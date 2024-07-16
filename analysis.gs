/**
 * Fill expected cells with formula/text.
 */
function fillAnalysis(sheet, resultJson) {
  final_text = ""
  Object.entries(resultJson).forEach(([key, value]) => {
    Logger.log("Setting " + key + " with " + value); // Do something with the key-value pair
    const cell = sheet.getRange(key); // Get the cell using A1 notation
    if (isFormula(value)) {
      cell.setFormula(value);

    } else {
      cell.setValue(value);
    }
  });
}

/**
 * Helper function to detect whether a string is a formula or not.
 */
function isFormula(value) {
  return value.startsWith("=");
}
