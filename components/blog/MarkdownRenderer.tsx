'use client';

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import Image from 'next/image';

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

export function MarkdownRenderer({ content, className = '' }: MarkdownRendererProps) {
  return (
    <div className={`prose prose-lg max-w-none ${className}`}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          // Überschriften
          h1: ({ children }) => (
            <h1 className="text-3xl font-bold mb-6 text-foreground border-b border-border pb-2">
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2 className="text-2xl font-semibold mb-4 mt-8 text-foreground">
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="text-xl font-semibold mb-3 mt-6 text-foreground">
              {children}
            </h3>
          ),
          h4: ({ children }) => (
            <h4 className="text-lg font-semibold mb-2 mt-4 text-foreground">
              {children}
            </h4>
          ),
          
          // Absätze
          p: ({ children }) => (
            <p className="mb-4 text-foreground leading-relaxed">
              {children}
            </p>
          ),
          
          // Listen
          ul: ({ children }) => (
            <ul className="mb-4 ml-6 list-disc text-foreground">
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol className="mb-4 ml-6 list-decimal text-foreground">
              {children}
            </ol>
          ),
          li: ({ children }) => (
            <li className="mb-1 text-foreground">
              {children}
            </li>
          ),
          
          // Links
          a: ({ href, children }) => {
            // Prüfe, ob es sich um einen Bild-Link handelt
            const isImageLink = Boolean(
              href &&
              (/\.(jpg|jpeg|png|gif|webp|avif|svg)$/i.test(href) ||
                href.startsWith('data:image'))
            );
            
            if (isImageLink && href) {
              return (
                <span className="my-6 block mx-auto max-w-full">
                  <Image 
                    src={href}
                    alt={typeof children === 'string' ? children : 'Bild'}
                    width={1200}
                    height={675}
                    className="rounded-lg shadow-md border border-border w-auto h-auto max-w-full"
                  />
                </span>
              );
            }
            
            return (
              <a 
                href={href} 
                className="text-primary hover:text-primary/80 underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                {children}
              </a>
            );
          },
          
          // Code
          code: ({ children, className }) => {
            const match = /language-(\w+)/.exec(className || '');
            return match ? (
              <pre className="bg-muted p-4 rounded-lg overflow-x-auto mb-4">
                <code className="text-sm font-mono">
                  {String(children).replace(/\n$/, '')}
                </code>
              </pre>
            ) : (
              <code className="bg-muted px-1 py-0.5 rounded text-sm font-mono">
                {children}
              </code>
            );
          },
          
          // Code-Blöcke
          pre: ({ children }) => (
            <div className="mb-4">
              {children}
            </div>
          ),
          
          // Blockquotes
          blockquote: ({ children }) => (
            <blockquote className="border-l-4 border-primary pl-4 py-2 mb-4 bg-muted/50 italic text-muted-foreground">
              {children}
            </blockquote>
          ),
          
          // Tabellen
          table: ({ children }) => (
            <div className="overflow-x-auto mb-4">
              <table className="min-w-full border border-border rounded-lg">
                {children}
              </table>
            </div>
          ),
          thead: ({ children }) => (
            <thead className="bg-muted">
              {children}
            </thead>
          ),
          tbody: ({ children }) => (
            <tbody>
              {children}
            </tbody>
          ),
          tr: ({ children }) => (
            <tr className="border-b border-border">
              {children}
            </tr>
          ),
          th: ({ children }) => (
            <th className="px-4 py-2 text-left font-semibold text-foreground">
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td className="px-4 py-2 text-foreground">
              {children}
            </td>
          ),
          
          // Bilder
          img: ({ src, alt }) => {
            if (!src) return null;
            return (
              <span className="my-6 block mx-auto max-w-full">
                <Image 
                  src={src}
                  alt={alt || ''}
                  width={1200}
                  height={675}
                  className="rounded-lg shadow-md border border-border w-auto h-auto max-w-full"
                />
              </span>
            );
          },
          
          // Horizontale Linien
          hr: () => (
            <hr className="my-8 border-border" />
          ),
          
          // Starke Betonung
          strong: ({ children }) => (
            <strong className="font-semibold text-foreground">
              {children}
            </strong>
          ),
          
          // Kursiv
          em: ({ children }) => (
            <em className="italic text-foreground">
              {children}
            </em>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
