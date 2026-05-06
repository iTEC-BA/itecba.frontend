import React from 'react';

export const FileIcon: React.FC<{ type: string }> = ({ type }) => {
  const cls = "w-6 h-6 shrink-0";
  if (type === 'pdf') return <svg className={`${cls} text-red-500`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><path d="M14 2v6h6m-8 10h.01M9.5 15.5l1.5-1.5 1.5 1.5m1.5 1.5l1.5-1.5"/></svg>;
  if (type === 'zip') return <svg className={`${cls} text-yellow-500`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><path d="M14 2v6h6m-4 5h-4m2-2v4"/></svg>;
  return <svg className={`${cls} text-gray-500`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><path d="M14 2v6h6"/></svg>;
};