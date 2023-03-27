import { ActionIcon, Flex, Paper, Popover, Space, Stack, Text, Tooltip } from "@mantine/core";
import { Prism } from "@mantine/prism";
import { IconCode } from "@tabler/icons-react";
import { useState } from "react";
import { Handle, Position } from "reactflow";
import { colorForType } from "../../types/AirliftCallable";



export default function AirliftNode({ icon, title, fieldnames, fieldtypes }: any) {
    const [codeOpened, setCodeOpened] = useState(false);
    const [codeData, setCodeData] = useState("");

    function fetchCodeFromBackend() {
        fetch('http://localhost:5050/callables/source/' + title)
            .then(response => response.text())
            .then(data => setCodeData(data));
    }

    return (
        <>
            <Paper withBorder style={{ paddingRight: 10, paddingTop: 10 }} component="div">
                <div style={{ paddingLeft: 20 }}>
                    <Flex justify="space-between" align="center" gap='xs'>
                        {icon}
                        <Text fz="sm" fw={500}>{title}</Text>
                    </Flex>
                    <Space h="lg" />
                    <Stack spacing="xs" justify="space-around" align="flex-end">
                        {fieldnames.map((e: string, i: number) => <Tooltip label={e + ' : ' + fieldtypes[i]} color={colorForType(fieldtypes[i])}><Text fz="xs" key={e}>{e}</Text></Tooltip>)}
                    </Stack>
                </div>
                <Popover opened={codeOpened} onChange={setCodeOpened} width="600px" position="bottom">
                    <Popover.Target>
                        <ActionIcon radius="xs" color="dark" onClick={(e) => { e.stopPropagation(); fetchCodeFromBackend(); setCodeOpened((o) => !o) }}>
                            <IconCode size={12} />
                        </ActionIcon>
                    </Popover.Target>
                    <Popover.Dropdown><Prism language="python">{codeData}</Prism></Popover.Dropdown>
                </Popover>
            </Paper>
            {fieldnames.map((e: string, i: number) => <Handle type="source" position={Position.Right} id={e} key={e} style={{ top: `${61.5 + i * 28}px`, backgroundColor: `${colorForType(fieldtypes[i])}` }} />)}
        </>
    )
}