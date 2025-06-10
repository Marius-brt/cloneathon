import { redirect } from "next/navigation";

export default function ChatPage() {
  const chatId = crypto.randomUUID();
  redirect(`/${chatId}`);
}
