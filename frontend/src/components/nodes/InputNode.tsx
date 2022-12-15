import { Card } from "@mantine/core";
import { type } from "os";
import { Handle, Position } from "reactflow";

export default function InputNode({data} : any) {
    return (
       <>
            <Card>
                <p id="text">{data.filename}</p>
            </Card>
            <Handle type="source" position={Position.Bottom} id="a" />
       </>
    )
}
