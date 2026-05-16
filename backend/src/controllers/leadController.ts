import { Response } from 'express';
import { stringify } from 'csv-stringify/sync';
import { Lead } from '../models/Lead';
import { AuthRequest } from '../middleware/auth';
import { sendSuccess, sendError, buildPaginationMeta } from '../utils/response';
import { LeadFilters, LeadStatus, LeadSource } from '../types';
import mongoose from 'mongoose';

const buildQuery = (filters: LeadFilters, userRole: string, userId: string) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const query: Record<string, any> = {};

  // Sales users only see leads they created
  if (userRole === 'sales') {
    query.createdBy = new mongoose.Types.ObjectId(userId);
  }

  if (filters.status) query.status = filters.status;
  if (filters.source) query.source = filters.source;

  if (filters.search) {
    const regex = new RegExp(filters.search, 'i');
    query.$or = [{ name: regex }, { email: regex }];
  }

  return query;
};

export const getLeads = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const {
      status,
      source,
      search,
      sort = 'latest',
      page = '1',
      limit = '10',
    } = req.query as Record<string, string>;

    const pageNum = Math.max(1, parseInt(page, 10));
    const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10)));
    const skip = (pageNum - 1) * limitNum;

    const filters: LeadFilters = {
      status: status as LeadStatus,
      source: source as LeadSource,
      search,
      sort: sort as 'latest' | 'oldest',
    };

    const query = buildQuery(filters, req.user!.role, req.user!.id);
    const sortOrder = sort === 'oldest' ? 1 : -1;

    const [leads, total] = await Promise.all([
      Lead.find(query)
        .populate('createdBy', 'name email')
        .sort({ createdAt: sortOrder })
        .skip(skip)
        .limit(limitNum)
        .lean(),
      Lead.countDocuments(query),
    ]);

    const meta = buildPaginationMeta(total, pageNum, limitNum);
    sendSuccess(res, leads, 'Leads fetched successfully.', 200, meta);
  } catch {
    sendError(res, 'Failed to fetch leads.', 500);
  }
};

export const getLead = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const lead = await Lead.findById(req.params.id).populate('createdBy', 'name email');
    if (!lead) {
      sendError(res, 'Lead not found.', 404);
      return;
    }

    if (
      req.user!.role === 'sales' &&
      lead.createdBy._id.toString() !== req.user!.id
    ) {
      sendError(res, 'Forbidden.', 403);
      return;
    }

    sendSuccess(res, lead, 'Lead fetched successfully.');
  } catch {
    sendError(res, 'Failed to fetch lead.', 500);
  }
};

export const createLead = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const lead = await Lead.create({ ...req.body, createdBy: req.user!.id });
    sendSuccess(res, lead, 'Lead created successfully.', 201);
  } catch (err) {
    if (err instanceof Error && err.message.includes('validation')) {
      sendError(res, err.message, 400);
    } else {
      sendError(res, 'Failed to create lead.', 500);
    }
  }
};

export const updateLead = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const lead = await Lead.findById(req.params.id);
    if (!lead) {
      sendError(res, 'Lead not found.', 404);
      return;
    }

    if (req.user!.role === 'sales' && lead.createdBy.toString() !== req.user!.id) {
      sendError(res, 'Forbidden.', 403);
      return;
    }

    const updated = await Lead.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    ).populate('createdBy', 'name email');

    sendSuccess(res, updated, 'Lead updated successfully.');
  } catch {
    sendError(res, 'Failed to update lead.', 500);
  }
};

export const deleteLead = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const lead = await Lead.findById(req.params.id);
    if (!lead) {
      sendError(res, 'Lead not found.', 404);
      return;
    }

    if (req.user!.role === 'sales' && lead.createdBy.toString() !== req.user!.id) {
      sendError(res, 'Forbidden.', 403);
      return;
    }

    await lead.deleteOne();
    sendSuccess(res, null, 'Lead deleted successfully.');
  } catch {
    sendError(res, 'Failed to delete lead.', 500);
  }
};

export const exportLeadsCSV = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { status, source, search } = req.query as Record<string, string>;

    const filters: LeadFilters = {
      status: status as LeadStatus,
      source: source as LeadSource,
      search,
    };

    const query = buildQuery(filters, req.user!.role, req.user!.id);

    const leads = await Lead.find(query)
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 })
      .lean();

    const csvData = leads.map((l) => ({
      Name: l.name,
      Email: l.email,
      Status: l.status,
      Source: l.source,
      Notes: l.notes || '',
      'Created At': new Date(l.createdAt).toLocaleDateString(),
    }));

    const csv = stringify(csvData, { header: true });

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="leads.csv"');
    res.status(200).send(csv);
  } catch {
    sendError(res, 'Failed to export leads.', 500);
  }
};

export const getLeadStats = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const matchQuery: Record<string, unknown> = {};
    if (req.user!.role === 'sales') {
      matchQuery.createdBy = new mongoose.Types.ObjectId(req.user!.id);
    }

    const stats = await Lead.aggregate([
      { $match: matchQuery },
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          New: { $sum: { $cond: [{ $eq: ['$status', 'New'] }, 1, 0] } },
          Contacted: { $sum: { $cond: [{ $eq: ['$status', 'Contacted'] }, 1, 0] } },
          Qualified: { $sum: { $cond: [{ $eq: ['$status', 'Qualified'] }, 1, 0] } },
          Lost: { $sum: { $cond: [{ $eq: ['$status', 'Lost'] }, 1, 0] } },
        },
      },
    ]);

    const sourceStats = await Lead.aggregate([
      { $match: matchQuery },
      { $group: { _id: '$source', count: { $sum: 1 } } },
    ]);

    sendSuccess(res, {
      overview: stats[0] || { total: 0, New: 0, Contacted: 0, Qualified: 0, Lost: 0 },
      bySource: sourceStats,
    }, 'Stats fetched successfully.');
  } catch {
    sendError(res, 'Failed to fetch stats.', 500);
  }
};
