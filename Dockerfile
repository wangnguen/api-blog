# chi dinh base image
FROM node:22-alpine

# thiet lap thu muc lam viec
WORKDIR /app

# code thay doi ma depen ko doi -> khong can yarn install
COPY package*.json yarn.lock ./

# thuc thi khi build image (--frozen-lockfile: khong thay doi neu code update)
RUN yarn install --frozen-lockfile

# sao chep file tu host vao image
COPY . .

# port container
EXPOSE 8080

# lenh mac dinh khi chay docker container tu docker image
CMD ["yarn", "dev"]