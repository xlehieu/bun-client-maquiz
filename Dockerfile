# 1. Base image Bun
FROM oven/bun:1 AS base

# 2. Set working dir
WORKDIR /app

# 3. Copy package và lockfile để cache deps
COPY package.json bun.lock* ./

# 4. Install dependencies
RUN bun install --frozen-lockfile

# 5. Copy toàn bộ source
COPY . .

# 6. Build Next.js app
RUN bun run build

# 7. Expose port Next.js
EXPOSE 3000

# 8. Start app
CMD ["bun", "run", "start"]
