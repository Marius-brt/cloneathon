# Use Bun image as base
FROM oven/bun:1 AS deps
WORKDIR /app

# Accept database URL as build argument
ARG DATABASE_URL
ENV DATABASE_URL=$DATABASE_URL
ENV CHECK_ENV=false

# Copy package files
COPY package.json bun.lock* ./
COPY prisma ./prisma/

# Install dependencies
RUN bun install --frozen-lockfile

# Generate Prisma client
RUN bunx prisma generate

# Builder stage
FROM oven/bun:1 AS builder
WORKDIR /app

# Accept database URL as build argument
ARG DATABASE_URL
ENV DATABASE_URL=$DATABASE_URL
ENV CHECK_ENV=false

# Copy dependencies from deps stage
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/prisma ./prisma

# Copy source code
COPY . .

# Set environment variable for Next.js build
ENV NEXT_TELEMETRY_DISABLED=1

# Build the application
RUN bun run build

# Production stage
FROM oven/bun:1 AS runner
WORKDIR /app

# Set environment variables
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Copy built application
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma

# Change ownership to existing bun user
RUN chown -R bun:bun /app
USER bun

# Expose port
EXPOSE 3000

# Set environment variables for runtime
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Start the application with migrations
CMD ["sh", "-c", "bunx prisma migrate deploy && bun server.js"]
