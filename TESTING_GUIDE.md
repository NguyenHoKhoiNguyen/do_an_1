# 🧪 Hướng dẫn Test Tính năng Mới

## 📋 Checklist Testing

### ✅ Backend API Testing

#### 1. Test API Tìm kiếm Trận đấu

**Endpoint**: `GET /api/matches/search`

```bash
# Test 1: Tìm theo tên đội
curl "http://localhost:5001/api/matches/search?team=Lakers"

# Test 2: Tìm theo địa điểm
curl "http://localhost:5001/api/matches/search?location=Hà Nội"

# Test 3: Lọc theo trạng thái
curl "http://localhost:5001/api/matches/search?status=Finished"

# Test 4: Kết hợp nhiều điều kiện
curl "http://localhost:5001/api/matches/search?team=Lakers&status=Live"
```

**Kết quả mong đợi**: Trả về array các trận đấu khớp với điều kiện

---

#### 2. Test API Thống kê Trận đấu

**Endpoint**: `GET /api/matches/stats`

```bash
# Test 1: Thống kê hôm nay
curl "http://localhost:5001/api/matches/stats?period=day"

# Test 2: Thống kê tuần này
curl "http://localhost:5001/api/matches/stats?period=week"

# Test 3: Thống kê tháng này
curl "http://localhost:5001/api/matches/stats?period=month"

# Test 4: Thống kê theo khoảng thời gian tùy chỉnh
curl "http://localhost:5001/api/matches/stats?startDate=2025-12-01&endDate=2025-12-15"
```

**Kết quả mong đợi**: 
```json
{
  "totalMatches": 10,
  "scheduled": 3,
  "live": 1,
  "finished": 5,
  "cancelled": 1,
  "matches": [...]
}
```

---

#### 3. Test API Tìm kiếm Đội bóng

**Endpoint**: `GET /api/teams/search`

```bash
# Test 1: Tìm theo tên
curl "http://localhost:5001/api/teams/search?name=Lakers"

# Test 2: Tìm theo thành phố
curl "http://localhost:5001/api/teams/search?city=Hà Nội"

# Test 3: Tìm theo HLV
curl "http://localhost:5001/api/teams/search?coach=Nguyễn"

# Test 4: Kết hợp
curl "http://localhost:5001/api/teams/search?name=Lakers&city=Hà Nội"
```

**Kết quả mong đợi**: Array các đội bóng phù hợp

---

#### 4. Test API Tìm kiếm Cầu thủ

**Endpoint**: `GET /api/players/search`

```bash
# Test 1: Tìm theo tên
curl "http://localhost:5001/api/players/search?name=Nguyễn"

# Test 2: Lọc theo vị trí
curl "http://localhost:5001/api/players/search?position=Point%20Guard"

# Test 3: Lọc theo đội
curl "http://localhost:5001/api/players/search?team=TEAM_ID_HERE"

# Test 4: Kết hợp
curl "http://localhost:5001/api/players/search?position=Point%20Guard&name=Văn"
```

**Kết quả mong đợi**: Array các cầu thủ phù hợp

---

### ✅ Frontend UI Testing

#### 1. Test Trang Matches (Lịch thi đấu)

**Test Case 1: Tìm kiếm theo tên đội**
1. Mở trang Matches
2. Nhập "Lakers" vào ô "Tên đội"
3. Click "Tìm kiếm"
4. ✅ Kết quả: Chỉ hiển thị các trận có Lakers

**Test Case 2: Lọc theo trạng thái**
1. Chọn "Đã kết thúc" từ dropdown Trạng thái
2. Click "Tìm kiếm"
3. ✅ Kết quả: Chỉ hiển thị trận đấu đã kết thúc

**Test Case 3: Xem thống kê tuần này**
1. Click nút "📊 Thống kê"
2. Modal thống kê hiển thị
3. Chọn "Tuần này"
4. Click "Cập nhật"
5. ✅ Kết quả: Hiển thị số liệu thống kê của tuần

**Test Case 4: Clear bộ lọc**
1. Nhập điều kiện tìm kiếm
2. Click "Tìm kiếm"
3. Click "Xóa bộ lọc"
4. ✅ Kết quả: Reset về danh sách đầy đủ

---

#### 2. Test Trang Teams (Đội bóng)

**Test Case 1: Tìm theo tên đội**
1. Nhập tên đội vào ô "Tên đội"
2. Click "Tìm kiếm"
3. ✅ Kết quả: Hiển thị đội khớp với tên

**Test Case 2: Tìm theo thành phố**
1. Nhập "Hà Nội" vào ô "Thành phố"
2. Click "Tìm kiếm"
3. ✅ Kết quả: Hiển thị các đội ở Hà Nội

