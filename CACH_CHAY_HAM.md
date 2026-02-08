# Cách Chạy Hàm Đúng Cách trong Google Apps Script

## Vấn đề: "employeeId undefined"

Khi bạn chạy hàm `sendSalaryEmailForEmployee` từ Apps Script editor mà không truyền parameter, bạn sẽ gặp lỗi **"employeeId undefined"**.

## Cách chạy hàm đúng cách

### Cách 1: Nhập parameter trong Function dropdown (Khuyến nghị)

1. **Mở Apps Script editor**
2. Ở trên cùng, bạn sẽ thấy dropdown **"Function"** (hiện tại đang hiển thị `sendSalaryEmailForEmployee`)
3. **Click vào dropdown** và chọn hàm `sendSalaryEmailForEmployee`
4. **Bên cạnh dropdown**, bạn sẽ thấy một ô để nhập parameter
5. **Nhập parameter**: `'NV01'` (có dấu nháy đơn)
   - ✅ Đúng: `'NV01'`
   - ✅ Đúng: `'NV02'`
   - ❌ Sai: `NV01` (thiếu dấu nháy đơn)
6. Click nút **"Run"** (▶️ Chạy)

### Cách 2: Tạo hàm test đơn giản

Thêm hàm này vào Code.gs để test dễ hơn:

```javascript
function testSendEmailNV01() {
  sendSalaryEmailForEmployee('NV01');
}

function testSendEmailNV02() {
  sendSalaryEmailForEmployee('NV02');
}

function testSendEmailNV03() {
  sendSalaryEmailForEmployee('NV03');
}

function testSendEmailNV04() {
  sendSalaryEmailForEmployee('NV04');
}
```

Sau đó:
1. Chọn hàm `testSendEmailNV01` từ dropdown
2. Click **"Run"**
3. Không cần nhập parameter vì đã hardcode trong hàm

### Cách 3: Dùng Menu trong Google Sheets (Dễ nhất)

1. **Reload Google Sheets** (F5)
2. Bạn sẽ thấy menu **"📧 Gửi Email"** ở thanh menu trên cùng
3. Click vào menu và chọn:
   - **"Gửi email cho tất cả nhân viên"** - Gửi cho tất cả
   - Các option khác sẽ được thêm sau

## Hướng dẫn chi tiết từng bước

### Bước 1: Mở Apps Script

1. Mở Google Sheets của bạn
2. Vào **Extensions > Apps Script**

### Bước 2: Chọn hàm

1. Ở trên cùng editor, bạn sẽ thấy dropdown **"Function"**
2. Click vào dropdown
3. Chọn hàm `sendSalaryEmailForEmployee`

### Bước 3: Nhập parameter

1. **Bên cạnh dropdown Function**, bạn sẽ thấy một ô input
2. **Nhập**: `'NV01'` (có dấu nháy đơn ở đầu và cuối)
3. **Lưu ý**: 
   - Phải có dấu nháy đơn: `'NV01'` ✅
   - Không được thiếu: `NV01` ❌

### Bước 4: Chạy hàm

1. Click nút **"Run"** (▶️ Chạy) ở trên cùng
2. Lần đầu sẽ hỏi authorization (nếu chưa authorize)
3. Xem kết quả trong **Execution log** (Nhật ký thực thi)

## Screenshot mô tả

```
┌─────────────────────────────────────────────────┐
│ Apps Script Editor                               │
├─────────────────────────────────────────────────┤
│ [Function ▼] [sendSalaryEmailForEmployee]       │
│                                                  │
│ [Parameter: ] ['NV01'        ] [▶ Run]          │
│              ↑ Nhập ở đây                        │
└─────────────────────────────────────────────────┘
```

## Các lỗi thường gặp

### Lỗi 1: "employeeId undefined"

**Nguyên nhân**: Không nhập parameter khi chạy hàm

**Giải pháp**:
- Nhập parameter trong ô bên cạnh dropdown Function
- Hoặc dùng hàm test (Cách 2)
- Hoặc dùng menu trong Google Sheets (Cách 3)

### Lỗi 2: "Không tìm thấy nhân viên với mã: NV01"

**Nguyên nhân**: 
- Mã nhân viên không tồn tại trong sheet
- Hoặc nhập sai format (thiếu dấu nháy đơn)

**Giải pháp**:
- Kiểm tra sheet `Danh_sach_nhan_vien` có mã NV01 không
- Đảm bảo nhập đúng: `'NV01'` (có dấu nháy đơn)

### Lỗi 3: "Không tìm thấy sheet Danh_sach_nhan_vien"

**Nguyên nhân**: Sheet không tồn tại hoặc tên sai

**Giải pháp**:
- Kiểm tra tên sheet có đúng là `Danh_sach_nhan_vien` không
- Phân biệt chữ hoa/thường

## Test nhanh

### Test 1: Test với hàm đơn giản

1. Thêm hàm này vào Code.gs:
```javascript
function testNV01() {
  sendSalaryEmailForEmployee('NV01');
}
```

2. Chọn hàm `testNV01` từ dropdown
3. Click **"Run"**
4. Không cần nhập parameter

### Test 2: Test với parameter

1. Chọn hàm `sendSalaryEmailForEmployee` từ dropdown
2. Nhập parameter: `'NV01'`
3. Click **"Run"**
4. Kiểm tra Execution log

## Checklist

Trước khi chạy hàm:

- [ ] Đã chọn đúng hàm từ dropdown
- [ ] Đã nhập parameter đúng format: `'NV01'` (có dấu nháy đơn)
- [ ] Đã kiểm tra sheet `Danh_sach_nhan_vien` có dữ liệu
- [ ] Đã kiểm tra mã nhân viên tồn tại trong sheet

## Khuyến nghị

**Cách dễ nhất**: Dùng menu trong Google Sheets
- Không cần nhập parameter
- Không cần mở Apps Script
- Chỉ cần click menu và chọn

**Cách linh hoạt nhất**: Tạo hàm test
- Tạo các hàm `testSendEmailNV01()`, `testSendEmailNV02()`, etc.
- Chọn hàm và chạy, không cần nhập parameter
