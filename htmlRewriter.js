const cheerio = require('cheerio');
const { createProxyUrl } = require('./urlEncoder');
const { getAbsoluteUrl } = require('./utils');

function rewriteHtml(html, baseUrl) {
  try {
    const $ = cheerio.load(html);
    const proxyBase = '/proxy?l=';
    
    // Fix base URL for the page
    if (!$('base').length) {
      $('head').prepend(`<base href="${baseUrl}">`);
    }
    
    // Rewrite links
    $('a').each((i, el) => {
      const href = $(el).attr('href');
      if (href && !href.startsWith('#') && !href.startsWith('javascript:')) {
        const absoluteUrl = getAbsoluteUrl(href, baseUrl);
        $(el).attr('href', `${proxyBase}${encodeURIComponent(absoluteUrl)}`);
        // Add target attribute to open in the same window
        $(el).attr('target', '_self');
      }
    });
    
    // Rewrite form actions
    $('form').each((i, el) => {
      const action = $(el).attr('action');
      if (action) {
        const absoluteUrl = getAbsoluteUrl(action, baseUrl);
        $(el).attr('action', `${proxyBase}${encodeURIComponent(absoluteUrl)}`);
      }
    });
    
    // Rewrite images
    $('img').each((i, el) => {
      const src = $(el).attr('src');
      if (src) {
        const absoluteUrl = getAbsoluteUrl(src, baseUrl);
        $(el).attr('src', `${proxyBase}${encodeURIComponent(absoluteUrl)}`);
      }
    });
    
    // Rewrite CSS links
    $('link[rel="stylesheet"]').each((i, el) => {
      const href = $(el).attr('href');
      if (href) {
        const absoluteUrl = getAbsoluteUrl(href, baseUrl);
        $(el).attr('href', `${proxyBase}${encodeURIComponent(absoluteUrl)}`);
      }
    });
    
    // Rewrite script sources
    $('script').each((i, el) => {
      const src = $(el).attr('src');
      if (src) {
        const absoluteUrl = getAbsoluteUrl(src, baseUrl);
        $(el).attr('src', `${proxyBase}${encodeURIComponent(absoluteUrl)}`);
      }
    });
    
    // Add proxy info banner
    $('body').prepend(`
      <div id="proxy-banner" style="position:fixed;top:0;left:0;right:0;background:#10B981;color:white;z-index:9999;padding:8px;font-family:system-ui,-apple-system,sans-serif;display:flex;justify-content:space-between;align-items:center;">
        <span>Proxied by Clover: ${baseUrl}</span>
        <button onclick="document.getElementById('proxy-banner').style.display='none'" style="background:none;border:none;color:white;cursor:pointer;font-size:16px;">×</button>
      </div>
    `);
    
    return $.html();
  } catch (error) {
    console.error('Error rewriting HTML:', error);
    return html;
  }
}

module.exports = { rewriteHtml };