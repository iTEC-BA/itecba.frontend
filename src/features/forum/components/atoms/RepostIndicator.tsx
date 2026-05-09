import React from 'react';
import { Repeat2 } from 'lucide-react';

interface Props { pseudonym: string; }

export const RepostIndicator: React.FC<Props> = ({ pseudonym }) => (
  <div className="flex items-center gap-2 px-4 pt-2 pb-0 text-[11px] text-itec-muted">
    <Repeat2 size={12} />
    <span>{pseudonym} reposteó</span>
  </div>
);
