# Use Ubuntu 25.04 as base for Node.js - has glibc 2.39
FROM ubuntu:25.04

# Install Node.js 20 and dependencies
RUN apt-get update && apt-get install -y \
    wget \
    ca-certificates \
    curl \
    && curl -fsSL https://deb.nodesource.com/setup_20.x | bash - \
    && apt-get install -y nodejs \
    && rm -rf /var/lib/apt/lists/*

# Download and install matugen
# Using the latest release from GitHub
ARG MATUGEN_VERSION=3.1.0
RUN wget -q https://github.com/InioX/matugen/releases/download/v${MATUGEN_VERSION}/matugen-${MATUGEN_VERSION}-x86_64.tar.gz -O /tmp/matugen.tar.gz \
    && tar -xzf /tmp/matugen.tar.gz -C /usr/local/bin/ \
    && chmod +x /usr/local/bin/matugen \
    && rm /tmp/matugen.tar.gz

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install Node.js dependencies
RUN npm install --production

# Copy application files
COPY . .

# Create uploads directory
RUN mkdir -p uploads

# Expose the port the app runs on
EXPOSE 3000

# Set environment variable
ENV NODE_ENV=production

# Start the application
CMD ["node", "server.js"]
