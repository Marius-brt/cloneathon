import { Chat } from "@/components/chat/chat";
import { ChatInput } from "@/components/chat/chat-input";
import { ChatTitle } from "@/components/chat/chat-title";
import { ChatProvider } from "@/components/providers/chat-provider";
import { ChatRepository } from "@/lib/server/repositories/chat.repository";
import { MessageRepository } from "@/lib/server/repositories/message.repository";
import { notFound } from "next/navigation";
import { z } from "zod/v4";

export const dynamic = "force-dynamic";

export default async function ThreadPage({
  params
}: {
  params: Promise<{ chatId: string }>;
}) {
  const { chatId } = await params;

  await z
    .uuid()
    .parseAsync(chatId)
    .catch(() => notFound());

  const messages = await MessageRepository.getMessagesByChatId(chatId, 10, 0);
  const orderedMessages = messages.reverse();
  const title = messages.length > 0 ? await ChatRepository.getChatTitle(chatId) : null;

  return (
    <ChatProvider
      initialMessages={orderedMessages}
      chatId={chatId}
      initialTitle={title?.title || ""}
    >
      <ChatTitle />
      <div className="fixed top-0 left-0 z-20 h-22 w-full bg-gradient-to-t from-background/0 via-60% via-background to-background" />
      <Chat initialMessages={orderedMessages} />
      <ChatInput />
      <div className="pointer-events-none fixed bottom-0 left-0 h-[180px] w-full bg-gradient-to-b from-background/0 via-70% via-background to-background" />
    </ChatProvider>
  );
}
