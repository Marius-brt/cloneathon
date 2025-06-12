import { marked } from "marked";
import type { ComponentProps } from "react";
import { memo, useMemo } from "react";
import type { Components, ExtraProps } from "react-markdown";
import ReactMarkdown from "react-markdown";
import rehypeKatex from "rehype-katex";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import { CodeBlock } from "./code-block";

type CodeComponentProps = ComponentProps<"code"> & ExtraProps;

const components: Components = {
  code: Code as Components["code"],
  pre: ({ children }) => <>{children}</>,
  h1: ({ node, ...props }) => <h1 {...props} className={"font-bold text-2xl"} />,
  h2: ({ node, ...props }) => <h2 {...props} className={"font-bold text-xl"} />,
  h3: ({ node, ...props }) => (
    <h3 {...props} className={"font-bold text-foreground/80"} />
  ),
  h4: ({ node, ...props }) => (
    <h4 {...props} className={"text-muted-foreground text-xs uppercase"} />
  ),
  ul: ({ node, ...props }) => <ul {...props} className={"list-disc pl-4"} />,
  li: ({ node, ...props }) => (
    <li {...props} className={"[&>.codeblock]:-ml-5 last:mb-0"} />
  ),
  p: ({ node, ...props }) => <p {...props} className={"text-pretty leading-relaxed"} />,
  a: ({ node, ...props }) => (
    <a
      {...props}
      target={"_blank"}
      rel={"noopener noreferrer"}
      className={"font-semibold text-foreground/80 underline"}
    >
      {props.children}
    </a>
  ),
  ol: ({ node, ...props }) => <ol {...props} className={"list-decimal pl-5"} />
};

const LANGUAGE_REGEX = /language-(\w+)/;

function Code({ children, className, ...props }: CodeComponentProps) {
  const match = LANGUAGE_REGEX.exec(className || "");

  if (match) {
    const lang = match[1];
    return <CodeBlock lang={lang} codeString={String(children)} />;
  }

  return (
    <code
      className={
        "mx-0.5 overflow-auto rounded-md bg-primary/10 px-2 py-1 font-mono text-foreground"
      }
      {...props}
    >
      {children}
    </code>
  );
}

function parseMarkdownIntoBlocks(markdown: string): string[] {
  const tokens = marked.lexer(markdown);
  return tokens.map((token) => token.raw);
}

const MemoizedMarkdownBlock = memo(
  ({ content }: { content: string }) => {
    return (
      <ReactMarkdown
        remarkPlugins={[remarkGfm, [remarkMath]]}
        rehypePlugins={[rehypeKatex]}
        components={components}
      >
        {content}
      </ReactMarkdown>
    );
  },
  (prevProps, nextProps) => {
    return prevProps.content === nextProps.content;
  }
);

MemoizedMarkdownBlock.displayName = "MemoizedMarkdownBlock";

export const MemoizedMarkdown = memo(
  ({ content, id }: { content: string; id: string }) => {
    const blocks = useMemo(() => parseMarkdownIntoBlocks(content), [content]);

    return (
      <div
        className={
          "prose prose-base dark:prose-invert bread-words flex w-full max-w-none flex-col gap-4 prose-code:before:content-none prose-code:after:content-none"
        }
      >
        {blocks.map((block, index) => (
          <MemoizedMarkdownBlock content={block} key={`${id}-block_${index}`} />
        ))}
      </div>
    );
  }
);

MemoizedMarkdown.displayName = "MemoizedMarkdown";
