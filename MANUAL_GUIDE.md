# Hướng dẫn Gửi Email Thủ Công trong Google Sheets

## Phương pháp 1: Sử dụng Google Apps Script với Menu/Button (Khuyến nghị)

### Cách 1: Tạo Menu tùy chỉnh

1. **Mở Apps Script**:
   - Vào Google Sheets của bạn
   - Click **Extensions > Apps Script**
   - Dán code từ file `Code.gs`

2. **Thêm hàm tạo menu** (thêm vào cuối file Code.gs):
   ```javascript
   function onOpen() {
     const ui = SpreadsheetApp.getUi();
     ui.createMenu('Gửi Email')
       .addItem('Gửi email cho tất cả nhân viên', 'sendSalaryEmailsToAll')
       .addItem('Gửi email cho NV01', 'sendEmailNV01')
       .addItem('Gửi email cho NV02', 'sendEmailNV02')
       .addItem('Gửi email cho NV03', 'sendEmailNV03')
       .addItem('Gửi email cho NV04', 'sendEmailNV04')
       .addToUi();
   }

   function sendEmailNV01() {
     sendSalaryEmailForEmployee('NV01');
   }
   function sendEmailNV02() {
     sendSalaryEmailForEmployee('NV02');
   }
   function sendEmailNV03() {
     sendSalaryEmailForEmployee('NV03');
   }
   function sendEmailNV04() {
     sendSalaryEmailForEmployee('NV04');
   }
   ```

3. **Reload Google Sheets**:
   - Đóng và mở lại Google Sheets
   - Bạn sẽ thấy menu **"Gửi Email"** ở thanh menu trên cùng
   - Click vào menu và chọn nhân viên cần gửi

### Cách 2: Tạo Button trong Sheet

1. **Thêm cột "Gửi template"** vào sheet `Danh_sach_nhan_vien`:
   - Vào cột E (sau cột "Lương GROSS")
   - Row 2: Nhập "Gửi template"
   - Format header: Bold

2. **Tạo checkbox hoặc hyperlink**:
   
   **Option A: Dùng Checkbox + Trigger**
   - Row 3 (NV01): Click vào cell E3
   - Vào **Insert > Checkbox**
   - Làm tương tự cho các nhân viên khác
   - Tạo trigger tự động khi checkbox được check

   **Option B: Dùng Hyperlink với công thức** (Đơn giản hơn)
   - Row 3: Nhập công thức:
     ```
     =HYPERLINK("mailto:"&C3&"?subject=Phiếu lương&body=Xem chi tiết trong sheet "&A3, "Gửi email")
     ```
   - Công thức này sẽ mở email client với subject và body sẵn

3. **Tạo trigger tự động** (nếu dùng checkbox):
   - Vào **Extensions > Apps Script**
   - Click **Triggers** (biểu tượng đồng hồ)
   - Click **"+ Add Trigger"**
   - Chọn function: `onEdit`
   - Event source: "From spreadsheet"
   - Event type: "On edit"
   - Click **Save**

   Thêm hàm này vào Code.gs:
   ```javascript
   function onEdit(e) {
     const sheet = e.source.getActiveSheet();
     const range = e.range;
     
     // Chỉ xử lý khi edit trong sheet Danh_sach_nhan_vien, cột E
     if (sheet.getName() === 'Danh_sach_nhan_vien' && range.getColumn() === 5) {
       const row = range.getRow();
       if (row >= 3 && range.getValue() === true) {
         const employeeId = sheet.getRange(row, 1).getValue();
         sendSalaryEmailForEmployee(employeeId);
         // Uncheck sau khi gửi
         range.setValue(false);
       }
     }
   }
   ```

## Phương pháp 2: Sử dụng Google Sheets Add-on (Không cần code)

### Cài đặt Add-on "Email Merge" hoặc "Yet Another Mail Merge"

1. **Cài đặt Add-on**:
   - Vào **Extensions > Add-ons > Get add-ons**
   - Tìm kiếm **"Yet Another Mail Merge"** hoặc **"Email Merge"**
   - Click **Install**

2. **Cấu hình**:
   - Mở add-on
   - Chọn sheet chứa dữ liệu nhân viên
   - Map các trường: Email, Tên, ...
   - Tạo template email HTML
   - Gửi thử

**Nhược điểm**: 
- Có giới hạn số lượng email miễn phí
- Cần setup phức tạp hơn
- Không tự động như script

## Phương pháp 3: Copy-Paste Manual (Hoàn toàn thủ công)

1. **Tạo template email**:
   - Mở sheet `PHIEU_LUONG` của nhân viên (ví dụ: NV03)
   - Copy toàn bộ nội dung từ A1:B9
   - Paste vào email

2. **Gửi email**:
   - Mở Gmail
   - Tạo email mới
   - Paste nội dung đã copy
   - Gửi đến email nhân viên

**Nhược điểm**: 
- Rất tốn thời gian
- Dễ sai sót
- Không tự động

## Phương pháp 4: Sử dụng Google Sheets với Mail Merge Template (Khuyến nghị cho người không biết code)

### Bước 1: Chuẩn bị dữ liệu

1. Trong sheet `Danh_sach_nhan_vien`, thêm các cột:
   - Column E: "Subject" (Tiêu đề email)
   - Column F: "Body" (Nội dung email)

2. Tạo công thức cho Subject (Row 3):
   ```
   =CONCATENATE("Phiếu lương tháng ", TEXT(TODAY(), "mm/yyyy"), " - ", B3)
   ```

3. Tạo công thức cho Body (Row 3):
   ```
   =CONCATENATE("Kính gửi: ", B3, CHAR(10), "Mã NV: ", A3, CHAR(10), "Lương GROSS: ", TEXT(D3, "#,##0"), " VNĐ", CHAR(10), "Xem chi tiết trong sheet ", A3)
   ```

### Bước 2: Sử dụng Google Sheets với Gmail

1. **Tạo template email trong Gmail**:
   - Mở Gmail
   - Click **Compose**
   - Tạo email mẫu với các placeholder: {{Tên}}, {{Mã NV}}, {{Lương}}
   - Save as template

2. **Sử dụng Mail Merge Add-on**:
   - Cài đặt add-on "Yet Another Mail Merge"
   - Map dữ liệu từ sheet
   - Gửi hàng loạt

## So sánh các phương pháp

| Phương pháp | Độ khó | Tự động | Chi phí | Khuyến nghị |
|------------|--------|---------|---------|-------------|
| Apps Script + Menu | Trung bình | Cao | Miễn phí | ⭐⭐⭐⭐⭐ |
| Apps Script + Button | Trung bình | Cao | Miễn phí | ⭐⭐⭐⭐⭐ |
| Add-on Mail Merge | Dễ | Trung bình | Có giới hạn | ⭐⭐⭐ |
| Copy-Paste Manual | Dễ | Không | Miễn phí | ⭐ |

## Khuyến nghị

**Nếu bạn muốn tự động hoàn toàn**: Dùng **Phương pháp 1 - Apps Script + Menu/Button**
- Chỉ cần setup một lần
- Click một lần để gửi
- Có thể tự động hóa hoàn toàn với trigger

**Nếu bạn không muốn code**: Dùng **Phương pháp 4 - Mail Merge Add-on**
- Dễ sử dụng
- Có giao diện trực quan
- Cần setup template

**Nếu bạn chỉ gửi vài email**: Dùng **Phương pháp 3 - Copy-Paste**
- Đơn giản nhất
- Không cần setup gì
- Tốn thời gian
