/**
 * Google Apps Script để gửi email template phiếu lương cho nhân viên
 * 
 * Hướng dẫn sử dụng:
 * 1. Mở Google Sheets của bạn
 * 2. Vào Extensions > Apps Script
 * 3. Dán code này vào
 * 4. Setup Google Cloud Console (xem SETUP_GUIDE.md)
 * 5. Chạy hàm sendSalaryEmail() hoặc tạo trigger tự động
 */

/**
 * Hàm chính để gửi email phiếu lương cho một nhân viên
 * @param {string} employeeId - Mã nhân viên (ví dụ: NV01, NV02)
 * @param {string} emailAddress - Email của nhân viên
 * @param {string} employeeName - Tên nhân viên
 * @param {number} grossSalary - Lương gross
 * @param {number} netSalary - Lương net
 * @param {number} tax - Thuế TNCN
 * @param {number} socialInsurance - BHXH
 * @param {number} healthInsurance - BHYT
 * @param {number} unemploymentInsurance - BHTN
 * @param {number} taxableIncome - Thu nhập chịu thuế
 */
function sendSalaryEmail(
  employeeId,
  emailAddress,
  employeeName,
  grossSalary,
  netSalary,
  tax,
  socialInsurance,
  healthInsurance,
  unemploymentInsurance,
  taxableIncome
) {
  // Kiểm tra email hợp lệ
  if (!emailAddress || emailAddress === '') {
    Logger.log('Email không hợp lệ cho nhân viên: ' + employeeId);
    return false;
  }

  // Tạo nội dung email HTML
  const subject = `Phiếu lương tháng ${getCurrentMonthYear()} - ${employeeName}`;
  const htmlBody = createEmailTemplate(
    employeeId,
    employeeName,
    grossSalary,
    netSalary,
    tax,
    socialInsurance,
    healthInsurance,
    unemploymentInsurance,
    taxableIncome
  );

  try {
    // Gửi email
    MailApp.sendEmail({
      to: emailAddress,
      subject: subject,
      htmlBody: htmlBody,
      name: 'Phòng Nhân Sự'
    });

    Logger.log(`Email đã gửi thành công cho ${employeeName} (${emailAddress})`);
    return { success: true, error: null };
  } catch (error) {
    const errorMsg = error.toString();
    Logger.log(`Lỗi khi gửi email cho ${employeeName}: ${errorMsg}`);
    Logger.log(`Chi tiết lỗi: ${JSON.stringify(error)}`);
    return { success: false, error: errorMsg };
  }
}

/**
 * Tạo template HTML cho email phiếu lương
 */
function createEmailTemplate(
  employeeId,
  employeeName,
  grossSalary,
  netSalary,
  tax,
  socialInsurance,
  healthInsurance,
  unemploymentInsurance,
  taxableIncome
) {
  // Format số tiền theo định dạng Việt Nam
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN').format(amount) + ' VNĐ';
  };

  const htmlTemplate = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <style>
        body {
          font-family: Arial, sans-serif;
          line-height: 1.6;
          color: #333;
        }
        .container {
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
          border: 1px solid #ddd;
          border-radius: 5px;
        }
        .header {
          background-color: #4CAF50;
          color: white;
          padding: 20px;
          text-align: center;
          border-radius: 5px 5px 0 0;
        }
        .content {
          padding: 20px;
          background-color: #f9f9f9;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          margin: 20px 0;
          background-color: white;
        }
        th, td {
          padding: 12px;
          text-align: left;
          border-bottom: 1px solid #ddd;
        }
        th {
          background-color: #4CAF50;
          color: white;
        }
        .total-row {
          font-weight: bold;
          background-color: #e8f5e9;
        }
        .footer {
          text-align: center;
          padding: 20px;
          color: #666;
          font-size: 12px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>PHIẾU LƯƠNG</h1>
          <p>Tháng ${getCurrentMonthYear()}</p>
        </div>
        <div class="content">
          <p>Kính gửi: <strong>${employeeName}</strong></p>
          <p>Mã nhân viên: <strong>${employeeId}</strong></p>
          
          <table>
            <tr>
              <th>STT</th>
              <th>Nội dung</th>
              <th>Số tiền</th>
            </tr>
            <tr>
              <td>1</td>
              <td>Lương GROSS</td>
              <td>${formatCurrency(grossSalary)}</td>
            </tr>
            <tr>
              <td>2</td>
              <td>BHXH (8%)</td>
              <td>${formatCurrency(socialInsurance)}</td>
            </tr>
            <tr>
              <td>3</td>
              <td>BHYT (1.5%)</td>
              <td>${formatCurrency(healthInsurance)}</td>
            </tr>
            <tr>
              <td>4</td>
              <td>BHTN (1%)</td>
              <td>${formatCurrency(unemploymentInsurance)}</td>
            </tr>
            <tr>
              <td>5</td>
              <td>Thu nhập chịu thuế</td>
              <td>${formatCurrency(taxableIncome)}</td>
            </tr>
            <tr>
              <td>6</td>
              <td>Thuế TNCN</td>
              <td>${formatCurrency(tax)}</td>
            </tr>
            <tr class="total-row">
              <td colspan="2">LƯƠNG NET</td>
              <td>${formatCurrency(netSalary)}</td>
            </tr>
          </table>
          
          <p>Trân trọng,<br>Phòng Nhân Sự</p>
        </div>
        <div class="footer">
          <p>Email này được gửi tự động từ hệ thống quản lý lương.</p>
          <p>Vui lòng không trả lời email này.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  return htmlTemplate;
}

/**
 * Lấy tháng/năm hiện tại
 */
function getCurrentMonthYear() {
  const now = new Date();
  const month = now.getMonth() + 1;
  const year = now.getFullYear();
  return `${month}/${year}`;
}

/**
 * Lấy config từ sheet CONFIG
 */
function getConfig() {
  const configSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('CONFIG');
  if (!configSheet) {
    throw new Error('Không tìm thấy sheet CONFIG');
  }
  
  return {
    bhxhRate: configSheet.getRange('B1').getValue(),      // BHXH (%)
    bhytRate: configSheet.getRange('B2').getValue(),      // BHYT (%)
    bhtnRate: configSheet.getRange('B3').getValue(),      // BHTN (%)
    personalDeduction: configSheet.getRange('B4').getValue() // Giảm trừ bản thân
  };
}

