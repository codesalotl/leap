import DataTable from '@/pages/aip/ppmp-table/data-table';
// import { ScrollArea } from '@/components/ui/scroll-area';

interface PpmpPageProps {
    ppmpItems: unknown[];
    selectedEntry: unknown;
}

export default function PpmpPage({ ppmpItems, selectedEntry }: PpmpPageProps) {
    return <DataTable ppmpItems={ppmpItems} selectedEntry={selectedEntry} />;
}