**Test Case 3: Tìm theo HLV**
1. Nhập tên HLV
2. Click "Tìm kiếm"
3. ✅ Kết quả: Hiển thị đội của HLV đó

**Test Case 4: Kết hợp nhiều điều kiện**
1. Nhập cả tên đội và thành phố
2. Click "Tìm kiếm"
3. ✅ Kết quả: Hiển thị đội khớp cả hai điều kiện

---

#### 3. Test Trang Players (Cầu thủ)

**Test Case 1: Tìm theo tên**
1. Nhập tên cầu thủ
2. Click "Tìm kiếm"
3. ✅ Kết quả: Hiển thị cầu thủ khớp tên

**Test Case 2: Lọc theo vị trí**
1. Chọn "Point Guard" từ dropdown
2. Click "Tìm kiếm"
3. ✅ Kết quả: Chỉ hiển thị Point Guards

**Test Case 3: Lọc theo đội**
1. Chọn một đội từ dropdown
2. Click "Tìm kiếm"
3. ✅ Kết quả: Chỉ hiển thị cầu thủ của đội đó

**Test Case 4: Kết hợp filters**
1. Chọn vị trí và đội
2. Click "Tìm kiếm"
3. ✅ Kết quả: Hiển thị cầu thủ khớp cả hai điều kiện

---

### ✅ Edge Cases Testing

#### 1. Không tìm thấy kết quả
- Nhập điều kiện không tồn tại
- ✅ Kết quả: Hiển thị danh sách trống (không crash)

#### 2. Tìm kiếm với ô trống
- Để trống tất cả ô tìm kiếm
- Click "Tìm kiếm"
- ✅ Kết quả: Hiển thị tất cả dữ liệu

#### 3. Tìm kiếm với ký tự đặc biệt
- Nhập ký tự đặc biệt (@, #, $, etc.)
- ✅ Kết quả: Không crash, xử lý bình thường

#### 4. Thống kê khi không có trận đấu
- Chọn khoảng thời gian không có trận
- ✅ Kết quả: Hiển thị 0 cho tất cả các chỉ số

---

### ✅ Performance Testing

#### 1. Tốc độ tìm kiếm
- Thời gian phản hồi < 500ms
- ✅ Test với database lớn (>100 records)

#### 2. Tốc độ thống kê
- Thời gian tính toán < 1s
- ✅ Test với nhiều trận đấu

#### 3. Responsive UI
- Test trên mobile (< 768px)
- Test trên tablet (768px - 1024px)
- Test trên desktop (> 1024px)
- ✅ Layout hiển thị đúng trên mọi kích thước

---

### ✅ Browser Compatibility

Test trên các trình duyệt:
- [ ] Chrome (Latest)
- [ ] Firefox (Latest)
- [ ] Safari (Latest)
- [ ] Edge (Latest)

---

## 🐛 Bug Report Template

Nếu phát hiện lỗi, báo cáo theo template:

```markdown
### Bug Description
[Mô tả chi tiết lỗi]

### Steps to Reproduce
1. [Bước 1]
2. [Bước 2]
3. [Bước 3]

### Expected Behavior
[Kết quả mong đợi]

### Actual Behavior
[Kết quả thực tế]

### Screenshots
[Attach screenshots nếu có]

### Environment
- Browser: [Chrome/Firefox/Safari]
- OS: [Windows/Mac/Linux]
- Screen Size: [Desktop/Tablet/Mobile]
```

---

## 📊 Test Results Tracking

| Feature | Test Cases | Passed | Failed | Status |
|---------|-----------|--------|--------|--------|
| Match Search | 4 | - | - | ⏳ Pending |
| Match Stats | 4 | - | - | ⏳ Pending |
| Team Search | 4 | - | - | ⏳ Pending |
| Player Search | 4 | - | - | ⏳ Pending |
| UI Responsive | 3 | - | - | ⏳ Pending |

---

## 🚀 Automation Testing (Future)

```javascript
// Example test với Jest
describe('Match Search API', () => {
  test('should return matches by team name', async () => {
    const response = await matchesAPI.search({ team: 'Lakers' });
    expect(response.data).toBeInstanceOf(Array);
    expect(response.data[0].homeTeam.name).toContain('Lakers');
  });

  test('should return stats for current week', async () => {
    const response = await matchesAPI.getStats({ period: 'week' });
    expect(response.data).toHaveProperty('totalMatches');
    expect(response.data).toHaveProperty('scheduled');
  });
});
```

---

**Happy Testing! 🎉**
