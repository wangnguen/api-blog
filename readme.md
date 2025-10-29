# Blog API

A RESTful API cho nền tảng blogging sử dụng Nodejs, Express, Mongodb, Redis

## Features

- Đăng nhập người dùng và phân quyền user, admin
- CRUD cho bài viết, danh mục, nhãn và bình luận
- Thích/bỏ thích cho bài viết
- Upload ảnh với cloudinary
- Sử dụng redis để lưu bài viết nổi bật
- Validate các dữ việu nhập vào
- Hỗ trợ phân trang
- Sử dụng swagger docs

## Tech Stack

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Redis** - Caching
- **JWT** - Authentication
- **Cloudinary** - Image storage
- **Docker** - Containerization

## Project Structure

```
src/
├── app.js                # setup express
├── config/               # Chứa các file cấu hình
├── controllers/          # Sử dụng req, res
├── helpers/              # Hàm trợ giúp
├── middlewares/          # Hàm trung gian hỗ trợ phân quyền xác thực token
├── models/               # Models cho database
├── routes/               # routes các API
├── services/            # Sử lí logic
├── utils/               # Hàm tiện ích
└── validations/         # validate
```

## Prerequisites

- Node.js
- MongoDB
- Redis
- Docker (optional)

## Getting Started

1. Clone the repository:

```bash
git clone https://github.com/wangnguen/api-blog.git
cd api-blog
```

2. Install dependencies:

```bash
yarn install
```

3. Set up environment variables:
   Create a `.env` file in the root directory and add the following:

```env
PORT=8080
DEV_DB_HOST=your_db_host
DEV_DB_PORT=your_db_port
DEV_DB_NAME=your_db_name
DEV_REDIS_USERNAME=default
DEV_REDIS_PASSWORD=your_redis_password
DEV_REDIS_HOST=your_redis_host
DEV_REDIS_PORT=your_redis_port
ACCESS_TOKEN_SECRET=your_jwt_secret
REFRESH_TOKEN_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

4. Start the server:

```bash
npm start
npm dev # for dev
```

Or using Docker:

```bash
docker-compose up
```

## API Endpoints

### Authentication

- `POST /auth/register` - Đăng ký
- `POST /auth/login` - Đăng nhập
- `POST /auth/refresh` - Lấy lại access token
- `POST /auth/logout` - Đăng xuất

### Categories

- `GET /categories` - Lấy tất cả danh mục
- `GET /categories/:slug` - Lấy danh mục theo slug
- `POST /categories` - Tạo mới danh mục(admin)
- `PATCH /categories/:id` - Cập nhật danh mục(admin)
- `DELETE /categories/:id` - Xóa danh mục(admin)

### Comments

- `GET /posts/:postId/comments` - Lấy danh sách bình luận của 1 bài viết
- `POST /posts/:postId/comments` - Thêm comment cho 1 bài viết
- `DELETE /comments/:id` - Xóa bình luận

### Posts

- `GET /posts` - Lấy tất cả bài viết(Hỗ trợ lọc theo tag, category và phân trang)
- `GET /posts/top` - Lấy bài viết nổi bật
- `GET /posts/:slug` - Lấy chi tiết 1 bài viết theo slug
- `POST /posts` - Tạo mới bài viết 
- `PATCH /posts/:id` - Cập nhật bài viết
- `DELETE /posts/:id` - Xóa bài viết 
- `GET /posts/:id/likes - Lấy danh sách người like bài viết 
- `POST /posts/:id/like` - Like/Unlike post

### Tags

- `GET /tags` - Lấy danh sách nhãn
- `GET /tags/:slug` - Lấy thông tin nhãn
- `POST /tags` - Tạo mới nhãn
- `DELETE /tags/:id` - Xóa nhãn 

### Users

- `GET /users/me` - Lấy người dùng hiện tại
- `GET /users/:username` - Xem thông tin giới thiệu ngườ dùng khác theo username
- `PATCH /users/me` - Cập nhật thông tin người dùng
- `PATCH /users/me/change-password` - Cập nhật mật khẩu

## Documentation

API documentation is available through Swagger UI at `/docs` when running the server.
