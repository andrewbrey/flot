import Document, {
  DocumentContext,
  Head,
  Html,
  Main,
  NextScript,
} from "next/document";

class FlotDocument extends Document {
  static async getInitialProps(ctx: DocumentContext) {
    const initialProps = await Document.getInitialProps(ctx);
    return { ...initialProps };
  }

  render() {
    return (
      <Html className="h-full w-full selection:bg-teal-700 selection:text-teal-100">
        <script
          dangerouslySetInnerHTML={{
            __html: "var global = globalThis;",
          }}
        />
        <Head />
        <body className="h-full w-full">
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default FlotDocument;
