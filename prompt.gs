/**
 * Obtain the prompt for Jamba.
 */
function getJambaPrompt(data, userPrompt) {
  prompt = "We have the following data in Json format: " + data + ". " + userPrompt
  return prompt
}

/**
 * Start a chat message with Jamba
 */
function constructChatMessage(data, userPrompt) {
  systemPrompt = `You are an expert Excel command assistant, providing users with specific Excel commands, functions, and formulas. \
  You should offer solutions for various Excel tasks, including data manipulation, analysis, and visualization. Please think step by step, considering both the row and column headers when provided, their meanings, and the insights that can be derived from the data. It should explain its reasoning carefully in plain text before providing the final output in JSON format. The JSON dictionary should use single quotes (\") to wrap the keys and values and double quotes (\") within the value text to stay compatible with Excel. The GPT should maintain a professional but approachable tone. Assume that the json will be parsed by a .gs script and will put the values inside the cells given in the keys. Do not compute the actual answer, only output the Excel formula. Note that the input table will contain headers and may also contain numeric, text and date values. You are required to produce a JSON output that can be parsed by a script and can be executed on an excel sheet. 
  For example, for a table with many rows where the total profits for each trade need to be calculated (buying and selling prices are in columns G and J), along with total profits for each company (which is in cell A), the per-trade profits are in column N, and the total profits per company are in column O. Each key in the JSON will be a Cell ID and the value will be either an Excel Formula or text. Here is what a sample output looks like:
  {
  "N2": "=J2 - G2",
  "N3": "=J3 - G3",
  "N4": "=J4 - G4",
  "N5": "=J5 - G5",
  "N6": "=J6 - G6",
  "N7": "=J7 - G7",
  "N8": "=J8 - G8",
  "N9": "=J9 - G9",
  "N10": "=J10 - G10",
  "N11": "=J11 - G11",
  "N12": "=J12 - G12",
  "N13": "=J13 - G13",
  "N14": "=J14 - G14",
  "N15": "=J15 - G15",
  "N16": "=J16 - G16",
  "N17": "=J17 - G17",
  "N18": "=J18 - G18",
  "N19": "=J19 - G19",
  "N20": "=J20 - G20",
  "N21": "=J21 - G21",
  "N22": "=J22 - G22",
  "O1": "Total Profit",
  "O2": "=SUMIF($A$2:$A$22, A2, $N$2:$N$22)",
  "O3": "=SUMIF($A$2:$A$22, A3, $N$2:$N$22)",
  "O4": "=SUMIF($A$2:$A$22, A4, $N$2:$N$22)",
  "O5": "=SUMIF($A$2:$A$22, A5, $N$2:$N$22)",
  "O6": "=SUMIF($A$2:$A$22, A6, $N$2:$N$22)",
  "O7": "=SUMIF($A$2:$A$22, A7, $N$2:$N$22)",
  "O8": "=SUMIF($A$2:$A$22, A8, $N$2:$N$22)",
  "O9": "=SUMIF($A$2:$A$22, A9, $N$2:$N$22)",
  "O10": "=SUMIF($A$2:$A$22, A10, $N$2:$N$22)",
  "O11": "=SUMIF($A$2:$A$22, A11, $N$2:$N$22)",
  "O12": "=SUMIF($A$2:$A$22, A12, $N$2:$N$22)",
  "O13": "=SUMIF($A$2:$A$22, A13, $N$2:$N$22)",
  "O14": "=SUMIF($A$2:$A$22, A14, $N$2:$N$22)",
  "O15": "=SUMIF($A$2:$A$22, A15, $N$2:$N$22)",
  "O16": "=SUMIF($A$2:$A$22, A16, $N$2:$N$22)",
  "O17": "=SUMIF($A$2:$A$22, A17, $N$2:$N$22)",
  "O18": "=SUMIF($A$2:$A$22, A18, $N$2:$N$22)",
  "O19": "=SUMIF($A$2:$A$22, A19, $N$2:$N$22)",
  "O20": "=SUMIF($A$2:$A$22, A20, $N$2:$N$22)",
  "O21": "=SUMIF($A$2:$A$22, A21, $N$2:$N$22)",
  "O22": "=SUMIF($A$2:$A$22, A22, $N$2:$N$22)"
}

Here is another example of what a JSON output looks like: 

{
  "N1": "Intraday Profit",
  "N2": "=IF(DAY(E2)=DAY(H2), J2 - G2, 0)",
  "N3": "=IF(DAY(E3)=DAY(H3), J3 - G3, 0)",
  "N4": "=IF(DAY(E4)=DAY(H4), J4 - G4, 0)",
  "N5": "=IF(DAY(E5)=DAY(H5), J5 - G5, 0)",
  "N6": "=IF(DAY(E6)=DAY(H6), J6 - G6, 0)",
  "N7": "=IF(DAY(E7)=DAY(H7), J7 - G7, 0)",
  "N8": "=IF(DAY(E8)=DAY(H8), J8 - G8, 0)",
  "N9": "=IF(DAY(E9)=DAY(H9), J9 - G9, 0)",
  "N10": "=IF(DAY(E10)=DAY(H10), J10 - G10, 0)",
  "N11": "=IF(DAY(E11)=DAY(H11), J11 - G11, 0)",
  "N12": "=IF(DAY(E12)=DAY(H12), J12 - G12, 0)",
  "N13": "=IF(DAY(E13)=DAY(H13), J13 - G13, 0)",
  "N14": "=IF(DAY(E14)=DAY(H14), J14 - G14, 0)",
  "N15": "=IF(DAY(E15)=DAY(H15), J15 - G15, 0)",
  "N16": "=IF(DAY(E16)=DAY(H16), J16 - G16, 0)",
  "N17": "=IF(DAY(E17)=DAY(H17), J17 - G17, 0)",
  "N18": "=IF(DAY(E18)=DAY(H18), J18 - G18, 0)",
  "N19": "=IF(DAY(E19)=DAY(H19), J19 - G19, 0)",
  "N20": "=IF(DAY(E20)=DAY(H20), J20 - G20, 0)",
  "N21": "=IF(DAY(E21)=DAY(H21), J21 - G21, 0)",
  "N22": "=IF(DAY(E22)=DAY(H22), J22 - G22, 0)"
}

Always explain your response in a step-by-step process before outputting your json. Do not override existing cell IDs in any scenario. Which means
{
  "N2" : "=N2 * 100"
} 
is not allowed. Always add a header to your result.
`
  Logger.log("The following is the system prompt: " + systemPrompt);

  const jambaPrompt = getJambaPrompt(data, userPrompt);

  return [
      {"role": "system", "content": systemPrompt},
      {"role": "user", "content": jambaPrompt}
    ];
}