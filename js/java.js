const SHEET_NAME = "Sheet1";


// ===============================
// MENERIMA UCAPAN DARI WEBSITE
// ===============================
function doPost(e) {
  try {
    const sheet = SpreadsheetApp
      .getActiveSpreadsheet()
      .getSheetByName(SHEET_NAME);

    const nama = e.parameter.nama || "";
    const status = e.parameter.status || "";
    const ucapan = e.parameter.ucapan || "";

    sheet.appendRow([
      nama,
      status,
      ucapan,
      new Date()
    ]);

    return ContentService
      .createTextOutput(JSON.stringify({
        status: "success",
        message: "Ucapan berhasil disimpan"
      }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {

    return ContentService
      .createTextOutput(JSON.stringify({
        status: "error",
        message: error.toString()
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}


// ===============================
// MENGAMBIL SEMUA UCAPAN
// ===============================
function doGet() {
  try {

    const sheet = SpreadsheetApp
      .getActiveSpreadsheet()
      .getSheetByName(SHEET_NAME);

    const data = sheet.getDataRange().getValues();

    const result = [];

    for (let i = 1; i < data.length; i++) {

      result.push({
        nama: data[i][0],
        status: data[i][1],
        ucapan: data[i][2],
        waktu: data[i][3]
      });

    }

    return ContentService
      .createTextOutput(JSON.stringify(result))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {

    return ContentService
      .createTextOutput(JSON.stringify({
        status: "error",
        message: error.toString()
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
