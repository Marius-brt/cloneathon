import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from "@/components/ui/accordion";
import { useId } from "react";
import { ShinyText } from "../animations/shinny-text";
import { MemoizedMarkdown } from "./markdown";

export function Reasoning({ text, isReasoning }: { text: string; isReasoning: boolean }) {
  const id = useId();

  return (
    <Accordion type="single" collapsible className="w-full">
      <AccordionItem
        value={id}
        className="rounded-md border bg-background px-3 py-2 outline-none last:border-b has-focus-visible:border-ring has-focus-visible:ring-[3px] has-focus-visible:ring-ring/50"
      >
        <AccordionTrigger className="[&>svg]:-order-1 flex items-center justify-start gap-2 p-0 leading-6 hover:no-underline focus-visible:ring-0 [&>svg]:mb-1">
          {isReasoning ? (
            <ShinyText className="text-sm">Reasoning</ShinyText>
          ) : (
            <span className="text-neutral-600/70 text-sm dark:text-neutral-400/70">
              Reasoning
            </span>
          )}
        </AccordionTrigger>
        <AccordionContent className="pt-2 pb-0">
          <MemoizedMarkdown content={text} id={`${id}-reasoning`} />
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
