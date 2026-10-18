import React from 'react';

interface MarkdownRendererProps {
  content: string;
}

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content }) => {
  if (!content) return null;

  // Split by double newlines or single newlines for block parsing
  const lines = content.split('\n');

  const renderFormattedLine = (line: string) => {
    // Process bold (**bold**) and inline code (`code`)
    const parts = [];
    let remaining = line;
    let keyIdx = 0;

    while (remaining.length > 0) {
      // Bold check **text**
      const boldMatch = remaining.match(/\*\*(.+?)\*\*/);
      // Inline code `code`
      const codeMatch = remaining.match(/`([^`]+)`/);

      let earliestMatch: { index: number; length: number; type: 'bold' | 'code'; text: string } | null = null;

      if (boldMatch && boldMatch.index !== undefined) {
        earliestMatch = {
          index: boldMatch.index,
          length: boldMatch[0].length,
          type: 'bold',
          text: boldMatch[1],
        };
      }

      if (codeMatch && codeMatch.index !== undefined) {
        if (!earliestMatch || codeMatch.index < earliestMatch.index) {
          earliestMatch = {
            index: codeMatch.index,
            length: codeMatch[0].length,
            type: 'code',
            text: codeMatch[1],
          };
        }
      }

      if (earliestMatch) {
        // Text before match
        if (earliestMatch.index > 0) {
          parts.push(<span key={`txt-${keyIdx++}`}>{remaining.slice(0, earliestMatch.index)}</span>);
        }

        // Render matched item
        if (earliestMatch.type === 'bold') {
          parts.push(
            <strong key={`bold-${keyIdx++}`} className="font-semibold text-slate-900">
              {earliestMatch.text}
            </strong>
          );
        } else if (earliestMatch.type === 'code') {
          parts.push(
            <code
              key={`code-${keyIdx++}`}
              className="px-1.5 py-0.5 rounded bg-indigo-50 text-indigo-700 text-xs font-mono font-medium border border-indigo-100"
            >
              {earliestMatch.text}
            </code>
          );
        }

        remaining = remaining.slice(earliestMatch.index + earliestMatch.length);
      } else {
        parts.push(<span key={`txt-${keyIdx++}`}>{remaining}</span>);
        break;
      }
    }

    return parts;
  };

  return (
    <div className="space-y-1.5 text-sm leading-relaxed text-slate-800 break-words">
      {lines.map((line, idx) => {
        const trimmed = line.trim();

        if (!trimmed) {
          return <div key={idx} className="h-1.5" />;
        }

        // Heading 3
        if (trimmed.startsWith('### ')) {
          return (
            <h4 key={idx} className="font-bold text-base text-slate-900 mt-2 mb-1">
              {renderFormattedLine(trimmed.replace('### ', ''))}
            </h4>
          );
        }

        // Heading 2
        if (trimmed.startsWith('## ')) {
          return (
            <h3 key={idx} className="font-bold text-lg text-slate-900 mt-2.5 mb-1.5 border-b pb-1 border-slate-200">
              {renderFormattedLine(trimmed.replace('## ', ''))}
            </h3>
          );
        }

        // Heading 1
        if (trimmed.startsWith('# ')) {
          return (
            <h2 key={idx} className="font-bold text-xl text-slate-900 mt-3 mb-2">
              {renderFormattedLine(trimmed.replace('# ', ''))}
            </h2>
          );
        }

        // Bullet point
        if (trimmed.startsWith('• ') || trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
          const itemText = trimmed.replace(/^[•\-\*]\s+/, '');
          return (
            <div key={idx} className="flex items-start gap-2 pl-1.5 py-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-2 shrink-0" />
              <div className="flex-1">{renderFormattedLine(itemText)}</div>
            </div>
          );
        }

        // Numbered list item like "1. ", "2. "
        const numMatch = trimmed.match(/^(\d+)\.\s+(.*)$/);
        if (numMatch) {
          return (
            <div key={idx} className="flex items-start gap-2 pl-1.5 py-0.5">
              <span className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-700 text-xs font-semibold flex items-center justify-center shrink-0 mt-0.5">
                {numMatch[1]}
              </span>
              <div className="flex-1">{renderFormattedLine(numMatch[2])}</div>
            </div>
          );
        }

        // Standard paragraph
        return (
          <p key={idx} className="py-0.5">
            {renderFormattedLine(line)}
          </p>
        );
      })}
    </div>
  );
};
