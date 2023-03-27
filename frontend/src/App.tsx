import { AppShell, Header, Group, Image, MantineProvider, ColorSchemeProvider, ColorScheme, ActionIcon, ThemeIcon, Tooltip } from '@mantine/core';
import { NotificationsProvider } from '@mantine/notifications';
import { useLocalStorage } from '@mantine/hooks';
import './App.css';
import { useEffect, useState } from "react";
import FlowView from './views/FlowView';
import { IconCodePlus, IconMoonStars, IconPlugConnected, IconPlugConnectedX, IconSun } from '@tabler/icons-react';
import { openSpotlight } from '@mantine/spotlight';
import { AirliftCallable } from './types/AirliftCallable';

function App() {

  const [colorScheme, setColorScheme] = useLocalStorage<ColorScheme>({
    key: 'mantine-color-scheme',
    defaultValue: 'light',
  });

  const [callables, setCallables] = useState<AirliftCallable[]>([]);

  const toggleColorScheme = (value?: ColorScheme) =>
    setColorScheme(value || (colorScheme === 'dark' ? 'light' : 'dark'));

  const dark = colorScheme === 'dark';

  function fetchCallablesFromBackend() {
    fetch('http://localhost:5050/')
      .then(response => response.json())
      .then(data => setCallables(data));
  }

  useEffect(() => {
    fetchCallablesFromBackend();
  }, []);

  return (
    <ColorSchemeProvider colorScheme={colorScheme} toggleColorScheme={toggleColorScheme}>
      <MantineProvider theme={{ colorScheme }}>
        <NotificationsProvider>
          <AppShell
            padding={0}
            header={
              <Header height={"55px"} p="xs" withBorder={false} fixed style={{ backgroundColor: 'transparent' }}>
                <Group position="apart">
                  <Image src={dark ? './airlift-light.svg' : '/airlift.svg'} alt="Airlift logo" width='120px' style={{ paddingLeft: '10px' }} />
                  <Group>
                    <ActionIcon
                      variant="outline"
                      color='blue'
                      onClick={() => openSpotlight()}
                      title="Open Spotlight"
                    >
                      <IconCodePlus />
                    </ActionIcon>
                    <ActionIcon
                      variant="outline"
                      color={dark ? 'yellow' : 'blue'}
                      onClick={() => toggleColorScheme()}
                      title="Toggle color scheme"
                    >
                      {dark ? <IconSun size={18} /> : <IconMoonStars size={18} />}
                    </ActionIcon>
                    <Tooltip label={callables.length > 0 ? 'Connected to backend' : 'Failed to connect to backend'}>
                      <ThemeIcon variant="light" radius="md" size="lg" color={callables.length > 0 ? 'teal' : 'red'}>
                        {callables.length > 0 ? <IconPlugConnected size={18} /> : <IconPlugConnectedX size={18} />}
                      </ThemeIcon>
                    </Tooltip>
                  </Group>
                </Group>
              </Header>}
            styles={(theme) => ({
              main: { backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.colors.gray[0] },
            })}
          >
            <FlowView callables={callables} />
          </AppShell>
        </NotificationsProvider>
      </MantineProvider>
    </ColorSchemeProvider>
  );
}

export default App;
