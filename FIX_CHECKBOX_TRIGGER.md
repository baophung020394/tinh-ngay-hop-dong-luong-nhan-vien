# 🔧 Khắc Phục Lỗi Checkbox Không Gửi Được Email

## Lỗi bạn đang gặp

Khi click checkbox để gửi email, bạn thấy lỗi:
> **"Exception: Các quyền được chỉ định không đủ để gọi MailApp.sendEmail. Các quyền bắt buộc: https://www.googleapis.com/auth/script.send_mail"**

Nhưng khi dùng menu "Gửi email cho tất cả nhân viên" thì lại thành công.

## Nguyên nhân

**Simple trigger `onEdit()` KHÔNG CÓ QUYỀN** gọi `MailApp.sendEmail()`.

- ✅ Menu/Button → Chạy trực tiếp → Có quyền → Thành công
- ❌ Checkbox với `onEdit()` → Simple trigger → Không có quyền → Lỗi

## Giải pháp: Tạo Installable Trigger

Cần tạo **Installable Trigger** thay vì dùng simple trigger `onEdit()`.

### Bước 1: Tạo Trigger THỦ CÔNG (Khuyến nghị)

**Cách này đáng tin cậy hơn** vì tạo trigger programmatic có thể gặp lỗi.

1. Mở **Extensions > Apps Script**
2. Click **"Triggers"** ở menu bên trái (biểu tượng đồng hồ ⏰)
3. Click **"+ Add Trigger"** ở góc dưới bên phải
4. Cấu hình trigger:
   - **Choose which function to run**: Chọn `onEditCheckbox`
   - **Choose which deployment should run**: Chọn `Head` (hoặc để mặc định)
   - **Select event source**: Chọn `From spreadsheet`
   - **Select event type**: Chọn `On edit`
   - **Failure notification settings**: (Tùy chọn, có thể để mặc định)
5. Click **"Save"**
6. Lần đầu sẽ hỏi authorization:
   - Click **"Review Permissions"**
   - Chọn tài khoản Google của bạn
   - Click **"Advanced" > "Go to [Your App Name] (unsafe)"**
   - Click **"Allow"**

### Bước 1b: Hoặc chạy hàm setup trigger (Có thể gặp lỗi)

Nếu muốn thử tạo trigger tự động:

1. Mở **Extensions > Apps Script**
2. Chọn hàm: `setupCheckboxTrigger`
3. Click **"Run"** (▶️)
4. Nếu thành công → Tiếp tục Bước 2
5. Nếu lỗi → Làm theo Bước 1 (tạo thủ công)

### Bước 2: Kiểm tra trigger đã được tạo

1. Trong Apps Script, click **"Triggers"** ở menu bên trái (biểu tượng đồng hồ ⏰)
2. Bạn sẽ thấy trigger:
   - **Function**: `onEditCheckbox`
   - **Event source**: `From spreadsheet`
   - **Event type**: `On edit`
   - **Failure notification settings**: (có thể cấu hình)

### Bước 3: Test checkbox

1. Quay lại Google Sheets
2. Click vào checkbox của một nhân viên
3. Email sẽ được gửi tự động
4. Kiểm tra cột F có hiển thị "Đã gửi: ..." không

## Cách khác: Dùng Menu thay vì Checkbox

Nếu không muốn setup trigger, bạn có thể:

1. **Dùng menu**: Menu "📧 Gửi Email" > "Gửi email cho tất cả nhân viên"
2. **Dùng hàm test**: Chạy `testSendEmailNV01()` từ Apps Script

## Troubleshooting

### Lỗi: "setupCheckboxTrigger không tìm thấy"

**Giải pháp**: 
- Đảm bảo đã copy toàn bộ code từ Code.gs vào Apps Script
- Kiểm tra hàm `setupCheckboxTrigger()` có trong code không

### Lỗi: "Trigger đã tồn tại"

**Giải pháp**:
- Hàm sẽ tự động xóa trigger cũ và tạo mới
- Không cần lo lắng

### Checkbox vẫn không hoạt động sau khi setup trigger

**Kiểm tra**:
1. Trigger đã được tạo chưa? (Xem trong Triggers)
2. Hàm `onEditCheckbox` có trong code không?
3. Checkbox có ở cột E không?
4. Execution log có lỗi gì không?

### Muốn xóa trigger

1. Vào Apps Script > **Triggers**
2. Click vào trigger `onEditCheckbox`
3. Click **"Delete"** (🗑️)

## Checklist

Trước khi dùng checkbox:

- [ ] Đã chạy hàm `setupCheckboxTrigger()` một lần
- [ ] Đã authorize khi được hỏi
- [ ] Đã kiểm tra trigger trong Triggers
- [ ] Đã tạo checkbox (chạy `createSendEmailButtons()`)
- [ ] Đã test với 1 checkbox

## So sánh Simple Trigger vs Installable Trigger

| Tính năng | Simple Trigger (`onEdit`) | Installable Trigger (`onEditCheckbox`) |
|-----------|---------------------------|----------------------------------------|
| Quyền gửi email | ❌ Không có | ✅ Có |
| Cần authorize | ❌ Không | ✅ Có (một lần) |
| Setup | Tự động | Cần chạy `setupCheckboxTrigger()` |
| Tốc độ | Nhanh hơn | Chậm hơn một chút |

## Lưu ý quan trọng

1. **Chỉ cần setup một lần**: Sau khi chạy `setupCheckboxTrigger()`, trigger sẽ tự động hoạt động
2. **Nếu xóa trigger**: Cần chạy lại `setupCheckboxTrigger()`
3. **Nếu code thay đổi**: Trigger vẫn hoạt động, không cần setup lại

## Tóm tắt

**Để checkbox hoạt động**:
1. ✅ Chạy `setupCheckboxTrigger()` một lần
2. ✅ Authorize khi được hỏi
3. ✅ Click checkbox để gửi email

**Nếu không muốn setup trigger**:
- Dùng menu "Gửi email cho tất cả nhân viên"
- Hoặc dùng các hàm test (`testSendEmailNV01()`, etc.)
