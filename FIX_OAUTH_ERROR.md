# 🔧 Khắc Phục Lỗi "Ứng dụng này đã bị chặn"

## Lỗi bạn đang gặp

Khi chạy Google Apps Script, bạn thấy thông báo:
> **"Ứng dụng này đã bị chặn"**
> 
> "Ứng dụng này đã cố truy cập thông tin nhạy cảm trong Tài khoản Google của bạn. Để giữ an toàn cho tài khoản của bạn, Google đã chặn không cho ứng dụng này truy cập."

## Nguyên nhân

Lỗi này xảy ra vì:
1. OAuth consent screen chưa được cấu hình đúng
2. App đang ở chế độ "Testing" nhưng chưa có test users
3. Scopes chưa được thêm đúng
4. App chưa được publish

## Giải pháp (Làm theo từng bước)

### ✅ Bước 1: Kiểm tra OAuth Consent Screen

1. Truy cập [Google Cloud Console](https://console.cloud.google.com/)
2. Chọn project của bạn (hoặc tạo project mới nếu chưa có)
3. Vào **"APIs & Services" > "OAuth consent screen"**

### ✅ Bước 2: Cấu hình OAuth Consent Screen (QUAN TRỌNG)

#### 2.1. Chọn User Type

- Nếu dùng Google Workspace: Chọn **"Internal"** (đơn giản hơn, không cần verify)
- Nếu dùng Gmail cá nhân: Chọn **"External"** (cần thêm test users)

#### 2.2. Điền thông tin App

1. **App name**: `Hệ thống gửi phiếu lương` (hoặc tên bạn muốn)
2. **User support email**: Email của bạn
3. **App logo**: (Tùy chọn, có thể bỏ qua)
4. **App domain**: (Có thể bỏ qua)
5. **Developer contact information**: Email của bạn
6. Click **"Save and Continue"**

#### 2.3. Thêm Scopes (QUAN TRỌNG NHẤT)

1. Click **"Add or Remove Scopes"**
2. Trong ô tìm kiếm, nhập: `mail`
3. Tìm và chọn scope sau:
   ```
   .../auth/gmail.send
   ```
   Hoặc tìm:
   ```
   https://www.googleapis.com/auth/gmail.send
   ```
4. Click **"Add to Table"**
5. Click **"Update"** ở cuối trang
6. Click **"Save and Continue"**

**LƯU Ý**: Nếu bạn dùng `MailApp.sendEmail()` trong Apps Script, scope sẽ tự động là:
```
https://www.googleapis.com/auth/script.send_mail
```
Hoặc:
```
https://mail.google.com/
```

#### 2.4. Thêm Test Users (Nếu chọn External)

1. Click **"Add Users"**
2. **QUAN TRỌNG**: Thêm email của bạn (email dùng để gửi email)
3. Thêm email của bạn vào danh sách test users
4. Click **"Add"**
5. Click **"Save and Continue"**

#### 2.5. Summary

1. Kiểm tra lại tất cả thông tin
2. Click **"Back to Dashboard"**

### ✅ Bước 3: Kiểm tra Publishing Status

1. Vẫn trong **"OAuth consent screen"**
2. Xem phần **"Publishing status"**
3. Nếu thấy **"Testing"**: 
   - Đảm bảo bạn đã thêm email của mình vào test users
   - App sẽ chỉ hoạt động cho các test users
4. Nếu muốn publish (không khuyến nghị cho app cá nhân):
   - Click **"PUBLISH APP"**
   - Cần verify với Google (mất vài ngày đến vài tuần)

### ✅ Bước 4: Link Google Cloud Project với Apps Script

**QUAN TRỌNG**: Bạn cần link Google Cloud Project với Apps Script project.

1. Mở Google Apps Script (Extensions > Apps Script trong Google Sheets)
2. Click vào **"Project Settings"** (biểu tượng bánh răng ⚙️)
3. Scroll xuống phần **"Google Cloud Platform (GCP) Project"**
4. Click **"Change project"**
5. Chọn **"Enter a project number to link this script to a Google Cloud Platform (GCP) project"**
6. Lấy Project Number từ Google Cloud Console:
   - Vào Google Cloud Console
   - Click vào project của bạn
   - Copy **Project Number** (không phải Project ID)
7. Paste Project Number vào Apps Script
8. Click **"Set project"**

### ✅ Bước 5: Kiểm tra OAuth Scopes trong Apps Script

1. Vẫn trong **"Project Settings"** của Apps Script
2. Scroll xuống phần **"OAuth Scopes"**
3. Kiểm tra xem có scope sau không:
   ```
   https://www.googleapis.com/auth/script.send_mail
   ```
   hoặc
   ```
   https://mail.google.com/
   ```
4. Nếu không có, scope sẽ tự động được thêm khi bạn chạy hàm gửi email lần đầu

### ✅ Bước 6: Chạy lại Script

1. Quay lại editor Apps Script
2. Chọn hàm đơn giản để test, ví dụ: `getCurrentMonthYear`
3. Click **"Run"**
4. Lần đầu sẽ hỏi authorization:
   - Click **"Review Permissions"**
   - Chọn tài khoản Google của bạn
   - **QUAN TRỌNG**: Nếu thấy cảnh báo "This app isn't verified":
     - Click **"Advanced"**
     - Click **"Go to [Your App Name] (unsafe)"**
   - Click **"Allow"**

### ✅ Bước 7: Nếu vẫn bị chặn

Nếu sau khi làm các bước trên vẫn bị chặn:

#### Giải pháp A: Đảm bảo Test Users đúng

1. Vào Google Cloud Console > OAuth consent screen
2. Kiểm tra phần **"Test users"**
3. **Đảm bảo email của bạn đã được thêm vào**
4. Email phải chính xác 100% (không có khoảng trắng, đúng chữ hoa/thường)

#### Giải pháp B: Đợi vài phút

- Sau khi cấu hình OAuth consent screen, đợi 5-10 phút để Google cập nhật
- Refresh lại trang Apps Script
- Thử chạy lại

#### Giải pháp C: Dùng Google Workspace (Nếu có)

- Nếu bạn có Google Workspace, chọn **"Internal"** thay vì **"External"**
- Không cần thêm test users
- Không cần verify

#### Giải pháp D: Kiểm tra Project đúng

- Đảm bảo bạn đang dùng đúng Google Cloud Project
- Kiểm tra Project Number trong Apps Script đúng với Project Number trong Cloud Console

## Giải pháp Đơn giản hơn (Không cần Gmail API)

Nếu bạn chỉ dùng `MailApp.sendEmail()` (không dùng Gmail API), bạn **KHÔNG CẦN** kích hoạt Gmail API. Chỉ cần:

1. ✅ Cấu hình OAuth consent screen (Bước 2)
2. ✅ Thêm test users (Bước 2.4)
3. ✅ Link project (Bước 4)
4. ✅ Chạy script và authorize (Bước 6)

**KHÔNG CẦN**:
- ❌ Kích hoạt Gmail API
- ❌ Tạo OAuth Client ID
- ❌ Cấu hình redirect URIs

## Checklist Khắc Phục

Trước khi chạy lại script, đảm bảo:

- [ ] Đã tạo Google Cloud Project
- [ ] Đã cấu hình OAuth consent screen
- [ ] Đã thêm scope `.../auth/script.send_mail` hoặc `.../auth/gmail.send`
- [ ] Đã thêm email của bạn vào test users (nếu chọn External)
- [ ] Đã link Google Cloud Project với Apps Script (Project Number)
- [ ] Đã đợi 5-10 phút sau khi cấu hình
- [ ] Đã refresh trang Apps Script

## Test nhanh

Sau khi setup xong, test với hàm đơn giản:

```javascript
function testEmail() {
  MailApp.sendEmail({
    to: 'your-email@gmail.com',
    subject: 'Test Email',
    body: 'Đây là email test'
  });
}
```

Nếu hàm này chạy được, các hàm khác cũng sẽ chạy được.

## Vẫn không được?

Nếu sau khi làm tất cả các bước trên vẫn không được:

1. **Kiểm tra lại email test user**: Phải chính xác 100%
2. **Kiểm tra project number**: Phải đúng
3. **Xóa cache trình duyệt**: Clear cache và cookies
4. **Thử trình duyệt khác**: Chrome, Firefox, Safari
5. **Đợi lâu hơn**: Có thể mất đến 30 phút để Google cập nhật

## Tài liệu tham khảo

- [Google Apps Script Authorization](https://developers.google.com/apps-script/guides/services/authorization)
- [OAuth Consent Screen](https://support.google.com/cloud/answer/10311615)
- [MailApp Documentation](https://developers.google.com/apps-script/reference/mail/mail-app)
