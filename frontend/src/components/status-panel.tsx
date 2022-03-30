import * as React from 'react';
import { Text, Loader, ThemeIcon, Tooltip, Button } from '@mantine/core'
import { Check, X } from 'tabler-icons-react';


function DisplayElements(props: any) {
    if (props.status === "loading") {
        return (
            <>
                <Loader className="status-panel-component" size="xs" variant="dots" color="orange" />
                <Text className="status-panel-component" size="xs" weight={500} color="orange" align="center">Waiting to connect</Text>
            </>
        )
    } else if (props.status === "connected") {
        return (
            <>
                <ThemeIcon className='center-vert' variant="light" radius="xl" color="green" size="xs">
                    <Check />
                </ThemeIcon>
                <Text className="status-panel-component" size="xs" weight={500} color="green" align="center">Connected to {props.host}</Text>
            </>
        )
    } else if (props.status === "error") {
        return (
            <>
                <ThemeIcon className='center-vert' variant="light" radius="xl" color="red" size="xs">
                    <X />
                </ThemeIcon>
                <Text className="status-panel-component" size="xs" weight={500} color="red" align="center">Could not connect to server</Text>
                <Button variant="subtle" radius="md" size="xs" compact>
                    Try again
                </Button>
            </>
        )
    } else{
        return (<p>Error</p>);
    }
}


class StatusPanel extends React.Component<any, any>{

    click = () => {
        this.props.retry();
    }
    
    render(): React.ReactNode {
        return (
            <div className="status-panel-container">
                <Tooltip
                    label={'Server version: ' + this.props.version}
                    radius="md"
                    withArrow
                    onClick={this.click}
                    disabled={this.props.status !== "connected"}
                    className={this.props.theme === 'light' ? "status-panel" : "status-panel dark"}
                >
                    <DisplayElements status={this.props.status} host={this.props.host} />
                </Tooltip>
            </div>
        );
    }
}

export default React.memo(StatusPanel);