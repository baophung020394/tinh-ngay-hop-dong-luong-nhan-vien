# Hướng dẫn Từng Bước - Step by Step Guide

## Bước 1: Tạo Google Cloud Project

1. Truy cập [Google Cloud Console](https://console.cloud.google.com/)
2. Đăng nhập bằng tài khoản Google của bạn
3. Click vào dropdown project ở đầu trang
4. Click **"New Project"**
5. Đặt tên: `Salary Email Sender` (hoặc tên bạn muốn)
6. Click **"Create"**
7. Đợi project được tạo (vài giây)

## Bước 2: Cấu hình OAuth Consent Screen

1. Trong Google Cloud Console, vào **"APIs & Services" > "OAuth consent screen"**
2. Chọn **"External"** (hoặc Internal nếu bạn dùng Google Workspace)
3. Click **"Create"**

### Điền thông tin App:

- **App name**: `Hệ thống gửi phiếu lương`
- **User support email**: Chọn email của bạn từ dropdown
- **Developer contact information**: Nhập email của bạn
- Click **"Save and Continue"**

### Thêm Scopes:

1. Click **"Add or Remove Scopes"**
2. Trong ô tìm kiếm, nhập: `send_mail`
3. Tìm và chọn scope:
   ```
   https://www.googleapis.com/auth/script.send_mail
   ```
4. Click **"Add to Table"**
5. Click **"Update"** ở cuối trang
6. Click **"Save and Continue"**

### Thêm Test Users (QUAN TRỌNG):

1. Click **"Add Users"**
2. **Nhập email của bạn** (email dùng để gửi email)
3. Click **"Add"**
4. Click **"Save and Continue"**

### Summary:

1. Kiểm tra lại thông tin
2. Click **"Back to Dashboard"**

## Bước 3: Lấy Project Number

1. Ở đầu trang Google Cloud Console, click vào **tên project** của bạn
2. Copy **Project Number** (số dài, ví dụ: `123456789012`)
3. **Lưu lại** Project Number này

## Bước 4: Link Project trong Apps Script

1. Mở Google Sheets của bạn
2. Vào **Extensions > Apps Script**
3. Click vào **"Project Settings"** (biểu tượng bánh răng ⚙️ ở menu bên trái)
4. Scroll xuống phần **"Dự án trên Google Cloud Platform (GCP)"**
5. Bạn sẽ thấy: **"GCP: Mặc định"**
6. Click nút **"Thay đổi dự án"** (Change project)
7. Chọn **"Enter a project number to link this script to a Google Cloud Platform (GCP) project"**
8. Paste **Project Number** bạn đã copy ở Bước 3
9. Click **"Set project"**
10. Đợi vài giây để link xong

## Bước 5: Kiểm tra Project Settings

Sau khi link project, bạn sẽ thấy:

- **GCP**: Tên project của bạn (thay vì "Mặc định")
- Các phần khác như Time zone, Script ID, v.v.

**LƯU Ý**: Phần **"OAuth Scopes"** có thể **CHƯA HIỂN THỊ** ngay. Điều này là bình thường. Nó sẽ xuất hiện sau khi bạn chạy script lần đầu.

## Bước 6: Chạy Script để Authorize

1. Quay lại editor Apps Script (click vào "Mã.gs" ở menu bên trái)
2. Chọn hàm đơn giản để test, ví dụ: `getCurrentMonthYear`
3. Click nút **"Run"** (▶️) ở trên cùng
4. Lần đầu tiên sẽ hiện popup yêu cầu authorize:
   - Click **"Review Permissions"** (Xem quyền)
   - Chọn tài khoản Google của bạn
   - **Nếu thấy cảnh báo "This app isn't verified"** hoặc "Ứng dụng này đã bị chặn"**:
     - Click **"Advanced"** (Nâng cao)
     - Click **"Go to [Your App Name] (unsafe)"** (Đi tới [Tên App] (không an toàn))
   - Click **"Allow"** (Cho phép)

## Bước 7: Kiểm tra OAuth Scopes (Sau khi authorize)

1. Sau khi authorize xong, vào lại **"Project Settings"**
2. Scroll xuống cuối trang
3. Bây giờ bạn sẽ thấy phần **"OAuth Scopes"**
4. Kiểm tra xem có scope:
   ```
   https://www.googleapis.com/auth/script.send_mail
   ```
   hoặc
   ```
   https://mail.google.com/
   ```

## Bước 8: Test Gửi Email

1. Quay lại editor Apps Script
2. Chọn hàm: `sendSalaryEmailForEmployee('NV01')`
3. Click **"Run"**
4. Nếu không có lỗi, kiểm tra email inbox để xem email đã được gửi chưa
5. Xem **"Execution log"** (Nhật ký thực thi) để xem kết quả

## Troubleshooting

### Không thấy phần "OAuth Scopes" trong Project Settings

**Đây là bình thường!** Phần này chỉ xuất hiện sau khi:
- Bạn đã chạy script ít nhất một lần
- Script đã yêu cầu quyền (authorization)
- Bạn đã authorize thành công

**Giải pháp**: Tiếp tục với Bước 6 (Chạy script để authorize). Sau đó quay lại Project Settings để xem OAuth Scopes.

### Vẫn bị lỗi "Ứng dụng này đã bị chặn"

Kiểm tra lại:
1. ✅ Đã thêm email của bạn vào Test Users chưa? (Bước 2.4)
2. ✅ Đã link Google Cloud Project chưa? (Bước 4)
3. ✅ Đã đợi 5-10 phút sau khi cấu hình chưa?
4. ✅ Email trong Test Users có chính xác 100% không? (không có khoảng trắng, đúng chữ hoa/thường)

### Không thấy nút "Thay đổi dự án"

- Đảm bảo bạn đang ở đúng trang **"Project Settings"**
- Scroll xuống phần **"Dự án trên Google Cloud Platform (GCP)"**
- Nút **"Thay đổi dự án"** (Change project) nằm ngay dưới dòng "GCP: Mặc định"

## Checklist Hoàn Thành

Trước khi test gửi email, đảm bảo:

- [ ] Đã tạo Google Cloud Project
- [ ] Đã cấu hình OAuth consent screen
- [ ] Đã thêm scope `.../auth/script.send_mail`
- [ ] Đã thêm email của bạn vào test users
- [ ] Đã lấy Project Number
- [ ] Đã link Google Cloud Project với Apps Script
- [ ] Đã chạy script và authorize thành công
- [ ] Đã thấy OAuth Scopes trong Project Settings (sau khi authorize)

## Tài liệu tham khảo

- **[FIX_OAUTH_ERROR.md](./FIX_OAUTH_ERROR.md)** - Khắc phục lỗi chi tiết
- **[SETUP_GUIDE.md](./SETUP_GUIDE.md)** - Hướng dẫn setup đầy đủ
- **[QUICK_START.md](./QUICK_START.md)** - Hướng dẫn nhanh
