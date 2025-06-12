import { CopyButton } from "@/components/ui/copy";
import { cn } from "@/lib/utils";
import { marked } from "marked";
import { useTheme } from "next-themes";
import { createContext, memo, useContext, useMemo } from "react";
import type { ComponentProps } from "react";
import ReactMarkdown, { type Components } from "react-markdown";
import type { ExtraProps } from "react-markdown";
import ShikiHighlighter from "react-shiki";
import rehypeKatex from "rehype-katex";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";

type CodeComponentProps = ComponentProps<"code"> & ExtraProps;
type MarkdownSize = "default" | "small";

// Context to pass size down to components
const MarkdownSizeContext = createContext<MarkdownSize>("default");

const components: Components = {
  code: CodeBlock as Components["code"],
  pre: ({ children }) => <>{children}</>,
  h1: ({ node, ...props }) => (
    <h1 {...props} className={"pt-10 pb-2 font-bold text-2xl"} />
  ),
  h2: ({ node, ...props }) => <h2 {...props} className={"pt-8 pb-1 font-bold text-xl"} />,
  h3: ({ node, ...props }) => (
    <h3 {...props} className={"pt-6 font-bold text-foreground/80"} />
  ),
  h4: ({ node, ...props }) => (
    <h4 {...props} className={"pt-4 text-muted-foreground text-xs uppercase"} />
  ),
  ul: ({ node, ...props }) => <ul {...props} className={"mb-4 list-disc pl-4"} />,
  li: ({ node, ...props }) => <li {...props} className={"mb-4 last:mb-0"} />,
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
  ol: ({ node, ...props }) => <ol {...props} className={"mb-4 list-decimal pl-5"} />,
  hr: ({ node, className, ...props }) => (
    <hr {...props} className={cn("my-8", className)} />
  )
};

const LANGUAGE_REGEX = /language-(\w+)/;

function CodeBlock({ children, className, ...props }: CodeComponentProps) {
  const size = useContext(MarkdownSizeContext);
  const match = LANGUAGE_REGEX.exec(className || "");
  const { resolvedTheme } = useTheme();

  if (match) {
    const lang = match[1];
    return (
      <div className="mt-4 rounded-none">
        <Codebar lang={lang} codeString={String(children)} />
        <ShikiHighlighter
          addDefaultStyles={false}
          language={lang}
          theme={
            resolvedTheme === "dark" ? "material-theme-darker" : "material-theme-lighter"
          }
          className="font-mono text-sm [&>pre]:overflow-x-auto [&>pre]:rounded-b-lg [&>pre]:p-4"
          showLanguage={false}
        >
          {String(children)}
        </ShikiHighlighter>
      </div>
    );
  }

  const inlineCodeClasses =
    size === "small"
      ? "mx-0.5 overflow-auto rounded-md px-1 py-0.5 bg-primary/10 text-foreground font-mono text-xs"
      : "mx-0.5 overflow-auto rounded-md px-2 py-1 bg-primary/10 text-foreground font-mono";

  return (
    <code className={inlineCodeClasses} {...props}>
      {children}
    </code>
  );
}

function Codebar({ lang, codeString }: { lang: string; codeString: string }) {
  return (
    <div className="flex items-center justify-between rounded-t-md bg-secondary px-4 py-2 text-foreground">
      <span className="font-mono text-sm">{lang}</span>
      <CopyButton value={codeString} />
    </div>
  );
}

function parseMarkdownIntoBlocks(markdown: string): string[] {
  const tokens = marked.lexer(markdown);
  return tokens.map((token) => token.raw);
}

function PureMarkdownRendererBlock({ content }: { content: string }) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm, [remarkMath]]}
      rehypePlugins={[rehypeKatex]}
      components={components}
    >
      {content}
    </ReactMarkdown>
  );
}

const MarkdownRendererBlock = memo(PureMarkdownRendererBlock, (prevProps, nextProps) => {
  if (prevProps.content !== nextProps.content) {
    return false;
  }
  return true;
});

MarkdownRendererBlock.displayName = "MarkdownRendererBlock";

const MemoizedMarkdown = memo(
  ({
    content,
    id,
    size = "default"
  }: {
    content: string;
    id: string;
    size?: MarkdownSize;
  }) => {
    const blocks = useMemo(() => parseMarkdownIntoBlocks(content), [content]);

    const proseClasses =
      size === "small"
        ? "prose prose-sm dark:prose-invert bread-words max-w-none w-full prose-code:before:content-none prose-code:after:content-none"
        : "prose prose-base dark:prose-invert bread-words max-w-none w-full prose-code:before:content-none prose-code:after:content-none";

    return (
      <MarkdownSizeContext.Provider value={size}>
        <div className={cn("flex flex-col gap-4", proseClasses)}>
          {blocks.map((block, index) => (
            <MarkdownRendererBlock content={block} key={`${id}-block-${index}`} />
          ))}
        </div>
      </MarkdownSizeContext.Provider>
    );
  }
);

MemoizedMarkdown.displayName = "MemoizedMarkdown";

export default MemoizedMarkdown;
