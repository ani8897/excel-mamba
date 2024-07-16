/**
 * Make API call to Jamba.
 */
function makeJambaApiCall(messages, max_tokens=4096, temperature=0.0) {
  const apiKey = "<API-KEY>"
  const data = {
    "model": 'jamba-instruct-preview',
    "messages": messages,
    "temperature": temperature,
    "max_tokens": max_tokens,
    "n": 1,
    "top_p": 1.0,
    "frequency_penalty": 0.0,
    "presence_penalty": 0.0,
  };

  const options = {
    'method' : 'post',
    'contentType': 'application/json',
    'payload' : JSON.stringify(data),
    'muteHttpExceptions': true,
    'headers': {
      Authorization: 'Bearer ' + apiKey,
    },
  };
  const response = UrlFetchApp.fetch(
    'https://api.ai21.com/studio/v1/chat/completions',
    options
  );

  Logger.log("API response: " + response.getContentText());

  return JSON.parse(response.getContentText())['choices'][0]['message']['content'];
}