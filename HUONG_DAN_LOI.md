# Hướng dẫn Xử lý Lỗi và Log

## Cấu trúc Sheet

Sheet `Danh_sach_nhan_vien` cần có các cột:
- **Cột A**: Mã NV
- **Cột B**: Họ tên
- **Cột C**: Email
- **Cột D**: Lương GROSS
- **Cột E**: Gửi template (checkbox)
- **Cột F**: Trạng thái/Log (tự động cập nhật)

## Cột F - Trạng thái và Log

Cột F sẽ tự động hiển thị:

### ✅ Thành công:
- **Màu xanh**: `Đã gửi: 17:20:20 11/1/2026`
- Hiển thị khi email được gửi thành công

### ❌ Lỗi:
- **Màu đỏ**: `Lỗi: [chi tiết lỗi]`
- Hiển thị khi có lỗi xảy ra

### Các loại lỗi có thể gặp:

1. **"Không tìm thấy nhân viên với mã: NV01"**
   - Nguyên nhân: Mã nhân viên không tồn tại trong sheet
   - Giải pháp: Kiểm tra mã NV trong cột A

2. **"Thiếu thông tin nhân viên: NV01"**
   - Nguyên nhân: Thiếu tên hoặc email
   - Giải pháp: Kiểm tra cột B (Họ tên) và C (Email)

3. **"Lương GROSS không hợp lệ cho nhân viên: NV01"**
   - Nguyên nhân: Lương GROSS không phải số hoặc <= 0
   - Giải pháp: Kiểm tra cột D (Lương GROSS)

4. **"Lỗi khi gửi email cho [Tên]"**
   - Nguyên nhân: Lỗi khi gửi email (có thể do email không hợp lệ, lỗi network, etc.)
   - Giải pháp: Kiểm tra email address, kiểm tra execution log

5. **"Lỗi: [chi tiết lỗi]"**
   - Nguyên nhân: Lỗi khác (tính toán, config, etc.)
   - Giải pháp: Xem execution log trong Apps Script để biết chi tiết

## Kiểm tra Log chi tiết

### Trong Apps Script:

1. Mở **Extensions > Apps Script**
2. Click **"Execution"** ở menu bên trái
3. Xem log chi tiết của lần chạy gần nhất
4. Tìm dòng có **"Lỗi"** để xem chi tiết

### Trong Google Sheets:

1. Xem cột **F** (Trạng thái/Log)
2. Màu đỏ = Lỗi
3. Màu xanh = Thành công

## Troubleshooting

### Lỗi không hiển thị trong cột F

**Nguyên nhân**: 
- Cột F chưa tồn tại
- Hoặc có lỗi khi ghi vào sheet

**Giải pháp**:
- Đảm bảo có cột F trong sheet
- Kiểm tra execution log trong Apps Script

### Checkbox không hoạt động

**Nguyên nhân**:
- Hàm `onEdit()` chưa được thêm vào code
- Hoặc có lỗi trong code

**Giải pháp**:
- Kiểm tra code `onEdit()` có trong Code.gs không
- Kiểm tra execution log

### Email không được gửi nhưng không có lỗi

**Nguyên nhân**:
- Email đã được gửi nhưng vào spam
- Hoặc có lỗi nhưng không được log

**Giải pháp**:
- Kiểm tra spam folder
- Kiểm tra execution log trong Apps Script

## Checklist

Trước khi gửi email:

- [ ] Sheet có đầy đủ các cột A-F
- [ ] Cột A có mã NV đúng format (NV01, NV02, ...)
- [ ] Cột B có tên nhân viên
- [ ] Cột C có email hợp lệ
- [ ] Cột D có lương GROSS (số hoặc text với dấu chấm)
- [ ] Cột E có checkbox (chạy hàm `createSendEmailButtons()`)
- [ ] Cột F để trống (sẽ tự động cập nhật)

## Lưu ý

1. **Cột F tự động**: Không cần nhập gì vào cột F, code sẽ tự động cập nhật
2. **Màu sắc**: 
   - Xanh = Thành công
   - Đỏ = Lỗi
3. **Log chi tiết**: Xem trong Apps Script > Execution để biết chi tiết lỗi
