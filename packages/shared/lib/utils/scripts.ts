type FindElementInput = {
  type: string;
  selector: string;
  parents?: number;
};

// hide all images and videos in a node
export const hideVideosPhotos = (node: ParentNode): void => {
  const imgs = node.querySelectorAll('img');
  const videos = node.querySelectorAll('video');
  const images = node.querySelectorAll('image');

  images.forEach((image: SVGImageElement) => {
    image.style.display = 'none';
  });

  imgs.forEach((img: HTMLImageElement) => {
    img.style.display = 'none';
  });

  videos.forEach((video: HTMLVideoElement) => {
    video.style.display = 'none';
  });
};

const muteLoop = (selector: string, maxAttempts: number) => {
  let attempts = 0;
  const initialPath = window.location.pathname;
  const intervalId = setInterval(() => {
    if (window.location.pathname !== initialPath) {
      clearInterval(intervalId);
      console.log('Mute loop stopped: Page navigated away.');
      return;
    }
    const videoElement = document.querySelector(selector);
    if (videoElement instanceof HTMLVideoElement) {
      videoElement.muted = true;
    }
    if (attempts >= maxAttempts) {
      clearInterval(intervalId);
      return;
    }
    attempts++;
  }, 100);
};

// finds a single element in a node based on the input criteria
export const findElement = (node: ParentNode, input: FindElementInput): HTMLElement | null => {
  let element: Element | null = null;
  if (input.type === 'attribute' || input.type === 'image') {
    element = node.querySelector(input.selector);
    if (node instanceof Element && node.matches(input.selector)) {
      element = node;
    }
  } else if (input.type === 'class') {
    element = node.querySelector(`.${input.selector.split(' ').join('.')}`);
  } else if (input.type === 'text') {
    element =
      Array.from(node.querySelectorAll('*')).find((el: Element) =>
        Array.from(el.childNodes).some(
          (child: ChildNode) => child.nodeType === Node.TEXT_NODE && child.nodeValue?.trim() === input.selector,
        ),
      ) || null;
  } else if (input.type === 'id') {
    element = document.getElementById(input.selector);
  }

  let currentElement: ParentNode | Element | null = element;
  for (let i = 0; i < (input.parents || 0); i++) {
    if (currentElement && currentElement.parentNode) {
      currentElement = currentElement.parentNode;
    }
  }

  return currentElement as HTMLElement | null;
};

// finds multiple elements in a node based on the input criteria
export const findElements = async (node: ParentNode, input: FindElementInput): Promise<HTMLElement[] | null> => {
  return waitForElm(node, input)
    .then(() => {
      let elements: HTMLElement[] = [];
      if (input.type === 'attribute') {
        elements = Array.from(node.querySelectorAll(input.selector));
      } else {
        elements = Array.from(node.querySelectorAll(input.selector));
      }
      const returnElements = elements
        .map(element => {
          let currentElement: ParentNode | Element | null = element;
          for (let i = 0; i < (input.parents || 0); i++) {
            if (currentElement && currentElement.parentNode) {
              currentElement = currentElement.parentNode;
            } else {
              currentElement = null;
              break;
            }
          }
          return currentElement as HTMLElement | null;
        })
        .filter((element): element is HTMLElement => element !== null);
      return returnElements.length > 0 ? returnElements : null;
    })
    .catch(err => {
      console.error('Error in findElements:', err);
      return null;
    });
};

// waits for an element to appear in the DOM based on the input criteria
export function waitForElm(node: ParentNode | Document, input: FindElementInput): Promise<HTMLElement | null> {
  return new Promise(resolve => {
    const elm = findElement(node, input);
    if (elm) {
      return resolve(elm);
    }
    const observer = new MutationObserver(() => {
      const elm = findElement(node, input);
      if (elm) {
        clearTimeout(timeoutId);
        observer.disconnect();
        resolve(elm);
      }
    });

    const timeoutId = setTimeout(() => {
      observer.disconnect();
      resolve(null);
    }, 5000);

    observer.observe(node instanceof Node ? node : document, {
      childList: true,
      subtree: true,
    });
  });
}

// hide an element if we find it in the DOM
export const hideElement = (
  elementInput: FindElementInput | FindElementInput[],
  node?: ParentNode | Document,
): void => {
  const inputs: FindElementInput[] = Array.isArray(elementInput) ? elementInput : [elementInput];
  inputs.forEach(input => {
    waitForElm(node || document, input).then(elm => {
      if (elm) {
        if (input.selector === '[data-a-target="front-page-carousel"]' || input.selector === '[class="home"]') {
          console.log('starts mute loop');
          muteLoop('video[playsinline]', 50);
        }
        (elm as HTMLElement).style.display = 'none';
      }
    });
  });
};

// hide multiple elements if we find them in the DOM
export const hideElements = (
  elementInput: FindElementInput | FindElementInput[],
  node?: ParentNode | Document,
): void => {
  const inputs: FindElementInput[] = Array.isArray(elementInput) ? elementInput : [elementInput];
  inputs.forEach(input => {
    findElements(node || document, input).then(elms => {
      elms?.forEach(elm => {
        if (elm) {
          (elm as HTMLElement).style.display = 'none';
        }
      });
    });
  });
};

// delete an element if we find it in the DOM
export const deleteElement = (
  elementInput: FindElementInput | FindElementInput[],
  node?: ParentNode | Document,
): void => {
  const inputs: FindElementInput[] = Array.isArray(elementInput) ? elementInput : [elementInput];

  inputs.forEach(input => {
    waitForElm(node || document, input).then(elm => {
      if (elm) elm.remove();
    });
  });
};

// delete an element if we find it in the DOM
export const deleteElements = (
  elementInput: FindElementInput | FindElementInput[],
  node?: ParentNode | Document,
): void => {
  const inputs: FindElementInput[] = Array.isArray(elementInput) ? elementInput : [elementInput];

  inputs.forEach(input => {
    findElements(node || document, input).then(elms => {
      elms?.forEach(elm => {
        if (elm) {
          elm.remove();
        }
      });
    });
  });
};
