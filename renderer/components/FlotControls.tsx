import { Disclosure, Transition } from '@headlessui/react';
import cn from 'classnames';
import { ipcRenderer as ipc } from 'electron-better-ipc';
import { motion } from 'framer-motion';
import { debounce } from 'lodash';
import React, { ChangeEventHandler, ClipboardEventHandler, KeyboardEventHandler } from 'react';
import { useStore } from '../store';

function FlotControls() {
  const urlInput = React.useRef<HTMLInputElement>(null);
  const opacityInput = React.useRef<HTMLInputElement>(null);

  const [focusVideo, setFocusVideo] = React.useState(false);
  const url = useStore((state) => state.url);
  const opacity = useStore((state) => Math.round(state.opacity * 100));
  const setOpacity = useStore((state) => state.setOpacity);
  const setURL = useStore((state) => state.setUrl);
  const urlLocked = useStore((state) => state.urlLocked);
  const windowActive = useStore((state) => state.windowActive);
  const windowHover = useStore((state) => state.windowHover);
  const childActive = useStore((state) => state.childActive);
  const childHover = useStore((state) => state.childHover);

  React.useEffect(() => {
    if (urlInput.current) urlInput.current.value = url.replace(/^https?:\/\//, '').replace(/\/$/, '');
  }, [url]);

  React.useEffect(() => {
    if (opacityInput.current) opacityInput.current.value = `${opacity}`;
  }, []);

  const updateURL = (nextURL: string) => {
    setFocusVideo(false);
    ipc.callMain('please-disable-video-css');
    setURL(nextURL);
  };

  const handleUrlInputPaste: ClipboardEventHandler<HTMLInputElement> = (e) => {
    updateURL(urlInput.current?.value ?? '');
  };

  const handleUrlInputKeypress: KeyboardEventHandler<HTMLInputElement> = debounce((e) => {
    e.preventDefault();
    updateURL(urlInput.current?.value ?? '');
  }, 750);

  const handleVideoCssChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    if (e.currentTarget.checked) {
      setFocusVideo(true);
      ipc.callMain('please-enable-video-css');
    } else {
      setFocusVideo(false);
      ipc.callMain('please-disable-video-css');
    }
  };

  const handleOpacityChange: ChangeEventHandler<HTMLInputElement> = debounce((e) => {
    setOpacity(e.target.value ?? 100);
  }, 125);

  return (
    <React.Fragment>
      <motion.div
        className="overflow-hidden"
        initial={false}
        animate={{
          height: windowActive || childActive || windowHover || childHover || !url ? 'auto' : 0,
        }}
      >
        <div className="flex bg-teal-900">
          <div className="flex items-center justify-center px-2 ">
            <img
              src="/images/logo/64x64.png"
              alt=""
              aria-hidden
              className="h-10 w-10 object-contain pointer-events-none select-none"
            />
          </div>
          <input
            type="text"
            autoFocus={true}
            name="flot-url"
            id="flot-url"
            spellCheck={false}
            className={cn(
              'flex-1 min-w-0 block w-full pl-2 pr-20 py-2 bg-transparent border-0 sm:text-sm',
              'caret-current placeholder-teal-600 focus:outline-none bg-teal-800',
              'focus:ring-teal-500 focus:ring-inset focus:ring-2',
              { 'text-teal-800 cursor-not-allowed ': urlLocked, 'text-teal-50 ': !urlLocked }
            )}
            placeholder="Enter a website to flōt..."
            disabled={urlLocked}
            onPaste={handleUrlInputPaste}
            onKeyUp={handleUrlInputKeypress}
            ref={urlInput}
          />
        </div>

        <Disclosure as="div" className="relative w-full">
          <Disclosure.Button
            className={cn(
              'px-1.5 py-0.5 text-sm rounded absolute right-3 -top-8 z-10 inline-flex justify-center items-center transition-colors tracking-tighter',
              'bg-teal-900 hover:bg-teal-700 text-teal-300',
              'outline-none border-0 focus-visible:bg-teal-700 focus-visible:ring-2 focus-visible:ring-teal-300'
            )}
          >
            <span className="select-none">Options</span>
          </Disclosure.Button>
          <Transition
            enter="transition duration-75 ease-out"
            enterFrom="-translate-x-full opacity-0"
            enterTo="translate-x-0 opacity-100"
            leave="transition duration-75 ease-in"
            leaveFrom="translate-x-0 opacity-100"
            leaveTo="-translate-x-full opacity-0"
          >
            <Disclosure.Panel className="text-teal-500 bg-teal-900">
              <fieldset className="space-y-4 px-3 py-4">
                <legend className="sr-only">Options</legend>
                <div className="relative flex flex-col items-start !mt-0">
                  <div className="flex items-center h-5">
                    <input
                      id="frame-opacity-option"
                      aria-describedby="frame-opacity-option-description"
                      name="frame-opacity-option"
                      type="range"
                      min={5}
                      max={95}
                      step={1}
                      defaultValue={opacity}
                      ref={opacityInput}
                      onChange={handleOpacityChange}
                      className=""
                    />
                    <p className="ml-2 select-none">
                      <span>{opacity}</span>
                      <span>%</span>
                    </p>
                  </div>
                  <div className="text-sm">
                    <label htmlFor="frame-opacity-option" className="font-medium text-teal-300 select-none">
                      Window opacity
                    </label>
                    <p id="frame-opacity-option-description" className="select-none">
                      Use the slider to set the opacity of the flōt window
                    </p>
                  </div>
                </div>

                <div className="relative flex flex-col items-start">
                  <div className="flex items-center h-5">
                    <input
                      id="video-focus-option"
                      aria-describedby="video-focus-option-description"
                      name="video-focus-option"
                      type="checkbox"
                      checked={focusVideo}
                      onChange={handleVideoCssChange}
                      className="focus:ring-teal-500 h-4 w-4 text-teal-600 border-0 rounded"
                    />
                    <label htmlFor="video-focus-option" className="ml-2 font-medium text-sm text-teal-300 select-none">
                      Focus video
                    </label>
                  </div>
                  <div className="text-sm">
                    <p id="video-focus-option-description" className="select-none">
                      Add (experimental) styles to the floated page which make videos as large as possible, hiding other
                      content. Does not work on all websites, and resets to "off" when you change websites.
                    </p>
                  </div>
                </div>
              </fieldset>
            </Disclosure.Panel>
          </Transition>
        </Disclosure>
      </motion.div>
    </React.Fragment>
  );
}

export default FlotControls;
