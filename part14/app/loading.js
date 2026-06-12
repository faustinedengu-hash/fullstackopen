export default function GlobalLoadingSkeleton() {
  // Creating a dummy array of 4 items to simulate our card placeholders
  const skeletonCards = Array(4).fill(0)

  return (
    <div className="p-8 max-w-xl mx-auto font-sans animate-pulse">
      {/* Skeleton Title */}
      <div className="h-9 bg-zinc-800 rounded w-3/4 mb-6"></div>
      
      {/* Skeleton Form Box */}
      <div className="h-20 bg-zinc-900 border border-zinc-800 rounded-lg mb-8"></div>

      {/* Skeleton Header text */}
      <div className="h-6 bg-zinc-800 rounded w-1/2 mb-4"></div>
      
      {/* Animated Skeleton List Stack */}
      <div className="space-y-3">
        {skeletonCards.map((_, index) => (
          <div 
            key={index} 
            className="p-4 rounded bg-zinc-900 border border-zinc-800 flex justify-between items-center h-16"
          >
            <div className="h-4 bg-zinc-800 rounded w-2/3"></div>
            <div className="h-6 bg-zinc-800 rounded w-16"></div>
          </div>
        ))}
      </div>
    </div>
  )
}