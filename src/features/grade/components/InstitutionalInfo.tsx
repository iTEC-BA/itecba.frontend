import React from 'react';
import ReactMarkdown from 'react-markdown';

type InstitutionalInfoProps = {
  children?: string | null;
};

export const InstitutionalInfo: React.FC<InstitutionalInfoProps> = ({ children }) => {
  return (
    <div className="bg-itec-box border border-itec-border rounded-xl px-4 shadow-sm">
      <ReactMarkdown
        components={{
          h2: (props) => (
            <h2 className="text-2xl font-bold text-white mt-5 mb-4 border-b border-itec-border pb-2" {...props} />
          ),
          h3: (props) => (
            <h3 className="text-xl font-semibold text-white mt-8 mb-3" {...props} />
          ),
          p: (props) => (
            <p className="text-base text-itec-text leading-relaxed mb-4 text-justify" {...props} />
          ),
          ul: (props) => (
            <ul className="list-disc list-inside space-y-2 mb-6 text-itec-text" {...props} />
          ),
          li: (props) => (
            <li className="leading-relaxed" {...props} />
          ),
          strong: (props) => (
            <strong className="font-semibold text-white" {...props} />
          ),
          blockquote: (props) => (
            <blockquote className="border-l-4 border-itec-blue-skye pl-5 italic text-itec-muted my-6 bg-itec-surface p-4 rounded-r-lg" {...props} />
          )
        }}
      >
        {children ?? ''}
      </ReactMarkdown>
    </div>
  );
};
