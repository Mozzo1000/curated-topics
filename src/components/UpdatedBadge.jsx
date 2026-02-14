export function UpdatedBadge() {
  const buildTimestamp = __BUILD_TIMESTAMP__;
  const daysOld = Math.floor((Date.now() - buildTimestamp) / (1000 * 60 * 60 * 24));

  const getStatusColor = () => {
    if (daysOld <= 30) return 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20';
    if (daysOld <= 180) return 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20';
    if (daysOld <= 365) return 'bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20';
    return 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20';
  };

  const getStatusDot = () => {
    if (daysOld <= 30) return 'bg-emerald-500';
    if (daysOld <= 180) return 'bg-amber-500';
    if (daysOld <= 365) return 'bg-orange-500';
    return 'bg-red-500';
  };

  const dateString = new Date(buildTimestamp).toLocaleDateString('en-GB', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  return (
    <div className={`flex items-center gap-2 px-2.5 py-1 rounded-full border text-[10px] font-bold tracking-tight transition-colors ${getStatusColor()}`}>
      <span className={`h-1.5 w-1.5 rounded-full animate-pulse ${getStatusDot()}`} />
      <span>UPDATED {dateString.toUpperCase()}</span>
    </div>
  );
}