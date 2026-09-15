/**
 * NABY COQUETTE — Google Apps Script Web App
 * Chức năng: Tra cứu đơn hàng theo Instagram handle
 *
 * HƯỚNG DẪN DEPLOY:
 * 1. Mở Google Sheet chứa đơn hàng
 * 2. Vào Extensions → Apps Script
 * 3. Dán toàn bộ code này vào, thay SHEET_ID bằng ID thực của sheet
 * 4. Click Deploy → New deployment → Web app
 *    - Execute as: Me
 *    - Who has access: Anyone
 * 5. Copy URL "Web app URL" → dán vào app.js tại biến APPS_SCRIPT_URL
 *
 * CẤU TRÚC GOOGLE SHEET (tên sheet: "DonHang"):
 * Cột A: order_id         (VD: #NBY001)
 * Cột B: instagram_handle (VD: baongoc_coquette)
 * Cột C: order_date       (VD: 15/09/2026)
 * Cột D: status           (VD: Đã chốt | Đang giao | Đã nhận)
 * Cột E: items            (VD: Áo hoa nhí|Đã thanh toán,Váy midi|Chưa TT)
 * Cột F: shipping_fee     (VD: 30000)
 * Cột G: spx_tracking_code (VD: SPXVN0123456789  — để trống nếu chưa có)
 *
 * Dòng 1 là HEADER, dữ liệu bắt đầu từ dòng 2.
 */

// ⚠️ Thay bằng ID Google Sheet của bạn (lấy từ URL của sheet)
var SHEET_ID = "YOUR_GOOGLE_SHEET_ID_HERE";
var SHEET_NAME = "DonHang"; // Tên tab sheet

function doGet(e) {
  var handle = (e.parameter.handle || "").toLowerCase().trim().replace(/^@/, "");

  if (!handle) {
    return jsonResponse({ error: "Vui lòng cung cấp tên Instagram để tra cứu." });
  }

  try {
    var ss = SpreadsheetApp.openById(SHEET_ID);
    var sheet = ss.getSheetByName(SHEET_NAME);

    if (!sheet) {
      return jsonResponse({ error: "Không tìm thấy sheet dữ liệu. Liên hệ Naby nhé ♡" });
    }

    var data = sheet.getDataRange().getValues();

    // data[0] là header row, bỏ qua
    var orders = [];
    for (var i = 1; i < data.length; i++) {
      var row = data[i];
      var rowHandle = (row[1] || "").toString().toLowerCase().trim().replace(/^@/, "");

      // Tìm kiếm chính xác hoặc bao gồm handle
      if (rowHandle === handle || rowHandle.includes(handle)) {
        orders.push({
          order_id: row[0] ? row[0].toString() : "",
          instagram_handle: row[1] ? row[1].toString() : "",
          order_date: row[2] ? formatDate(row[2]) : "",
          status: row[3] ? row[3].toString() : "Đã chốt",
          items: row[4] ? row[4].toString() : "",
          shipping_fee: row[5] ? row[5].toString() : "",
          spx_tracking_code: row[6] ? row[6].toString() : ""
        });
      }
    }

    return jsonResponse(orders);

  } catch (err) {
    Logger.log("Error: " + err.toString());
    return jsonResponse({ error: "Có lỗi xảy ra. Vui lòng thử lại sau hoặc nhắn Naby qua Instagram nhé ♡" });
  }
}

/** Định dạng ngày từ Date object của Sheets sang dd/mm/yyyy */
function formatDate(val) {
  if (!val) return "";
  if (val instanceof Date) {
    var d = val.getDate().toString().padStart(2, "0");
    var m = (val.getMonth() + 1).toString().padStart(2, "0");
    var y = val.getFullYear();
    return d + "/" + m + "/" + y;
  }
  return val.toString();
}

/** Trả về JSON response với CORS headers */
function jsonResponse(data) {
  var output = ContentService.createTextOutput(JSON.stringify(data));
  output.setMimeType(ContentService.MimeType.JSON);
  return output;
}
