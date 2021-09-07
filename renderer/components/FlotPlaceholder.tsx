import cn from 'classnames';
import React from 'react';
import { useStore } from '../store';

function FlotPlaceholder() {
  return (
    <React.Fragment>
      <aside className="h-full relative overflow-auto">
        <div className={cn('w-full h-full absolute inset-0 z-0')}>
          <div className="px-4 pt-7 pb-4 grid place-items-center h-full select-none">
            <div className="max-w-sm mx-auto ">
              <h1 className="text-3xl font-extrabold leading-none text-teal-50 tracking-tight">
                Enter a website and enjoy your flōt!
              </h1>
              <p className="pt-2 text-sm text-teal-200">
                Use the options to control the opacity of the flōted content. When Flōt is not the active window, only
                the flōted website will be displayed!
              </p>
              <p className="pt-6 pb-4 text-sm text-teal-500">
                <span className="font-black">Note:</span> some websites can't be loaded with Flōt as the website itself
                must permit being displayed as embedded content. If a page fails to load, check if the site specifies an
                "embed" version of the address.
              </p>
            </div>
          </div>
        </div>
      </aside>
    </React.Fragment>
  );
}

export default FlotPlaceholder;
