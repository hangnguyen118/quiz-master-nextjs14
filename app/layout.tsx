"use client"
import '@mantine/core/styles.css';
import { ColorSchemeScript, MantineProvider, createTheme } from '@mantine/core';
import { HeaderMenu, Footer } from '../_components';
import { store } from "@/_lib/redux/store";
import { Provider } from 'react-redux'
const theme = createTheme({
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <ColorSchemeScript />
      </head>
      <body>
        <MantineProvider theme={theme} defaultColorScheme="light">
          <Provider store={store}>
            <HeaderMenu/>
            <main style={{ minHeight: '100vh' }}>
              {children}
            </main>
            <Footer />
          </Provider>
        </MantineProvider>
      </body>
    </html>
  );
}