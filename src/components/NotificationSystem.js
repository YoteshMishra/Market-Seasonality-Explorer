import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';
import { removeNotification } from '../store/slices/uiSlice';

const NotificationSystem = () => {
  const dispatch = useDispatch();
  const { notifications } = useSelector(state => state.ui);

  useEffect(() => {
    notifications.forEach(notification => {
      if (notification.duration) {
        const timer = setTimeout(() => {
          dispatch(removeNotification(notification.id));
        }, notification.duration);

        return () => clearTimeout(timer);
      }
    });
  }, [notifications, dispatch]);

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'error':
        return <AlertCircle className="w-5 h-5 text-red-600" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-yellow-600" />;
      default:
        return <Info className="w-5 h-5 text-blue-600" />;
    }
  };

  const getNotificationClasses = (type) => {
    const baseClasses = 'flex items-center p-4 rounded-lg shadow-lg border-l-4';
    switch (type) {
      case 'success':
        return `${baseClasses} bg-green-50 border-green-400`;
      case 'error':
        return `${baseClasses} bg-red-50 border-red-400`;
      case 'warning':
        return `${baseClasses} bg-yellow-50 border-yellow-400`;
      default:
        return `${baseClasses} bg-blue-50 border-blue-400`;
    }
  };

  if (notifications.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {notifications.map(notification => (
        <div
          key={notification.id}
          className={`${getNotificationClasses(notification.type)} animate-slide-up`}
        >
          <div className="flex items-start">
            <div className="flex-shrink-0 mr-3">
              {getNotificationIcon(notification.type)}
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">
                {notification.message}
              </p>
            </div>
            <div className="flex-shrink-0 ml-3">
              <button
                onClick={() => dispatch(removeNotification(notification.id))}
                className="inline-flex text-gray-400 hover:text-gray-600 focus:outline-none"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default NotificationSystem; 