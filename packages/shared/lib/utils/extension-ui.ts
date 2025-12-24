type Data = { [key: string]: number };

// Creates a bar segment for the data visualization
// Each segment represents a percentage value for a specific category
export const createBarSegment = (barContainer: HTMLDivElement, name: string, value: number): void => {
  const segment = document.createElement('div');
  segment.style.width = `${value}%`;
  segment.style.backgroundColor = name === 'left' ? '#00AEF3' : name === 'center' ? '#808080' : '#f44336';
  segment.style.height = '100%';
  segment.title = name;
  segment.innerText = `${value}%`;
  segment.style.display = 'flex';
  segment.style.justifyContent = 'center';
  segment.style.alignItems = 'center';
  barContainer.appendChild(segment);
};

// Creates the actual data visualization
export const createDataBars = (data: Data, targetElement: HTMLElement | null): void => {
  const dataDiv = document.createElement('div');
  const barContainer = document.createElement('div');
  barContainer.style.display = 'flex';
  barContainer.style.height = '20px';
  barContainer.style.border = '1px solid #ccc';
  barContainer.style.borderRadius = '4px';
  barContainer.style.overflow = 'hidden';

  const dataEntries = Object.entries(data);
  dataEntries.forEach(([name, value]) => {
    if (value) {
      createBarSegment(barContainer, name, value);
    }
  });

  dataDiv.style.padding = '10px';
  const bodyStyle = getComputedStyle(document.body);
  const backgroundColor = bodyStyle.backgroundColor || '#f0f0f0';
  dataDiv.style.backgroundColor = backgroundColor;
  dataDiv.appendChild(barContainer);

  if (targetElement) {
    targetElement.style.flexDirection = 'column';
    targetElement.insertAdjacentElement('beforeend', dataDiv);
  } else {
    console.warn('Parent node not found');
  }
};

const getThemeColors = () => {
  const host = window.location.hostname;
  if (host.includes('youtube.com')) {
    return {
      bg: 'var(--yt-spec-badge-chip-background)',
      text: 'var(--yt-spec-text-primary)',
      border: '1px solid var(--yt-spec-10-percent-layer)',
    };
  }
  if (host.includes('twitch.tv')) {
    return {
      bg: 'var(--color-background-button-secondary-default)',
      text: 'var(--color-text-button-secondary)',
      border: '1px solid var(--color-border-base)',
    };
  }
  if (host.includes('facebook.com')) {
    return {
      bg: 'var(--secondary-button-background)',
      text: 'var(--primary-text)',
      border: 'none',
    };
  }
  if (host.includes('twitter.com') || host.includes('x.com')) {
    const bodyStyle = getComputedStyle(document.body);
    return {
      bg: bodyStyle.backgroundColor,
      text: bodyStyle.color,
      border: bodyStyle.color,
    };
  }
  return {
    bg: '#f0f0f0',
    text: '#333',
    border: '1px solid #ccc',
  };
};

export const createDropdown = (text: string, postNode: HTMLElement): void => {
  const toggleButton = document.createElement('button');
  const buttonNode = postNode.parentNode as HTMLElement;
  const theme = getThemeColors();

  const originalDisplay = window.getComputedStyle(postNode).display;

  const buttonTextSpan = document.createElement('span');
  buttonTextSpan.textContent = text;
  const iconContainer = document.createElement('span');

  const dropdownIconSVG = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"><path fill="currentColor" d="M7 10l5 5 5-5z"/></svg>`;
  const dropupIconSVG = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"><path fill="currentColor" d="M7 14l5-5 5 5z"/></svg>`;
  iconContainer.innerHTML = dropdownIconSVG;

  toggleButton.appendChild(iconContainer);
  toggleButton.appendChild(buttonTextSpan);

  Object.assign(toggleButton.style, {
    backgroundColor: theme.bg,
    color: theme.text,
    border: theme.border,
    borderRadius: '9999px',
    cursor: 'pointer',
    padding: '8px 16px',
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '8px',
    fontSize: '14px',
    fontWeight: '600',
    marginBottom: '10px',
  });

  if (buttonNode) {
    buttonNode.style.display = 'flex';
    buttonNode.style.flexDirection = 'column';
    buttonNode.style.alignItems = 'stretch';
  }

  let isHidden = true;
  postNode.style.display = 'none';

  toggleButton.onclick = e => {
    e.preventDefault();
    if (isHidden) {
      postNode.style.display = originalDisplay;
      iconContainer.innerHTML = dropupIconSVG;
    } else {
      postNode.style.display = 'none';
      iconContainer.innerHTML = dropdownIconSVG;
    }
    isHidden = !isHidden;
  };

  buttonNode.insertAdjacentElement('afterbegin', toggleButton);
};

export const createTimeout = (name: string, duration: number): void => {
  const overlay = document.createElement('div');
  overlay.style.position = 'fixed';
  overlay.style.top = '0';
  overlay.style.left = '0';
  overlay.style.width = '100%';
  overlay.style.height = '100%';
  overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
  overlay.style.zIndex = '9999';
  overlay.style.display = 'flex';
  overlay.style.justifyContent = 'center';
  overlay.style.alignItems = 'center';
  overlay.style.color = 'white';
  overlay.style.fontSize = '2rem';

  const styleElement = document.createElement('style');
  styleElement.textContent = `
    a {
      pointer-events: none;
    }`;
  overlay.appendChild(styleElement);

  document.body.style.overflow = 'hidden';

  document.body.appendChild(overlay);

  let remainingTime = duration;
  overlay.innerText = `Access to ${name} is disabled for ${remainingTime} seconds`;

  const interval = setInterval(() => {
    remainingTime -= 1;
    if (remainingTime > 0) {
      overlay.innerText = `Access to ${name} is disabled for ${remainingTime} seconds`;
    } else {
      clearInterval(interval);
      document.body.removeChild(overlay);
      document.body.style.overflow = '';
    }
  }, 1000);
};

// Displays a message when the post limit is reached
export const displayLimitReached = (adjacentElement: HTMLElement, postLimit: number): void => {
  if (document.getElementById('limit-reached-overlay')) {
    return;
  }

  const messageContainer = document.createElement('div');
  messageContainer.id = 'limit-reached-overlay';
  Object.assign(messageContainer.style, {
    position: 'fixed',
    top: '0',
    left: '0',
    width: '100vw',
    height: '100vh',
    backgroundColor: 'rgba(15, 15, 15, 0.85)', // Darker, more cinematic
    backdropFilter: 'blur(12px)', // Blurs the background content
    webkitBackdropFilter: 'blur(12px)',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: '2147483647', // Maximum possible z-index
    color: 'white',
    textAlign: 'center',
    padding: '40px',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
  });

  const messageText = document.createElement('p');
  messageText.innerHTML = `You have hit your set post limit of ${postLimit}`;
  messageText.style.marginBottom = '50px';
  messageContainer.appendChild(messageText);

  const quoteText = document.createElement('blockquote');
  quoteText.style.fontStyle = 'italic';
  quoteText.style.fontSize = '1.2rem';
  quoteText.style.textAlign = 'center';
  quoteText.style.margin = '0 20px';
  quoteText.innerHTML = `  `;
  messageContainer.appendChild(quoteText);

  const citation = document.createElement('cite');
  citation.style.marginTop = '10px';
  citation.style.display = 'block';
  citation.style.fontSize = '1rem';
  citation.style.color = 'rgba(255, 255, 255, 0.8)';
  citation.innerText = ` `;
  messageContainer.appendChild(citation);

  adjacentElement.insertAdjacentElement('beforebegin', messageContainer);
  adjacentElement.style.display = 'none';
};
