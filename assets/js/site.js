(function () {
  const root = document.documentElement;
  const themeToggle = document.querySelector('[data-theme-toggle]');
  const mobileNavToggle = document.querySelector('.mobile-nav-toggle');
  const navLinks = document.querySelector('.nav-links');

  // ==========================================================================
  // Theme Management
  // ==========================================================================
  const setTheme = (theme) => {
    root.setAttribute('data-theme', theme);
    localStorage.setItem('preferred-theme', theme);
  };

  const toggleTheme = () => {
    const current = root.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    setTheme(next);
  };

  if (themeToggle) {
    themeToggle.addEventListener('click', toggleTheme);
  }

  // ==========================================================================
  // Mobile Navigation
  // ==========================================================================
  if (mobileNavToggle && navLinks) {
    mobileNavToggle.addEventListener('click', () => {
      navLinks.classList.toggle('active');
    });
  }

  // ==========================================================================
  // Author Highlight in Publications
  // ==========================================================================
  const highlightAuthorName = () => {
    const authorElements = document.querySelectorAll('.authors');
    authorElements.forEach(el => {
      const text = el.innerHTML;
      // Highlight "Feng H" or "Huazhuo Feng"
      el.innerHTML = text.replace(/(Feng H|Huazhuo Feng)/g, '<span class="author-highlight">$1</span>');
    });
  };
  highlightAuthorName();

  // ==========================================================================
  // Sidebar Search Initialization
  // ==========================================================================
  if (window.SimpleJekyllSearch && document.getElementById('search-input')) {
    SimpleJekyllSearch({
      searchInput: document.getElementById('search-input'),
      resultsContainer: document.getElementById('results-container'),
      json: '/search.json',
      searchResultTemplate: '<li><a href="{url}">{title}</a> <span style="font-size:0.8em;color:var(--muted)">({date})</span></li>',
      noResultsText: '<li style="color:var(--muted)">No posts found</li>',
      limit: 5
    });
  }

  // ==========================================================================
  // Command Palette (Ctrl/Cmd + P)
  // ==========================================================================
  const searchModal = document.getElementById('search-modal');
  const modalInput = document.getElementById('modal-search-input');
  
  if (searchModal && modalInput && window.SimpleJekyllSearch) {
    // Init Search for Modal
    SimpleJekyllSearch({
      searchInput: modalInput,
      resultsContainer: document.getElementById('modal-results-container'),
      json: '/search.json',
      searchResultTemplate: '<li><a href="{url}">{title}</a> <span style="font-size:0.8em;color:var(--muted)">({date})</span></li>',
      noResultsText: '<li style="padding:1rem;color:var(--muted)">No results found</li>',
      limit: 10
    });

    // Toggle Modal
    const toggleModal = (show) => {
      if (show) {
        searchModal.classList.remove('hidden');
        // Slight delay to allow display:block to apply before adding class for transition
        requestAnimationFrame(() => {
          searchModal.classList.add('open');
          modalInput.focus();
        });
      } else {
        searchModal.classList.remove('open');
        setTimeout(() => {
          searchModal.classList.add('hidden');
        }, 200); // Match transition duration
      }
    };

    // Keyboard Shortcuts
    document.addEventListener('keydown', (e) => {
      // Toggle on Ctrl+P or Cmd+P
      if ((e.ctrlKey || e.metaKey) && e.key === 'p') {
        e.preventDefault();
        e.stopPropagation(); // Stop event from bubbling
        const isOpen = searchModal.classList.contains('open');
        toggleModal(!isOpen);
        return false; // Legacy way to prevent default
      }
      // Close on Esc
      if (e.key === 'Escape' && searchModal.classList.contains('open')) {
        toggleModal(false);
      }
    });

    // Close on backdrop click
    searchModal.addEventListener('click', (e) => {
      if (e.target === searchModal) {
        toggleModal(false);
      }
    });
  }

  // ==========================================================================
  // AI Chat Widget (DeepSeek)
  // ==========================================================================
  const chatFab = document.getElementById('chat-fab');
  const chatWidget = document.getElementById('chat-widget');
  const closeChatBtn = document.getElementById('close-chat');
  const chatInput = document.getElementById('chat-input');
  const sendChatBtn = document.getElementById('send-chat');
  const chatMessages = document.getElementById('chat-messages');
  
  // New UI Elements
  const resizeBtn = document.getElementById('chat-resize-btn');
  const settingsBtn = document.getElementById('chat-settings-btn');
  const authOverlay = document.getElementById('chat-auth-overlay');
  const authTabs = document.querySelectorAll('.auth-tab');
  const authPanels = document.querySelectorAll('.auth-panel');
  const authSaveBtn = document.getElementById('auth-save-btn');
  const authCancelBtn = document.getElementById('auth-cancel-btn');
  const vipInput = document.getElementById('vip-password-input');
  const apiKeyInput = document.getElementById('api-key-input');

  // Configuration
  // IMPORTANT: Replace this with your actual Cloudflare Worker URL after deployment
  const WORKER_URL = 'deepseek-proxy.doctorfhz.workers.dev';  
  
  // State
  let userAuth = {
    type: 'guest', // 'guest', 'vip', 'apikey'
    value: null
  };

  if (chatFab && chatWidget) {
    // 1. Toggle Chat
    const toggleChat = () => {
      chatWidget.classList.toggle('hidden');
      if (!chatWidget.classList.contains('hidden')) {
        setTimeout(() => chatInput.focus(), 100);
      }
    };

    chatFab.addEventListener('click', toggleChat);
    closeChatBtn.addEventListener('click', toggleChat);

    // 2. Resize Chat
    resizeBtn.addEventListener('click', () => {
      chatWidget.classList.toggle('expanded');
    });

    // 3. Settings / Auth Overlay
    const toggleAuthOverlay = (show) => {
      if (show) {
        authOverlay.classList.remove('hidden');
        // Pre-fill if exists
        if (userAuth.type === 'vip') vipInput.value = userAuth.value;
        if (userAuth.type === 'apikey') apiKeyInput.value = userAuth.value;
      } else {
        authOverlay.classList.add('hidden');
      }
    };

    settingsBtn.addEventListener('click', () => toggleAuthOverlay(true));
    authCancelBtn.addEventListener('click', () => toggleAuthOverlay(false));

    // Auth Tabs Logic
    authTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        // Switch Tabs
        authTabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        
        // Switch Panels
        const target = tab.dataset.tab;
        authPanels.forEach(p => p.classList.remove('active'));
        document.getElementById(`auth-panel-${target}`).classList.add('active');
      });
    });

    // Save Auth
    authSaveBtn.addEventListener('click', () => {
      const activeTab = document.querySelector('.auth-tab.active').dataset.tab;
      
      if (activeTab === 'vip') {
        const pass = vipInput.value.trim();
        if (pass) {
          userAuth = { type: 'vip', value: pass };
          toggleAuthOverlay(false);
          // Optional: Retry last message if needed
        }
      } else {
        const key = apiKeyInput.value.trim();
        if (key) {
          userAuth = { type: 'apikey', value: key };
          toggleAuthOverlay(false);
        }
      }
    });

    // 4. Chat Logic
    const appendMessage = (role, text) => {
      const msgDiv = document.createElement('div');
      msgDiv.className = `message ${role === 'user' ? 'user-message' : 'ai-message'}`;
      
      const contentDiv = document.createElement('div');
      contentDiv.className = 'message-content';
      
      if (role === 'ai') {
        contentDiv.innerHTML = typeof marked !== 'undefined' ? marked.parse(text) : `<p>${text}</p>`;
      } else {
        contentDiv.textContent = text;
      }
      
      msgDiv.appendChild(contentDiv);
      chatMessages.appendChild(msgDiv);
      chatMessages.scrollTop = chatMessages.scrollHeight;
    };

    const handleSend = async () => {
      const text = chatInput.value.trim();
      if (!text) return;

      chatInput.value = '';
      appendMessage('user', text);

      // Loading State
      const loadingId = 'loading-' + Date.now();
      const loadingDiv = document.createElement('div');
      loadingDiv.className = 'message ai-message';
      loadingDiv.id = loadingId;
      loadingDiv.innerHTML = `<div class="message-content"><p>Thinking...</p></div>`;
      chatMessages.appendChild(loadingDiv);
      chatMessages.scrollTop = chatMessages.scrollHeight;

      try {
        // Prepare Headers
        const headers = { 'Content-Type': 'application/json' };
        if (userAuth.type === 'vip') {
          headers['Authorization'] = `Password ${userAuth.value}`;
        } else if (userAuth.type === 'apikey') {
          headers['Authorization'] = `Bearer ${userAuth.value}`;
        }

        const response = await fetch(WORKER_URL, {
          method: 'POST',
          headers: headers,
          body: JSON.stringify({
            messages: [
              { role: "system", content: "You are a helpful AI assistant." },
              { role: "user", content: text }
            ]
          })
        });

        // Handle Errors (Rate Limit etc)
        if (response.status === 403 || response.status === 401) {
          const errData = await response.json();
          document.getElementById(loadingId).remove();
          appendMessage('ai', `⚠️ ${errData.error}`);
          // Auto-open auth overlay
          setTimeout(() => toggleAuthOverlay(true), 1000);
          return;
        }

        if (!response.ok) throw new Error('API Error');

        // Handle Stream
        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let aiText = '';
        
        // Replace loading with empty message to stream into
        document.getElementById(loadingId).remove();
        const msgDiv = document.createElement('div');
        msgDiv.className = 'message ai-message';
        const contentDiv = document.createElement('div');
        contentDiv.className = 'message-content';
        msgDiv.appendChild(contentDiv);
        chatMessages.appendChild(msgDiv);

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          
          const chunk = decoder.decode(value);
          const lines = chunk.split('\n');
          
          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const data = line.slice(6);
              if (data === '[DONE]') break;
              try {
                const parsed = JSON.parse(data);
                const delta = parsed.choices[0].delta.content || '';
                aiText += delta;
                contentDiv.innerHTML = typeof marked !== 'undefined' ? marked.parse(aiText) : `<p>${aiText}</p>`;
                chatMessages.scrollTop = chatMessages.scrollHeight;
              } catch (e) {
                // ignore parse errors for partial chunks
              }
            }
          }
        }

      } catch (error) {
        console.error(error);
        const loadingEl = document.getElementById(loadingId);
        if (loadingEl) loadingEl.remove();
        appendMessage('ai', 'Sorry, I encountered an error. Please check your connection or try again.');
      }
    };

    sendChatBtn.addEventListener('click', handleSend);
    
    chatInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSend();
      }
    });
  }

})();
