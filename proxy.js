const fetch = require('node-fetch');
const { encodeUrl, decodeUrl } = require('./urlEncoder');
const { rewriteHtml } = require('./htmlRewriter');
const { getUserAgent } = require('./userAgentSpoofing');

/**
 * Proxy a request to a target URL
 * @param {string} url - The URL to proxy
 * @param {string} userAgent - User agent to use for the request
 * @param {boolean} rewriteContent - Whether to rewrite HTML content
 * @returns {Object} The response data and content type
 */
async function proxyRequest(url, userAgent, rewriteContent = true) {
  try {
    // Decode URL if it's encoded
    const decodedUrl = url.includes('xor=') ? decodeUrl(url.split('xor=')[1]) : url;
    
    // Prepare headers
    const headers = {
      'User-Agent': getUserAgent(userAgent),
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
      'Accept-Language': 'en-US,en;q=0.5',
      'Connection': 'keep-alive',
      'Upgrade-Insecure-Requests': '1',
      'Pragma': 'no-cache',
      'Cache-Control': 'no-cache',
    };

    // Fetch the target URL
    const response = await fetch(decodedUrl, { headers });
    const contentType = response.headers.get('content-type') || 'text/plain';
    
    // Handle different content types
    if (contentType.includes('text/html') && rewriteContent) {
      const html = await response.text();
      const rewrittenHtml = rewriteHtml(html, decodedUrl);
      return { data: rewrittenHtml, contentType };
    } else {
      // For non-HTML content, pass through as-is
      const buffer = await response.buffer();
      return { data: buffer, contentType };
    }
  } catch (error) {
    console.error('Error proxying request:', error);
    throw error;
  }
}

module.exports = { proxyRequest };