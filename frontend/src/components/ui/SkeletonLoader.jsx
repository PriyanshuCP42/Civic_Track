const SkeletonLoader = ({ rows = 5, className = "h-10" }) => (
  <div className="space-y-3">
    {Array.from({ length: rows }).map((_, i) => (
      <div key={i} className={`animate-pulse rounded-xl bg-slate-200 ${className}`} />
    ))}
  </div>
);

export default SkeletonLoader;
