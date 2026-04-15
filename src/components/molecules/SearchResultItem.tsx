import React from 'react';
import { Link } from 'react-router-dom';
import { Icons } from '../atoms/Icons';

interface Props {
  type: 'curso' | 'aporte' | 'grupo';
  title: string;
  subtitle: string;
  link: string;
  isExternal?: boolean;
  onClick?: () => void;
}

export const SearchResultItem: React.FC<Props> = ({ type, title, subtitle, link, isExternal, onClick }) => {
  const getStyles = () => {
    switch (type) {
      case 'curso': return { bg: 'bg-blue-500/20', text: 'text-blue-400', icon: 'play' };
      case 'aporte': return { bg: 'bg-orange-500/20', text: 'text-orange-400', icon: 'documentFill' };
      case 'grupo': return { bg: 'bg-green-500/20', text: 'text-green-400', icon: 'users' };
      default: return { bg: 'bg-gray-500/20', text: 'text-gray-400', icon: 'search' };
    }
  };

  const style = getStyles();

  const content = (
    <>
      <div className={`w-10 h-10 rounded flex items-center justify-center shrink-0 ${style.bg} ${style.text}`}>
        <div className="w-5 h-5"><Icons type={style.icon as any} /></div>
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-bold text-white truncate">{title}</p>
        <p className="text-[11px] text-gray-400 truncate">{subtitle}</p>
      </div>
    </>
  );

  const className = "flex items-center gap-3 p-2 hover:bg-itec-gray rounded-lg transition-colors w-full text-left";

  if (isExternal) {
    return (
      <a href={link} target="_blank" rel="noreferrer" onClick={onClick} className={className}>
        {content}
      </a>
    );
  }

  return (
    <Link to={link} onClick={onClick} className={className}>
      {content}
    </Link>
  );
};