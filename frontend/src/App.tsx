import { AppShell, Menu, Header, Text, Button, Group, Divider, Drawer, Image, Modal, MantineProvider, ColorSchemeProvider, ColorScheme, ActionIcon } from '@mantine/core';
import { NotificationsProvider, showNotification, updateNotification } from '@mantine/notifications';
import { useLocalStorage } from '@mantine/hooks';
import { Search, Route, PlayerPlay, Sun, MoonStars, Cpu, X, Map, Satellite, ChevronDown } from 'tabler-icons-react';
import { SpotlightProvider } from '@mantine/spotlight';
import './App.css';
import SpotlightControl from './components/spotlight-control';
import MapboxMap from './components/mapbox-map';
import { useEffect, useState } from "react";
import axios from 'axios';
import StatusPanel from './components/status-panel';
import { usePromiseTracker, trackPromise} from 'react-promise-tracker';
import SignalsPanel from './components/signals-panel';

async function fetchAirliftServerData(url: string) {
  return axios.get(url).then(function (res) { return res.data; }).catch(function (error) {
    return {};
  });
};

async function requestAnalysis(){
  showNotification({
    id: 'load-data',
    loading: true,
    title: 'Region analysis',
    message: 'Analysis will start with the selected signals...',
    autoClose: false,
    radius: 'lg',
    disallowClose: true,
  });
  let res = await fetchAirliftServerData('http://localhost:5050/analyze');
  updateNotification({
    id: 'load-data',
    color: 'red',
    title: 'Analysis failed',
    message: 'Could not connect to server',
    icon: <X />,
    autoClose: 2000,
  });
}

const algo_type = {name: '', descr: ''};

function App() {

  const [serverData, setServerData] = useState({
    'status': 'loading', 'host': '', 'version': 0, 'algos': [algo_type]
})

  const [colorScheme, setColorScheme] = useLocalStorage<ColorScheme>({
    key: 'mantine-color-scheme',
    defaultValue: 'light',
  });

  const [drawerOpened, setDrawerOpened] = useState(false);

  const [satDisplay, setSatDisplay] = useState(false);

  const [signalPanelOpened, setSignalPanelOpened] = useState(false);

  const toggleColorScheme = (value?: ColorScheme) =>
    setColorScheme(value || (colorScheme === 'dark' ? 'light' : 'dark'));

  const dark = colorScheme === 'dark';

  async function setServerState() {
    let serverData = await fetchAirliftServerData("http://localhost:5050/");
    if (Object.keys(serverData).length === 0) {
      setServerData({ 'status': 'error', 'host': '', 'version': 0, 'algos': []});
    } else {
      setServerData({ ...serverData, 'status': 'connected', 'host': 'http://localhost:5050/' });
      let serverAlgos = await fetchAirliftServerData("http://localhost:5050/algos");
      setServerData({ ...serverData, 'algos': serverAlgos.algos, 'status': 'connected', 'host': 'http://localhost:5050/' });
    }
  }

  const [selectedAlgo, setAlgo] = useState(algo_type);


  useEffect(() => { 
    setServerState();
  },[])

  const { promiseInProgress } = usePromiseTracker();

  return (
     <ColorSchemeProvider colorScheme={colorScheme} toggleColorScheme={toggleColorScheme}>
      <MantineProvider theme={{ colorScheme }}>
        <NotificationsProvider>
          <SpotlightProvider
            actions={serverData.algos ? serverData.algos?.map((item, index) => ({
              title: item.name,
              description: item.descr,
              onTrigger: () => {
                setAlgo(item);
                setDrawerOpened(true);
              },
              icon: <Route size={18} />,
            })) : []}
            searchIcon={<Search size={18} />}
            searchPlaceholder="Search..."
            shortcut="shift + space"
            nothingFoundMessage="Nothing found..."
          >
            <Drawer
              opened={drawerOpened}
              onClose={() => setDrawerOpened(false)}
              title={<Text size='xl' transform="uppercase">{selectedAlgo.name}</Text>}
              padding="xl"
              size="xl"
            >
              <Text>Configuration:</Text>
              <Button leftIcon={<PlayerPlay />} color="teal" size="lg">
                Run
              </Button>
            </Drawer>
            <AppShell
              padding={0}
              header={<Header height={"55px"} p="xs"><Group position="apart"><Group><Image src='/airlift.png' alt="Airlift logo" width='30px' height='30px'></Image><Text variant="gradient"
                gradient={{ from: 'cyan', to: 'pink', deg: 160 }}
                size="xl"
                weight={700}>AIRLIFT</Text><Menu trigger="click" delay={500} control={<Button variant="subtle">Signals </Button>}>
                  {
                    <>
                      <Menu.Label>Recent</Menu.Label>
                      <Menu.Item
                        onClick={() => {setSignalPanelOpened(true)}}
                        rightSection={
                          <Text size="sm" color="gray">
                            Ctrl+s
                          </Text>
                        }
                      >
                        Search
                      </Menu.Item>
                    </>
                  }
                </Menu></Group><Group><Menu control={<Button leftIcon={<PlayerPlay />} variant="subtle" disabled={serverData.status !== 'connected'}>
                  Run
                </Button>}>
                  <Menu.Label>Transportation</Menu.Label>
                  {
                    serverData.algos?.map((item, index) => (
                      <Menu.Item icon={<Route size={14} />} onClick={() => {
                        setAlgo(item);
                        setDrawerOpened(true);
                      }}>{item.name}</Menu.Item>
                    ))
                  }
                  <Divider />
                  <SpotlightControl />
                </Menu>
                  <Button variant="light" color="green" radius="md" leftIcon={<Cpu size={18} />} loading={promiseInProgress} disabled={serverData.status !== 'connected'} onClick={() => {
                    trackPromise(
                      requestAnalysis()
                    );
                  }}>
                    Analyze
                  </Button>
                  <ActionIcon
                    radius="xl"
                    variant="hover"
                    color='blue'
                    onClick={() => setSatDisplay(!satDisplay)}
                    title="Toggle color scheme"
                  >
                    {satDisplay ? <Satellite size={20} /> : <Map size={20} />}
                  </ActionIcon>
                  <ActionIcon
                    radius="xl"
                    variant="hover"
                    color={dark ? 'yellow' : 'blue'}
                    onClick={() => toggleColorScheme()}
                    title="Toggle color scheme"
                  >
                    {dark ? <Sun size={20} /> : <MoonStars size={20} />}
                  </ActionIcon>
                  </Group></Group></Header>}
              styles={(theme) => ({
                main: { backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.colors.gray[0] },
              })}
            >
              <MapboxMap theme={colorScheme} display={satDisplay}/><StatusPanel status={serverData.status} host={serverData.host} version={serverData.version} retry={setServerState} theme={colorScheme} />
              <Modal
                size={"80vw"}
                opened={signalPanelOpened}
                onClose={() => setSignalPanelOpened(false)}
                title="Search for signals"
              >
                <SignalsPanel/>
              </Modal>
            </AppShell>
          </SpotlightProvider>
        </NotificationsProvider>
      </MantineProvider>
    </ColorSchemeProvider>
  );
}

export default App;
