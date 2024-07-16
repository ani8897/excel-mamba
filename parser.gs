/**
 * Parse LLM response into a JSON object where Key is Cell ID and Value is either a formula or a string.
*/
function ParseResponse(inputString) {
  Logger.log(inputString);
  // Find the starting and ending tags
  const startTag = "{";
  const endTag = "}";
  const startIndex = inputString.indexOf(startTag) + startTag.length; // Start after the tag

  const endIndex = inputString.indexOf(endTag);

  Logger.log("Parsing braces in JSON: " + startIndex + " -> " + endIndex)

  if (startIndex === -1 || endIndex === -1 || startIndex >= endIndex) {
    Logger.log("Invalid JSON structure or missing tags.");
    return [-1,-1];
  }

  // Extract the JSON string
  const jsonString = '{' + inputString.substring(startIndex, endIndex) + '}';
  const remainingString = inputString.substring(0, startIndex);
  // Parse the JSON string into an object
  try {
    const jsonObject = JSON.parse(jsonString);
    Logger.log(jsonObject);
    Object.entries(jsonObject).forEach(([key, value]) => {
      console.log(key, ":", value); // Do something with the key-value pair
    });
    return [jsonObject, remainingString];
  } catch (error) {
    Logger.log("Error parsing JSON: " + error.message);
    return [-1, -1];
  }
}

/**
 * Input: Cell Range.
 * Format data in terms of (key, value) JSON where the key is Cell ID and Value is Cell Content.
 */
function FormatActiveRangeIntoJsonData(range) {
  const values = range.getValues();
  const jsonData = {};
  for (let i = 0; i < values.length; i++) {
    for (let j = 0; j < values[i].length; j++) {
      const cellId = range.getCell(i + 1, j + 1).getA1Notation();      // Get its A1 notation (e.g., "B5")
      jsonData[cellId] = values[i][j];          // Store in JSON format
    }
  }

  return JSON.stringify(jsonData);
}

/**
 * Formats data in terms of (key, value) JSON where the key is Cell ID and Value is Cell Content for the whole sheet.
 */
function FormatSheetIntoJsonData() {
  const sheet = SpreadsheetApp.getActiveSheet();
  const allDataRange = sheet.getDataRange();

  return FormatActiveRangeIntoJsonData(allDataRange);
}

/**
 * Debug formatter used for BB's prompt.
 */
function FormatOnlyHeadersAndColumns(range) {
  const values = range.getValues();
  const jsonData = {};
  for (let i = 0; i < values.length; i++) {
      const cell = range.getCell(i + 1, 1);     // Get the individual cell
      const cellId = cell.getA1Notation();      // Get its A1 notation (e.g., "B5")
      Logger.log(cellId);
      jsonData[cellId] = values[i][0];          // Store in JSON format
  }
  for (let i = 0; i < values[0].length; i++) {
      const cell = range.getCell(1, i + 1);     // Get the individual cell
      const cellId = cell.getA1Notation();      // Get its A1 notation (e.g., "B5")
      Logger.log(cellId);
      jsonData[cellId] = values[0][i];          // Store in JSON format
  }
  return JSON.stringify(jsonData);
}


/**
 * Input: Cell Range.
 * Format data in CSV format.
 */
function FormatIntoCsvData(range) {
  // Get the values in the active range as a 2D array.
  var values = range.getValues();
  
  // // Initialize an empty string to concatenate the values.
  var concatenatedText = '';
  
  // Loop through the values and concatenate them into a single string.
  for (var i = 0; i < values.length; i++) {
    for (var j = 0; j < values[i].length; j++) {
      concatenatedText += values[i][j] + ',';
    }
    concatenatedText += '\n'
  }
  
  // Trim any trailing spaces.
  return concatenatedText.trim();
}
