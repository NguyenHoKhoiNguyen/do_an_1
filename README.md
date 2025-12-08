# 🏀 Website Quản Lý Bóng Rổ

> Ứng dụng web full-stack quản lý câu lạc bộ bóng rổ được xây dựng bằng MERN Stack

## 📌 Thông tin đồ án

- **Môn học**: Công nghệ phần mềm 1
- **Sinh viên**: Nguyễn Hồ Khôi Nguyên
- **MSSV**: 4551190039
- **Lớp**: Kỹ thuật phần mềm K45
- **Giảng viên**: Đoàn Thị Thu Cúc
- **Năm**: 2025

## 🚀 Công nghệ sử dụng

### Backend
- **Node.js** - Runtime JavaScript (MIT License)
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - ODM cho MongoDB
- **JWT** - Xác thực người dùng
- **bcryptjs** - Mã hóa mật khẩu

### Frontend
- **React.js** - Thư viện UI
- **React Router** - Điều hướng
- **Axios** - HTTP client

## ✨ Tính năng chính

### 🔐 Xác thực & Phân quyền
- ✅ Đăng ký/Đăng nhập với JWT
- ✅ Phân quyền Admin và User
- ✅ Quản lý profile & đổi mật khẩu
- ✅ Admin quản lý người dùng

### 🏆 Quản lý Đội bóng
- ✅ CRUD đội bóng (Admin)
- ✅ Xem danh sách và chi tiết đội
- ✅ Theo dõi thống kê thắng/thua

### 👥 Quản lý Cầu thủ
- ✅ CRUD cầu thủ (Admin)
- ✅ Gán cầu thủ vào đội
- ✅ Quản lý thống kê cá nhân

### 📅 Quản lý Lịch thi đấu
- ✅ CRUD trận đấu (Admin)
- ✅ Cập nhật tỷ số real-time
- ✅ Xem trận sắp diễn ra
- ✅ Tự động cập nhật thắng/thua

### 🎨 Giao diện
- ✅ Design hiện đại với gradient & glassmorphism
- ✅ Responsive trên mọi thiết bị
- ✅ Dashboard với thống kê trực quan
- ✅ Smooth animations

## 📦 Cài đặt

### Yêu cầu
- Node.js v14+
- MongoDB v4+
- npm hoặc yarn

### Bước 1: Clone project
```bash
git clone <repository-url>
cd BasketballManagementWebsite
```

### Bước 2: Cài đặt Backend
```bash
cd backend
npm install
```

Tạo file `.env`:
```env
PORT=5001
MONGODB_URI=mongodb://localhost:27017/basketball_management
JWT_SECRET=basketball_secret_key_2025
```

### Bước 3: Cài đặt Frontend
```bash
cd frontend
npm install
```

### Bước 4: Khởi tạo dữ liệu mẫu
```bash
cd backend
npm run seed
```

## 🎯 Chạy ứng dụng

### Chạy Backend (Terminal 1)
```bash
cd backend
npm start
```
Server chạy tại: `http://localhost:5001`

### Chạy Frontend (Terminal 2)
```bash
cd frontend
npm start
```
Website chạy tại: `http://localhost:3000`

## 👤 Tài khoản demo

Sau khi chạy `npm run seed`, sử dụng tài khoản sau:

| Username | Password | Role  |
|----------|----------|-------|
| admin    | 123456   | Admin |
| user     | 123456   | User  |

## 📊 Cấu trúc Database

### Collections
- **users**: Thông tin người dùng và quyền truy cập
- **teams**: Các đội bóng (tên, HLV, thành phố, thống kê)
- **players**: Cầu thủ (tên, số áo, vị trí, đội, thống kê)
- **matches**: Lịch thi đấu (đội nhà, đội khách, tỷ số, trạng thái)

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - Đăng ký
- `POST /api/auth/login` - Đăng nhập
- `GET /api/auth/profile` - Xem profile (Protected)
- `PUT /api/auth/change-password` - Đổi mật khẩu (Protected)
- `GET /api/auth/users` - Danh sách users (Admin)
- `DELETE /api/auth/users/:id` - Xóa user (Admin)

### Teams
- `GET /api/teams` - Danh sách đội
- `GET /api/teams/:id` - Chi tiết đội
- `POST /api/teams` - Tạo đội (Admin)
- `PUT /api/teams/:id` - Sửa đội (Admin)
- `DELETE /api/teams/:id` - Xóa đội (Admin)

### Players
- `GET /api/players` - Danh sách cầu thủ
- `POST /api/players` - Tạo cầu thủ (Admin)
- `PUT /api/players/:id` - Sửa cầu thủ (Admin)
- `DELETE /api/players/:id` - Xóa cầu thủ (Admin)

### Matches
- `GET /api/matches` - Danh sách trận đấu
- `GET /api/matches/upcoming` - Trận sắp tới
- `POST /api/matches` - Tạo trận (Admin)
- `PATCH /api/matches/:id/score` - Cập nhật tỷ số (Admin)

## 🔒 Bảo mật

- ✅ Password hash với bcrypt (salt rounds = 10)
- ✅ JWT token với expiry 7 ngày
- ✅ Middleware xác thực và phân quyền
- ✅ Protected routes trên frontend
- ✅ CORS configuration

## 📱 Screenshots

### Trang đăng nhập
![Login Page](frontend/public/images/login-screenshot.png)

### Dashboard
![Dashboard](frontend/public/images/dashboard-screenshot.png)

## 🎓 Mục tiêu học tập

Dự án này giúp nắm vững:
- ✅ MERN Stack development
- ✅ RESTful API design
- ✅ JWT authentication
- ✅ Role-based authorization
- ✅ MongoDB & Mongoose
- ✅ React hooks & context API
- ✅ Responsive UI/UX design

## 🚧 Hướng phát triển

- [ ] Upload ảnh cho players/teams
- [ ] Tìm kiếm và filter nâng cao
- [ ] Real-time updates với Socket.io
- [ ] Charts và graphs cho thống kê
- [ ] Export data (PDF, Excel)
- [ ] Pagination cho danh sách
- [ ] Unit tests và E2E tests

## 📄 License

MIT License - Mã nguồn mở hoàn toàn

## 📞 Liên hệ

- **Sinh viên**: Nguyễn Hồ Khôi Nguyên
- **Trường**: Đại học Quy Nhơn

---

⭐ **Star repo này nếu bạn thấy hữu ích!**

🏀 **Made with ❤️ for Software Engineering Course**
