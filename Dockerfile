FROM node:15
WORKDIR /project1
COPY package*.json ./
RUN npm install
COPY . .
CMD [ "node", "app.js" ]
EXPOSE 1000