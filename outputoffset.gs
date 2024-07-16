function getA1NotationIndexes(a1Notation) {
  const match = a1Notation.match(/^([A-Z]+)(\d+)$/);
  const column = columnToIndex(match[1]);
  const row = parseInt(match[2], 10);
  console.log(row, column);
  return { row, column };
}

function columnToIndex(columnName) {
  let column = 0;
  for (let i = 0; i < columnName.length; i++) {
    column = (column * 26) + (columnName.charCodeAt(i) - 'A'.charCodeAt(0) + 1);
  }
  return column;
}

function findSmallestRectangle(cells) {
  const sheet = SpreadsheetApp.getActiveSheet();
  
  // Convert cell references to row and column indices
  let minRow = Infinity, maxRow = 0, minCol = Infinity, maxCol = 0;

  cells.forEach(cellRef => {
    // const {row, column} = sheet.getRange(cellRef).getA1NotationIndexes();
    const {row, column} = getA1NotationIndexes(sheet.getRange(cellRef).getA1Notation());
    minRow = Math.min(minRow, row);
    maxRow = Math.max(maxRow, row);
    minCol = Math.min(minCol, column);
    maxCol = Math.max(maxCol, column);
  });

  // Calculate the size of the rectangle
  const numRows = maxRow - minRow + 1;
  const numCols = maxCol - minCol + 1;

  // Return or log the size of the rectangle
  console.log(`Smallest rectangle size: ${numRows} rows x ${numCols} columns`);
  return { numRows, numCols, minRow, minCol };
}

function findEmptyRectangle(sheet, numRowsRequired, numColsRequired) {
  const data = sheet.getDataRange().getValues(); // Get all data in the sheet
  const maxRow = data.length;
  const maxCol = data[0].length;

  const out = [1, maxCol + 1];
  return out;

  // // Loop through rows and columns to find the first matching empty rectangle
  // for (let startRow = 0; startRow <= maxRow - numRowsRequired; startRow++) {
  //   for (let startCol = 0; startCol <= maxCol - numColsRequired; startCol++) {
  //     if (isEmptyRectangle(data, startRow, startCol, numRowsRequired, numColsRequired)) {
  //       // Return the top-left cell of the found rectangle
  //       return {row: startRow + 1, col: startCol + 1}; // Convert zero-based index to one-based
  //     }
  //   }
  // }

  // // Return null if no empty rectangle is found
  // return null;
}

function isEmptyRectangle(data, startRow, startCol, numRows, numCols) {
  for (let row = startRow; row < startRow + numRows; row++) {
    for (let col = startCol; col < startCol + numCols; col++) {
      if (data[row][col] !== "") {
        return false; // This rectangle isn't empty
      }
    }
  }
  return true; // The rectangle is empty
}

/*  This is the final function that takes output json and  */
function convertIndices(sheet, json) {
  // get size of output
  const keys = Object.keys(json);
  // const {outRows, outCols, minOutRows, minOutCols} = findSmallestRectangle(keys);
  // const {numRows, numCols, minRow, minCol} =
  const k = findSmallestRectangle(keys);
  const outRows = k.numRows;
  const outCols = k.numCols;
  const minOutRows = k.minRow;
  const minOutCols = k.minCol;
  // const {startRow, startCol} = findEmptyRectangle(sheet, outRows, outCols);
  const k1 = findEmptyRectangle(sheet, outRows, outCols);
  const startRow = k1[0];
  const startCol = k1[1];
  // convert all keys to this new start keys
  var newjson = {};
  keys.forEach(key => {
    console.log("key", key);
    var {row, column} = getA1NotationIndexes(key);
    console.log(row, column, "rowcol");
    console.log(minOutRows, minOutCols, startRow, startCol);
    row = row - minOutRows + startRow;
    col = column - minOutCols + startCol;
    newkey = toA1Notation(col, row);
    newjson[newkey] = json[key];
  });
  return newjson;
}

// function toA1Notation(col, row) {
//   var column = "";
//   while (col > 0) {
//     var remainder = (col - 1) % 26;
//     column = String.fromCharCode(remainder + 65) + column;
//     col = (col - remainder) / 26;
//   }
//   return column + row;
// }

function toA1Notation(col, row) {
  var column = "";
  // console.log(col, row);
  while (col > 0) {
    var remainder = (col - 1) % 26; // Corrected to handle column indexing starting from 0
    column = String.fromCharCode(65 + remainder) + column; // Correct the ASCII conversion
    col = Math.floor((col - 1) / 26); // Update col to move up the "column digits"
  }
  return column + String(row); // Return the column letters combined with the row number
}

// Example usage
// const exampleCells = ['A1', 'B3', 'AD4'];
// const {numRows, numCols, minOutRows, minOutCols} = findSmallestRectangle(exampleCells);
// console.log(numRows, numCols);
// const emptyRectangle = findEmptyRectangle(SpreadsheetApp.getActiveSheet(), numRows, numCols);
// console.log(emptyRectangle);
const examplejson = {
  'A1': 'Hi', 'B3': 'Hello', 'AD4': 'womp womp'
};
// console.log(convertIndices(SpreadsheetApp.getActiveSheet(), examplejson));