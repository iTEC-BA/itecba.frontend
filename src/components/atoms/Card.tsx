export const Card = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <div className={`bg-[#252525] p-5 rounded-xl border border-[#333] ${className}`}>
    {children}
  </div>
);