/**
 * Tính thuế TNCN dựa trên thu nhập chịu thuế và bảng thuế
 * Tính theo phương pháp lũy tiến từng phần
 */
function calculateTax(taxableIncome) {
  if (taxableIncome <= 0) {
    return 0;
  }
  
  const taxSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('BANG_THUE_TNCN');
  if (!taxSheet) {
    throw new Error('Không tìm thấy sheet BANG_THUE_TNCN');
  }
  
  // Lấy dữ liệu bảng thuế (từ row 3 đến row 9)
  // Format: [bậc, đến mức, thuế suất]
  const taxData = taxSheet.getRange(3, 1, 7, 3).getValues();
  
  let totalTax = 0;
  let previousLevel = 0;
  
  for (let i = 0; i < taxData.length; i++) {
    const [level, maxAmount, taxRateStr] = taxData[i];
    
    // Parse thuế suất (ví dụ: "5%" -> 0.05)
    const taxRate = parseFloat(taxRateStr.toString().replace('%', '').replace(/,/g, '')) / 100;
    
    // Parse mức thuế (ví dụ: "5,000,000" -> 5000000)
    let maxAmountNum = maxAmount;
    if (typeof maxAmount === 'string') {
      maxAmountNum = parseFloat(maxAmount.replace(/,/g, '').replace(/\./g, ''));
    }
    
    if (taxableIncome <= maxAmountNum) {
      // Thu nhập nằm trong bậc này
      // Tính thuế cho phần vượt quá mức trước đó
      const taxableAmount = taxableIncome - previousLevel;
      totalTax += taxableAmount * taxRate;
      break;
    } else {
      // Thu nhập vượt quá bậc này
      // Tính thuế cho toàn bộ bậc này
      const taxableAmount = maxAmountNum - previousLevel;
      totalTax += taxableAmount * taxRate;
      previousLevel = maxAmountNum;
    }
  }
  
  return Math.round(totalTax);
}

/**
 * Tính toán lương cho một nhân viên dựa trên lương GROSS
 * @param {number} grossSalary - Lương GROSS
 * @returns {object} Object chứa các khoản tính toán
 */
function calculateSalary(grossSalary) {
  const config = getConfig();
  
  // Tính các khoản bảo hiểm
  const socialInsurance = Math.round(grossSalary * config.bhxhRate);      // BHXH
  const healthInsurance = Math.round(grossSalary * config.bhytRate);     // BHYT
  const unemploymentInsurance = Math.round(grossSalary * config.bhtnRate); // BHTN
  
  // Tính thu nhập chịu thuế
  const taxableIncome = grossSalary - socialInsurance - healthInsurance - unemploymentInsurance - config.personalDeduction;
  
  // Tính thuế TNCN
  const tax = calculateTax(taxableIncome);
  
  // Tính lương NET
  const netSalary = grossSalary - socialInsurance - healthInsurance - unemploymentInsurance - tax;
  
  return {
    grossSalary: grossSalary,
    socialInsurance: socialInsurance,
    healthInsurance: healthInsurance,
    unemploymentInsurance: unemploymentInsurance,
    taxableIncome: taxableIncome,
    tax: tax,
    netSalary: netSalary
  };
}

/**
 * Hàm để gửi email cho tất cả nhân viên từ sheet Danh_sach_nhan_vien
 * Tính toán lương trực tiếp từ dữ liệu trong sheet
 */
function sendSalaryEmailsToAll() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Danh_sach_nhan_vien');
  
  if (!sheet) {
    Logger.log('Không tìm thấy sheet Danh_sach_nhan_vien');
    SpreadsheetApp.getUi().alert('Không tìm thấy sheet Danh_sach_nhan_vien');
    return;
  }

  // Lấy dữ liệu từ sheet (bắt đầu từ row 2 là header, row 3 trở đi là dữ liệu)
  const lastRow = sheet.getLastRow();
  if (lastRow < 3) {
    Logger.log('Không có dữ liệu nhân viên');
    SpreadsheetApp.getUi().alert('Không có dữ liệu nhân viên');
    return;
  }

  const dataRange = sheet.getRange(2, 1, lastRow - 1, 4); // A2:D(lastRow)
  const data = dataRange.getValues();
  
  let successCount = 0;
  let failCount = 0;

  for (let i = 0; i < data.length; i++) {
    const [employeeId, employeeName, email, grossSalaryRaw] = data[i];
    
    // Bỏ qua header row
    if (i === 0) continue;
    
    // Bỏ qua nếu không có đủ thông tin
    if (!employeeId || !email || !grossSalaryRaw) {
      Logger.log(`Bỏ qua row ${i + 2}: Thiếu thông tin`);
      continue;
    }

    try {
      // Chuyển đổi lương GROSS từ string sang number
      let grossSalary = grossSalaryRaw;
      if (typeof grossSalaryRaw === 'string') {
        grossSalary = parseFloat(grossSalaryRaw.toString().replace(/\./g, '').replace(/,/g, ''));
      }
      
      if (!grossSalary || grossSalary <= 0) {
        Logger.log(`Bỏ qua ${employeeId}: Lương GROSS không hợp lệ`);
        failCount++;
        continue;
      }

      // Tính toán lương
      const salaryData = calculateSalary(grossSalary);
      
      // Gửi email
      const result = sendSalaryEmail(
        employeeId,
        email,
        employeeName,
        salaryData.grossSalary,
        salaryData.netSalary,
        salaryData.tax,
        salaryData.socialInsurance,
        salaryData.healthInsurance,
        salaryData.unemploymentInsurance,
        salaryData.taxableIncome
      );

      // Xử lý kết quả (có thể là boolean hoặc object)
      const success = (typeof result === 'object' && result !== null) ? result.success : result;
      const errorDetail = (typeof result === 'object' && result !== null) ? result.error : null;

      if (success) {
        successCount++;
        // Cập nhật trạng thái trong sheet (cột F)
        const statusCell = sheet.getRange(i + 2, 6); // Cột F
        statusCell.setValue('Đã gửi: ' + new Date().toLocaleString('vi-VN'));
        statusCell.setFontColor('#0f9d58');
      } else {
        failCount++;
        // Ghi lỗi chi tiết vào cột F
        const statusCell = sheet.getRange(i + 2, 6); // Cột F
        let errorMsg = `Lỗi khi gửi email cho ${employeeName}`;
        if (errorDetail) {
          errorMsg += `: ${errorDetail}`;
        }
        statusCell.setValue(errorMsg);
        statusCell.setFontColor('#ea4335');
        Logger.log(`Lỗi chi tiết cho ${employeeId}: ${errorMsg}`);
      }

      // Nghỉ 1 giây giữa các email để tránh rate limit
      Utilities.sleep(1000);
    } catch (error) {
      Logger.log(`Lỗi khi xử lý nhân viên ${employeeId}: ${error.toString()}`);
      failCount++;
    }
  }

  Logger.log(`Hoàn thành! Đã gửi thành công: ${successCount}, Thất bại: ${failCount}`);
  
  // Hiển thị kết quả (wrap trong try-catch vì không thể gọi trong một số context)
  try {
    SpreadsheetApp.getUi().alert(
      `Đã gửi email!\nThành công: ${successCount}\nThất bại: ${failCount}`
    );
  } catch (e) {
    Logger.log('Không thể hiển thị alert UI: ' + e.toString());
  }
}

