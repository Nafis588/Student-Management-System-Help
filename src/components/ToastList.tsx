import React from 'react';
import { useApp } from '../context/AppContext';
import { CheckCircle, XCircle, AlertCircle } from 'lucide-react';

export const ToastList: React.FC = () => {
  const { toasts, removeToast } = useApp();

  return (
    <div className="toast-container">
      {toasts.map(toast => {
        let Icon = AlertCircle;
        if (toast.type === 'success') Icon = CheckCircle;
        if (toast.type === 'error') Icon = XCircle;
            
        return (
          <div 
            key={toast.id} 
            className={`toast toast-${toast.type}`}
            onClick={() => removeToast(toast.id)}
            style={{ cursor: 'pointer' }}
          >
            <Icon size={18} />
            <span>{toast.message}</span>
          </div>
        );
      })}
    </div>
  );
};
export default ToastList;
