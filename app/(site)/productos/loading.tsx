export default function Loading() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] px-4 lg:px-8 pt-32 pb-8">
      <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-6 max-w-[1600px] mx-auto">
        <aside className="hidden lg:block">
          <div className="sticky top-35 bg-[#111111] border border-[#2a2a2a] rounded-xl p-6 space-y-6">
            <div className="h-4 bg-[#2a2a2a] rounded w-1/3 animate-pulse" />
            <div className="space-y-3">
              <div className="h-3 bg-[#2a2a2a] rounded w-3/4 animate-pulse" />
              <div className="h-3 bg-[#2a2a2a] rounded w-1/2 animate-pulse" />
              <div className="h-3 bg-[#2a2a2a] rounded w-2/3 animate-pulse" />
            </div>
            <div className="space-y-3">
              <div className="h-3 bg-[#2a2a2a] rounded w-3/4 animate-pulse" />
              <div className="h-3 bg-[#2a2a2a] rounded w-1/2 animate-pulse" />
            </div>
          </div>
        </aside>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 9 }).map((_, i) => (
            <div
              key={i}
              className="bg-[#111111] border border-[#2a2a2a] rounded-xl overflow-hidden"
            >
              <div className="aspect-[4/5] bg-[#1a1a1a] animate-pulse" />
              <div className="p-5 space-y-3">
                <div className="h-4 bg-[#2a2a2a] rounded w-3/4 animate-pulse" />
                <div className="h-3 bg-[#2a2a2a] rounded w-1/2 animate-pulse" />
                <div className="h-3 bg-[#2a2a2a] rounded w-1/4 animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
