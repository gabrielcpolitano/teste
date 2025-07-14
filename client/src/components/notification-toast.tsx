import React, { useEffect } from 'react';
import { CheckCircle, AlertTriangle, XCircle, Info } from 'lucide-react';
import { NotificationType } from '../types';

interface NotificationToastProps {
  message: string;
  type: NotificationType;
  visible: boolean;
  onClose: () => void;
}

export function NotificationToast({ message, type, visible, onClose }: NotificationToastProps) {
  useEffect(() => {
    if (visible) {
      const timer = setTimeout(() => {
        onClose();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [visible, onClose]);

  if (!visible) return null;

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      case 'error':
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return <Info className="h-5 w-5 text-blue-500" />;
    }
  };

  return (
    <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-right-full">
      <div className="bg-card border border-border rounded-lg shadow-lg p-4 max-w-sm">
        <div className="flex items-center">
          {getIcon()}
          <div className="ml-3">
            <p className="text-sm font-medium text-foreground">
              {message}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              {new Date().toLocaleTimeString('pt-BR')}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
