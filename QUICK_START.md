# Hướng dẫn Nhanh - Quick Start Guide

## Bước 1: Thêm cột "Gửi template" vào Google Sheets

1. Mở Google Sheets của bạn
2. Vào tab **"Danh_sach_nhan_vien"**
3. Click vào cột **E** (sau cột "Lương GROSS")
4. Click chuột phải > **Insert 1 column left** (hoặc Insert 1 column right)
5. Trong cell **E2**, nhập: **"Gửi template"**
6. Format cell E2: **Bold** (Ctrl+B hoặc Cmd+B)

## Bước 2: Thêm Checkbox cho mỗi nhân viên

### Cách 1: Thêm checkbox thủ công (Khuyến nghị)

1. Click vào cell **E3** (dòng của NV01)
2. Vào menu **Insert > Checkbox**
3. Làm tương tự cho các nhân viên khác (E4, E5, E6, ...)

### Cách 2: Dùng hàm createSendEmailButtons() (Tự động)

1. Vào **Extensions > Apps Script**
2. Chạy hàm `createSendEmailButtons()`
3. Hàm này sẽ tự động thêm header và checkbox cho tất cả nhân viên

## Bước 3: Cài đặt Google Apps Script

1. Vào **Extensions > Apps Script**
2. Xóa code mặc định
3. Copy toàn bộ nội dung từ file `Code.gs` và dán vào
4. Lưu lại (Ctrl+S hoặc Cmd+S)
5. Đặt tên project: "Gửi Email Phiếu Lương"

## Bước 4: Setup Google Cloud Console (QUAN TRỌNG)

**Bạn PHẢI làm bước này để gửi email được!**

Xem hướng dẫn chi tiết trong file: **[SETUP_GUIDE.md](./SETUP_GUIDE.md)**

Tóm tắt nhanh:
1. Truy cập [Google Cloud Console](https://console.cloud.google.com/)
2. Tạo project mới
3. Kích hoạt **Gmail API**
4. Cấu hình **OAuth consent screen**
5. Tạo **OAuth client ID**
6. Authorize script lần đầu khi chạy

## Bước 5: Sử dụng

### Cách 1: Dùng Menu (Dễ nhất)

1. Reload Google Sheets (F5 hoặc refresh browser)
2. Bạn sẽ thấy menu **"📧 Gửi Email"** ở thanh menu trên cùng
3. Click vào menu và chọn:
   - **"Gửi email cho tất cả nhân viên"** - Gửi cho tất cả
   - **"Gửi email cho NV01"** - Gửi cho nhân viên cụ thể

### Cách 2: Dùng Checkbox (Tự động)

1. Click vào checkbox trong cột "Gửi template" của nhân viên cần gửi
2. Script sẽ tự động:
   - Gửi email
   - Hiển thị thông báo
   - Uncheck checkbox
   - Cập nhật trạng thái (nếu có cột F)

## Kiểm tra kết quả

### Kiểm tra Execution Log

1. Vào **Extensions > Apps Script**
2. Click **"Execution"** ở menu bên trái
3. Xem log để biết email đã được gửi chưa

### Kiểm tra Email

1. Kiểm tra inbox của nhân viên
2. Kiểm tra spam folder (nếu không thấy trong inbox)
3. Email sẽ có format HTML đẹp với đầy đủ thông tin lương

## Troubleshooting

### Lỗi "Access denied" khi chạy script

**Giải pháp**: 
- Bạn chưa authorize script
- Click **"Review Permissions"** khi được hỏi
- Chọn tài khoản Google của bạn
- Click **"Advanced" > "Go to [Your App Name] (unsafe)"**
- Click **"Allow"**

### Lỗi "Gmail API not enabled"

**Giải pháp**:
- Vào Google Cloud Console
- **APIs & Services > Library**
- Tìm và enable **Gmail API**

### Email không được gửi

**Kiểm tra**:
1. Email address có đúng format không? (ví dụ: a@gmail.com)
2. Execution log có lỗi gì không?
3. Đã authorize script chưa?
4. Gmail API đã được enable chưa?

### Checkbox không hoạt động

**Giải pháp**:
1. Kiểm tra hàm `onEdit()` đã được thêm vào Code.gs chưa
2. Kiểm tra tên sheet có đúng là "Danh_sach_nhan_vien" không
3. Kiểm tra checkbox có ở cột E không

## Lưu ý quan trọng

1. **Rate Limit**: Gmail API giới hạn 500 emails/ngày (tài khoản miễn phí)
2. **Test trước**: Nên test với 1-2 nhân viên trước khi gửi hàng loạt
3. **Backup**: Nên backup Google Sheets trước khi chạy script
4. **Email hợp lệ**: Đảm bảo tất cả email trong sheet đều hợp lệ

## Cần giúp đỡ?

Xem các file hướng dẫn chi tiết:
- **[SETUP_GUIDE.md](./SETUP_GUIDE.md)** - Setup Google Cloud Console
- **[MANUAL_GUIDE.md](./MANUAL_GUIDE.md)** - Các cách làm thủ công
- **[README.md](./README.md)** - Tổng quan về dự án
