import { AppShell, Header, Group, Image, MantineProvider, ColorSchemeProvider, ColorScheme } from '@mantine/core';
import { NotificationsProvider } from '@mantine/notifications';
import { useLocalStorage } from '@mantine/hooks';
import './App.css';
import { useState } from "react";
import FlowView from './views/FlowView';

function App() {

  const [colorScheme, setColorScheme] = useLocalStorage<ColorScheme>({
    key: 'mantine-color-scheme',
    defaultValue: 'light',
  });

  const toggleColorScheme = (value?: ColorScheme) =>
    setColorScheme(value || (colorScheme === 'dark' ? 'light' : 'dark'));

  const dark = colorScheme === 'dark';

  return (
     <ColorSchemeProvider colorScheme={colorScheme} toggleColorScheme={toggleColorScheme}>
      <MantineProvider theme={{ colorScheme }}>
        <NotificationsProvider>
          <AppShell
              padding={0}
              header={
                <Header height={"55px"} p="xs">
                  <Group position="apart">
                      <Image src={dark ? './airlift-light.svg' : '/airlift.svg'} alt="Airlift logo" width='120px' style={{paddingLeft:'10px'}} />
                  </Group>
                </Header>}
              styles={(theme) => ({
                main: { backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.colors.gray[0] },
              })}
            >
              <FlowView />
            </AppShell>
        </NotificationsProvider>
      </MantineProvider>
    </ColorSchemeProvider>
  );
}

export default App;
