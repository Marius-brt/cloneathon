import { Chat } from "@/components/chat/chat";
import { MessageRepository } from "@/lib/server/repositories/message.repository";

export default async function ThreadPage({
  params
}: {
  params: Promise<{ chatId: string }>;
}) {
  const { chatId } = await params;

  const messages = await MessageRepository.getMessagesByChatId(chatId);

  return <Chat chatId={chatId} initialMessages={messages} />;
}
