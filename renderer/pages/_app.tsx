import type { AppProps } from 'next/app';
import React from 'react';
import { useStore } from '../store';
import '../styles/globals.css';

function MyApp({ Component, pageProps }: AppProps) {
  React.useEffect(() => {
    const onFocus = () => useStore.setState({ windowActive: true });
    const onBlur = () => useStore.setState({ windowActive: false });
    const onMouseenter = () => useStore.setState({ windowHover: true });
    const onMouseleave = () => useStore.setState({ windowHover: false });
    const onMsg = (event: MessageEvent) => {
      try {
        const { key = 'UNKNOWN', msg = 'UNKNOWN' } = event.data;

        switch (key) {
          case 'location':
            if (typeof window !== 'undefined') localStorage.setItem('flot-last-url', msg);
            break;
          case 'active':
            useStore.setState({ childActive: msg });
            break;
          case 'hover':
            useStore.setState({ childHover: msg });
            break;
          default:
            console.log(`unknown iframe message with key [${key}] and msg [${msg}]`);
            break;
        }
      } catch (error) {
        console.error(error);
      }
    };

    window.addEventListener('focus', onFocus);
    window.addEventListener('blur', onBlur);
    window.addEventListener('message', onMsg);

    document.addEventListener('mouseenter', onMouseenter);
    document.addEventListener('mouseleave', onMouseleave);

    return function removeListeners() {
      window.removeEventListener('focus', onFocus);
      window.removeEventListener('blur', onBlur);
      window.removeEventListener('message', onMsg);

      document.removeEventListener('mouseenter', onMouseenter);
      document.removeEventListener('mouseleave', onMouseleave);
    };
  }, []);

  return (
    <React.Fragment>
      <Component {...pageProps} />
    </React.Fragment>
  );
}

export default MyApp;
