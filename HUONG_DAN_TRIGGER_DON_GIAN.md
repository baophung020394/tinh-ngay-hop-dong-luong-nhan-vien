# Hướng dẫn Tạo Trigger Đơn Giản

## Vấn đề

Checkbox không gửi được email vì chưa có **installable trigger**.

## Giải pháp: Tạo Trigger Thủ Công (Chỉ 4 bước)

### Bước 1: Mở Triggers

1. Mở Google Sheets
2. Vào **Extensions > Apps Script**
3. Click **"Triggers"** ở menu bên trái (biểu tượng đồng hồ ⏰)

### Bước 2: Tạo Trigger Mới

1. Click **"+ Add Trigger"** ở góc dưới bên phải
2. Cấu hình:
   - **Choose which function to run**: Chọn `onEditCheckbox`
   - **Choose which deployment should run**: Chọn `Head` (hoặc để mặc định)
   - **Select event source**: Chọn `From spreadsheet`
   - **Select event type**: Chọn `On edit`
3. Click **"Save"**

### Bước 3: Authorize (Lần đầu)

1. Click **"Review Permissions"**
2. Chọn tài khoản Google của bạn
3. Click **"Advanced"**
4. Click **"Go to [Your App Name] (unsafe)"**
5. Click **"Allow"**

### Bước 4: Test

1. Quay lại Google Sheets
2. Click vào checkbox của một nhân viên
3. Email sẽ được gửi tự động! ✅

## Kiểm tra Trigger Đã Tạo

Sau khi tạo, bạn sẽ thấy trong danh sách Triggers:
- ✅ Function: `onEditCheckbox`
- ✅ Event source: `From spreadsheet`
- ✅ Event type: `On edit`

## Cách Hoạt Động

1. **Bạn click checkbox** → Trigger `onEditCheckbox` được gọi
2. **Trigger gọi hàm** `sendSalaryEmailForEmployee(employeeId)` 
3. **Hàm gửi email** giống như trong `sendSalaryEmailsToAll()`
4. **Kết quả** hiển thị trong cột F

## Troubleshooting

### Checkbox vẫn không hoạt động

**Kiểm tra**:
1. ✅ Trigger đã được tạo chưa? (Xem trong Triggers)
2. ✅ Function name có đúng là `onEditCheckbox` không?
3. ✅ Đã authorize chưa?
4. ✅ Checkbox có ở cột E không?

### Lỗi "Insufficient permissions"

**Giải pháp**:
- Đảm bảo đã authorize khi tạo trigger
- Hoặc authorize lại: Click vào trigger > Authorize

### Muốn xóa trigger

1. Vào Apps Script > **Triggers**
2. Click vào trigger `onEditCheckbox`
3. Click **"Delete"** (🗑️)

## Tóm tắt

**Chỉ cần làm 1 lần**:
1. Apps Script > Triggers > + Add Trigger
2. Chọn `onEditCheckbox` > `From spreadsheet` > `On edit`
3. Save và Authorize
4. Xong! ✅

Sau đó checkbox sẽ hoạt động tự động.
