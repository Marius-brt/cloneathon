import { toolIcons } from "@/components/icons";
import { GlobeIcon, type LucideIcon } from "lucide-react";
import type { ReactNode, SVGProps } from "react";

export const tools: Record<
  string,
  {
    name: string;
    description: string;
    icon: LucideIcon | ((props: SVGProps<SVGSVGElement>) => ReactNode);
  }
> = {
  context7: {
    name: "Context7",
    description: "Context7 is a tool that allows you to search the web.",
    icon: toolIcons.context7
  },
  websearch: {
    name: "Web Search",
    description: "Web Search is a tool that allows you to search the web.",
    icon: GlobeIcon
  }
};
