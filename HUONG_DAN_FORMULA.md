# Hướng dẫn Thêm Công Thức sau khi Import vào Google Sheets

Sau khi import file Excel vào Google Sheets, bạn cần thêm các công thức tính toán vào các sheet NV01, NV02, NV03, NV04.

## Công thức cho Sheet NV01 (và các sheet NV khác)

### Bước 1: Thêm công thức vào cell B2 (Mã NV)

Cell B2 đã có giá trị "NV01", bạn có thể giữ nguyên hoặc thêm công thức để tự động lấy từ sheet Danh_sach_nhan_vien:

```
=NV01
```
(Hoặc giữ nguyên giá trị "NV01")

### Bước 2: Thêm công thức vào cell B3 (Lương GROSS)

```
=XLOOKUP(B2,Danh_sach_nhan_vien!A:A,Danh_sach_nhan_vien!D:D)
```

Công thức này sẽ tự động lấy lương GROSS từ sheet Danh_sach_nhan_vien dựa trên mã NV.

### Bước 3: Thêm công thức vào cell B4 (BHXH)

```
=B3*CONFIG!B1
```

BHXH = Lương GROSS × 8% (từ CONFIG!B1)

### Bước 4: Thêm công thức vào cell B5 (BHYT)

```
=B3*CONFIG!B2
```

BHYT = Lương GROSS × 1.5% (từ CONFIG!B2)

### Bước 5: Thêm công thức vào cell B6 (BHTN)

```
=B3*CONFIG!B3
```

BHTN = Lương GROSS × 1% (từ CONFIG!B3)

### Bước 6: Thêm công thức vào cell B7 (Thu nhập chịu thuế)

```
=B3-B4-B5-B6-CONFIG!B4
```

Thu nhập chịu thuế = Lương GROSS - BHXH - BHYT - BHTN - Giảm trừ bản thân

### Bước 7: Thêm công thức vào cell B8 (Thuế TNCN)

Đây là công thức phức tạp nhất, tính thuế theo bậc:

```
=IF(B7<=0,0,
  IF(B7<=5000000,B7*0.05,
    IF(B7<=10000000,250000+(B7-5000000)*0.1,
      IF(B7<=18000000,750000+(B7-10000000)*0.15,
        IF(B7<=32000000,1950000+(B7-18000000)*0.2,
          IF(B7<=52000000,4750000+(B7-32000000)*0.25,
            IF(B7<=80000000,9750000+(B7-52000000)*0.3,
              15750000+(B7-80000000)*0.35
            )
          )
        )
      )
    )
  )
)
```

Hoặc công thức đơn giản hơn sử dụng VLOOKUP:

```
=IF(B7<=0,0,
  B7*VLOOKUP(B7,BANG_THUE_TNCN!B:C,2,TRUE)/100
)
```

**Lưu ý**: Công thức VLOOKUP này cần điều chỉnh để tính đúng theo từng bậc thuế. Công thức IF lồng nhau ở trên sẽ tính đúng hơn.

### Bước 8: Thêm công thức vào cell B9 (LƯƠNG NET)

```
=B3-B4-B5-B6-B8
```

Lương NET = Lương GROSS - BHXH - BHYT - BHTN - Thuế TNCN

## Cách Copy công thức cho các sheet khác

Sau khi thêm công thức vào sheet NV01:

1. Copy toàn bộ cột B (từ B2 đến B9)
2. Paste vào các sheet NV02, NV03, NV04
3. Google Sheets sẽ tự động điều chỉnh tham chiếu

Hoặc:

1. Click vào cell B2 trong NV01
2. Copy (Ctrl+C hoặc Cmd+C)
3. Vào sheet NV02, click vào B2
4. Paste (Ctrl+V hoặc Cmd+V)
5. Làm tương tự cho các cell khác

## Kiểm tra công thức

Sau khi thêm tất cả công thức, kiểm tra:

1. **Cell B2**: Hiển thị mã NV đúng (NV01, NV02, ...)
2. **Cell B3**: Hiển thị lương GROSS từ Danh_sach_nhan_vien
3. **Cell B4-B6**: Tính đúng các khoản bảo hiểm
4. **Cell B7**: Thu nhập chịu thuế = GROSS - các khoản trừ
5. **Cell B8**: Thuế TNCN tính đúng theo bậc
6. **Cell B9**: Lương NET = GROSS - các khoản trừ - thuế

## Ví dụ tính toán

Với NV03 có lương GROSS = 100,000,000:

- BHXH (8%) = 8,000,000
- BHYT (1.5%) = 1,500,000
- BHTN (1%) = 1,000,000
- Thu nhập chịu thuế = 100,000,000 - 8,000,000 - 1,500,000 - 1,000,000 - 11,000,000 = 78,500,000
- Thuế TNCN (bậc 7, 35%): 
  - Bậc 1: 5,000,000 × 5% = 250,000
  - Bậc 2: (10,000,000 - 5,000,000) × 10% = 500,000
  - Bậc 3: (18,000,000 - 10,000,000) × 15% = 1,200,000
  - Bậc 4: (32,000,000 - 18,000,000) × 20% = 2,800,000
  - Bậc 5: (52,000,000 - 32,000,000) × 25% = 5,000,000
  - Bậc 6: (80,000,000 - 52,000,000) × 30% = 8,400,000
  - Bậc 7: (78,500,000 - 80,000,000) × 35% = 0 (chưa đến mức)
  - Tổng thuế = 250,000 + 500,000 + 1,200,000 + 2,800,000 + 5,000,000 + 8,400,000 = 18,150,000
- Lương NET = 100,000,000 - 8,000,000 - 1,500,000 - 1,000,000 - 18,150,000 = 71,350,000

## Lưu ý

1. Đảm bảo tên các sheet đúng: CONFIG, BANG_THUE_TNCN, Danh_sach_nhan_vien
2. Đảm bảo cấu trúc dữ liệu trong các sheet đúng như template
3. Nếu có lỗi #N/A, kiểm tra lại mã NV trong Danh_sach_nhan_vien
4. Nếu có lỗi #REF, kiểm tra lại tên sheet và tham chiếu
