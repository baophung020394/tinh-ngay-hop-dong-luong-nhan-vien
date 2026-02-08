# Hệ thống Quản lý Lương và Gửi Email Tự động

Dự án này giúp quản lý lương nhân viên và tự động gửi phiếu lương qua email từ Google Sheets.

## Cấu trúc Google Sheets

### Tab CONFIG
Định nghĩa các config chung:
- BHXH (%): 0.08 (8%)
- BHYT (%): 0.015 (1.5%)
- BHTN (%): 0.01 (1%)
- Giảm trừ bản thân: 11,000,000 VNĐ

### Tab BANG_THUE_TNCN
Định nghĩa bảng thuế thu nhập cá nhân Việt Nam:
- Bậc 1: Đến 5,000,000 - Thuế suất 5%
- Bậc 2: Đến 10,000,000 - Thuế suất 10%
- Bậc 3: Đến 18,000,000 - Thuế suất 15%
- Bậc 4: Đến 32,000,000 - Thuế suất 20%
- Bậc 5: Đến 52,000,000 - Thuế suất 25%
- Bậc 6: Đến 80,000,000 - Thuế suất 30%
- Bậc 7: Trên 80,000,000 - Thuế suất 35%

### Tab Danh_sach_nhan_vien
Danh sách nhân viên với các cột:
- Mã NV: Mã nhân viên (NV01, NV02, ...)
- Họ tên: Tên đầy đủ
- Email: Email nhân viên
- Lương GROSS: Lương gross
- **Gửi template**: Cột mới để gửi email (cần thêm)

### Tab PHIEU_LUONG (NV01, NV02, NV03, NV04, ...)
Mỗi nhân viên có một sheet riêng để tính lương:
- Mã NV: Sử dụng công thức `=XLOOKUP(B2,Danh_sach_nhan_vien!A:A,Danh_sach_nhan_vien!D:D)`
- Tự động tính các khoản:
  - BHXH
  - BHYT
  - BHTN
  - Thu nhập chịu thuế
  - Thuế TNCN
  - Lương NET

## Tính năng

### 1. Tính lương tự động
- Chỉ cần nhập mã NV vào sheet PHIEU_LUONG
- Tự động lấy thông tin từ Danh_sach_nhan_vien
- Tự động tính các khoản khấu trừ và thuế

### 2. Gửi email tự động
- Gửi phiếu lương qua email cho nhân viên
- Email có format HTML đẹp mắt
- Tự động điền thông tin từ sheet

## Hướng dẫn Setup

### Bước 1: Thêm cột "Gửi template" vào Danh_sach_nhan_vien

1. Mở Google Sheets
2. Vào tab `Danh_sach_nhan_vien`
3. Thêm cột E với header "Gửi template"
4. Format header: Bold

### Bước 2: Cài đặt Google Apps Script

1. Vào **Extensions > Apps Script**
2. Xóa code mặc định
3. Copy toàn bộ nội dung từ file `Code.gs` và dán vào
4. Lưu lại (Ctrl+S hoặc Cmd+S)

### Bước 3: Setup Google Cloud Console

**QUAN TRỌNG**: Để gửi email được, bạn PHẢI setup Google Cloud Console.

Xem hướng dẫn chi tiết trong file: **[SETUP_GUIDE.md](./SETUP_GUIDE.md)**

Tóm tắt:
1. Tạo project trong Google Cloud Console
2. Kích hoạt Gmail API
3. Cấu hình OAuth consent screen
4. Tạo OAuth credentials
5. Authorize script lần đầu

### Bước 4: Sử dụng

#### Cách 1: Dùng Menu (Khuyến nghị)

1. Reload Google Sheets
2. Bạn sẽ thấy menu **"Gửi Email"** ở thanh menu trên cùng
3. Click vào menu và chọn nhân viên cần gửi

#### Cách 2: Dùng Button trong Sheet

1. Thêm hàm `onOpen()` vào Code.gs (xem MANUAL_GUIDE.md)
2. Tạo checkbox hoặc hyperlink trong cột "Gửi template"
3. Click để gửi email

## Các hàm chính trong Code.gs

### `sendSalaryEmail()`
Gửi email cho một nhân viên cụ thể với đầy đủ thông tin lương.

### `sendSalaryEmailsToAll()`
Gửi email cho tất cả nhân viên trong danh sách.

### `sendSalaryEmailForEmployee(employeeId)`
Gửi email cho một nhân viên dựa trên mã NV.

### `createEmailTemplate()`
Tạo template HTML cho email phiếu lương.

## Cách làm thủ công (Không cần code)

Nếu bạn không muốn setup Google Cloud Console, có thể dùng các phương pháp thủ công.

Xem hướng dẫn chi tiết trong file: **[MANUAL_GUIDE.md](./MANUAL_GUIDE.md)**

Các phương pháp:
1. **Apps Script + Menu/Button** (Khuyến nghị)
2. **Mail Merge Add-on**
3. **Copy-Paste Manual**
4. **Google Sheets với Gmail Template**

## Lưu ý quan trọng

### Rate Limits
- Gmail API: 500 emails/ngày (tài khoản miễn phí)
- Nếu gửi nhiều email, code đã tự động thêm delay 1 giây giữa các email

### Security
- **KHÔNG** chia sẻ Client Secret từ Google Cloud Console
- Chỉ thêm test users cần thiết
- Kiểm tra email trước khi gửi hàng loạt

### Troubleshooting

**Lỗi "Access denied"**:
- Kiểm tra OAuth consent screen đã được cấu hình
- Kiểm tra scope đã được thêm
- Kiểm tra test users

**Email không được gửi**:
- Kiểm tra email address có đúng format
- Kiểm tra execution log trong Apps Script
- Kiểm tra spam folder

**Script không chạy**:
- Kiểm tra đã authorize script chưa
- Kiểm tra Gmail API đã được enable chưa

## Tài liệu tham khảo

- [SETUP_GUIDE.md](./SETUP_GUIDE.md) - Hướng dẫn setup Google Cloud Console
- [MANUAL_GUIDE.md](./MANUAL_GUIDE.md) - Hướng dẫn cách làm thủ công
- [Code.gs](./Code.gs) - Code Google Apps Script

## Hỗ trợ

Nếu gặp vấn đề, kiểm tra:
1. Execution log trong Apps Script
2. Google Cloud Console > APIs & Services > Dashboard
3. Email spam folder

## License

Dự án này được tạo cho mục đích học tập và sử dụng nội bộ.
