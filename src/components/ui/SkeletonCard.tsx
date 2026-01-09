export function SkeletonCard() {
  return (
    <div
      className="bg-card rounded-lg shadow-sm p-4 animate-pulse"
      aria-hidden="true"
    >
      <div className="flex items-start">
        <div className="w-16 h-16 rounded-md skeleton-shimmer flex-shrink-0" />
        <div className="flex-grow ml-3">
          <div className="h-5 skeleton-shimmer rounded w-3/4 mb-2" />
          <div className="h-4 skeleton-shimmer rounded w-1/2 mb-3" />
          <div className="flex gap-1 mb-3">
            <div className="h-5 skeleton-shimmer rounded-full w-14" />
            <div className="h-5 skeleton-shimmer rounded-full w-16" />
          </div>
          <div className="flex items-center gap-2">
            <div className="h-5 skeleton-shimmer rounded w-32" />
            <div className="h-5 skeleton-shimmer rounded-full w-10" />
          </div>
        </div>
      </div>
    </div>
  );
}

export function SkeletonList({ count = 3 }: { count?: number }) {
  return (
    <div className="space-y-3" aria-busy="true" aria-live="polite">
      <span className="sr-only">목록 정보를 불러오는 중...</span>
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}
