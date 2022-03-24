import type { NextPage } from 'next'
import { AppShell, Header, Text, Navbar, Group, AspectRatio } from '@mantine/core';
import MapboxMap from "../components/mapbox-map";
import { useState } from 'react';
import Head from 'next/head'
import Image from 'next/image'
import dynamic from 'next/dynamic';
import styles from '../styles/Home.module.css'

const DynamicComponentWithNoSSR = dynamic(() => import('../components/mapbox-map'), {
  ssr: false
});

const Home: NextPage = () => {
  return (
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
      {<DynamicComponentWithNoSSR></DynamicComponentWithNoSSR>}
    </AppShell>
  )
}

export default Home
