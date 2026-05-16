import api from './api';
import { ApiResponse, Lead, LeadFilters, LeadFormData, LeadStats } from '../types';

export const leadsService = {
  getLeads: async (filters: LeadFilters = {}) => {
    const params = new URLSearchParams();
    if (filters.status) params.append('status', filters.status);
    if (filters.source) params.append('source', filters.source);
    if (filters.search) params.append('search', filters.search);
    if (filters.sort) params.append('sort', filters.sort);
    if (filters.page) params.append('page', String(filters.page));
    if (filters.limit) params.append('limit', String(filters.limit));

    const res = await api.get<ApiResponse<Lead[]>>(`/leads?${params.toString()}`);
    return res.data;
  },

  getLead: async (id: string) => {
    const res = await api.get<ApiResponse<Lead>>(`/leads/${id}`);
    return res.data;
  },

  createLead: async (data: LeadFormData) => {
    const res = await api.post<ApiResponse<Lead>>('/leads', data);
    return res.data;
  },

  updateLead: async (id: string, data: Partial<LeadFormData>) => {
    const res = await api.put<ApiResponse<Lead>>(`/leads/${id}`, data);
    return res.data;
  },

  deleteLead: async (id: string) => {
    const res = await api.delete<ApiResponse<null>>(`/leads/${id}`);
    return res.data;
  },

  getStats: async () => {
    const res = await api.get<ApiResponse<LeadStats>>('/leads/stats');
    return res.data;
  },

  exportCSV: async (filters: LeadFilters = {}) => {
    const params = new URLSearchParams();
    if (filters.status) params.append('status', filters.status);
    if (filters.source) params.append('source', filters.source);
    if (filters.search) params.append('search', filters.search);

    const res = await api.get(`/leads/export?${params.toString()}`, {
      responseType: 'blob',
    });

    const url = window.URL.createObjectURL(new Blob([res.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `leads-${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  },
};
