FROM node:16-alpine as build-stage
WORKDIR /frontend
COPY package*.json ./
RUN npm install
COPY . .
RUN npm ci 
RUN npm run build --if-present --production

# RUN NODE_ENV=production npm ci
# RUN npm ci --only=prod
# CMD ["npm", "run", "serve"] 	# étape de production

FROM nginx:stable-alpine as production-stage
COPY --from=build-stage /frontend/out /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"] 