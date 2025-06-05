/**
 * Simple XOR encoding/decoding function for URLs
 * @param {string} input - The string to encode/decode
 * @param {string} key - The key to use for encoding/decoding (default: 'proxy')
 * @returns {string} The encoded/decoded string
 */
function xorEncode(input, key = 'cloverontop') {
  let result = '';
  for (let i = 0; i < input.length; i++) {
    result += String.fromCharCode(input.charCodeAt(i) ^ key.charCodeAt(i % key.length));
  }
  return result;
}

/**
 * Encode a URL using XOR and convert to Base64
 * @param {string} url - The URL to encode
 * @returns {string} The encoded URL
 */
function encodeUrl(url) {
  const xorEncoded = xorEncode(url);
  return Buffer.from(xorEncoded).toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
}

/**
 * Decode a Base64 and XOR encoded URL
 * @param {string} encoded - The encoded URL
 * @returns {string} The decoded URL
 */
function decodeUrl(encoded) {
  const base64 = encoded.replace(/-/g, '+').replace(/_/g, '/');
  const xorEncoded = Buffer.from(base64, 'base64').toString();
  return xorEncode(xorEncoded);
}

/**
 * Create a proxied URL
 * @param {string} baseUrl - The base URL of the proxy server
 * @param {string} targetUrl - The target URL to proxy
 * @returns {string} The proxied URL
 */
function createProxyUrl(baseUrl, targetUrl) {
  const encoded = encodeUrl(targetUrl);
  return `${baseUrl}/proxy?l=xor=${encoded}`;
}

module.exports = { encodeUrl, decodeUrl, createProxyUrl };