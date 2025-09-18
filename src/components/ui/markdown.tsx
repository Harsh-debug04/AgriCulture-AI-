import { ReactMarkdown } from 'react-markdown/lib/react-markdown';
import remarkGfm from 'remark-gfm';

type MarkdownProps = {
  text: string;
};

export function Markdown({ text }: MarkdownProps) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      className="prose prose-sm dark:prose-invert max-w-none"
      components={{
        h1: ({node, ...props}) => <h1 className="text-2xl font-bold my-4" {...props} />,
        h2: ({node, ...props}) => <h2 className="text-xl font-bold my-3" {...props} />,
        h3: ({node, ...props}) => <h3 className="text-lg font-semibold my-2" {...props} />,
        p: ({node, ...props}) => <p className="mb-2" {...props} />,
        ul: ({node, ...props}) => <ul className="list-disc pl-5 mb-2" {...props} />,
        ol: ({node, ...props}) => <ol className="list-decimal pl-5 mb-2" {...props} />,
        li: ({node, ...props}) => <li className="mb-1" {...props} />,
      }}
    >
      {text}
    </ReactMarkdown>
  );
}
