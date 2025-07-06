type Data = { [key: string]: number };

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

export const createDropdown = (text: string, postNode: HTMLElement): void => {
  const toggleButton = document.createElement('button');
  const buttonNode = postNode.parentNode as HTMLElement;

  const buttonTextSpan = document.createElement('span');
  buttonTextSpan.textContent = text;

  const iconContainer = document.createElement('span');

  toggleButton.appendChild(iconContainer);
  toggleButton.appendChild(buttonTextSpan);

  toggleButton.style.border = '1px solid #ccc';
  toggleButton.style.borderRadius = '8px';
  toggleButton.style.cursor = 'pointer';
  toggleButton.style.padding = '10px';
  toggleButton.style.width = '100%';

  toggleButton.style.display = 'flex';
  toggleButton.style.justifyContent = 'center';
  toggleButton.style.alignItems = 'center';
  toggleButton.style.gap = '8px';

  const bodyStyle = getComputedStyle(document.body);
  const backgroundColor = bodyStyle.backgroundColor || '#f0f0f0';
  const textColor = bodyStyle.color || '#808080';
  toggleButton.style.backgroundColor = backgroundColor;

  const dropdownIconSVG = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="${textColor}" d="M7 10l5 5 5-5z"/></svg>`;
  const dropupIconSVG = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="${textColor}" d="M7 14l5-5 5 5z"/></svg>`;
  iconContainer.innerHTML = dropdownIconSVG;

  buttonNode.style.display = 'flex';
  buttonNode.style.flexDirection = 'column';
  buttonNode.style.alignItems = 'center';

  let isHidden = true;
  postNode.style.display = 'none';

  toggleButton.onclick = () => {
    if (isHidden) {
      postNode.style.display = 'block';
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

export const displayLimitReached = (adjacentElement: HTMLElement, postLimit: number): void => {
  const messageContainer = document.createElement('div');
  messageContainer.style.position = 'fixed';
  messageContainer.style.top = '0';
  messageContainer.style.left = '0';
  messageContainer.style.width = '100%';
  messageContainer.style.height = '100%';
  messageContainer.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
  messageContainer.style.display = 'flex';
  messageContainer.style.flexDirection = 'column';
  messageContainer.style.justifyContent = 'center';
  messageContainer.style.alignItems = 'center';
  messageContainer.style.zIndex = '9999';
  messageContainer.style.color = 'white';
  messageContainer.style.fontSize = '1.5rem';
  messageContainer.style.textAlign = 'center';
  messageContainer.style.padding = '20px';

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
