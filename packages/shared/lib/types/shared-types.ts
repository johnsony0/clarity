export type ValueOf<T> = T[keyof T];

// Define types for settings and configs

type FindElementInput = {
  type: string;
  selector: string;
  parents?: number;
};

export type Settings = { [key: string]: any };
export type PlatformConfig = {
  mainContainer: FindElementInput;
  postContainer: FindElementInput[];
  messageContainer: FindElementInput;
  otherContainers: { [key: string]: FindElementInput[] };
  others: {
    exempt: string;
    createTimeout: {
      selector: string;
      text: string;
    };
  };
  onOpen: {
    General: {
      url: string;
      hideElement: { [key: string]: FindElementInput | FindElementInput[] };
    };
    Navigation: {
      url: string;
      hideElement: { [key: string]: FindElementInput | FindElementInput[] };
    };
    Home: {
      url: string;
      hideElement: { [key: string]: FindElementInput | FindElementInput[] };
    };
    Pages: {
      url: string;
      hideElement: { [key: string]: FindElementInput | FindElementInput[] };
    };
    Extras: {
      url: string;
      hideElement: { [key: string]: FindElementInput | FindElementInput[] };
    };
  };
  onPost: {
    hideElement: { [key: string]: FindElementInput | FindElementInput[] };
    hideElements: { [key: string]: FindElementInput | FindElementInput[] };
  };
};
