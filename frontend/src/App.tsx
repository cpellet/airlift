import { AppShell, Menu, Header, Text, Button, Group, Divider, Image } from '@mantine/core';
import { Search, Route, PlayerPlay } from 'tabler-icons-react';
import { SpotlightProvider, SpotlightAction } from '@mantine/spotlight';
import './App.css';
import SpotlightControl from './components/spotlight-control';
import MapboxMap from './components/mapbox-map';
import { useEffect } from "react";
import axios from 'axios';
import StatusPanel from './components/status-panel';

const actions: SpotlightAction[] = [
  {
    title: 'Auto Bus',
    description: 'Generate bus routes for this area',
    onTrigger: () => console.log('Home'),
    icon: <Route size={18} />,
  }
];

async function fetchAirliftServerData(url: string){
  try {
    const result = await axios.get(url);
    return result.data;
  } catch (error) {
    console.error(error);
  }
};

function App() {

  useEffect(() => {
    console.log("App loaded");
    let serverData = fetchAirliftServerData("http://localhost:5050/");
    console.log(serverData);
  })

  return (
    <SpotlightProvider
      actions={actions}
      searchIcon={<Search size={18} />}
      searchPlaceholder="Search..."
      shortcut="shift + space"
      nothingFoundMessage="Nothing found..."
    >
      <AppShell
        padding={0}
        header={<Header height={"6vh"} p="xs"><Group position="apart"><Group><Image src='/airlift.png' alt="Airlift logo" width='30px' height='30px'></Image><Text variant="gradient"
          gradient={{ from: 'cyan', to: 'pink', deg: 45 }}
          size="xl"
          weight={400}>AIRLIFT</Text></Group><Group><Menu control={<Button leftIcon={<PlayerPlay />} variant="subtle">
            Run algorithm
          </Button>}>
            <Menu.Label>Transportation</Menu.Label>
            <Menu.Item icon={<Route size={14} />}>Auto Bus</Menu.Item>
            <Divider />
            <SpotlightControl />
          </Menu><Menu control={<Button variant="subtle">
            Display options
          </Button>}>
              <Menu.Label>Display options go here</Menu.Label>
            </Menu></Group></Group></Header>}
        styles={(theme) => ({
          main: { backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.colors.gray[0] },
        })}
      >
      <>
          <MapboxMap /><StatusPanel />
      </>
      </AppShell>
    </SpotlightProvider>
  );
}

export default App;
