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
    description: "Search up-to-date documentation and technical information",
    icon: toolIcons.context7
  },
  websearch: {
    name: "Web Search",
    description: "Search the web for up-to-date information",
    icon: GlobeIcon
  }
};
