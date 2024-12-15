import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { Provider } from "@/components/ui/provider";
import { Theme } from "@chakra-ui/react";
import { Toaster } from "@/components/ui/toaster";
import Head from "next/head";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <Provider themes={["light"]}>
      <Theme appearance="light">
        <Head>
          <title>Invantry</title>
          <meta
            name="description"
            content="Track, Manage, Optimize — All in One Place"
          />
          <link rel="shortcut icon" href="/favicon.ico" type="image/x-icon" />
        </Head>
        <div className="bg-gray-50">
          <Component {...pageProps} />
        </div>
        <Toaster />
      </Theme>
    </Provider>
  );
}
