// Reddit Minimizer - content.js
// Injects/removes styles based on stored settings

const STYLE_ID = 'reddit-minimizer-styles';

const STYLES = {
  hideLeftSidebar: `
    /* Hide left sidebar / nav drawer */
    #left-sidebar-container,
    [data-testid="left-sidebar"],
    .left-sidebar-container,
    reddit-sidebar-nav,
    shreddit-sidebar,
    #secondary-nav,
    nav[aria-label="Main navigation"],
    .nav-menu-container,
    faceplate-nav-grid > *:first-child {
      display: none !important;
    }
    /* Expand main feed to fill the space */
    main, [data-testid="main-content"], .main-container, shreddit-feed {
      margin-left: 0 !important;
      padding-left: 16px !important;
    }
  `,
  hideRightSidebar: `
    /* Hide right sidebar */
    #right-sidebar-container,
    [data-testid="right-sidebar"],
    .right-sidebar-container,
    aside,
    .sidebar,
    reddit-sidebar,
    shreddit-right-sidebar,
    [data-redditstyle="true"] aside {
      display: none !important;
    }
  `,
  hideSearchBorder: `
    /* Remove the bright orange search bar border/ring */
    #search-bar, 
    [data-testid="search-bar"],
    search-dynamic-id-cache-controller,
    .search-bar,
    shreddit-search-input,
    faceplate-search-input,
    input[name="q"],
    #searchbox,
    [class*="search"] input,
    [class*="SearchInput"],
    [id*="search"] input {
      outline: none !important;
      border-color: transparent !important;
      box-shadow: none !important;
    }
    shreddit-search-input::part(input),
    faceplate-search-input::part(input) {
      outline: none !important;
      border-color: #333 !important;
      box-shadow: none !important;
    }
    /* Target the orange ring wrapper */
    [class*="search-bar"] [class*="ring"],
    [class*="SearchBar"] [class*="ring"],
    [class*="search-container"] {
      outline: none !important;
      box-shadow: none !important;
    }
  `,
  hideTopBar: `
    /* Hide the top navigation bar */
    header,
    [data-testid="reddit-header"],
    .header-container,
    shreddit-header,
    reddit-header-large,
    #masthead,
    #header {
      display: none !important;
    }
    body, html {
      padding-top: 0 !important;
      margin-top: 0 !important;
    }
  `,
  hideAds: `
    /* Hide promoted/ad posts */
    [data-testid*="promoted"],
    [data-promoted="true"],
    shreddit-ad-post,
    [promotedlink],
    div[data-ipstype],
    [class*="promoted"],
    .promotedlink {
      display: none !important;
    }
  `
};

function applySettings(settings) {
  // Remove existing style tag
  const existing = document.getElementById(STYLE_ID);
  if (existing) existing.remove();

  // Build combined CSS from active settings
  let css = '';
  for (const [key, value] of Object.entries(settings)) {
    if (value && STYLES[key]) {
      css += STYLES[key];
    }
  }

  if (css) {
    const style = document.createElement('style');
    style.id = STYLE_ID;
    style.textContent = css;
    document.head.appendChild(style);
  }
}

// Load settings from storage and apply on page load
chrome.storage.sync.get(null, (settings) => {
  applySettings(settings);
});

// Listen for changes from the popup
chrome.storage.onChanged.addListener((changes, area) => {
  if (area === 'sync') {
    chrome.storage.sync.get(null, (settings) => {
      applySettings(settings);
    });
  }
});
