import { Flex, Input, Space, Text } from "@mantine/core";
import { SpotlightAction } from "@mantine/spotlight";
import { IconDatabase, IconFile, IconTableImport } from "@tabler/icons-react";
import { Node } from "reactflow";

export type AirliftCallable = {
    name: string;
    module: string;
    doc: string;
    args: AirliftCallableArg[];
    return: AirliftArgType;
    type: AirliftCallableType;
}

export type AirliftCallableArg = {
    name: string;
    type: AirliftArgType;
}

enum AirliftCallableType {
    FILE_INPUT = 'file_input'
}

enum AirliftArgType {
    String = 'str',
    DataFrame = 'DataFrame',
    Number = 'number'
}

type Position = {
    x: number;
    y: number;
}

export function iconForCallableType(type: AirliftCallableType): JSX.Element {
    switch (type) {
        case AirliftCallableType.FILE_INPUT:
            return <IconTableImport />;
    }
}

export function callableToSpotlightAction(callable: AirliftCallable, onAdd: (node: SpotlightAction) => void): SpotlightAction {
    return {
        title: callable.name,
        description: callable.doc,
        icon: iconForCallableType(callable.type),
        onTrigger: onAdd,
        group: callable.module
    }
}

export function callableToAirliftNode(callable: AirliftCallable, position: Position, id: string, data: any): Node<any> {
    switch (callable.type) {
        case AirliftCallableType.FILE_INPUT:
            return { id: id, data: data ?? { filename: 'csv file', fields: ['test'] }, position: position, type: 'inputNode' }
    }
}

export function airliftNodeToPropsPanel(node: Node<any>): JSX.Element {
    switch (node.type) {
        case 'inputNode':
            return (
                <>
                    <Text fz="xl">File input</Text>
                    <Space h="sm" />
                    <Input
                        icon={<IconFile />}
                        variant="filled"
                        placeholder={node.data.filename}
                        radius="md"
                        disabled
                    />
                    <Space h="sm" />
                    <Flex gap='xs' align='center'>
                        <IconDatabase size={18} />
                        <Text fz="sm">{node.data.count} rows</Text>
                    </Flex>
                </>
            );
        default:
            return <Text>No details to show</Text>;
    }
}

export function colorForType(type: AirliftArgType): string {
    switch (type) {
        case AirliftArgType.String:
            return 'green';
        case AirliftArgType.DataFrame:
            return 'green';
        case AirliftArgType.Number:
            return 'red';
    }
}