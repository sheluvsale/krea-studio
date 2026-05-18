export default function Loading() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] px-[5%] pt-[120px] pb-8">
      <div className="max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div className="aspect-[4/5] bg-[#1a1a1a] rounded-xl animate-pulse" />
        <div className="space-y-6">
          <div className="h-8 bg-[#2a2a2a] rounded w-3/4 animate-pulse" />
          <div className="h-4 bg-[#2a2a2a] rounded w-1/2 animate-pulse" />
          <div className="h-6 bg-[#2a2a2a] rounded w-1/4 animate-pulse" />
          <div className="space-y-2">
            <div className="h-3 bg-[#2a2a2a] rounded w-full animate-pulse" />
            <div className="h-3 bg-[#2a2a2a] rounded w-5/6 animate-pulse" />
            <div className="h-3 bg-[#2a2a2a] rounded w-4/6 animate-pulse" />
          </div>
          <div className="h-12 bg-[#2a2a2a] rounded w-full animate-pulse" />
        </div>
      </div>
    </div>
  );
}
