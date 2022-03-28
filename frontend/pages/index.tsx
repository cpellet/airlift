import type { NextPage } from 'next'
import { AppShell, Menu, Header, Text, Navbar, Button, Group, AspectRatio, Divider } from '@mantine/core';
import { Search, Route, PlayerPlay } from 'tabler-icons-react';
import type { SpotlightAction } from '@mantine/spotlight';
import { SpotlightProvider, useSpotlight } from '@mantine/spotlight';
import MapboxMap from "../components/mapbox-map";
import { useState } from 'react';
import Head from 'next/head'
import Image from 'next/image'
import dynamic from 'next/dynamic';
import styles from '../styles/Home.module.css'
import SpotlightControl from '../components/spotlight/spotlight-control';
import axios from 'axios';
import { APIService } from '../api/ApiService';

const DynamicMapNoSSR = dynamic(() => import('../components/mapbox-map'), {
  ssr: false
});


const actions: SpotlightAction[] = [
  {
    title: 'Auto Bus',
    description: 'Generate bus routes for this area',
    onTrigger: () => console.log('Home'),
    icon: <Route size={18} />,
  }
];

const HomePage: NextPage = (airliftServer) => {
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
        header={<Header height={"6vh"} p="xs"><Group position="apart"><Group><Image src="/../public/airlift.png" alt="Airlift logo" width='40px' height='40px' layout="fixed"></Image><Text variant="gradient"
          gradient={{ from: 'cyan', to: 'pink', deg: 45 }}
          size="xl"
          weight={400}>AIRLIFT</Text></Group><Group><Menu control={<Button leftIcon={<PlayerPlay />} variant="subtle">
            Run algorithm
          </Button>}>
            <Menu.Label>Transportation</Menu.Label>
            <Menu.Item icon={<Route size={14} />}>Auto Bus</Menu.Item>
            <Divider />
            <SpotlightControl/>
          </Menu><Menu control={<Button variant="subtle">
            Display options
          </Button>}>
              <Menu.Label>Display options go here</Menu.Label>
            </Menu></Group></Group></Header>}
        styles={(theme) => ({
          main: { backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.colors.gray[0] },
        })}
      >
        {<DynamicMapNoSSR />}
      </AppShell>
    </SpotlightProvider>
  )
}

HomePage.getInitialProps = async () => {
  const service = new APIService("http://localhost:5050");
  service.initialise();
  return {};
}


export default HomePage
