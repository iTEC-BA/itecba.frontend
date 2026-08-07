export const Card = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <div className={`flex flex-col items-center justify-center gap-4 rounded-xl border border-dashed border-itec-border p-5 py-5 ${className}`}>
    {children}
  </div>
);