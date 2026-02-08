# Hướng dẫn Test và Sử dụng

## Bước 1: Đảm bảo đã có Google Sheet với dữ liệu

Trước khi test, bạn cần có Google Sheet với:
- ✅ Sheet **CONFIG** (cấu hình)
- ✅ Sheet **BANG_THUE_TNCN** (bảng thuế)
- ✅ Sheet **Danh_sach_nhan_vien** (danh sách nhân viên)
- ✅ Sheet **NV01, NV02, NV03, NV04** (phiếu lương từng nhân viên)

**Nếu chưa có**: Import file `Template_Quan_Ly_Luong.xlsx` vào Google Sheets (xem HUONG_DAN_IMPORT.md)

## Bước 2: Test với hàm đơn giản nhất

### Cách 1: Test với hàm gửi email cho 1 nhân viên

1. Mở Google Apps Script (Extensions > Apps Script)
2. Chọn hàm: `sendEmailNV01`
3. Click **"Run"** (▶️)
4. Kiểm tra:
   - **Execution log**: Xem có lỗi không
   - **Email inbox**: Kiểm tra email đã được gửi chưa

### Cách 2: Test với hàm tổng quát

1. Chọn hàm: `sendSalaryEmailForEmployee`
2. Trong phần parameters, nhập: `'NV01'` (có dấu nháy đơn)
3. Click **"Run"**
4. Kiểm tra kết quả

## Bước 3: Sử dụng Menu trong Google Sheets (Dễ nhất)

Sau khi reload Google Sheets, bạn sẽ thấy menu **"📧 Gửi Email"**:

1. **Reload Google Sheets** (F5 hoặc refresh browser)
2. Bạn sẽ thấy menu **"📧 Gửi Email"** ở thanh menu trên cùng
3. Click vào menu và chọn:
   - **"Gửi email cho tất cả nhân viên"** - Gửi cho tất cả
   - **"Gửi email cho NV01"** - Gửi cho nhân viên cụ thể
   - **"Gửi email cho NV02"** - v.v.

## Bước 4: Sử dụng Checkbox (Tự động)

1. Vào sheet **Danh_sach_nhan_vien**
2. Thêm checkbox vào cột **"Gửi template"** (cột E):
   - Click vào cell E3 (NV01)
   - Vào **Insert > Checkbox**
   - Làm tương tự cho E4, E5, E6
3. Click vào checkbox của nhân viên cần gửi
4. Script sẽ tự động:
   - Gửi email
   - Hiển thị thông báo
   - Uncheck checkbox

## Các hàm có sẵn

### 1. `sendEmailNV01()` - Gửi email cho NV01
- **Cách dùng**: Chọn hàm > Run
- **Không cần tham số**

### 2. `sendEmailNV02()` - Gửi email cho NV02
- **Cách dùng**: Chọn hàm > Run
- **Không cần tham số**

### 3. `sendEmailNV03()` - Gửi email cho NV03
- **Cách dùng**: Chọn hàm > Run
- **Không cần tham số**

### 4. `sendEmailNV04()` - Gửi email cho NV04
- **Cách dùng**: Chọn hàm > Run
- **Không cần tham số**

### 5. `sendSalaryEmailForEmployee(employeeId)` - Gửi email cho nhân viên bất kỳ
- **Tham số**: `'NV01'`, `'NV02'`, `'NV03'`, `'NV04'` (có dấu nháy đơn)
- **Ví dụ**: `sendSalaryEmailForEmployee('NV01')`

### 6. `sendSalaryEmailsToAll()` - Gửi email cho tất cả nhân viên
- **Cách dùng**: Chọn hàm > Run
- **Không cần tham số**
- **Lưu ý**: Sẽ gửi cho tất cả nhân viên trong danh sách

### 7. `createSendEmailButtons()` - Tạo button trong sheet
- **Cách dùng**: Chạy một lần để tạo các button
- **Không cần tham số**

## Test từng bước

### Test 1: Kiểm tra dữ liệu

1. Chọn hàm: `getCurrentMonthYear`
2. Click **"Run"**
3. Xem kết quả trong **Execution log**
4. Kết quả mong đợi: `"1/2025"` (hoặc tháng/năm hiện tại)

