# frontend/Dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package.json package-lock.json* ./

RUN npm install || (echo "Retrying npm install..." && sleep 5 && npm install)

COPY . .

EXPOSE 3000

CMD ["npm", "run", "dev"]
