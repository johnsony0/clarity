import type React from 'react';
import { useState, useEffect } from 'react';

interface ToastProps {
  message: string;
  type?: 'success' | 'warning' | 'error';
  duration?: number;
  onClose: () => void;
}

export const Toast: React.FC<ToastProps> = ({
  message,
  type = 'success',
  duration = 5000, //Default duration
  onClose,
}) => {
  const [visible, setVisible] = useState(false);

  const displayDuration = type === 'error' ? 10000 : duration; //Increase for errors

  useEffect(() => {
    setVisible(true);

    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(onClose, 300);
    }, displayDuration);
    return () => {
      clearTimeout(timer);
    };
  }, [displayDuration, onClose]);

  const backgroundColor = {
    success: 'bg-primary',
    warning: 'bg-yellow-500',
    error: 'bg-red-600',
  }[type];

  const transitionClasses = visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4';

  return (
    <div
      className={`fixed bottom-4 right-4 text-black px-4 py-3 rounded-lg shadow-lg transition-all duration-300 ease-in-out ${backgroundColor} ${transitionClasses}`}>
      <div className="flex items-center">
        <span>
          {message}
          {type === 'error' && (
            <>
              {' '}
              Common errors found
              <a
                href="https://github.com/johnsony0/productivity-extension/tree/main?tab=readme-ov-file#errors"
                target="_blank"
                rel="noopener noreferrer"
                className="ml-1 font-bold underline hover:text-gray-200">
                here.
              </a>
            </>
          )}
        </span>
      </div>
    </div>
  );
};
