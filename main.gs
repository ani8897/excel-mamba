/**
 * Upskill your sheet skills with Mamba mentality.
 * 
 * @param {string} Prompt by user.
 * @return Response from the Jamba model
 * @customfunction
 */

function onOpen() { // This runs when the spreadsheet is opened
  SpreadsheetApp.getUi() // Create a custom menu
      .createMenu('ExcelMamba')
      .addItem('Analyze Sheet', 'excelMambaMenuHandler')
      .addToUi();
}

function excelMambaMenuHandler() { // This is the menu item's handler
  const prompt = Browser.inputBox("ExcelMamba", "Enter your analysis prompt:", Browser.Buttons.OK_CANCEL);

  if (prompt === "cancel") { 
    return; // User cancelled
  }

  const sheet = SpreadsheetApp.getActiveSheet();

  // Rest of your logic remains the same (format data, construct prompt, make API call, parse response, fill analysis)
  const jsonString = FormatSheetIntoJsonData();

  const messages = constructChatMessage(jsonString, prompt);
  const result = makeApiCall(messages);
  var [resultJson, explanation] = ParseResponse(result);
  
  if (resultJson == "-1") {
    SpreadsheetApp.getUi().alert("Error: womp womp"); 
  } else {
    resultJson = convertIndices(sheet, resultJson);
    fillAnalysis(sheet, resultJson);
  }

  // explanation = explanation.replace("\n", "<br>");
  var html = HtmlService.createHtmlOutputFromFile('sidebar')
      .setContent(explanation);
  SpreadsheetApp.getUi() // Or DocumentApp or SlidesApp or FormApp.
      .showSidebar(html);
}

function ExcelMamba(prompt="What is the average buy price per unit?") {
  Logger.log("Requesting prompt: " + prompt);

  const sheet = SpreadsheetApp.getActiveSheet();
  
  // Format data.
  const jsonString = FormatSheetIntoJsonData();
  Logger.log("Selected range: " + jsonString);

  // Construct Prompt and append data.
  const messages = constructChatMessage(jsonString, prompt);

  // Make API call.
  const result = makeApiCall(messages);

  // Parse Response, segmented into analysis and accompanied with a formula
  const [resultJson, explanation] = ParseResponse(result);

  if (resultJson == "-1") {
    return "womp womp";
  }
  fillAnalysis(sheet, resultJson);
}
