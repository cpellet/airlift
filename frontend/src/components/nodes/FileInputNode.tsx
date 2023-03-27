import { IconTableImport } from "@tabler/icons-react";
import AirliftNode from "./AirliftNode";

export default function FileInputNode({ data }: any) {
    return (
        <AirliftNode title={data.filename} fieldnames={data.fields} icon={<IconTableImport size={16} />} fieldtypes={data.types} />
    );
}