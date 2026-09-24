export const Card = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <div className={`flex flex-col items-center justify-center gap-4 rounded-xl border border-dashed border-itec-border/50 p-5 py-5 ${className}`}>
    {children}
  </div>
);