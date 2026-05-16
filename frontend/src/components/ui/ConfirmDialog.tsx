import { AlertTriangle, X } from 'lucide-react';
import { Spinner } from './Spinner';

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  description: string;
  onConfirm: () => void;
  onCancel: () => void;
  isLoading?: boolean;
  confirmLabel?: string;
}

export const ConfirmDialog = ({
  isOpen,
  title,
  description,
  onConfirm,
  onCancel,
  isLoading,
  confirmLabel = 'Delete',
}: ConfirmDialogProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onCancel} />
      <div className="relative w-full max-w-md card p-6 animate-scale-in shadow-xl">
        <button
          onClick={onCancel}
          className="absolute top-4 right-4 p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
        >
          <X size={16} />
        </button>
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-red-50 dark:bg-red-900/20 flex items-center justify-center flex-shrink-0">
            <AlertTriangle size={18} className="text-red-500" />
          </div>
          <div>
            <h3 className="font-display font-600 text-slate-900 dark:text-white mb-1">{title}</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">{description}</p>
          </div>
        </div>
        <div className="flex justify-end gap-3 mt-6">
          <button onClick={onCancel} className="btn-secondary">Cancel</button>
          <button onClick={onConfirm} disabled={isLoading} className="btn-danger">
            {isLoading ? <Spinner size="sm" /> : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};
