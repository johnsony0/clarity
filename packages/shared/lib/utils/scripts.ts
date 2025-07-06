interface FindElementInput {
  type: string;
  selector: string;
  parents?: number;
}

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

const findElements = (node: ParentNode, input: FindElementInput): HTMLElement[] | null => {
  let elements: Element[] = [];
  if (input.type === 'attribute') {
    elements = Array.from(node.querySelectorAll(input.selector));
  }
  const returnElements: HTMLElement[] = elements
    .map(element => {
      let currentElement: ParentNode | Element | null = element;
      for (let i = 0; i < (input.parents || 0); i++) {
        if (currentElement && currentElement.parentNode) {
          currentElement = currentElement.parentNode;
        }
      }
      return currentElement as HTMLElement | null;
    })
    .filter((element): element is HTMLElement => element !== null);
  return returnElements.length > 0 ? returnElements : null;
};

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

export const hideElement = (
  elementInput: FindElementInput | FindElementInput[],
  node?: ParentNode | Document,
): void => {
  const inputs: FindElementInput[] = Array.isArray(elementInput) ? elementInput : [elementInput];
  inputs.forEach(input => {
    waitForElm(node || document, input).then(elm => {
      if (elm) {
        (elm as HTMLElement).style.display = 'none';
      }
    });
  });
};

export const hideElements = (
  elementInput: FindElementInput | FindElementInput[],
  node?: ParentNode | Document,
): void => {
  const inputs: FindElementInput[] = Array.isArray(elementInput) ? elementInput : [elementInput];
  inputs.forEach(input => {
    const elms = findElements(node || document, input);
    elms?.forEach(elm => {
      if (elm) {
        (elm as HTMLElement).style.display = 'none';
      }
    });
  });
};

export const deleteElement = (
  elementInput: FindElementInput | FindElementInput[],
  node?: ParentNode | Document,
): void => {
  const inputs: FindElementInput[] = Array.isArray(elementInput) ? elementInput : [elementInput];
  inputs.forEach(input => {
    waitForElm(node || document, input).then(elm => {
      if (elm) {
        elm.remove();
      }
    });
  });
};
