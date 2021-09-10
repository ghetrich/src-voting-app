const ExcelJS = require("exceljs");
const excelToJson = require("convert-excel-to-json");
const fs = require("fs");

const result = excelToJson({
    source: fs.readFileSync("export.xlsx"),
    header: {
        rows: 1
    }, // fs.readFileSync return a Buffer
    columnToKey: {
        A:"id",
        B: "name",
        C:"index"
    }
});


console.log(result);


