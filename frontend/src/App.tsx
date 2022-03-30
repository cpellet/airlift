import { AppShell, Menu, Header, Text, Button, Group, Divider, Image, MantineProvider, ColorSchemeProvider, ColorScheme, ActionIcon, useMantineColorScheme } from '@mantine/core';
import { useLocalStorage } from '@mantine/hooks';
import { Search, Route, PlayerPlay, Sun, MoonStars } from 'tabler-icons-react';
import { SpotlightProvider, SpotlightAction } from '@mantine/spotlight';
import './App.css';
import SpotlightControl from './components/spotlight-control';
import MapboxMap from './components/mapbox-map';
import { useEffect, useState } from "react";
import axios from 'axios';
import StatusPanel from './components/status-panel';

async function fetchAirliftServerData(url: string) {
  return axios.get(url).then(function (res) { return res.data; }).catch(function (error) {
    return {};
  });
};

function App() {

  const [serverData, setServerData] = useState({ 'status': 'loading', 'host': '', 'version': 0, 'algos': [{'name':'test', 'description':'null'}]
})

  const [colorScheme, setColorScheme] = useLocalStorage<ColorScheme>({
    key: 'mantine-color-scheme',
    defaultValue: 'light',
  });


  const toggleColorScheme = (value?: ColorScheme) =>
    setColorScheme(value || (colorScheme === 'dark' ? 'light' : 'dark'));

  const dark = colorScheme === 'dark';

  async function setServerState() {
    let serverData = await fetchAirliftServerData("http://localhost:5050/");
    if (Object.keys(serverData).length === 0) {
      setServerData({ 'status': 'error', 'host': '', 'version': 0, 'algos': []});
    } else {
      setServerData({ ...serverData, 'status': 'connected', 'host': 'http://localhost:5050/' });
      loadAlgos();
    }
  }

  async function loadAlgos(){
    let serverAlgos = await fetchAirliftServerData("http://localhost:5050/algos");
    console.log(serverAlgos.algos);
    setServerData({ ...serverData, 'algos': serverAlgos.algos, 'status': 'connected', 'host': 'http://localhost:5050/'});
  }

  useEffect(() => {
    setServerState();
  },[])

  return (
     <ColorSchemeProvider colorScheme={colorScheme} toggleColorScheme={toggleColorScheme}>
      <MantineProvider theme={{ colorScheme }}>
        <SpotlightProvider
          actions={serverData.algos ? serverData.algos?.map((item, index) => ({
            title: 'Auto Bus',
            description: 'Generate bus routes for this area',
            onTrigger: () => console.log('Home'),
            icon: <Route size={18} />,
          })) : []}
          searchIcon={<Search size={18} />}
          searchPlaceholder="Search..."
          shortcut="shift + space"
          nothingFoundMessage="Nothing found..."
        >
          <AppShell
            padding={0}
            header={<Header height={"55px"} p="xs"><Group position="apart"><Group><Image src='/airlift.png' alt="Airlift logo" width='30px' height='30px'></Image><Text variant="gradient"
              gradient={{ from: 'cyan', to: 'pink', deg: 160 }}
              size="xl"
              weight={700}>AIRLIFT</Text></Group><Group><Menu control={<Button leftIcon={<PlayerPlay />} variant="subtle">
                Run algorithm
              </Button>}>
                <Menu.Label>Transportation</Menu.Label>
                {
                  serverData.algos?.map((item, index) => (
                    <Menu.Item icon={<Route size={14} />}>{item.name}</Menu.Item>
                  ))
                }
                <Divider />
                <SpotlightControl />
              </Menu><ActionIcon
                  variant="outline"
                  color={dark ? 'yellow' : 'blue'}
                  onClick={() => toggleColorScheme()}
                  title="Toggle color scheme"
                >
                  {dark ? <Sun size={18} /> : <MoonStars size={18} />}
                </ActionIcon></Group></Group></Header>}
            styles={(theme) => ({
              main: { backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.colors.gray[0] },
            })}
          >
            <MapboxMap theme={colorScheme} /><StatusPanel status={serverData.status} host={serverData.host} version={serverData.version} retry={setServerState} theme={colorScheme}/>
          </AppShell>
        </SpotlightProvider>
      </MantineProvider>
    </ColorSchemeProvider>
  );
}

export default App;
