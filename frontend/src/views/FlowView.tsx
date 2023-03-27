import { Dialog, Group, Text, useMantineTheme } from '@mantine/core';
import { Dropzone, FileWithPath } from '@mantine/dropzone';
import { applyNodeChanges, Background, Controls, Node, NodeChange, Position, ReactFlow } from 'reactflow';
import 'reactflow/dist/style.css';
import { IconUpload, IconX, IconFile3d, IconCheck } from '@tabler/icons-react';
import { showNotification } from '@mantine/notifications';
import Papa from 'papaparse';
import { useCallback, useRef, useState } from 'react';
import FileInputNode from '../components/nodes/FileInputNode';
import { openSpotlight, SpotlightProvider } from '@mantine/spotlight';
import { AirliftCallable, airliftNodeToPropsPanel, callableToAirliftNode, callableToSpotlightAction } from '../types/AirliftCallable';

const nodeTypes = { inputNode: FileInputNode };

interface FlowViewProps {
    callables: AirliftCallable[];
}

export default function FlowView({ callables }: FlowViewProps) {

    const theme = useMantineTheme();
    const [reactFlowInstance, setReactFlowInstance] = useState<any>(null);
    const reactFlowWrapper = useRef<HTMLDivElement>(null);
    const [globalCoords, setGlobalCoords] = useState({ x: 0, y: 0 });
    const [detailsOpened, setDetailsOpened] = useState(false);
    const [inspectedNode, setInspectedNode] = useState<Node<any> | null>(null);

    const initialNodes: Node[] = [
        {
            id: '0',
            data: { label: 'Hello' },
            position: { x: 300, y: 100 },
            type: 'input',
            sourcePosition: Position.Right
        },
    ];

    const [nodes, setNodes] = useState(initialNodes);

    function addNode(type: string, data: any) {
        var position = { x: 200, y: 200 };
        if (reactFlowWrapper.current != null && reactFlowInstance != null) {
            const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
            position = reactFlowInstance.project({
                x: globalCoords.x - reactFlowBounds.left,
                y: globalCoords.y - reactFlowBounds.top,
            });
        }
        setNodes((nodes) => [...nodes, callableToAirliftNode(callables.find(c => c.name === type)!, position, nodes.length.toString(), data)]);
    }

    function handleFile(files: FileWithPath[]) {
        Papa.parse(files[0], {
            header: true,
            complete: function (results) {
                console.log(results);
                addNode('load_csv', { filename: files[0].name, fields: results.meta.fields, count: results.data.length, types: Object.keys(results.data[0] as any).map(k => isNaN((results.data[0] as any)[k]) ? 'str' : 'number') });
                showNotification({
                    title: 'File processed',
                    message: files[0].name,
                    color: 'teal',
                    radius: 'xl',
                    icon: <IconCheck />,
                });
            }
        });
        //setDropActive(false);
    }

    const onNodesChange = useCallback(
        (changes: NodeChange[]) => setNodes((nds: Node[]) => applyNodeChanges(changes, nds)),
        [setNodes]
    );

    return (
        <>
            <Dropzone.FullScreen onDrop={handleFile} onDragOver={(e) => setGlobalCoords({ x: e.clientX, y: e.clientY })}>
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
            <SpotlightProvider actions={callables.map((e) => callableToSpotlightAction(e, (s) => addNode(s.title, {})))} shortcut={['shift + space']}>
                <div ref={reactFlowWrapper} style={{ flexGrow: 1, height: '100vh' }}>
                    <ReactFlow proOptions={{ account: '', hideAttribution: true }} nodes={nodes} nodeTypes={nodeTypes} onNodesChange={onNodesChange} onInit={setReactFlowInstance} onConnectEnd={(e) => { openSpotlight(); setGlobalCoords({ x: e.clientX, y: e.clientY }); }} onNodeClick={(e, n) => { setInspectedNode(n); setDetailsOpened((o) => !o) }}>
                        <Background />
                        <Controls />
                    </ReactFlow>
                </div>
            </SpotlightProvider>
            <Dialog opened={detailsOpened} withCloseButton withBorder radius='md' onClose={() => setDetailsOpened(false)}>
                {inspectedNode != null && airliftNodeToPropsPanel(inspectedNode)}
            </Dialog>
        </>
    );
}