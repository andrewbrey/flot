import cn from 'classnames';
import React from 'react';
import { useStore } from '../store';
import FlotPlaceholder from './FlotPlaceholder';

function FlotEmbed() {
  const [firstLoad, setFirstLoad] = React.useState(false);
  const url = useStore((state) => state.url);
  const childLoading = useStore((state) => state.childLoading);
  const setChildLoading = useStore((state) => state.setChildLoading);

  React.useEffect(() => setFirstLoad(true), []);

  React.useEffect(() => {
    if (url) setChildLoading(true);
  }, [url]);

  const handlOnLoad = () => {
    setChildLoading(false);
  };

  return (
    <React.Fragment>
      {firstLoad && url ? (
        <React.Fragment>
          <iframe
            name="flot-embed"
            src={url}
            className={cn('w-full h-full absolute inset-0 z-10 bg-transparent select-none')}
            allow="autoplay"
            onLoad={handlOnLoad}
          ></iframe>
          <div className={cn('w-full h-full absolute inset-0 z-0 select-none', { hidden: !url || childLoading })}>
            <div className="px-4 pt-2 pb-4 grid place-items-center h-full">
              <div className="max-w-sm mx-auto ">
                <h1 className="text-3xl font-extrabold leading-none text-teal-50 tracking-tight">
                  Something went wrong :(
                </h1>
                <p className="pt-2 text-sm text-teal-200">
                  Double check the address you entered to ensure it's a valid url. Some websites can't be displayed
                  because their settings forbid it.
                </p>
              </div>
            </div>
          </div>
        </React.Fragment>
      ) : (
        <FlotPlaceholder />
      )}
    </React.Fragment>
  );
}

export default FlotEmbed;
