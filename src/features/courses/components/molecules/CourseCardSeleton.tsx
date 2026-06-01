export const CourseCardSkeleton = () => {
  return (
    <article className="group relative bg-itec-card rounded-xl overflow-hidden flex flex-col h-full transition-all duration-300">
      <div className="relative w-full aspect-video overflow-hidden bg-itec-gray/33 shrink-0 animate-pulse" />

      <div className="flex flex-col flex-1 p-3 gap-2">
        <div className="h-4 bg-itec-gray/33 rounded animate-pulse mb-1" />
        <div className="h-3 bg-itec-gray/33 rounded animate-pulse w-3/4" />

        <div className="space-y-2 flex-1">
          <div className="h-3 bg-itec-gray/33 rounded animate-pulse" />
          <div className="h-3 bg-itec-gray/33 rounded animate-pulse w-5/6" />
        </div>

        <div className="mt-auto pt-2 border-t border-white/5">
          <div className="flex justify-between items-center mb-1.5">
            <div className="h-3 bg-itec-gray/33 rounded animate-pulse w-16" />
            <div className="h-3 bg-itec-gray/33 rounded animate-pulse w-12" />
          </div>
          <div className="h-2 bg-itec-gray/33 rounded animate-pulse" />
        </div>
      </div>
    </article>
  );
};
