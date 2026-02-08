# Hướng dẫn Debug Lỗi Gửi Email

## Cách xem lỗi chi tiết

### 1. Xem trong cột F (Trạng thái/Log)

Cột F sẽ hiển thị lỗi chi tiết:
- **Màu đỏ**: Lỗi
- **Màu xanh**: Thành công

Ví dụ lỗi:
- `Lỗi khi gửi email cho Nguyễn Văn A: Exception: Invalid email: giabao020396@gmail.com`
- `Lỗi khi gửi email cho Nguyễn Văn A: Exception: Access denied`

### 2. Xem trong Apps Script Execution Log

1. Mở **Extensions > Apps Script**
2. Click **"Execution"** ở menu bên trái
3. Click vào lần chạy gần nhất
4. Xem log chi tiết:
   - Tìm dòng có **"Lỗi"** hoặc **"Error"**
   - Xem **"Chi tiết lỗi"** để biết nguyên nhân

## Các lỗi thường gặp

### 1. "Invalid email"

**Nguyên nhân**: Email không hợp lệ hoặc không đúng format

**Giải pháp**:
- Kiểm tra email trong cột C có đúng format không
- Ví dụ: `giabao020396@gmail.com` ✅
- Ví dụ: `giabao020396@gmail` ❌ (thiếu .com)

### 2. "Access denied" hoặc "Permission denied"

**Nguyên nhân**: 
- Chưa authorize script
- Hoặc OAuth consent screen chưa được cấu hình đúng

**Giải pháp**:
- Xem file **FIX_OAUTH_ERROR.md**
- Đảm bảo đã authorize script
- Kiểm tra OAuth consent screen trong Google Cloud Console

### 3. "Quota exceeded"

**Nguyên nhân**: Đã vượt quá giới hạn 500 emails/ngày

**Giải pháp**:
- Đợi đến ngày hôm sau
- Hoặc upgrade tài khoản Google

### 4. "Cannot send email to self"

**Nguyên nhân**: Đang cố gửi email cho chính mình (nếu dùng tài khoản test)

**Giải pháp**:
- Dùng email khác để test
- Hoặc thêm email khác vào test users

### 5. "Invalid recipient"

**Nguyên nhân**: Email không tồn tại hoặc không hợp lệ

**Giải pháp**:
- Kiểm tra email có đúng không
- Kiểm tra email có tồn tại không

## Cách test từng bước

### Test 1: Kiểm tra dữ liệu

1. Kiểm tra cột A có mã NV không
2. Kiểm tra cột B có tên không
3. Kiểm tra cột C có email hợp lệ không
4. Kiểm tra cột D có lương GROSS không

### Test 2: Test tính toán

1. Chạy hàm `calculateSalary(20000000)` từ Apps Script
2. Xem kết quả trong Execution log
3. Kiểm tra các giá trị có đúng không

### Test 3: Test gửi email đơn giản

Thêm hàm này vào Code.gs để test:

```javascript
function testSimpleEmail() {
  try {
    MailApp.sendEmail({
      to: 'your-email@gmail.com', // Thay bằng email của bạn
      subject: 'Test Email',
      body: 'Đây là email test'
    });
    Logger.log('Email test đã gửi thành công');
  } catch (error) {
    Logger.log('Lỗi test email: ' + error.toString());
  }
}
```

1. Chạy hàm `testSimpleEmail`
2. Nếu thành công → vấn đề không phải ở MailApp
3. Nếu lỗi → kiểm tra authorization và OAuth

### Test 4: Test với 1 nhân viên

1. Chạy hàm `testSendEmailNV01()` từ Apps Script
2. Xem Execution log
3. Kiểm tra cột F có hiển thị lỗi không

## Checklist Debug

Khi gặp lỗi, kiểm tra:

- [ ] Email trong cột C có đúng format không?
- [ ] Đã authorize script chưa?
- [ ] OAuth consent screen đã được cấu hình chưa?
- [ ] Đã thêm email vào test users chưa?
- [ ] Đã vượt quá 500 emails/ngày chưa?
- [ ] Execution log có chi tiết lỗi gì không?
- [ ] Cột F có hiển thị lỗi chi tiết không?

## Lấy thông tin lỗi chi tiết

Nếu cột F chỉ hiển thị "Lỗi khi gửi email cho [Tên]" mà không có chi tiết:

1. Mở Apps Script
2. Vào **Execution**
3. Click vào lần chạy gần nhất
4. Tìm dòng có **"Lỗi chi tiết"** hoặc **"Chi tiết lỗi"**
5. Copy thông tin lỗi và kiểm tra

## Liên hệ hỗ trợ

Nếu vẫn không giải quyết được:

1. Copy toàn bộ Execution log
2. Copy nội dung cột F
3. Mô tả các bước đã làm
4. Gửi để được hỗ trợ
