# Hướng dẫn Import File Excel vào Google Sheets

## Bước 1: Chuẩn bị file

File `Template_Quan_Ly_Luong.xlsx` đã được tạo sẵn với đầy đủ các sheet:
- ✅ CONFIG
- ✅ BANG_THUE_TNCN  
- ✅ Danh_sach_nhan_vien
- ✅ PHIEU_LUONG
- ✅ NV01, NV02, NV03, NV04

## Bước 2: Import vào Google Sheets

### Cách 1: Import trực tiếp (Khuyến nghị)

1. **Mở Google Drive**:
   - Truy cập [drive.google.com](https://drive.google.com)
   - Đăng nhập bằng tài khoản Google của bạn

2. **Upload file**:
   - Click **"New"** (Mới) ở góc trên bên trái
   - Chọn **"File upload"** (Tải tệp lên)
   - Chọn file `Template_Quan_Ly_Luong.xlsx`
   - Đợi file upload xong

3. **Mở bằng Google Sheets**:
   - Click chuột phải vào file vừa upload
   - Chọn **"Open with" > "Google Sheets"**
   - File sẽ được convert sang Google Sheets format

### Cách 2: Import từ Google Sheets

1. **Mở Google Sheets**:
   - Truy cập [sheets.google.com](https://sheets.google.com)
   - Click **"Blank"** để tạo spreadsheet mới

2. **Import file**:
   - Vào menu **"File" > "Import"**
   - Chọn tab **"Upload"**
   - Click **"Select a file from your device"**
   - Chọn file `Template_Quan_Ly_Luong.xlsx`

3. **Cấu hình import**:
   - **Import location**: Chọn **"Replace spreadsheet"** (thay thế) hoặc **"Insert new sheet(s)"** (thêm sheet mới)
   - **Convert text to numbers, dates, and formulas**: ✅ Bật
   - Click **"Import data"**

## Bước 3: Kiểm tra sau khi import

Sau khi import, kiểm tra:

1. ✅ Tất cả các sheet đã được import (CONFIG, BANG_THUE_TNCN, Danh_sach_nhan_vien, PHIEU_LUONG, NV01-NV04)
2. ✅ Dữ liệu trong các sheet đúng
3. ✅ Formatting (màu sắc, font) đã được giữ nguyên

## Bước 4: Thêm công thức tính toán

**QUAN TRỌNG**: Sau khi import, bạn cần thêm công thức vào các sheet NV01-NV04.

Xem hướng dẫn chi tiết trong file: **[HUONG_DAN_FORMULA.md](./HUONG_DAN_FORMULA.md)**

### Tóm tắt nhanh:

1. Vào sheet **NV01**
2. Cell **B3** (Lương GROSS): Thêm công thức
   ```
   =XLOOKUP(B2,Danh_sach_nhan_vien!A:A,Danh_sach_nhan_vien!D:D)
   ```
3. Cell **B4** (BHXH): `=B3*CONFIG!B1`
4. Cell **B5** (BHYT): `=B3*CONFIG!B2`
5. Cell **B6** (BHTN): `=B3*CONFIG!B3`
6. Cell **B7** (Thu nhập chịu thuế): `=B3-B4-B5-B6-CONFIG!B4`
7. Cell **B8** (Thuế TNCN): Thêm công thức tính thuế theo bậc (xem HUONG_DAN_FORMULA.md)
8. Cell **B9** (Lương NET): `=B3-B4-B5-B6-B8`
9. Copy công thức sang các sheet NV02, NV03, NV04

## Bước 5: Thêm cột "Gửi template" (Nếu chưa có)

1. Vào sheet **Danh_sach_nhan_vien**
2. Click vào cột **E** (sau cột "Lương GROSS")
3. Click chuột phải > **Insert 1 column left**
4. Cell **E2**: Nhập **"Gửi template"**
5. Format: **Bold**
6. Thêm checkbox cho mỗi nhân viên (E3, E4, E5, E6):
   - Click vào cell E3
   - Vào **Insert > Checkbox**
   - Làm tương tự cho E4, E5, E6

## Bước 6: Cài đặt Google Apps Script

1. Vào **Extensions > Apps Script**
2. Copy toàn bộ code từ file `Code.gs`
3. Dán vào editor
4. Lưu lại (Ctrl+S hoặc Cmd+S)
5. Setup Google Cloud Console (xem SETUP_GUIDE.md)

## Troubleshooting

### Lỗi: File không import được

**Giải pháp**:
- Kiểm tra file có đúng định dạng .xlsx không
- Thử upload lại file
- Kiểm tra kết nối internet

### Lỗi: Thiếu sheet sau khi import

**Giải pháp**:
- Chọn **"Insert new sheet(s)"** khi import
- Hoặc import lại với option **"Replace spreadsheet"**

### Lỗi: Công thức không hoạt động

**Giải pháp**:
- Kiểm tra tên sheet có đúng không (CONFIG, BANG_THUE_TNCN, Danh_sach_nhan_vien)
- Kiểm tra cấu trúc dữ liệu trong các sheet
- Xem lại hướng dẫn trong HUONG_DAN_FORMULA.md

### Lỗi: Formatting bị mất

**Giải pháp**:
- Formatting có thể bị mất một phần khi import
- Bạn có thể format lại thủ công:
  - Header: Bold, màu xanh (#4CAF50), chữ trắng
  - Số tiền: Format số với dấu phẩy

## Lưu ý

1. **Backup**: Nên tạo bản sao của Google Sheets sau khi import thành công
2. **Test**: Test các công thức với 1-2 nhân viên trước khi áp dụng cho tất cả
3. **Permissions**: Đảm bảo bạn có quyền chỉnh sửa Google Sheets
4. **Version**: Google Sheets sẽ tự động lưu các thay đổi

## Bước tiếp theo

Sau khi import và thêm công thức xong:

1. ✅ Test tính lương cho 1 nhân viên
2. ✅ Setup Google Apps Script (Code.gs)
3. ✅ Setup Google Cloud Console (SETUP_GUIDE.md)
4. ✅ Test gửi email
5. ✅ Sử dụng menu hoặc checkbox để gửi email

## Tài liệu tham khảo

- **[HUONG_DAN_FORMULA.md](./HUONG_DAN_FORMULA.md)** - Hướng dẫn thêm công thức
- **[SETUP_GUIDE.md](./SETUP_GUIDE.md)** - Setup Google Cloud Console
- **[QUICK_START.md](./QUICK_START.md)** - Hướng dẫn nhanh
- **[README.md](./README.md)** - Tổng quan dự án
