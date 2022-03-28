import { useSpotlight } from '@mantine/spotlight';
import { Menu } from '@mantine/core';

function SpotlightControl() {
    const spotlight = useSpotlight();
    return (
        <Menu.Item onClick={spotlight.openSpotlight}>See all</Menu.Item>
    );
}

export default SpotlightControl