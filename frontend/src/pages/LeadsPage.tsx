import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { Plus, Download } from 'lucide-react';
import { leadsService } from '../services/leadsService';
import { Lead, LeadFilters, LeadFormData } from '../types';
import { LeadTable } from '../components/leads/LeadTable';
import { FiltersBar } from '../components/leads/FiltersBar';
import { LeadModal } from '../components/leads/LeadModal';
import { ConfirmDialog } from '../components/ui/ConfirmDialog';
import { Pagination } from '../components/ui/Pagination';
import { EmptyState } from '../components/ui/EmptyState';
import { PageLoader } from '../components/ui/Spinner';
import { useDebounce } from '../hooks/useDebounce';
import { useAuthStore } from '../store/authStore';
import { AxiosError } from 'axios';

export default function LeadsPage() {
  const qc = useQueryClient();
  const { user } = useAuthStore();

  const [filters, setFilters] = useState<LeadFilters>({ sort: 'latest', page: 1, limit: 10 });
  const [searchInput, setSearchInput] = useState('');
  const debouncedSearch = useDebounce(searchInput, 400);

  const [isModalOpen, setModalOpen] = useState(false);
  const [editingLead, setEditingLead] = useState<Lead | undefined>();
  const [deletingLead, setDeletingLead] = useState<Lead | undefined>();

  const queryFilters = { ...filters, search: debouncedSearch || undefined };

  const { data, isLoading, isError } = useQuery({
    queryKey: ['leads', queryFilters],
    queryFn: () => leadsService.getLeads(queryFilters),
  });

  const leads = data?.data || [];
  const meta = data?.meta;

  const createMutation = useMutation({
    mutationFn: leadsService.createLead,
    onSuccess: () => {
      toast.success('Lead created!');
      qc.invalidateQueries({ queryKey: ['leads'] });
      qc.invalidateQueries({ queryKey: ['leadStats'] });
      setModalOpen(false);
    },
    onError: (err: AxiosError<{ message: string }>) => {
      toast.error(err.response?.data?.message || 'Failed to create lead.');
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<LeadFormData> }) =>
      leadsService.updateLead(id, data),
    onSuccess: () => {
      toast.success('Lead updated!');
      qc.invalidateQueries({ queryKey: ['leads'] });
      qc.invalidateQueries({ queryKey: ['leadStats'] });
      setModalOpen(false);
      setEditingLead(undefined);
    },
    onError: (err: AxiosError<{ message: string }>) => {
      toast.error(err.response?.data?.message || 'Failed to update lead.');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: leadsService.deleteLead,
    onSuccess: () => {
      toast.success('Lead deleted.');
      qc.invalidateQueries({ queryKey: ['leads'] });
      qc.invalidateQueries({ queryKey: ['leadStats'] });
      setDeletingLead(undefined);
    },
    onError: (err: AxiosError<{ message: string }>) => {
      toast.error(err.response?.data?.message || 'Failed to delete lead.');
    },
  });

  const handleSubmit = (formData: LeadFormData) => {
    if (editingLead) {
      updateMutation.mutate({ id: editingLead._id, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const handleEdit = (lead: Lead) => {
    setEditingLead(lead);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setEditingLead(undefined);
  };

  const handleExport = async () => {
    try {
      await leadsService.exportCSV(queryFilters);
      toast.success('CSV exported!');
    } catch {
      toast.error('Export failed.');
    }
  };

  const handleFilterChange = (updates: Partial<LeadFilters>) => {
    setFilters((prev) => ({ ...prev, ...updates, page: 1 }));
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-700 text-slate-900 dark:text-white">Leads</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            {meta ? `${meta.total} total leads` : 'Manage your sales leads'}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={handleExport} className="btn-secondary">
            <Download size={15} />
            Export CSV
          </button>
          <button onClick={() => setModalOpen(true)} className="btn-primary">
            <Plus size={15} />
            Add Lead
          </button>
        </div>
      </div>

      {/* Filters */}
      <FiltersBar
        filters={filters}
        onFilterChange={handleFilterChange}
        onSearchChange={(val) => { setSearchInput(val); setFilters((p) => ({ ...p, page: 1 })); }}
        searchValue={searchInput}
      />

      {/* Table */}
      <div className="card p-6">
        {isLoading ? (
          <PageLoader />
        ) : isError ? (
          <div className="text-center py-16">
            <p className="text-sm text-red-500">Failed to load leads. Please try again.</p>
          </div>
        ) : leads.length === 0 ? (
          <EmptyState
            title={debouncedSearch || filters.status || filters.source ? 'No results found' : 'No leads yet'}
            description={debouncedSearch || filters.status || filters.source
              ? 'Try adjusting your filters or search query.'
              : 'Add your first lead to get started.'}
            action={
              !debouncedSearch && !filters.status && !filters.source ? (
                <button onClick={() => setModalOpen(true)} className="btn-primary">
                  <Plus size={15} />
                  Add Lead
                </button>
              ) : undefined
            }
          />
        ) : (
          <>
            <LeadTable leads={leads} onEdit={handleEdit} onDelete={setDeletingLead} />
            {meta && (
              <Pagination
                meta={meta}
                onPageChange={(page) => setFilters((p) => ({ ...p, page }))}
              />
            )}
          </>
        )}
      </div>

      {/* Modals */}
      <LeadModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleSubmit}
        isLoading={createMutation.isPending || updateMutation.isPending}
        initialData={editingLead}
      />

      <ConfirmDialog
        isOpen={!!deletingLead}
        title="Delete Lead"
        description={`Are you sure you want to delete "${deletingLead?.name}"? This action cannot be undone.`}
        onConfirm={() => deletingLead && deleteMutation.mutate(deletingLead._id)}
        onCancel={() => setDeletingLead(undefined)}
        isLoading={deleteMutation.isPending}
      />

      {/* Role info: sales users can't delete */}
      {user?.role === 'sales' && leads.length > 0 && (
        <p className="text-xs text-slate-400 dark:text-slate-500 text-center">
          Contact an admin to delete leads.
        </p>
      )}
    </div>
  );
}