### Test 2: Gửi email test đơn giản

Tạo hàm test đơn giản:

```javascript
function testEmail() {
  MailApp.sendEmail({
    to: 'your-email@gmail.com', // Thay bằng email của bạn
    subject: 'Test Email',
    body: 'Đây là email test từ Google Apps Script'
  });
}
```

1. Thêm hàm này vào Code.gs
2. Chọn hàm `testEmail`
3. Click **"Run"**
4. Kiểm tra email inbox

### Test 3: Gửi email phiếu lương cho NV01

1. Đảm bảo sheet **NV01** đã có dữ liệu và công thức
2. Chọn hàm: `sendEmailNV01`
3. Click **"Run"**
4. Kiểm tra:
   - **Execution log**: Xem có lỗi không
   - **Email inbox**: Kiểm tra email đã được gửi chưa
   - **Spam folder**: Nếu không thấy trong inbox

## Kiểm tra kết quả

### Execution Log

1. Trong Apps Script, click **"Execution"** ở menu bên trái
2. Xem log của lần chạy gần nhất
3. Kiểm tra:
   - ✅ `Email đã gửi thành công cho...` = Thành công
   - ❌ `Lỗi khi gửi email...` = Có lỗi

### Email Inbox

1. Kiểm tra inbox của email nhân viên
2. Kiểm tra spam folder
3. Email sẽ có:
   - Subject: `Phiếu lương tháng X/YYYY - Tên nhân viên`
   - Format HTML đẹp với bảng lương

## Troubleshooting

### Lỗi: "Không tìm thấy sheet Danh_sach_nhan_vien"

**Giải pháp**:
- Kiểm tra tên sheet có đúng không (phân biệt chữ hoa/thường)
- Đảm bảo sheet đã tồn tại trong Google Sheets

### Lỗi: "Không tìm thấy nhân viên với mã: NV01"

**Giải pháp**:
- Kiểm tra sheet **Danh_sach_nhan_vien** có dữ liệu không
- Kiểm tra mã NV trong cột A có đúng không (NV01, NV02, ...)

### Lỗi: "Không tìm thấy sheet cho nhân viên NV01"

**Giải pháp**:
- Đảm bảo có sheet tên **NV01** (phân biệt chữ hoa/thường)
- Kiểm tra sheet NV01 có dữ liệu trong các cell B2-B9 không

### Email không được gửi

**Kiểm tra**:
1. Execution log có lỗi gì không?
2. Email address có đúng format không?
3. Đã authorize script chưa?
4. Kiểm tra spam folder

### Menu "Gửi Email" không xuất hiện

**Giải pháp**:
1. Reload Google Sheets (F5)
2. Đảm bảo hàm `onOpen()` đã được thêm vào Code.gs
3. Đóng và mở lại Google Sheets

## Checklist Test

Trước khi sử dụng thực tế:

- [ ] Đã import Google Sheet template
- [ ] Đã thêm công thức vào các sheet NV01-NV04
- [ ] Đã test với hàm `getCurrentMonthYear`
- [ ] Đã test với hàm `testEmail` (nếu có)
- [ ] Đã test gửi email cho 1 nhân viên (NV01)
- [ ] Đã kiểm tra email nhận được
- [ ] Đã test menu "Gửi Email"
- [ ] Đã test checkbox (nếu dùng)

## Lưu ý quan trọng

1. **Test trước**: Luôn test với 1 nhân viên trước khi gửi hàng loạt
2. **Kiểm tra email**: Đảm bảo email address đúng
3. **Rate limit**: Gmail API giới hạn 500 emails/ngày
4. **Backup**: Nên backup Google Sheets trước khi chạy script

## Tài liệu tham khảo

- **[HUONG_DAN_IMPORT.md](./HUONG_DAN_IMPORT.md)** - Hướng dẫn import template
- **[HUONG_DAN_FORMULA.md](./HUONG_DAN_FORMULA.md)** - Hướng dẫn thêm công thức
- **[QUICK_START.md](./QUICK_START.md)** - Hướng dẫn nhanh
