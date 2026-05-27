interface LoadingSkeletonProps {
  layout?: "grid" | "list" | "sidebar";
}

export default function LoadingSkeleton({ layout = "grid" }: LoadingSkeletonProps) {
  if (layout === "sidebar") {
    return (
      <div className="bg-white rounded-3xl border border-slate-100 p-6 md:p-8 space-y-6">
        <div className="h-6 w-1/3 bg-slate-200 rounded animate-pulse" />
        <div className="space-y-3">
          <div className="h-4 w-1/2 bg-slate-200 rounded animate-pulse" />
          <div className="h-10 w-full bg-slate-100 rounded-xl" />
        </div>
        <div className="space-y-3 pt-4 border-t border-slate-100">
          <div className="h-4 w-2/3 bg-slate-200 rounded animate-pulse" />
          <div className="grid grid-cols-2 gap-2">
            <div className="h-10 bg-slate-100 rounded-xl" />
            <div className="h-10 bg-slate-100 rounded-xl" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full space-y-8">
      {/* Skeleton Filters and Cards Heading */}
      <div className="flex flex-col sm:flex-row justify-between items-start gap-4 pb-6 border-b border-slate-100">
        <div className="space-y-2.5 w-full sm:w-1/2">
          <div className="h-7 w-2/3 bg-slate-200 rounded-lg animate-pulse" />
          <div className="h-4 w-1/3 bg-slate-150 rounded animate-pulse" />
        </div>
        <div className="h-10 w-40 bg-slate-150 rounded-xl animate-pulse" />
      </div>

      {/* Grid listing of plans cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
        {[1, 2, 3, 4].map((idx) => (
          <div
            key={idx}
            className="bg-white rounded-3xl border border-slate-100 p-6 md:p-8 space-y-6 shadow-sm overflow-hidden relative"
          >
            {/* Shimmer element */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/45 to-transparent -translate-x-full animate-shimmer" />

            <div className="flex justify-between items-center">
              <div className="h-8 w-24 bg-slate-250 rounded animate-pulse" />
              <div className="h-5 w-16 bg-slate-200 rounded-full animate-pulse" />
            </div>

            <div className="space-y-2">
              <div className="h-12 w-1/2 bg-slate-200 rounded-xl animate-pulse" />
              <div className="h-4 w-2/3 bg-slate-150 rounded animate-pulse" />
            </div>

            <div className="space-y-2.5 pt-4 border-t border-slate-50">
              <div className="h-4 w-4/5 bg-slate-100 rounded animate-pulse" />
              <div className="h-4 w-3/4 bg-slate-100 rounded animate-pulse" />
              <div className="h-4 w-2/3 bg-slate-100 rounded animate-pulse" />
            </div>

            <div className="pt-6 border-t border-slate-100 flex justify-between items-end">
              <div className="space-y-2">
                <div className="h-3 w-16 bg-slate-150 rounded" />
                <div className="h-8 w-32 bg-slate-200 rounded-lg" />
              </div>
              <div className="h-8 w-12 bg-slate-150 rounded-xl" />
            </div>

            <div className="h-12 w-full bg-slate-100 rounded-2xl animate-pulse" />
          </div>
        ))}
      </div>
    </div>
  );
}
