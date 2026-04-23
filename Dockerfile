FROM node:24-alpine

WORKDIR /app

# Install dependencies first (better layer caching)
COPY package.json package-lock.json* ./
RUN npm install

# Copy all source files
COPY . .

# Generate Prisma client
RUN npx prisma generate

# Expose dev server port
EXPOSE 3000

# Start dev server
CMD ["npm", "run", "dev"]
