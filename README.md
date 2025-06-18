# Marius Chat

This project was created for the [**Theo Cloneathon**](https://cloneathon.t3.chat/).

## Features
- Multi-model AI chat
- All OpenRouter AI models
- Tools (Context7 and Web search)
- Custom agents
- Modern UI with [shadcn/ui](https://ui.shadcn.com/)

## Tech stack
- Next.js
- AI SDK
- Shadcn
- Upstash
- Better Auth
- OpenRouter

## Getting Started

1. **Install dependencies:**
   ```bash
   bun install
   ```
2. **Set up environment variables:**
   Create a `.env` file to match the `env.ts` requirements
3. **Run database migrations:**
   ```bash
   bun run db:migrate
   ```
4. **Start the development server:**
   ```bash
   bun run dev
   ```

## Scripts
- `bun run dev` – Start the development server
- `bun run build` – Build the application
- `bun run db:migrate` – Run database migrations
- `bun run db:studio` – Open Prisma Studio