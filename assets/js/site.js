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

  const DEEPSEEK_API_KEY = 'sk-efb48b37dd1649f0bf72838ab86b63f5';
  const API_URL = 'https://api.deepseek.com/chat/completions';

  if (chatFab && chatWidget) {
    // Toggle Chat
    const toggleChat = () => {
      chatWidget.classList.toggle('hidden');
      if (!chatWidget.classList.contains('hidden')) {
        setTimeout(() => chatInput.focus(), 100);
      }
    };

    chatFab.addEventListener('click', toggleChat);
    closeChatBtn.addEventListener('click', toggleChat);

    // Append Message
    const appendMessage = (role, text) => {
      const msgDiv = document.createElement('div');
      msgDiv.className = `message ${role === 'user' ? 'user-message' : 'ai-message'}`;
      
      const contentDiv = document.createElement('div');
      contentDiv.className = 'message-content';
      
      if (role === 'ai') {
        // Parse Markdown for AI
        contentDiv.innerHTML = typeof marked !== 'undefined' ? marked.parse(text) : `<p>${text}</p>`;
      } else {
        contentDiv.textContent = text;
      }
      
      msgDiv.appendChild(contentDiv);
      chatMessages.appendChild(msgDiv);
      chatMessages.scrollTop = chatMessages.scrollHeight;
    };

    // Send Message to API
    const handleSend = async () => {
      const text = chatInput.value.trim();
      if (!text) return;

      // Clear input and show user message
      chatInput.value = '';
      appendMessage('user', text);

      // Show loading state
      const loadingId = 'loading-' + Date.now();
      const loadingDiv = document.createElement('div');
      loadingDiv.className = 'message ai-message';
      loadingDiv.id = loadingId;
      loadingDiv.innerHTML = `<div class="message-content"><p>Thinking...</p></div>`;
      chatMessages.appendChild(loadingDiv);
      chatMessages.scrollTop = chatMessages.scrollHeight;

      try {
        const response = await fetch(API_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${DEEPSEEK_API_KEY}`
          },
          body: JSON.stringify({
            model: "deepseek-chat",
            messages: [
              { role: "system", content: "You are a helpful AI assistant for Huazhuo Feng's academic website." },
              { role: "user", content: text }
            ],
            stream: false
          })
        });

        if (!response.ok) throw new Error('API Error');

        const data = await response.json();
        const reply = data.choices[0].message.content;

        // Remove loading and show reply
        document.getElementById(loadingId).remove();
        appendMessage('ai', reply);

      } catch (error) {
        console.error(error);
        document.getElementById(loadingId).remove();
        appendMessage('ai', 'Sorry, I encountered an error. Please try again later.');
      }
    };

    sendChatBtn.addEventListener('click', handleSend);
    
    // Handle Enter to send
    chatInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSend();
      }
    });
  }

})();
