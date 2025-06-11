import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default function ChatPage() {
  const chatId = crypto.randomUUID();
  redirect(`/${chatId}`);
}
