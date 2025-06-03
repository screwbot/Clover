const url = require('url');

/**
 * Convert a relative URL to an absolute URL
 * @param {string} relativeUrl - The relative URL
 * @param {string} baseUrl - The base URL
 * @returns {string} The absolute URL
 */
function getAbsoluteUrl(relativeUrl, baseUrl) {
  try {
    // If already absolute, return as is
    if (relativeUrl.match(/^https?:\/\//i)) {
      return relativeUrl;
    }
    
    // Handle data URLs
    if (relativeUrl.startsWith('data:')) {
      return relativeUrl;
    }
    
    // Handle protocol-relative URLs
    if (relativeUrl.startsWith('//')) {
      const baseUrlObj = new URL(baseUrl);
      return `${baseUrlObj.protocol}${relativeUrl}`;
    }
    
    // Handle absolute paths
    if (relativeUrl.startsWith('/')) {
      const baseUrlObj = new URL(baseUrl);
      return `${baseUrlObj.protocol}//${baseUrlObj.host}${relativeUrl}`;
    }
    
    // Handle relative paths
    const resolvedUrl = new URL(relativeUrl, baseUrl).href;
    return resolvedUrl;
  } catch (error) {
    console.error('Error resolving URL:', error);
    return relativeUrl; // Return original if resolution fails
  }
}

/**
 * Sanitize a URL for display
 * @param {string} url - The URL to sanitize
 * @returns {string} The sanitized URL
 */
function sanitizeUrl(url) {
  return url
    .replace(/^https?:\/\//i, '')
    .replace(/\/$/, '');
}

/**
 * Store the last visited URLs in local storage
 * @param {string} url - The URL to store
 */
function storeVisitedUrl(url) {
  try {
    const sanitized = sanitizeUrl(url);
    const history = JSON.parse(localStorage.getItem('proxyHistory') || '[]');
    
    // Add URL if not already in history
    if (!history.includes(sanitized)) {
      history.unshift(sanitized);
      // Keep only the last 10 URLs
      if (history.length > 10) {
        history.pop();
      }
      localStorage.setItem('proxyHistory', JSON.stringify(history));
    }
  } catch (error) {
    console.error('Error storing history:', error);
  }
}

module.exports = { getAbsoluteUrl, sanitizeUrl, storeVisitedUrl };