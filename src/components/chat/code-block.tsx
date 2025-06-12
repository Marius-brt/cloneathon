"use client";

import { CopyButton } from "@/components/ui/copy";
import { toJsxRuntime } from "hast-util-to-jsx-runtime";
import { Fragment, type JSX, useEffect, useState } from "react";
import { jsx, jsxs } from "react/jsx-runtime";
import { type BundledLanguage, codeToHast } from "shiki";

async function highlight(code: string, lang: BundledLanguage) {
  const out = await codeToHast(code, {
    lang,
    themes: {
      dark: "material-theme-darker",
      light: "material-theme-lighter"
    }
  });

  return toJsxRuntime(out, {
    Fragment,
    jsx,
    jsxs
  }) as JSX.Element;
}

export function CodeBlock({
  lang,
  codeString
}: {
  lang: string;
  codeString: string;
}) {
  const [code, setCode] = useState<JSX.Element | null>(null);

  useEffect(() => {
    let cancelled = false;
    highlight(codeString, lang as BundledLanguage).then((res) => {
      if (!cancelled) {
        setCode(res);
      }
    });
    return () => {
      cancelled = true;
    };
  }, [codeString, lang]);

  return (
    <div className="codeblock my-4 rounded-none font-mono text-sm [&>pre]:overflow-x-auto [&>pre]:rounded-b-lg [&>pre]:p-4">
      <div className="flex items-center justify-between rounded-t-md bg-secondary py-2 pr-2 pl-4 text-foreground">
        <span className="font-mono text-sm">{lang}</span>
        <CopyButton value={codeString} />
      </div>
      {code ?? (
        <pre className="bg-[rgb(250,250,250)] text-[rgb(144,164,174)] dark:bg-[#212121] dark:text-[#EEFFFF]">
          {codeString}
        </pre>
      )}
    </div>
  );
}
