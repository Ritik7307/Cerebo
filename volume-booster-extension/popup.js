document.addEventListener('DOMContentLoaded', () => {
  const slider = document.getElementById('volume-slider');
  const display = document.getElementById('volume-display');

  // Load saved volume
  chrome.storage.local.get(['volume'], (result) => {
    if (result.volume !== undefined) {
      slider.value = result.volume;
      display.textContent = result.volume + '%';
    }
  });

  slider.addEventListener('input', (e) => {
    const val = e.target.value;
    display.textContent = val + '%';
    
    // Save state
    chrome.storage.local.set({ volume: val });

    // Send to current tab
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]) {
        // Send to all frames in the tab
        chrome.tabs.sendMessage(tabs[0].id, {
          type: 'SET_VOLUME',
          value: val / 100
        }, { frameId: 0 }, () => {
           // We might get an error if content script is not loaded, ignore it.
           if (chrome.runtime.lastError) {}
        });
        
        // Broadcast to all frames (since YouTube is an iframe)
        // Chrome API sendMessage without frameId targets the main frame, 
        // but we can execute a script to broadcast or just query all frames.
        chrome.webNavigation?.getAllFrames({ tabId: tabs[0].id }, (frames) => {
          if (frames) {
            frames.forEach(frame => {
              chrome.tabs.sendMessage(tabs[0].id, {
                type: 'SET_VOLUME',
                value: val / 100
              }, { frameId: frame.frameId }, () => {
                if (chrome.runtime.lastError) {}
              });
            });
          }
        });
      }
    });
  });
});
