import React from 'react';
import { AlertCircle, X } from 'lucide-react';
import { ErrorNotification } from '@/types/gas';

interface ErrorNotificationsProps {
  errors: ErrorNotification[];
  onRemoveError: (id: number) => void;
}

export const ErrorNotifications: React.FC<ErrorNotificationsProps> = ({
  errors,
  onRemoveError
}) => {
  if (errors.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {errors.map((error) => (
        <div
          key={error.id}
          className={`p-4 rounded-lg shadow-lg flex items-center gap-3 transition-all duration-300 animate-in slide-in-from-right ${
            error.type === 'error' 
              ? 'bg-destructive/90 text-destructive-foreground backdrop-blur-sm' 
              : error.type === 'warning'
              ? 'bg-warning/90 text-warning-foreground backdrop-blur-sm'
              : 'bg-muted/90 text-muted-foreground backdrop-blur-sm'
          }`}
        >
          <AlertCircle size={20} className="flex-shrink-0" />
          <div className="flex-1">
            <span className="font-medium">{error.message}</span>
            {error.chain && (
              <div className="text-xs opacity-75 mt-1">
                Chain: {error.chain}
              </div>
            )}
          </div>
          <button
            onClick={() => onRemoveError(error.id)}
            className="text-current hover:opacity-75 transition-opacity p-1 rounded"
            aria-label="Dismiss notification"
          >
            <X size={16} />
          </button>
        </div>
      ))}
    </div>
  );
};