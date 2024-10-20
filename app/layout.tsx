// Import styles of packages that you've installed.
// All packages except `@mantine/hooks` require styles imports
import '@mantine/core/styles.css';


import { ColorSchemeScript, MantineProvider, createTheme } from '@mantine/core';
import { HeaderMenu, Footer } from '../components';

export const metadata = {
  title: 'My Mantine app',
  description: 'I have followed setup instructions carefully',
};

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
        <HeaderMenu/>
          {children}
          <Footer/>
          </MantineProvider>
      </body>
    </html>
  );
}