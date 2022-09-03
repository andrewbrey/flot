import {
  BrowserWindow,
  BrowserWindowConstructorOptions,
  Rectangle,
  screen,
} from "electron";
import Store from "electron-store";

interface WindowState {
  x: number;
  y: number;
  width: any;
  height: any;
}

export default (
  windowName: string,
  options: BrowserWindowConstructorOptions
): BrowserWindow => {
  const key = "window-state";
  const name = `window-state-${windowName}`;
  const defaultState: WindowState = {
    x: 0,
    y: 0,
    width: options.width ?? 600,
    height: options.height ?? 400,
  };
  const store = new Store<WindowState>({
    name,
    defaults: { ...defaultState },
  });

  let state = {};
  let win: BrowserWindow | undefined;

  const restore = (): WindowState => store.get(key, { ...defaultState });

  const getCurrentPosition = (): WindowState => {
    const position = win?.getPosition() ?? [0, 0];
    const size = win?.getSize() ?? [defaultState.width, defaultState.height];
    return {
      x: position[0],
      y: position[1],
      width: size[0],
      height: size[1],
    };
  };

  const windowWithinBounds = (windowState: WindowState, bounds: Rectangle) => {
    return (
      windowState.x >= bounds.x &&
      windowState.y >= bounds.y &&
      windowState.x + windowState.width <= bounds.x + bounds.width &&
      windowState.y + windowState.height <= bounds.y + bounds.height
    );
  };

  const resetToDefaults = (): WindowState => {
    const bounds = screen.getPrimaryDisplay().bounds;
    return Object.assign({}, defaultState, {
      x: (bounds.width - defaultState.width) / 2,
      y: (bounds.height - defaultState.height) / 2,
    });
  };

  const ensureVisibleOnSomeDisplay = (windowState: WindowState) => {
    const visible = screen.getAllDisplays().some((display) => {
      return windowWithinBounds(windowState, display.bounds);
    });
    if (!visible) {
      // Window is partially or fully not visible now.
      // Reset it to safe defaults.
      return resetToDefaults();
    }
    return windowState;
  };

  const saveState = () => {
    if (!win?.isMinimized() && !win?.isMaximized()) {
      Object.assign(state, getCurrentPosition());
    }
    store.set(key, state);
  };

  state = ensureVisibleOnSomeDisplay(restore());

  const browserOptions: BrowserWindowConstructorOptions = {
    ...options,
    ...state,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      ...options.webPreferences,
    },
  };
  win = new BrowserWindow(browserOptions);

  win.on("close", saveState);

  return win;
};
