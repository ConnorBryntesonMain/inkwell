# server/Dockerfile
#
# Copy package files and install dependencies before copying the source
# code. Docker can then reuse the dependency layer when only the source
# code changes.

FROM node:22-alpine
# Alpine is a small Linux distribution. Its small base image can reduce
# download size and the number of installed system packages. Alpine uses
# musl instead of glibc, so confirm that native dependencies support it.
# Node.js 22 matches the engines setting in server/package.json.

ENV NODE_ENV=production
# Run npm and Express in production mode. error-handler.js hides internal
# error details only when NODE_ENV is production and app.js mounts the
# handler.

WORKDIR /app
# Run all later instructions from /app inside the image.

COPY package*.json ./
RUN npm ci --omit=dev
# Install dependencies in a separate cached layer.

COPY prisma7.config.ts ./prisma.config.ts
COPY prisma ./prisma
RUN DATABASE_URL="postgresql://build:build@localhost:5432/build" npx --no-install prisma generate
# prisma.config.ts reads DATABASE_URL and fails if it is missing.
# The .dockerignore file excludes .env.
#
# `prisma generate` does not connect to the database, so this command can
# use a temporary URL. The URL applies only to this RUN instruction and
# does not remain in the final image. Supply the real URL at runtime.

COPY src ./src
# Copy the application code last because it changes most often.

COPY docker-entrypoint.sh ./
RUN chmod +x docker-entrypoint.sh
# Run pending database migrations before the server starts.

ENV PORT=3000
# Inkwell normally uses port 4000 when PORT is not set.
# Set PORT so the application listens on the documented container port.

EXPOSE 3000
# Document the port that the server uses. EXPOSE does not publish it.

USER node
# Run the server as the unprivileged "node" user from the official image.
# The running process can read the root-owned application files but cannot
# modify them.

ENTRYPOINT ["./docker-entrypoint.sh"]
CMD ["node", "src/index.js"]
# Do not store secrets in the image. Supply them when the container starts:
#   docker run -p 3000:3000 \
#     -e DATABASE_URL=... \
#     -e ACCESS_TOKEN_SECRET=... \
#     -e REFRESH_TOKEN_SECRET=... \
#     inkwell-server
