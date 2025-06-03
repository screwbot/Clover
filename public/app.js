document.addEventListener('DOMContentLoaded', () => {
  // DOM elements
  const proxyForm = document.getElementById('proxyForm');
  const urlInput = document.getElementById('urlInput');
  const userAgentSelect = document.getElementById('userAgentSelect');
  const encodeToggle = document.getElementById('encodeToggle');
  const submitBtn = document.getElementById('submitBtn');
  const historyList = document.getElementById('historyList');
  const historySection = document.getElementById('historySection');
  
  // Initial loading of history
  loadHistory();
  
  // Event listeners
  proxyForm.addEventListener('submit', handleProxySubmit);
  
  /**
   * Handle proxy form submission
   * @param {Event} e - The form submit event
   */
  function handleProxySubmit(e) {
    e.preventDefault();
    
    let url = urlInput.value.trim();
    
    // Add https:// if not present
    if (!/^https?:\/\//i.test(url)) {
      url = 'https://' + url;
      urlInput.value = url;
    }
    
    // Get options
    const userAgent = userAgentSelect.value;
    const shouldEncode = encodeToggle.checked;
    
    // Show loading state
    setLoadingState(true);
    
    // Save to history
    saveToHistory(url);
    
    // Create the proxy URL
    let proxyUrl = `/proxy?l=${encodeURIComponent(url)}&ua=${userAgent}`;
    
    // If XOR encoding is enabled, encode the URL
    if (shouldEncode) {
      proxyUrl = `/proxy?l=xor=${encodeUrl(url)}&ua=${userAgent}`;
    }
    
    // Navigate to the proxy URL
    window.location.href = proxyUrl;
  }
  
  /**
   * Set loading state for the submit button
   * @param {boolean} isLoading - Whether the form is loading
   */
  function setLoadingState(isLoading) {
    if (isLoading) {
      submitBtn.innerHTML = '<span class="loading"></span>';
      submitBtn.disabled = true;
    } else {
      submitBtn.innerHTML = '<span class="btn-text">Proxy</span><span class="btn-icon">→</span>';
      submitBtn.disabled = false;
    }
  }
  
  /**
   * Save a URL to the browsing history
   * @param {string} url - The URL to save
   */
  function saveToHistory(url) {
    try {
      // Sanitize URL for display
      const displayUrl = sanitizeUrl(url);
      
      // Get existing history
      const history = JSON.parse(localStorage.getItem('proxyHistory') || '[]');
      
      // Check if URL already exists in history
      const existingIndex = history.findIndex(item => item === displayUrl);
      if (existingIndex !== -1) {
        // Remove it so we can add it to the top
        history.splice(existingIndex, 1);
      }
      
      // Add to beginning of history
      history.unshift(displayUrl);
      
      // Keep only the last 10 items
      const trimmedHistory = history.slice(0, 10);
      
      // Save back to localStorage
      localStorage.setItem('proxyHistory', JSON.stringify(trimmedHistory));
      
      // Update the UI
      loadHistory();
    } catch (error) {
      console.error('Error saving to history:', error);
    }
  }
  
  /**
   * Load browsing history from localStorage
   */
  function loadHistory() {
    try {
      const history = JSON.parse(localStorage.getItem('proxyHistory') || '[]');
      
      // Clear the list
      historyList.innerHTML = '';
      
      // Hide history section if empty
      if (history.length === 0) {
        historySection.style.display = 'none';
        return;
      }
      
      // Show history section
      historySection.style.display = 'block';
      
      // Add each item to the list
      history.forEach(url => {
        const li = document.createElement('li');
        
        const link = document.createElement('a');
        link.href = `#`;
        link.textContent = url;
        link.addEventListener('click', (e) => {
          e.preventDefault();
          urlInput.value = 'https://' + url;
          // Automatically submit the form
          proxyForm.dispatchEvent(new Event('submit'));
        });
        
        li.appendChild(link);
        historyList.appendChild(li);
      });
    } catch (error) {
      console.error('Error loading history:', error);
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
   * Simple XOR encoding for URLs
   * @param {string} input - The string to encode
   * @param {string} key - The key to use for encoding
   * @returns {string} The base64 encoded result
   */
  function encodeUrl(input, key = 'proxy') {
    // XOR encode
    let result = '';
    for (let i = 0; i < input.length; i++) {
      result += String.fromCharCode(input.charCodeAt(i) ^ key.charCodeAt(i % key.length));
    }
    
    // Convert to base64 and make URL-safe
    return btoa(result).replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
  }
});