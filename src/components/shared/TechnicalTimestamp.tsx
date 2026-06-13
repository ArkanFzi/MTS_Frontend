// src/components/shared/TechnicalTimestamp.tsx

interface TechnicalTimestampProps {
  timestamp: string;
}

function timeAgo(dateString: string): string {
  const now = new Date();
  const date = new Date(dateString);
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (seconds < 60) return 'baru saja';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} menit lalu`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} jam lalu`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days} hari lalu`;
  const months = Math.floor(days / 30);
  if (months < 12) return `${months} bulan lalu`;
  return `${Math.floor(months / 12)} tahun lalu`;
}

const TechnicalTimestamp = ({ timestamp }: TechnicalTimestampProps) => {
  return (
    <span className="text-zinc-500 font-fira-code tracking-tight">
      {timeAgo(timestamp)}
    </span>
  )
}

export default TechnicalTimestamp
