// List of common user agents for spoofing
const userAgents = {
  chrome: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
  firefox: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:89.0) Gecko/20100101 Firefox/89.0',
  safari: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.1.1 Safari/605.1.15',
  edge: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36 Edg/91.0.864.59',
  ios: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Mobile/15E148 Safari/604.1',
  android: 'Mozilla/5.0 (Linux; Android 11; Pixel 5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.210 Mobile Safari/537.36'
};

/**
 * Get a user agent for the request
 * @param {string} userAgent - The user agent type or custom string
 * @returns {string} The user agent string to use
 */
function getUserAgent(userAgent = 'chrome') {
  // If a known user agent type, return the predefined one
  if (userAgents[userAgent.toLowerCase()]) {
    return userAgents[userAgent.toLowerCase()];
  }
  
  // If a full user agent string is provided, return it
  if (userAgent.length > 20) {
    return userAgent;
  }
  
  // Default to Chrome
  return userAgents.chrome;
}

/**
 * Get the list of available user agent options
 * @returns {Object} The list of user agent options
 */
function getUserAgentOptions() {
  return Object.keys(userAgents).reduce((acc, key) => {
    acc[key] = userAgents[key].split(' ')[0].replace('Mozilla/5.0', key);
    return acc;
  }, {});
}

module.exports = { getUserAgent, getUserAgentOptions };