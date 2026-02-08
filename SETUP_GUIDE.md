# Hướng dẫn Setup Google Cloud Console để gửi email tự động

## Tổng quan

Để Google Apps Script có thể gửi email tự động, bạn cần:
1. Kích hoạt Gmail API trong Google Cloud Console
2. Cấu hình OAuth consent screen
3. Cấp quyền cho script

## Bước 1: Tạo Project trong Google Cloud Console

1. Truy cập [Google Cloud Console](https://console.cloud.google.com/)
2. Đăng nhập bằng tài khoản Google của bạn
3. Click vào dropdown project ở đầu trang (hoặc tạo project mới)
4. Click **"New Project"**
5. Đặt tên project (ví dụ: "Salary Email Sender")
6. Click **"Create"**

## Bước 2: Kích hoạt Gmail API (TÙY CHỌN)

**LƯU Ý**: Nếu bạn chỉ dùng `MailApp.sendEmail()` (như trong Code.gs), bạn **KHÔNG CẦN** kích hoạt Gmail API. Bạn có thể bỏ qua bước này.

Nếu bạn muốn dùng Gmail API (không khuyến nghị cho trường hợp này):

1. Trong Google Cloud Console, vào **"APIs & Services" > "Library"**
2. Tìm kiếm **"Gmail API"**
3. Click vào **Gmail API**
4. Click **"Enable"** để kích hoạt

## Bước 3: Cấu hình OAuth Consent Screen

1. Vào **"APIs & Services" > "OAuth consent screen"**
2. Chọn **"External"** (hoặc Internal nếu bạn dùng Google Workspace)
3. Click **"Create"**

### Điền thông tin:

- **App name**: Tên ứng dụng (ví dụ: "Hệ thống gửi phiếu lương")
- **User support email**: Email của bạn
- **Developer contact information**: Email của bạn
- Click **"Save and Continue"**

### Scopes (Quyền truy cập):

**QUAN TRỌNG**: Nếu bạn dùng `MailApp.sendEmail()` (như trong Code.gs), bạn KHÔNG CẦN Gmail API!

1. Click **"Add or Remove Scopes"**
2. Tìm và thêm scope sau (chọn một trong hai):
   - `https://www.googleapis.com/auth/script.send_mail` (Khuyến nghị - cho MailApp)
   - HOẶC `https://mail.google.com/` (Nếu scope trên không có)
3. Click **"Update"**
4. Click **"Save and Continue"**

**Lưu ý**: Scope sẽ tự động được thêm khi bạn chạy script lần đầu, nhưng tốt nhất là thêm trước.

### Test users (Nếu chọn External):

1. Click **"Add Users"**
2. Thêm email của bạn (email dùng để gửi)
3. Click **"Add"**
4. Click **"Save and Continue"**

## Bước 4: Link Google Cloud Project với Apps Script (QUAN TRỌNG)

**BẮT BUỘC**: Bạn phải link Google Cloud Project với Apps Script project.

1. Mở Google Apps Script (Extensions > Apps Script trong Google Sheets)
2. Click vào **"Project Settings"** (biểu tượng bánh răng ⚙️)
3. Scroll xuống phần **"Google Cloud Platform (GCP) Project"**
4. Click **"Change project"**
5. Chọn **"Enter a project number to link this script to a Google Cloud Platform (GCP) project"**
6. Lấy Project Number từ Google Cloud Console:
   - Vào Google Cloud Console
   - Click vào project của bạn ở đầu trang
   - Copy **Project Number** (số dài, không phải Project ID)
7. Paste Project Number vào Apps Script
8. Click **"Set project"**

## Bước 4b: Tạo OAuth 2.0 Credentials (KHÔNG CẦN cho MailApp)

**LƯU Ý**: Nếu bạn dùng `MailApp.sendEmail()`, bạn **KHÔNG CẦN** tạo OAuth Client ID. Bỏ qua bước này.

Chỉ cần tạo OAuth Client ID nếu bạn dùng Gmail API trực tiếp:

1. Vào **"APIs & Services" > "Credentials"**
2. Click **"Create Credentials" > "OAuth client ID"**
3. Chọn **"Web application"**
4. Đặt tên (ví dụ: "Gmail Sender")
5. **Authorized redirect URIs**: Thêm:
   ```
   https://script.google.com/macros/d/YOUR_SCRIPT_ID/usercallback
   ```
   (Bạn sẽ lấy SCRIPT_ID từ URL Apps Script)
6. Click **"Create"**
7. **Lưu lại Client ID và Client Secret** (sẽ cần sau)

## Bước 5: Cấu hình trong Google Apps Script

### 5.1. Mở Apps Script

1. Mở Google Sheets của bạn
2. Vào **Extensions > Apps Script**
3. Dán code từ file `Code.gs`

### 5.2. Kiểm tra OAuth Scopes (Sẽ xuất hiện sau khi chạy script)

**LƯU Ý**: Phần "OAuth Scopes" có thể **KHÔNG HIỂN THỊ** ngay trong Project Settings. Nó sẽ xuất hiện sau khi bạn chạy script lần đầu và yêu cầu quyền.

**Cách xem OAuth Scopes**:

1. Trong Apps Script, vào **"Project Settings"** (biểu tượng bánh răng ⚙️)
2. Scroll xuống cuối trang
3. Tìm phần **"OAuth Scopes"** (có thể không có nếu chưa chạy script)
4. Nếu không thấy, **KHÔNG SAO** - scope sẽ tự động được thêm khi bạn chạy script lần đầu
5. Sau khi chạy script và authorize, quay lại đây để kiểm tra scope:
   - `https://www.googleapis.com/auth/script.send_mail` (cho MailApp)
   - HOẶC `https://mail.google.com/`

**QUAN TRỌNG**: Bạn không cần phải thấy OAuth Scopes ngay bây giờ. Hãy tiếp tục với bước tiếp theo (chạy script).

### 5.3. Chạy hàm để authorize

**BƯỚC QUAN TRỌNG**: Trước khi chạy, đảm bảo bạn đã:
- ✅ Link Google Cloud Project (Bước 4)
- ✅ Cấu hình OAuth consent screen (Bước 3)
- ✅ Thêm test users (Bước 3.4)

**Chạy script**:

1. Chọn hàm đơn giản để test trước, ví dụ: `getCurrentMonthYear`
   - Hoặc hàm `sendSalaryEmailForEmployee('NV01')` nếu muốn test gửi email
2. Click **"Run"** (▶️)
3. Lần đầu tiên sẽ yêu cầu **authorize**:
   - Click **"Review Permissions"** (Xem quyền)
   - Chọn tài khoản Google của bạn
   - **Nếu thấy cảnh báo "This app isn't verified"**:
     - Click **"Advanced"** (Nâng cao)
     - Click **"Go to [Your App Name] (unsafe)"** (Đi tới [Tên App] (không an toàn))
   - Click **"Allow"** (Cho phép)

**Sau khi authorize**:
- Quay lại Project Settings
- Bây giờ bạn sẽ thấy phần **"OAuth Scopes"** với scope đã được thêm tự động

## Bước 6: Test gửi email

1. Trong Apps Script, chạy hàm `sendSalaryEmailForEmployee('NV01')`
2. Kiểm tra email inbox để xem email đã được gửi chưa
3. Kiểm tra **"Execution log"** để xem log

## Lưu ý quan trọng

### Rate Limits:
- Gmail API có giới hạn: 500 emails/ngày cho tài khoản miễn phí
- Nếu gửi nhiều email, nên thêm delay giữa các email (đã có trong code: `Utilities.sleep(1000)`)

### Security:
- **KHÔNG** chia sẻ Client Secret
- Chỉ thêm test users cần thiết
- Nếu publish app, cần verify với Google (mất thời gian)

### Troubleshooting:

**Lỗi "Ứng dụng này đã bị chặn" hoặc "Access denied"**:
- ✅ Kiểm tra OAuth consent screen đã được cấu hình đúng chưa
- ✅ Kiểm tra scope đã được thêm chưa (`.../auth/script.send_mail`)
- ✅ Kiểm tra test users đã được thêm chưa (email phải chính xác 100%)
- ✅ Kiểm tra đã link Google Cloud Project với Apps Script chưa (Project Number)
- ✅ Đợi 5-10 phút sau khi cấu hình để Google cập nhật
- 📖 Xem file **FIX_OAUTH_ERROR.md** để biết chi tiết cách khắc phục

**Lỗi "Quota exceeded"**:
- Đã vượt quá giới hạn 500 emails/ngày
- Đợi đến ngày hôm sau hoặc upgrade tài khoản

**Email không được gửi**:
- Kiểm tra email address có đúng format không
- Kiểm tra execution log trong Apps Script
- Kiểm tra spam folder

## Tài liệu tham khảo

- [Gmail API Documentation](https://developers.google.com/gmail/api)
- [Google Apps Script MailApp](https://developers.google.com/apps-script/reference/mail/mail-app)
- [OAuth 2.0 Setup](https://developers.google.com/identity/protocols/oauth2)
