import { useSpotlight } from '@mantine/spotlight';
import { Menu, Text } from '@mantine/core';

function SpotlightControl() {
    const spotlight = useSpotlight();
    return (
        <Menu.Item onClick={spotlight.openSpotlight} rightSection={<Text color="dimmed" size="xs">Shift + Space </Text>}>See all</Menu.Item>
    );
}

export default SpotlightControl