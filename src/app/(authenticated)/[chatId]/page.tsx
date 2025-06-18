import { Chat } from "@/components/chat/chat";
import { ModelsProvider } from "@/components/providers/models.provider";
import { models } from "@/lib/server/models";
import { AgentRepository } from "@/lib/server/repositories/agent.repository";
import { ChatRepository } from "@/lib/server/repositories/chat.repository";
import { MessageRepository } from "@/lib/server/repositories/message.repository";
import { notFound } from "next/navigation";
import { z } from "zod/v4";

export const dynamic = "force-dynamic";

export default async function ThreadPage({
  params,
  searchParams
}: {
  params: Promise<{ chatId: string }>;
  searchParams: Promise<{ prompt?: string }>;
}) {
  const { chatId } = await params;
  const { prompt } = await searchParams;

  await z
    .uuid()
    .parseAsync(chatId)
    .catch(() => notFound());

  const messages = await MessageRepository.getMessagesByChatId(chatId, 0);
  const orderedMessages = messages.reverse();
  const title = messages.length > 0 ? await ChatRepository.getChatTitle(chatId) : null;
  const agents = await AgentRepository.getAgents();

  return (
    <>
      <div className="fixed top-0 left-0 z-20 h-22 w-full bg-gradient-to-t from-background/0 via-60% via-background to-background" />
      <ModelsProvider models={models} agents={agents}>
        <Chat
          initialMessages={orderedMessages}
          chatId={chatId}
          initialTitle={title?.title || null}
          initialPrompt={typeof prompt === "string" ? prompt : null}
        />
      </ModelsProvider>
      <div className="pointer-events-none fixed bottom-0 left-0 h-[180px] w-full bg-gradient-to-b from-background/0 via-70% via-background to-background" />
    </>
  );
}
