# Hướng dẫn Sử dụng Phiên Bản Mới

## Thay đổi chính

✅ **KHÔNG CẦN** các sheet NV01, NV02, NV03, NV04 riêng biệt nữa!
✅ Code sẽ **tự động tính toán lương** từ dữ liệu trong sheet `Danh_sach_nhan_vien`
✅ Chỉ cần có 3 sheet: **CONFIG**, **BANG_THUE_TNCN**, **Danh_sach_nhan_vien**

## Cách sử dụng

### Cách 1: Dùng Menu (Dễ nhất - Khuyến nghị)

1. **Reload Google Sheets** (F5 hoặc refresh browser)
2. Bạn sẽ thấy menu **"📧 Gửi Email"** ở thanh menu trên cùng
3. Click vào menu và chọn:
   - **"Gửi email cho tất cả nhân viên"** - Gửi cho tất cả nhân viên trong danh sách
   - **"Tạo button gửi email trong sheet"** - Tạo button trong cột "Gửi template"

### Cách 2: Dùng Button trong Sheet

1. **Tạo button** (chạy một lần):
   - Vào menu **"📧 Gửi Email"** > **"Tạo button gửi email trong sheet"**
   - Hoặc chạy hàm `createSendEmailButtons()` từ Apps Script
   - Button sẽ xuất hiện trong cột **"Gửi template"** (cột E)

2. **Gửi email từ button**:
   - **Cách A**: Click vào button, sau đó vào Apps Script và chạy hàm `sendSalaryEmailForEmployee('NV01')`
   - **Cách B**: Dùng menu **"📧 Gửi Email"** > **"Gửi email cho tất cả nhân viên"**

### Cách 3: Dùng Checkbox (Tự động)

1. **Thêm checkbox** vào cột "Gửi template":
   - Click vào cell E3 (NV01)
   - Vào **Insert > Checkbox**
   - Làm tương tự cho E4, E5, E6

2. **Gửi email**:
   - Click vào checkbox của nhân viên cần gửi
   - Script sẽ tự động gửi email (cần uncomment code trong hàm `onEdit`)

## Cấu trúc Sheet cần có

### Sheet CONFIG
```
A1: BHXH (%)          B1: 0.08
A2: BHYT (%)          B2: 0.015
A3: BHTN (%)          B3: 0.01
A4: Giảm trừ bản thân B4: 11000000
```

### Sheet BANG_THUE_TNCN
```
A2: Bậc    B2: Đến mức      C2: Thuế suất
A3: 1      B3: 5000000      C3: 5%
A4: 2      B4: 10000000     C4: 10%
... (tiếp tục đến bậc 7)
```

### Sheet Danh_sach_nhan_vien
```
A2: Mã NV    B2: Họ tên    C2: Email    D2: Lương GROSS    E2: Gửi template
A3: NV01     B3: Nguyễn... C3: email    D3: 20000000       E3: (button)
A4: NV02     B4: Trần...   C4: email    D4: 15000000       E4: (button)
...
```

## Cách tính toán tự động

Code sẽ tự động:
1. ✅ Đọc lương GROSS từ cột D
2. ✅ Tính BHXH = GROSS × 8%
3. ✅ Tính BHYT = GROSS × 1.5%
4. ✅ Tính BHTN = GROSS × 1%
5. ✅ Tính Thu nhập chịu thuế = GROSS - BHXH - BHYT - BHTN - Giảm trừ
6. ✅ Tính Thuế TNCN dựa trên bảng thuế
7. ✅ Tính Lương NET = GROSS - BHXH - BHYT - BHTN - Thuế

## Test

### Test 1: Test tính toán

1. Mở Apps Script
2. Chọn hàm: `calculateSalary`
3. Trong phần parameters, nhập: `20000000` (lương GROSS)
4. Click **"Run"**
5. Xem kết quả trong Execution log

### Test 2: Test gửi email cho 1 nhân viên

1. Chọn hàm: `sendSalaryEmailForEmployee`
2. Trong phần parameters, nhập: `'NV01'` (có dấu nháy đơn)
3. Click **"Run"**
4. Kiểm tra email inbox

### Test 3: Test gửi email cho tất cả

1. Dùng menu **"📧 Gửi Email"** > **"Gửi email cho tất cả nhân viên"**
2. Hoặc chạy hàm `sendSalaryEmailsToAll()` từ Apps Script
3. Kiểm tra email inbox của tất cả nhân viên

## Lưu ý quan trọng

1. **Format lương GROSS**: 
   - Có thể nhập số: `20000000`
   - Hoặc text với dấu chấm: `20.000.000`
   - Code sẽ tự động xử lý cả hai format

2. **Không cần sheet NV01-NV04**: 
   - Code tính toán trực tiếp từ `Danh_sach_nhan_vien`
   - Không cần tạo các sheet riêng cho từng nhân viên

3. **Cột "Gửi template"**: 
   - Button chỉ để hiển thị và hướng dẫn
   - Để gửi email, dùng menu hoặc chạy hàm từ Apps Script

4. **Cột F (Trạng thái)**: 
   - Tự động cập nhật khi gửi email thành công
   - Hiển thị: "Đã gửi: [thời gian]"

## Troubleshooting

### Lỗi: "Không tìm thấy sheet CONFIG"

**Giải pháp**: Đảm bảo có sheet tên **CONFIG** với dữ liệu đúng format

### Lỗi: "Không tìm thấy sheet BANG_THUE_TNCN"

**Giải pháp**: Đảm bảo có sheet tên **BANG_THUE_TNCN** với bảng thuế 7 bậc

### Lỗi tính toán sai

**Kiểm tra**:
1. Dữ liệu trong CONFIG có đúng không?
2. Bảng thuế có đầy đủ 7 bậc không?
3. Lương GROSS có đúng format không?

### Button không hoạt động

**Giải pháp**: 
- Button chỉ để hiển thị
- Dùng menu **"📧 Gửi Email"** để gửi email
- Hoặc chạy hàm `sendSalaryEmailForEmployee('NV01')` từ Apps Script

## So sánh với phiên bản cũ

| Tính năng | Phiên bản cũ | Phiên bản mới |
|-----------|--------------|---------------|
| Sheet NV01-NV04 | ✅ Cần có | ❌ Không cần |
| Tính toán lương | Từ sheet NV01 | Tự động từ Danh_sach_nhan_vien |
| Công thức trong sheet | Cần thêm công thức | Không cần |
| Gửi email | Từ sheet NV01 | Từ Danh_sach_nhan_vien |

## Checklist

Trước khi sử dụng:

- [ ] Đã có sheet CONFIG với dữ liệu
- [ ] Đã có sheet BANG_THUE_TNCN với bảng thuế
- [ ] Đã có sheet Danh_sach_nhan_vien với dữ liệu nhân viên
- [ ] Đã reload Google Sheets để thấy menu "📧 Gửi Email"
- [ ] Đã test với 1 nhân viên trước khi gửi hàng loạt
