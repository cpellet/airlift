import type { NextPage } from 'next'
import { AppShell, Header, Text, Navbar, Button, Group, AspectRatio } from '@mantine/core';
import { Home, Dashboard, FileText, Search, Route } from 'tabler-icons-react';
import type { SpotlightAction } from '@mantine/spotlight';
import { SpotlightProvider, useSpotlight } from '@mantine/spotlight';
import MapboxMap from "../components/mapbox-map";
import { useState } from 'react';
import Head from 'next/head'
import Image from 'next/image'
import dynamic from 'next/dynamic';
import styles from '../styles/Home.module.css'

const DynamicMapNoSSR = dynamic(() => import('../components/mapbox-map'), {
  ssr: false
});

function SpotlightControl() {
  const spotlight = useSpotlight();
  return (
    <Group position="center">
      <Button onClick={spotlight.openSpotlight}>Open spotlight</Button>
    </Group>
  );
}

const actions: SpotlightAction[] = [
  {
    title: 'Auto Bus',
    description: 'Generate bus routes for this area',
    onTrigger: () => console.log('Home'),
    icon: <Route size={18} />,
  }
];

const HomePage: NextPage = () => {
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
        header={<Header height={"6vh"} p="xs"><Group><Image src="/../public/airlift.png" alt="Airlift logo" width='40px' height='40px' layout="fixed"></Image><Text variant="gradient"
          gradient={{ from: 'cyan', to: 'pink', deg: 45 }}
          size="xl"
          weight={400}>AIRLIFT</Text></Group></Header>}
        styles={(theme) => ({
          main: { backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.colors.gray[0] },
        })}
      >
        {<DynamicMapNoSSR />}
      </AppShell>
    </SpotlightProvider>
  )
}

export default HomePage
