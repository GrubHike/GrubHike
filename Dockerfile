# pull the official base image (Background o.s for container)
 FROM node:latest
# set working direction (directory for my project)
 WORKDIR /app
# set environment path
 ENV PATH="./node_modules/.bin:$PATH"
# Copy everything from local machine to our server, second dot refers to the directory on the container.
 COPY . .
# install npm dependencies
 RUN npm install
# start an application (starting our react server)
 CMD ["node", "app.js"]
