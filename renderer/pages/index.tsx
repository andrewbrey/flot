import cn from 'classnames';
import Head from 'next/head';
import React from 'react';
import FlotBar from '../components/FlotBar';
import FlotControls from '../components/FlotControls';
import FlotEmbed from '../components/FlotEmbed';
import { useStore } from '../store';

const magicHeight = 'max-h-[calc(100%-0px)]';

function PageHome() {
  const url = useStore((state) => state.url);
  const storeOpacity = useStore((state) => state.opacity);

  const [opacity, setOpactity] = React.useState(1);

  React.useEffect(() => setOpactity(storeOpacity), [storeOpacity]);

  return (
    <React.Fragment>
      <Head>
        <title>Flōt | {url}</title>
      </Head>
      <header className="h-8 relative">
        <FlotBar />
      </header>
      <main className="flex-grow flex flex-col overflow-auto">
        <section className="w-full">
          <FlotControls />
        </section>
        <section
          className={cn('flex-grow relative bg-teal-900/95 overflow-hidden', magicHeight)}
          style={{ opacity: url ? opacity : 1 }}
        >
          <FlotEmbed />
        </section>
      </main>
    </React.Fragment>
  );
}

export default PageHome;