/**
 * Hàm để gửi email cho một nhân viên cụ thể từ button trong sheet
 * Tính toán lương trực tiếp từ dữ liệu trong Danh_sach_nhan_vien
 * @param {string} employeeId - Mã nhân viên (ví dụ: 'NV01')
 */
function sendSalaryEmailForEmployee(employeeId) {
  // Kiểm tra parameter
  if (!employeeId || employeeId === undefined || employeeId === '') {
    const errorMsg = 'Lỗi: Vui lòng nhập mã nhân viên!\n\nVí dụ: sendSalaryEmailForEmployee(\'NV01\')';
    Logger.log('Lỗi: employeeId không được cung cấp');
    try {
      SpreadsheetApp.getUi().alert(errorMsg);
    } catch (e) {
      Logger.log('Không thể hiển thị alert UI: ' + e.toString());
    }
    return errorMsg;
  }
  
  // Xử lý employeeId có thể có dấu nháy đơn
  employeeId = employeeId.toString().replace(/'/g, '');
  
  Logger.log('Đang gửi email cho nhân viên: ' + employeeId);
  
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Danh_sach_nhan_vien');
  
  if (!sheet) {
    const errorMsg = 'Không tìm thấy sheet Danh_sach_nhan_vien';
    Logger.log(errorMsg);
    try {
      SpreadsheetApp.getUi().alert(errorMsg);
    } catch (e) {
      Logger.log('Không thể hiển thị alert UI: ' + e.toString());
    }
    return errorMsg;
  }

  // Tìm nhân viên trong sheet (bắt đầu từ row 2 là header)
  const lastRow = sheet.getLastRow();
  if (lastRow < 3) {
    const errorMsg = 'Không có dữ liệu nhân viên';
    Logger.log(errorMsg);
    try {
      SpreadsheetApp.getUi().alert(errorMsg);
    } catch (e) {
      Logger.log('Không thể hiển thị alert UI: ' + e.toString());
    }
    return errorMsg;
  }
  
  const dataRange = sheet.getRange(2, 1, lastRow - 1, 4); // A2:D(lastRow)
  const data = dataRange.getValues();
  
  let employeeData = null;
  let rowIndex = -1;
  
  // Loop qua dữ liệu (bỏ qua header row ở i=0)
  for (let i = 0; i < data.length; i++) {
    // Bỏ qua header row (i=0)
    if (i === 0) continue;
    
    // So sánh mã nhân viên (có thể có dấu nháy đơn hoặc không)
    const currentId = data[i][0];
    const cleanCurrentId = currentId ? currentId.toString().replace(/'/g, '') : '';
    const cleanEmployeeId = employeeId.toString().replace(/'/g, '');
    
    if (cleanCurrentId === cleanEmployeeId || currentId === employeeId) {
      employeeData = data[i];
      rowIndex = i + 2; // +2 vì bắt đầu từ row 2
      break;
    }
  }

  if (!employeeData) {
    const errorMsg = `Không tìm thấy nhân viên với mã: ${employeeId}`;
    // Ghi lỗi vào cột F nếu có rowIndex
    if (rowIndex > 0) {
      try {
        const statusCell = sheet.getRange(rowIndex, 6); // Cột F
        statusCell.setValue(errorMsg);
        statusCell.setFontColor('#ea4335');
      } catch (e) {
        Logger.log('Không thể ghi lỗi vào sheet: ' + e.toString());
      }
    }
    Logger.log(errorMsg);
    return errorMsg;
  }

  const [id, name, email, grossSalaryRaw] = employeeData;
  
  // Kiểm tra dữ liệu
  if (!id || !name || !email) {
    const errorMsg = `Thiếu thông tin nhân viên: ${employeeId}`;
    // Ghi lỗi vào cột F
    try {
      const statusCell = sheet.getRange(rowIndex, 6); // Cột F
      statusCell.setValue(errorMsg);
      statusCell.setFontColor('#ea4335');
    } catch (e) {
      Logger.log('Không thể ghi lỗi vào sheet: ' + e.toString());
    }
    Logger.log(errorMsg);
    return errorMsg;
  }
  
  // Chuyển đổi lương GROSS từ string sang number (xử lý format "20.000.000")
  let grossSalary = grossSalaryRaw;
  if (typeof grossSalaryRaw === 'string') {
    grossSalary = parseFloat(grossSalaryRaw.toString().replace(/\./g, '').replace(/,/g, ''));
  }
  
  if (!grossSalary || grossSalary <= 0) {
    const errorMsg = `Lương GROSS không hợp lệ cho nhân viên: ${employeeId}`;
    // Ghi lỗi vào cột F
    try {
      const statusCell = sheet.getRange(rowIndex, 6); // Cột F
      statusCell.setValue(errorMsg);
      statusCell.setFontColor('#ea4335');
    } catch (e) {
      Logger.log('Không thể ghi lỗi vào sheet: ' + e.toString());
    }
    Logger.log(errorMsg);
    return errorMsg;
  }

  try {
    // Tính toán lương
    const salaryData = calculateSalary(grossSalary);
    
    // Gửi email
    const result = sendSalaryEmail(
      id,
      email,
      name,
      salaryData.grossSalary,
      salaryData.netSalary,
      salaryData.tax,
      salaryData.socialInsurance,
      salaryData.healthInsurance,
      salaryData.unemploymentInsurance,
      salaryData.taxableIncome
    );

    // Xử lý kết quả (có thể là boolean hoặc object)
    const success = (typeof result === 'object' && result !== null) ? result.success : result;
    const errorDetail = (typeof result === 'object' && result !== null) ? result.error : null;

    if (success) {
      // Cập nhật trạng thái trong sheet (cột F)
      const statusCell = sheet.getRange(rowIndex, 6); // Cột F
      statusCell.setValue('Đã gửi: ' + new Date().toLocaleString('vi-VN'));
      statusCell.setFontColor('#0f9d58');
      
      return `Đã gửi email thành công cho ${name}`;
    } else {
      // Ghi lỗi chi tiết vào cột F
      const statusCell = sheet.getRange(rowIndex, 6); // Cột F
      let errorMsg = `Lỗi khi gửi email cho ${name}`;
      
      // Thêm chi tiết lỗi nếu có
      if (errorDetail) {
        errorMsg += `: ${errorDetail}`;
      }
      
      statusCell.setValue(errorMsg);
      statusCell.setFontColor('#ea4335');
      Logger.log(`Lỗi chi tiết: ${errorMsg}`);
      return errorMsg;
    }
  } catch (error) {
    // Ghi lỗi chi tiết vào cột F
    const errorMsg = `Lỗi: ${error.toString()}`;
    Logger.log(`Lỗi khi tính toán/gửi email cho ${employeeId}: ${errorMsg}`);
    
    // Cập nhật trạng thái lỗi vào sheet (cột F)
    try {
      const statusCell = sheet.getRange(rowIndex, 6); // Cột F
      statusCell.setValue(errorMsg);
      statusCell.setFontColor('#ea4335');
    } catch (e) {
      Logger.log('Không thể ghi lỗi vào sheet: ' + e.toString());
    }
    
    return errorMsg;
  }
}

/**
 * Hàm để setup installable trigger cho checkbox
 * 
 * LƯU Ý: Cách tạo trigger programmatic có thể không hoạt động đúng.
 * Vui lòng tạo trigger THỦ CÔNG theo hướng dẫn trong FIX_CHECKBOX_TRIGGER.md
 * 
 * Hoặc làm theo các bước sau:
 * 1. Vào Apps Script > Triggers (biểu tượng đồng hồ)
 * 2. Click "+ Add Trigger"
 * 3. Chọn:
 *    - Function: onEditCheckbox
 *    - Event source: From spreadsheet
 *    - Event type: On edit
 * 4. Click Save và authorize
 */
function setupCheckboxTrigger() {
  try {
    // Thử tạo trigger programmatic
    const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    
    // Xóa trigger cũ nếu có
    const triggers = ScriptApp.getProjectTriggers();
    triggers.forEach(trigger => {
      if (trigger.getHandlerFunction() === 'onEditCheckbox') {
        ScriptApp.deleteTrigger(trigger);
      }
    });
    
    // Tạo trigger mới
    ScriptApp.newTrigger('onEditCheckbox')
      .onEdit()
      .create();
    
    try {
      SpreadsheetApp.getUi().alert('Đã tạo trigger thành công!\n\nBây giờ bạn có thể click checkbox để gửi email.\n\nLưu ý: Lần đầu click checkbox sẽ hỏi authorization.');
    } catch (e) {
      Logger.log('Đã tạo trigger thành công (không thể hiển thị alert)');
    }
  } catch (error) {
    // Nếu không thể tạo trigger programmatic, hướng dẫn tạo thủ công
    const errorMsg = 'Không thể tạo trigger tự động.\n\nVui lòng tạo trigger THỦ CÔNG:\n\n1. Vào Apps Script > Triggers (biểu tượng đồng hồ ⏰)\n2. Click "+ Add Trigger"\n3. Chọn:\n   - Function: onEditCheckbox\n   - Event source: From spreadsheet\n   - Event type: On edit\n4. Click Save và authorize\n\nXem hướng dẫn chi tiết trong FIX_CHECKBOX_TRIGGER.md';
    
    Logger.log('Lỗi khi tạo trigger: ' + error.toString());
    Logger.log('Vui lòng tạo trigger thủ công');
    
    try {
      SpreadsheetApp.getUi().alert(errorMsg);
    } catch (e) {
      Logger.log(errorMsg);
    }
  }
}

/**
 * Installable trigger để xử lý checkbox (có quyền gửi email)
 * Đơn giản: Khi checkbox được check → Gọi hàm sendSalaryEmailForEmployee() giống như sendSalaryEmailsToAll()
 * 
 * QUAN TRỌNG: Cần tạo trigger thủ công:
 * 1. Apps Script > Triggers > + Add Trigger
 * 2. Function: onEditCheckbox
 * 3. Event source: From spreadsheet
 * 4. Event type: On edit
 * 
 * LƯU Ý: Hàm này chỉ hoạt động khi được gọi từ trigger, không thể chạy trực tiếp từ editor
 */
function onEditCheckbox(e) {
  // Kiểm tra event object (khi chạy từ trigger sẽ có, khi chạy trực tiếp sẽ undefined)
  if (!e || !e.source || !e.range) {
    Logger.log('Lỗi: Hàm này chỉ hoạt động khi được gọi từ trigger (On edit). Không thể chạy trực tiếp từ editor.');
    Logger.log('Vui lòng tạo trigger: Apps Script > Triggers > + Add Trigger > Chọn onEditCheckbox');
    return;
  }
  
  const sheet = e.source.getActiveSheet();
  const range = e.range;
  
  // Chỉ xử lý khi edit trong sheet Danh_sach_nhan_vien, cột E (cột 5)
  if (sheet.getName() !== 'Danh_sach_nhan_vien' || range.getColumn() !== 5) {
    return;
  }
  
  const row = range.getRow();
  
  // Bỏ qua header row (row 2)
  if (row < 3) {
    return;
  }
  
  // Chỉ xử lý khi checkbox được check (value = true)
  if (range.getValue() !== true) {
    return;
  }
  
  // Lấy mã nhân viên từ cột A
  const employeeIdRaw = sheet.getRange(row, 1).getValue();
  const employeeId = employeeIdRaw ? employeeIdRaw.toString().replace(/'/g, '') : '';
  
  if (!employeeId) {
    range.setValue(false); // Uncheck
    const errorMsg = 'Không tìm thấy mã nhân viên ở dòng ' + row;
    sheet.getRange(row, 6).setValue(errorMsg).setFontColor('#ea4335');
    Logger.log(errorMsg);
    return;
  }
  
  // Đơn giản: Gọi hàm sendSalaryEmailForEmployee() giống như trong sendSalaryEmailsToAll()
  try {
    Logger.log(`Checkbox được check cho nhân viên: ${employeeId}`);
    const result = sendSalaryEmailForEmployee(employeeId);
    
    // Uncheck checkbox sau khi gửi
    range.setValue(false);
    
    // Kết quả đã được ghi vào cột F trong hàm sendSalaryEmailForEmployee()
    // Không cần làm gì thêm
    
  } catch (error) {
    // Ghi lỗi vào cột F
    const errorMsg = 'Lỗi: ' + error.toString();
    sheet.getRange(row, 6).setValue(errorMsg).setFontColor('#ea4335');
    range.setValue(false); // Uncheck
    Logger.log('Lỗi khi gửi email: ' + errorMsg);
  }
}

/**
 * Hàm helper để tạo checkbox trong sheet Danh_sach_nhan_vien
 * Chạy hàm này một lần để tạo các checkbox gửi email trong cột "Gửi template"
 * Sau khi tạo checkbox, click vào checkbox để gửi email tự động
 * 
 * QUAN TRỌNG: Sau khi tạo checkbox, cần chạy setupCheckboxTrigger() để tạo trigger có quyền
 */
function createSendEmailButtons() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Danh_sach_nhan_vien');
  
  if (!sheet) {
    Logger.log('Không tìm thấy sheet Danh_sach_nhan_vien');
    SpreadsheetApp.getUi().alert('Không tìm thấy sheet Danh_sach_nhan_vien');
    return;
  }

  // Đảm bảo header cho cột "Gửi template" (cột E) đã có
  const headerRange = sheet.getRange('E2');
  if (!headerRange.getValue()) {
    headerRange.setValue('Gửi template');
    headerRange.setFontWeight('bold');
    headerRange.setBackground('#4CAF50');
    headerRange.setFontColor('#FFFFFF');
  }

  // Lấy số lượng nhân viên (bắt đầu từ row 3)
  const lastRow = sheet.getLastRow();
  if (lastRow < 3) {
    Logger.log('Không có dữ liệu nhân viên');
    SpreadsheetApp.getUi().alert('Không có dữ liệu nhân viên');
    return;
  }
  
  // Tạo checkbox cho mỗi nhân viên (từ row 3)
  let checkboxCount = 0;
  for (let row = 3; row <= lastRow; row++) {
    const employeeId = sheet.getRange(row, 1).getValue();
    
    if (!employeeId) {
      continue;
    }

    // Tạo checkbox trong cột E
    const cell = sheet.getRange(row, 5); // Cột E
    
    // Xóa giá trị cũ nếu có
    cell.clear();
    
    // Thêm checkbox
    cell.insertCheckboxes();
    cell.setValue(false); // Mặc định là unchecked
    
    // Format checkbox
    cell.setHorizontalAlignment('center');
    cell.setVerticalAlignment('middle');
    
    // Thêm note để hướng dẫn
    const cleanEmployeeId = employeeId.toString().replace(/'/g, '');
    cell.setNote('Click vào checkbox này để gửi email cho ' + cleanEmployeeId);
    
    checkboxCount++;
  }

  Logger.log(`Đã tạo ${checkboxCount} checkbox gửi email`);
  try {
    SpreadsheetApp.getUi().alert(`Đã tạo ${checkboxCount} checkbox gửi email trong cột "Gửi template"!\n\nĐể gửi email:\n1. Click vào checkbox của nhân viên cần gửi\n2. Email sẽ được gửi tự động\n3. Checkbox sẽ tự động uncheck sau khi gửi`);
  } catch (e) {
    Logger.log(`Đã tạo ${checkboxCount} checkbox gửi email`);
  }
}

/**
 * Hàm tự động chạy khi mở Google Sheets
 * Tạo menu "Gửi Email" trong thanh menu
 */
function onOpen() {
  const ui = SpreadsheetApp.getUi();
  ui.createMenu('📧 Gửi Email')
    .addItem('Gửi email cho tất cả nhân viên', 'sendSalaryEmailsToAll')
    .addSeparator()
    .addItem('Tạo checkbox gửi email trong sheet', 'createSendEmailButtons')
    .addItem('Setup trigger cho checkbox (QUAN TRỌNG)', 'setupCheckboxTrigger')
    .addToUi();
  
  // Tạo menu cho tính năng nhắc nhở
  ui.createMenu('🔔 Nhắc Nhở')
    .addItem('Thêm cột Joined Date và Date nhắc nhở', 'addReminderColumns')
    .addItem('Cập nhật Date nhắc nhở cho tất cả', 'updateAllReminderDates')
    .addItem('Bật/Tắt border nhấp nháy', 'toggleBlinkingBorder')
    .addToUi();
  
  // Tự động tạo button nếu chưa có
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Danh_sach_nhan_vien');
  if (sheet) {
    const lastRow = sheet.getLastRow();
    if (lastRow >= 3) {
      const firstButtonCell = sheet.getRange(3, 5); // E3
      if (!firstButtonCell.getValue() || firstButtonCell.getValue() === '') {
        // Chưa có button, nhưng không tự động tạo để tránh làm phiền user
        // User có thể chạy createSendEmailButtons() thủ công
      }
    }
  }
  
  // Tự động kiểm tra và cập nhật reminder dates khi mở sheet
  checkAndUpdateReminderBorders();
}

/**
 * Các hàm test helper - Chạy các hàm này để test dễ dàng hơn
 * Không cần nhập parameter, chỉ cần chọn hàm và click Run
 */
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

/**
 * Hàm helper để gửi email cho nhân viên từ button trong sheet
 * Được gọi khi click vào cell trong cột "Gửi template"
 * @param {number} row - Số dòng trong sheet (bắt đầu từ 1)
 */
function sendEmailFromButton(row) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Danh_sach_nhan_vien');
  
  if (!sheet) {
    SpreadsheetApp.getUi().alert('Không tìm thấy sheet Danh_sach_nhan_vien');
    return;
  }
  
  // Lấy mã nhân viên từ cột A
  const employeeId = sheet.getRange(row, 1).getValue();
  
  if (!employeeId) {
    SpreadsheetApp.getUi().alert('Không tìm thấy mã nhân viên ở dòng ' + row);
    return;
  }
  
  // Gửi email
  const result = sendSalaryEmailForEmployee(employeeId);
  SpreadsheetApp.getUi().alert(result);
}

/**
 * Hàm tự động chạy khi có chỉnh sửa trong sheet
 * Xử lý khi checkbox trong cột "Gửi template" (cột E) được check
 * 
 * LƯU Ý QUAN TRỌNG:
 * Simple trigger onEdit() KHÔNG CÓ QUYỀN gọi MailApp.sendEmail()
 * Cần tạo INSTALLABLE TRIGGER thay vì dùng simple trigger này
 * 
 * CÁCH SỬ DỤNG:
 * 1. Chạy hàm setupCheckboxTrigger() một lần để tạo installable trigger
 * 2. Thêm checkbox vào cột E (Gửi template) cho mỗi nhân viên
 * 3. Click vào checkbox để gửi email tự động
 */
function onEdit(e) {
  const sheet = e.source.getActiveSheet();
  const range = e.range;
  
  // Chỉ xử lý khi edit trong sheet Danh_sach_nhan_vien
  if (sheet.getName() === 'Danh_sach_nhan_vien') {
    const row = range.getRow();
    const col = range.getColumn();
    
    // Xử lý checkbox trong cột E (cột 5)
    if (col === 5) {
      // Bỏ qua header row (row 2)
      if (row < 3) {
        return;
      }
      
      const cellValue = range.getValue();
      
      // Xử lý khi checkbox được check (value = true)
      if (cellValue === true) {
        const employeeIdRaw = sheet.getRange(row, 1).getValue();
        
        // Xử lý employeeId có thể có dấu nháy đơn
        const employeeId = employeeIdRaw ? employeeIdRaw.toString().replace(/'/g, '') : '';
        
        if (employeeId) {
          try {
            Logger.log(`Checkbox được check cho nhân viên: ${employeeId}`);
            const result = sendSalaryEmailForEmployee(employeeId);
            
            // Uncheck checkbox sau khi gửi
            range.setValue(false);
            
            // Kiểm tra kết quả và cập nhật vào cột F (nếu chưa được cập nhật trong hàm sendSalaryEmailForEmployee)
            const statusCell = sheet.getRange(row, 6); // Cột F
            if (!statusCell.getValue() || statusCell.getValue() === '') {
              if (result.includes('thành công')) {
                statusCell.setValue('Đã gửi: ' + new Date().toLocaleString('vi-VN'));
                statusCell.setFontColor('#0f9d58');
              } else if (result.includes('Lỗi')) {
                statusCell.setValue(result);
                statusCell.setFontColor('#ea4335');
              }
            }
            
            // Hiển thị thông báo (không bắt buộc)
            try {
              SpreadsheetApp.getUi().alert(result);
            } catch (uiError) {
              Logger.log('Không thể hiển thị alert UI: ' + uiError.toString());
              Logger.log('Kết quả: ' + result);
            }
          } catch (error) {
            const errorMsg = 'Lỗi: ' + error.toString();
            Logger.log('Lỗi khi gửi email: ' + errorMsg);
            
            // Ghi lỗi vào cột F
            const statusCell = sheet.getRange(row, 6); // Cột F
            statusCell.setValue(errorMsg);
            statusCell.setFontColor('#ea4335');
            
            // Uncheck checkbox
            range.setValue(false);
            
            // Hiển thị thông báo (không bắt buộc)
            try {
              SpreadsheetApp.getUi().alert(errorMsg);
            } catch (uiError) {
              Logger.log('Không thể hiển thị alert UI: ' + uiError.toString());
            }
          }
        } else {
          range.setValue(false);
          const errorMsg = 'Không tìm thấy mã nhân viên ở dòng ' + row;
          Logger.log(errorMsg);
          
          // Ghi lỗi vào cột F
          const statusCell = sheet.getRange(row, 6); // Cột F
          statusCell.setValue(errorMsg);
          statusCell.setFontColor('#ea4335');
        }
      }
    }
    
    // Xử lý khi chỉnh sửa Joined Date (cột F - cột 6)
    // Cập nhật lại Date nhắc nhở tự động
    if (col === 6 && row >= 3) {
      updateReminderDateForRow(sheet, row);
      // Cập nhật lại border nhấp nháy
      checkAndUpdateReminderBorders();
    }
  }
}

/**
 * ============================================
 * TÍNH NĂNG NHẮC NHỞ - REMINDER FEATURES
 * ============================================
 */

/**
 * Thêm 2 cột mới: "Joined Date" (cột F) và "Date nhắc nhở" (cột G)
 * Cột F: Joined Date - Ngày nhân viên vào làm
 * Cột G: Date nhắc nhở - Ngày nhắc nhở (1 tháng trước ngày kỷ niệm 1 năm)
 */
function addReminderColumns() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Danh_sach_nhan_vien');
  
  if (!sheet) {
    SpreadsheetApp.getUi().alert('Không tìm thấy sheet Danh_sach_nhan_vien');
    return;
  }
  
  // Kiểm tra xem đã có header chưa
  const headerRow = 2;
  
  // Cột F: Joined Date
  const joinedDateHeader = sheet.getRange(headerRow, 6); // F2
  if (!joinedDateHeader.getValue() || joinedDateHeader.getValue() === '') {
    joinedDateHeader.setValue('Joined Date');
    joinedDateHeader.setFontWeight('bold');
    joinedDateHeader.setBackground('#4CAF50');
    joinedDateHeader.setFontColor('#FFFFFF');
    joinedDateHeader.setHorizontalAlignment('center');
  }
  
  // Cột G: Date nhắc nhở
  const reminderDateHeader = sheet.getRange(headerRow, 7); // G2
  if (!reminderDateHeader.getValue() || reminderDateHeader.getValue() === '') {
    reminderDateHeader.setValue('Date nhắc nhở');
    reminderDateHeader.setFontWeight('bold');
    reminderDateHeader.setBackground('#4CAF50');
    reminderDateHeader.setFontColor('#FFFFFF');
    reminderDateHeader.setHorizontalAlignment('center');
  }
  
  // Đặt format cho các cột date
  const lastRow = sheet.getLastRow();
  if (lastRow >= 3) {
    // Format cột F (Joined Date) - dd/mm/yyyy
    const joinedDateRange = sheet.getRange(3, 6, lastRow - 2, 1);
    joinedDateRange.setNumberFormat('dd/mm/yyyy');
    
    // Format cột G (Date nhắc nhở) - dd/mm/yyyy
    const reminderDateRange = sheet.getRange(3, 7, lastRow - 2, 1);
    reminderDateRange.setNumberFormat('dd/mm/yyyy');
  }
  
  SpreadsheetApp.getUi().alert('Đã thêm 2 cột:\n- Cột F: Joined Date\n- Cột G: Date nhắc nhở\n\nVui lòng nhập ngày vào làm cho từng nhân viên vào cột F.\nDate nhắc nhở sẽ được tính tự động.');
}

/**
 * Tính Date nhắc nhở dựa trên Joined Date
 * Logic: Joined Date + 1 năm (bao gồm 2 tháng thử việc) - 1 tháng
 * Ví dụ: Joined Date = 8/1/2025 => Anniversary = 8/1/2026 => Reminder = 7/1/2026
 * 
 * @param {Date} joinedDate - Ngày vào làm
 * @returns {Date} Ngày nhắc nhở (1 tháng trước ngày kỷ niệm 1 năm)
 */
function calculateReminderDate(joinedDate) {
  if (!joinedDate || !(joinedDate instanceof Date) || isNaN(joinedDate.getTime())) {
    return null;
  }
  
  // Tạo ngày kỷ niệm 1 năm (bao gồm 2 tháng thử việc)
  const anniversaryDate = new Date(joinedDate);
  anniversaryDate.setFullYear(anniversaryDate.getFullYear() + 1);
  
  // Trừ đi 1 tháng để có ngày nhắc nhở
  const reminderDate = new Date(anniversaryDate);
  reminderDate.setMonth(reminderDate.getMonth() - 1);
  
  return reminderDate;
}

/**
 * Cập nhật Date nhắc nhở cho một hàng cụ thể
 * @param {Sheet} sheet - Sheet object
 * @param {number} row - Số hàng (bắt đầu từ 1)
 */
function updateReminderDateForRow(sheet, row) {
  const joinedDateCell = sheet.getRange(row, 6); // Cột F
  const reminderDateCell = sheet.getRange(row, 7); // Cột G
  
  const joinedDate = joinedDateCell.getValue();
  
  if (!joinedDate) {
    reminderDateCell.setValue('');
    return;
  }
  
  // Chuyển đổi sang Date object nếu là string
  let dateObj = joinedDate;
  if (typeof joinedDate === 'string') {
    // Thử parse định dạng dd/mm/yyyy hoặc mm/dd/yyyy
    const parts = joinedDate.split('/');
    if (parts.length === 3) {
      // Giả sử định dạng dd/mm/yyyy
      dateObj = new Date(parseInt(parts[2]), parseInt(parts[1]) - 1, parseInt(parts[0]));
    } else {
      dateObj = new Date(joinedDate);
    }
  }
  
  if (!(dateObj instanceof Date) || isNaN(dateObj.getTime())) {
    reminderDateCell.setValue('');
    return;
  }
  
  const reminderDate = calculateReminderDate(dateObj);
  if (reminderDate) {
    reminderDateCell.setValue(reminderDate);
  } else {
    reminderDateCell.setValue('');
  }
}

/**
 * Cập nhật Date nhắc nhở cho tất cả nhân viên
 */
function updateAllReminderDates() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Danh_sach_nhan_vien');
  
  if (!sheet) {
    SpreadsheetApp.getUi().alert('Không tìm thấy sheet Danh_sach_nhan_vien');
    return;
  }
  
  const lastRow = sheet.getLastRow();
  if (lastRow < 3) {
    SpreadsheetApp.getUi().alert('Không có dữ liệu nhân viên');
    return;
  }
  
  let updatedCount = 0;
  
  for (let row = 3; row <= lastRow; row++) {
    const employeeId = sheet.getRange(row, 1).getValue();
    if (employeeId) {
      updateReminderDateForRow(sheet, row);
      updatedCount++;
    }
  }
  
  SpreadsheetApp.getUi().alert(`Đã cập nhật Date nhắc nhở cho ${updatedCount} nhân viên`);
  
  // Tự động kiểm tra và cập nhật border nhấp nháy
  checkAndUpdateReminderBorders();
}

/**
 * Kiểm tra xem một nhân viên có đủ điều kiện để hiển thị border nhấp nháy không
 * Điều kiện: Ngày hiện tại >= Date nhắc nhở và <= Ngày kỷ niệm
 * 
 * @param {Date} reminderDate - Ngày nhắc nhở
 * @returns {boolean} true nếu đủ điều kiện
 */
function shouldShowBlinkingBorder(reminderDate) {
  if (!reminderDate || !(reminderDate instanceof Date) || isNaN(reminderDate.getTime())) {
    return false;
  }
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const reminder = new Date(reminderDate);
  reminder.setHours(0, 0, 0, 0);
  
  // Tính ngày kỷ niệm (reminderDate + 1 tháng)
  const anniversary = new Date(reminder);
  anniversary.setMonth(anniversary.getMonth() + 1);
  
  // Hiển thị border nếu hôm nay >= reminderDate và <= anniversary
  return today >= reminder && today <= anniversary;
}

/**
 * Kiểm tra và cập nhật border nhấp nháy cho các hàng đủ điều kiện
 * Border sẽ có màu đỏ và nhấp nháy bằng cách toggle mỗi phút
 */
function checkAndUpdateReminderBorders() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Danh_sach_nhan_vien');
  
  if (!sheet) {
    return;
  }
  
  const lastRow = sheet.getLastRow();
  if (lastRow < 3) {
    return;
  }
  
  // Lấy số cột cuối cùng có dữ liệu (ít nhất là cột G)
  const lastCol = Math.max(7, sheet.getLastColumn());
  
  // Lấy trạng thái nhấp nháy từ PropertiesService
  const properties = PropertiesService.getScriptProperties();
  const sheetId = sheet.getSheetId().toString();
  const stateKey = 'blinking_state_' + sheetId;
  let blinkingState = {};
  
  try {
    const stateStr = properties.getProperty(stateKey);
    if (stateStr) {
      blinkingState = JSON.parse(stateStr);
    }
  } catch (e) {
    Logger.log('Lỗi khi đọc trạng thái nhấp nháy: ' + e.toString());
  }
  
  for (let row = 3; row <= lastRow; row++) {
    const employeeId = sheet.getRange(row, 1).getValue();
    if (!employeeId) {
      continue;
    }
    
    const reminderDateCell = sheet.getRange(row, 7); // Cột G
    const reminderDate = reminderDateCell.getValue();
    
    const shouldBlink = shouldShowBlinkingBorder(reminderDate);
    
    // Lấy range cho toàn bộ hàng (từ cột A đến cột cuối cùng)
    const rowRange = sheet.getRange(row, 1, 1, lastCol);
    
    if (shouldBlink) {
      // Toggle trạng thái nhấp nháy cho hàng này
      const rowKey = row.toString();
      if (blinkingState[rowKey] === undefined) {
        blinkingState[rowKey] = false;
      }
      blinkingState[rowKey] = !blinkingState[rowKey];
      
      // Áp dụng border đỏ (nhấp nháy bằng cách toggle)
      if (blinkingState[rowKey]) {
        rowRange.setBorder(
          true, // top
          true, // left
          true, // bottom
          true, // right
          true, // vertical
          true, // horizontal
          '#ea4335', // color - màu đỏ
          SpreadsheetApp.BorderStyle.SOLID_THICK // style - dày hơn để dễ nhận biết
        );
        
        // Thêm background color nhẹ để dễ nhận biết
        rowRange.setBackground('#fff3cd'); // Màu vàng nhạt
      } else {
        // Tắt border nhưng giữ background
        rowRange.setBorder(
          false, // top
          false, // left
          false, // bottom
          false, // right
          false, // vertical
          false, // horizontal
          null,
          null
        );
        
        // Giữ background color để vẫn dễ nhận biết
        rowRange.setBackground('#fff3cd'); // Màu vàng nhạt
      }
    } else {
      // Xóa border đặc biệt, để lại border mặc định
      rowRange.setBorder(
        false, // top
        false, // left
        false, // bottom
        false, // right
        false, // vertical
        false, // horizontal
        null,
        null
      );
      
      // Xóa background color
      rowRange.setBackground(null);
      
      // Xóa trạng thái nhấp nháy
      const rowKey = row.toString();
      if (blinkingState[rowKey] !== undefined) {
        delete blinkingState[rowKey];
      }
    }
  }
  
  // Lưu trạng thái nhấp nháy
  try {
    properties.setProperty(stateKey, JSON.stringify(blinkingState));
  } catch (e) {
    Logger.log('Lỗi khi lưu trạng thái nhấp nháy: ' + e.toString());
  }
}

/**
 * Toggle border nhấp nháy - Bật/Tắt tính năng border nhấp nháy
 * Tạo time-based trigger để tự động cập nhật border mỗi ngày và nhấp nháy mỗi phút
 */
function toggleBlinkingBorder() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Danh_sach_nhan_vien');
  
  if (!sheet) {
    SpreadsheetApp.getUi().alert('Không tìm thấy sheet Danh_sach_nhan_vien');
    return;
  }
  
  // Kiểm tra xem đã có trigger chưa
  const triggers = ScriptApp.getProjectTriggers();
  let hasDailyTrigger = false;
  let hasMinuteTrigger = false;
  
  for (let i = 0; i < triggers.length; i++) {
    const handler = triggers[i].getHandlerFunction();
    if (handler === 'checkAndUpdateReminderBorders') {
      if (triggers[i].getEventType() === ScriptApp.EventType.CLOCK) {
        // Kiểm tra xem trigger chạy mỗi phút hay mỗi ngày
        const triggerSource = triggers[i].getTriggerSource();
        // Trigger chạy mỗi phút sẽ có triggerSourceId khác
        hasMinuteTrigger = true;
      } else {
        hasDailyTrigger = true;
      }
    }
  }
  
  if (hasMinuteTrigger || hasDailyTrigger) {
    // Xóa tất cả trigger liên quan
    for (let i = 0; i < triggers.length; i++) {
      if (triggers[i].getHandlerFunction() === 'checkAndUpdateReminderBorders') {
        ScriptApp.deleteTrigger(triggers[i]);
      }
    }
    
    // Xóa tất cả border nhấp nháy
    const lastRow = sheet.getLastRow();
    if (lastRow >= 3) {
      const lastCol = Math.max(7, sheet.getLastColumn());
      for (let row = 3; row <= lastRow; row++) {
        const rowRange = sheet.getRange(row, 1, 1, lastCol);
        rowRange.setBorder(false, false, false, false, false, false, null, null);
        rowRange.setBackground(null);
      }
    }
    
    SpreadsheetApp.getUi().alert('Đã tắt tính năng border nhấp nháy');
  } else {
    // Tạo trigger chạy mỗi phút để tạo hiệu ứng nhấp nháy
    ScriptApp.newTrigger('checkAndUpdateReminderBorders')
      .timeBased()
      .everyMinutes(1)
      .create();
    
    // Chạy ngay lập tức để cập nhật border
    checkAndUpdateReminderBorders();
    
    SpreadsheetApp.getUi().alert('Đã bật tính năng border nhấp nháy!\n\nBorder sẽ tự động nhấp nháy mỗi phút cho các hàng có Date nhắc nhở trong khoảng thời gian hiện tại.\n\nCác hàng sẽ được đánh dấu bằng border đỏ và background vàng nhạt.');
  }
}
