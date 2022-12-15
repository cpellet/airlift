import { Group, Text, useMantineTheme } from '@mantine/core';
import { Dropzone, FileWithPath } from '@mantine/dropzone';
import { applyNodeChanges, Background, Controls, Node, NodeChange, ReactFlow } from 'reactflow';
import 'reactflow/dist/style.css';
import { IconUpload, IconX, IconFile3d, IconCheck } from '@tabler/icons';
import { showNotification } from '@mantine/notifications';
import Papa from 'papaparse';
import { useCallback, useMemo, useState } from 'react';
import InputNode from '../components/nodes/InputNode';

export default function FlowView(){

    const theme = useMantineTheme();

    const nodeTypes = useMemo(() => ({inputNode: InputNode}), []);

    const [dropActive, setDropActive] = useState(true);

    const initialNodes: Node[] = [
    {
        id: '1',
        data: { label: 'Hello' },
        position: { x: 300, y: 100 },
        type: 'input',
    },
    ];

    const [nodes, setNodes] = useState(initialNodes);

    function handleFile(files: FileWithPath[]) {
        console.log(files);
        Papa.parse(files[0], {
            header: true,
            complete: function(results) {
                setNodes((nodes) => [...nodes, {id: '3', data: {filename: files[0].name}, position: {x: 200, y: 200}, type: 'inputNode'}])
                showNotification({
                    title: 'File processed',
                    message: files[0].name,
                    color: 'teal',
                    radius: 'xl',
                    icon: <IconCheck />,
                });
            }
        });
        setDropActive(false);
    }

    const onNodesChange = useCallback(
        (changes: NodeChange[]) => setNodes((nds: Node[]) => applyNodeChanges(changes, nds)),
        [setNodes]
    );

    return (
        <>
            <Dropzone.FullScreen onDrop={handleFile} active={dropActive}>
                <Group position="center" spacing="xl" style={{ minHeight: 220, pointerEvents: 'none' }}>
                <Dropzone.Accept>
                    <IconUpload
                    size={50}
                    stroke={1.5}
                    color={theme.colors[theme.primaryColor][theme.colorScheme === 'dark' ? 4 : 6]}
                    />
                </Dropzone.Accept>
                <Dropzone.Reject>
                    <IconX
                    size={50}
                    stroke={1.5}
                    color={theme.colors.red[theme.colorScheme === 'dark' ? 4 : 6]}
                    />
                </Dropzone.Reject>
                <Dropzone.Idle>
                    <IconFile3d size={50} stroke={1.5} />
                </Dropzone.Idle>

                <div>
                    <Text size="xl" inline color={theme.primaryColor}>
                    Drag files here to load
                    </Text>
                    <Text size="sm" color="dimmed" inline mt={7}>
                    Only .csv files are supported at the moment
                    </Text>
                </div>
                </Group>
            </Dropzone.FullScreen>
            <ReactFlow proOptions={{account: '', hideAttribution:true}} nodes={nodes} nodeTypes={nodeTypes} onNodesChange={onNodesChange}>
                <Background />
                <Controls />
            </ReactFlow>
        </>
    );
}