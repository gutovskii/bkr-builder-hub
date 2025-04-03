# Use Node.js 20 with Alpine for a lightweight image
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package.json and install dependencies
COPY package.json package-lock.json ./
RUN npm install

# Install tsx globally
RUN npm install -g tsx

# Copy the rest of the application
COPY . .

# RUN npx zenstack@latest init
RUN npx zenstack generate
# RUN npx prisma db push

# Default command (this can be overridden by docker-compose)
CMD ["sh", "./run.sh"]
