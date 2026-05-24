const OPTIONS = [
  { key: 'hideLeftSidebar',  name: 'Left sidebar',       desc: 'Hides the Home/Popular/News nav',       default: true  },
  { key: 'hideRightSidebar', name: 'Right sidebar',      desc: 'Hides recent posts & community info',   default: true  },
  { key: 'hideTopBar',       name: 'Top navigation bar', desc: 'Hides the Reddit header entirely',      default: false },
  { key: 'hideAds',          name: 'Promoted posts',     desc: 'Hides ads & sponsored content',         default: true  }
];

const container = document.getElementById('toggles');

function updateHideAllState() {
  const allOn = OPTIONS.every(opt => {
    const input = document.querySelector(`input[data-key="${opt.key}"]`);
    return input && input.checked;
  });
  const hideAllInput = document.getElementById('hideAllInput');
  if (hideAllInput) hideAllInput.checked = allOn;
}

chrome.storage.sync.get(null, (stored) => {
  const settings = {};
  // Hide All row
  const hideAllRow = document.createElement('label');
  hideAllRow.className = 'toggle-row hide-all-row';
  hideAllRow.innerHTML = `
    <div class="toggle-label">
      <div class="name">Hide all</div>
      <div class="desc">Toggle everything at once</div>
    </div>
    <div class="switch">
      <input type="checkbox" id="hideAllInput" />
      <span class="slider"></span>
    </div>
  `;
  container.appendChild(hideAllRow);

  hideAllRow.querySelector('input').addEventListener('change', e => {
    const checked = e.target.checked;
    const update = {};
    OPTIONS.forEach(opt => {
      update[opt.key] = checked;
      const input = document.querySelector(`input[data-key="${opt.key}"]`);
      if (input) input.checked = checked;
    });
    chrome.storage.sync.set(update);
  });

  // Divider
  const divider = document.createElement('div');
  divider.style.cssText = 'height:1px;background:#1f1f1f;margin:0 16px;';
  container.appendChild(divider);

  OPTIONS.forEach(opt => {
    const row = document.createElement('label');
    row.className = 'toggle-row';
    row.innerHTML = `
      <div class="toggle-label">
        <div class="name">${opt.name}</div>
        <div class="desc">${opt.desc}</div>
      </div>
      <div class="switch">
        <input type="checkbox" data-key="${opt.key}" ${settings[opt.key] ? 'checked' : ''} />
        <span class="slider"></span>
      </div>
    `;
    container.appendChild(row);
    row.querySelector('input').addEventListener('change', e => {
      chrome.storage.sync.set({ [opt.key]: e.target.checked });
      updateHideAllState();
    });
  });

  updateHideAllState();

  if (Object.keys(stored).length === 0) chrome.storage.sync.set(settings);
});

document.getElementById('reloadBtn').addEventListener('click', () => {
  chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
    if (tabs[0]) chrome.tabs.reload(tabs[0].id);
  });
});
