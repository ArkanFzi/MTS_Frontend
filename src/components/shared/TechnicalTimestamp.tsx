// src/components/shared/TechnicalTimestamp.tsx
import React from 'react';

interface TechnicalTimestampProps {
  timestamp: string;
  className?: string;
}

export const TechnicalTimestamp: React.FC<TechnicalTimestampProps> = ({
  timestamp,
  className = '',
}) => {
  const formatTime = (isoString: string): string => {
    if (!isoString) return '-';

    try {
      const date = new Date(isoString);
      
      if (isNaN(date.getTime())) return isoString;

      const now = new Date();
      const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

      if (diffInSeconds < 60) {
        return 'baru saja';
      }

      const diffInMinutes = Math.floor(diffInSeconds / 60);
      if (diffInMinutes < 60) {
        return `${diffInMinutes} mnt yang lalu`;
      }

      const diffInHours = Math.floor(diffInMinutes / 60);
      if (diffInHours < 24) {
        return `${diffInHours} jam yang lalu`;
      }

      const diffInDays = Math.floor(diffInHours / 24);
      if (diffInDays < 7) {
        return `${diffInDays} hari yang lalu`;
      }

      const options: Intl.DateTimeFormatOptions = {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      };

      return new Intl.DateTimeFormat('id-ID', options).format(date);
    } catch (error) {
      console.error('Error saat memformat TechnicalTimestamp:', error);
      return isoString;
    }
  };

  return (
    <span 
      className={`text-zinc-400 font-mono tracking-tight select-none ${className}`}
      title={new Date(timestamp).toLocaleString('id-ID')}
    >
      {formatTime(timestamp)}
    </span>
  );
};

export default TechnicalTimestamp;