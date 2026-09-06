import React from "react";
import ReactMarkdown from "react-markdown";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import "katex/dist/katex.min.css"; // CSS necesario para renderizar las fórmulas

interface Props {
  content: string;
  className?: string;
}

export const MarkdownContent: React.FC<Props> = ({ content, className = "" }) => (
  <div className={`prose-itec text-sm text-itec-text/80 leading-relaxed ${className}`}>
    <ReactMarkdown
      remarkPlugins={[remarkMath]}
      rehypePlugins={[rehypeKatex]}
      components={{
        h1: ({ children }) => <h1 className="text-base font-bold text-itec-blue-skye mb-2 mt-4 first:mt-0">{children}</h1>,
        h2: ({ children }) => <h2 className="text-sm font-bold text-itec-text mb-1.5 mt-3 first:mt-0">{children}</h2>,
        h3: ({ children }) => <h3 className="text-xs font-bold text-itec-text/80 mb-1 mt-2 first:mt-0">{children}</h3>,
        p: ({ children }) => <p className="text-sm text-itec-text/75 leading-relaxed mb-2 last:mb-0">{children}</p>,
        strong: ({ children }) => <strong className="font-bold text-itec-text">{children}</strong>,
        em: ({ children }) => <em className="italic text-itec-text/70">{children}</em>,
        ul: ({ children }) => <ul className="list-disc list-inside space-y-1 mb-2 text-sm text-itec-text/75">{children}</ul>,
        ol: ({ children }) => <ol className="list-decimal list-inside space-y-1 mb-2 text-sm text-itec-text/75">{children}</ol>,
        li: ({ children }) => <li className="text-sm text-itec-text/75">{children}</li>,
        code: ({ children }) => <code className="bg-white/6 text-itec-blue-skye/90 px-1.5 py-0.5 rounded text-xs font-mono">{children}</code>,
        blockquote: ({ children }) => (
          <blockquote className="border-l-2 border-itec-blue-skye/40 pl-3 text-itec-text/60 italic my-2">
            {children}
          </blockquote>
        ),
        a: ({ href, children }) => (
          <a href={href} target="_blank" rel="noreferrer" className="text-itec-blue-skye hover:underline">
            {children}
          </a>
        ),
        hr: () => <hr className="border-white/8 my-3" />,
      }}
    >
      {content}
    </ReactMarkdown>
  </div>
);
