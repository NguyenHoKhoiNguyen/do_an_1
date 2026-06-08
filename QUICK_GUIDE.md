# 🚀 HƯỚNG DẪN NHANH - Version 2.1.0

## ✨ TÍNH NĂNG MỚI: TRANG THỐNG KÊ VỚI BIỂU ĐỒ

---

## 📦 Cài đặt

### Bước 1: Cài đặt thư viện biểu đồ
```bash
cd frontend
npm install recharts
```

### Bước 2: Khởi động lại server
```bash
# Terminal 1 - Backend
cd backend
npm start

# Terminal 2 - Frontend
cd frontend
npm start
```

---

## 🎯 Truy cập Trang Thống kê

1. **Mở trình duyệt**: `http://localhost:3000`
2. **Đăng nhập** với tài khoản admin hoặc user
3. **Click menu** "📊 Thống kê" trên navbar
4. **Hoặc truy cập trực tiếp**: `http://localhost:3000/statistics`

---

## 📊 Các Biểu đồ

### 1. **Phân bổ Trận đấu** (Pie Chart)
- Hiển thị số lượng trận theo trạng thái
- Màu sắc: Xanh (Scheduled), Lục (Live), Xám (Finished), Đỏ (Cancelled)

### 2. **Top 5 Đội Bóng** (Bar Chart)
- So sánh số trận Thắng vs Thua
- Chỉ hiển thị 5 đội có nhiều trận thắng nhất

### 3. **Tỷ lệ Thắng** (Line Chart)
- Hiển thị win rate (%) của từng đội
- Sắp xếp theo tỷ lệ thắng giảm dần

### 4. **Phân bổ Cầu thủ** (Pie Chart)
- Số lượng cầu thủ theo vị trí
- 5 vị trí: PG, SG, SF, PF, C

---

## 🔄 Lọc theo Thời gian

### Cách sử dụng:
1. Click dropdown "Khoảng thời gian"
2. Chọn một trong ba:
   - **📅 Hôm nay**: Chỉ trận đấu hôm nay
   - **📆 Tuần này**: Từ Chủ nhật đến hiện tại
   - **🗓️ Tháng này**: Từ ngày 1 đến hiện tại
3. Biểu đồ tự động cập nhật

---

## 🏆 Bảng Xếp hạng

### Các cột:
- **Đội**: Tên đội (Top 3 có icon 🥇🥈🥉)
- **Thành phố**: Nơi đóng quân
- **HLV**: Huấn luyện viên
- **Thắng**: Số trận thắng (màu xanh)
- **Thua**: Số trận thua (màu đỏ)
- **Tổng trận**: Tổng số trận đã đấu
- **Tỷ lệ thắng**: Win rate (%) với màu nền

### Sắp xếp:
- Tự động sắp xếp theo tỷ lệ thắng giảm dần
- Đội có win rate cao nhất ở đầu bảng

---

## 📱 Responsive

### Desktop (>1200px)
- 2 cột biểu đồ
- Bảng đầy đủ các cột

### Tablet (768-1200px)
- 1-2 cột tùy kích thước
- Bảng responsive với scroll ngang

### Mobile (<768px)
- 1 cột, stack vertical
- Cards stack theo chiều dọc

---

## 🎨 Màu sắc

### Summary Cards:
```
┌─────────────┬─────────────┬─────────────┬─────────────┐
│   Purple    │    Pink     │    Cyan     │    Green    │
│  #667eea    │  #f093fb    │  #4facfe    │  #43e97b    │
└─────────────┴─────────────┴─────────────┴─────────────┘
```

### Chart Colors:
- **Scheduled**: #3498db (Blue)
- **Live**: #27ae60 (Green)
- **Finished**: #95a5a6 (Gray)
- **Cancelled**: #e74c3c (Red)

---

## 🔍 Tìm kiếm

### Trang Matches:
1. Nhập tên đội, địa điểm hoặc chọn trạng thái
2. Click "Tìm kiếm"
3. Kết quả hiển thị ngay lập tức

### Trang Teams:
1. Tìm theo tên đội, thành phố hoặc HLV
2. Click "Tìm kiếm"

### Trang Players:
1. Tìm theo tên hoặc lọc theo vị trí/đội
2. Click "Tìm kiếm"

---

## 📝 Ví dụ Sử dụng

### Scenario 1: Xem thống kê tuần này
```
1. Vào trang Thống kê
2. Dropdown đã chọn sẵn "Tuần này"
3. Xem 4 summary cards
4. Xem biểu đồ Pie - phân bổ trận
5. Xem Top 5 đội ở Bar Chart
6. Cuộn xuống xem bảng xếp hạng
```

### Scenario 2: Tìm đội Lakers
```
1. Vào trang Đội bóng
2. Nhập "Lakers" vào ô Tên đội
3. Click "Tìm kiếm"
4. Kết quả hiển thị các đội có tên "Lakers"
5. Click "Xóa bộ lọc" để xem lại tất cả
```

### Scenario 3: Xem thống kê hôm nay
```
1. Vào trang Thống kê
2. Click dropdown "Khoảng thời gian"
3. Chọn "Hôm nay"
4. Tất cả biểu đồ cập nhật theo hôm nay
```

---

## 🐛 Xử lý Lỗi

### Không có dữ liệu:
- Hiển thị message: "Không có dữ liệu..."
- Không crash, không blank screen

### Lỗi kết nối:
- Check backend đang chạy: `http://localhost:5001`
- Check MongoDB đang chạy

### Biểu đồ không hiển thị:
1. Clear cache trình duyệt
2. Restart frontend: `Ctrl+C` → `npm start`
3. Check console log

---

## 🎓 Tips & Tricks

### Tip 1: Xem nhanh trận đang live
- Vào trang Thống kê
- Nhìn vào card "Trận đang diễn ra"
- Số hiển thị số trận đang live

### Tip 2: So sánh đội
- Vào bảng xếp hạng
- So sánh cột "Tỷ lệ thắng"
- Đội nào xanh lá = win rate > 50%

### Tip 3: Tìm cầu thủ theo vị trí
- Vào trang Cầu thủ
- Chọn vị trí từ dropdown
- Click "Tìm kiếm"

---

## 📞 Hỗ trợ

### Gặp vấn đề?
1. Check terminal có lỗi
2. Check browser console (F12)
3. Restart backend & frontend
4. Clear cache

### Câu hỏi thường gặp:

**Q: Biểu đồ trống?**  
A: Chưa có dữ liệu trong khoảng thời gian đã chọn. Thử chọn "Tháng này".

**Q: Không thấy menu Thống kê?**  
A: Chưa đăng nhập. Login trước khi vào trang.

**Q: Tìm kiếm không hoạt động?**  
A: Check backend API đang chạy. Test: `http://localhost:5001/api/teams`

---

## 🎉 Tính năng Nổi bật

✅ **Biểu đồ chuyên nghiệp** với Recharts  
✅ **Responsive** trên mọi thiết bị  
✅ **Real-time** cập nhật khi chọn thời gian  
✅ **Màu sắc đẹp mắt** với gradient  
✅ **Icon trực quan** (🥇🥈🥉)  
✅ **Tìm kiếm nhanh** cho tất cả trang  
✅ **Thống kê đầy đủ** theo ngày/tuần/tháng  

---

**Chúc bạn sử dụng hiệu quả! 🏀📊**

Version: 2.1.0  
Date: 15/12/2025
