import { Chat } from "@/components/chat/chat";
import { ChatRepository } from "@/lib/server/repositories/chat.repository";
import { MessageRepository } from "@/lib/server/repositories/message.repository";

export const dynamic = "force-dynamic";

export default async function ThreadPage({
  params
}: {
  params: Promise<{ chatId: string }>;
}) {
  const { chatId } = await params;

  const messages = await MessageRepository.getMessagesByChatId(chatId);
  const title = messages.length > 0 ? await ChatRepository.getChatTitle(chatId) : null;

  return <Chat chatId={chatId} initialMessages={messages} title={title?.title || ""} />;
}
