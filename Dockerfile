# Stage 1: Build
FROM oven/bun:1-alpine AS builder
WORKDIR /app

# 1. Install dependencies (cached layer)
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile

# 2. Build the app
COPY . .
RUN bun run build

# 3. Prune dev-dependencies to save space
# This removes things like Vite, leaving only what's needed for production
RUN rm -rf node_modules
RUN bun install --production --frozen-lockfile && bun pm cache rm

# Stage 2: Production
FROM oven/bun:1-alpine AS runner
WORKDIR /app

# Set to production to optimize Bun's internal performance
ENV NODE_ENV=production

# Copy only the essentials from the builder
COPY --from=builder /app/build ./build

# Security: Don't run as root
USER bun
EXPOSE 3000

# svelte-adapter-bun outputs an index.js inside the build folder
ENTRYPOINT ["bun", "./build"]