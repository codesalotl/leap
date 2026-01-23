import { columns, MasterPpa } from './columns';
import { DataTable } from './data-table';

interface DemoPageProps {
    descendants: MasterPpa[];
}

export default function DemoPage({ descendants }: DemoPageProps) {
    // Log here to verify data is arriving inside the table page
    console.log("Table Page received descendants:", descendants);

    return (
        <div className="w-full">
            {/* 
                Pass the descendants array directly to the DataTable.
                The DataTable will then use the 'columns' we defined 
                to map out the Title, Code, and Type.
            */}
            <DataTable columns={columns} data={descendants} />
        </div>
    );
}