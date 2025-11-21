FROM node:18-alpine

# Working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install production dependencies
RUN if [ -f package-lock.json ]; then npm ci --production; else npm install --production; fi && npm cache clean --force

# Copy app files and set owner to non-root user
COPY --chown=node:node . .

# Set environment variables
ENV NODE_ENV=production
ENV PORT=3000
ENV MONGO_URI=mongodb://mongo:27017/belajar-nodejs

# Switch to non-root user
USER node

# Expose the app port
EXPOSE 3000

# Start the application
CMD ["npm", "start"]