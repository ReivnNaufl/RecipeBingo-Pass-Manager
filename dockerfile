FROM node:20 AS backend

WORKDIR /app


# Copy backend files
COPY package*.json ./
COPY .env .env
COPY index.js index.js
COPY api/ ./api
COPY lib/ ./lib
COPY recipebingo-pass-manager-firebase-adminsdk-fbsvc-5817abd14b.json recipebingo-pass-manager-firebase-adminsdk-fbsvc-5817abd14b.json

# Install backend deps
RUN npm install

FROM node:20 AS frontend

WORKDIR /client

COPY client/package*.json ./
RUN npm install

COPY client/ .

RUN npm run build

RUN npm install

COPY client/ .

RUN npm run build

# ---- Serve frontend with backend ----
FROM node:20 AS final

WORKDIR /app

# Copy backend and deps
COPY --from=backend /app /app

# Copy frontend build into backend folder
COPY --from=frontend /client/dist ./client/dist

# Expose port (update to your actual backend port if different)
EXPOSE 3000

# Start backend server
CMD ["node", "index.js"]