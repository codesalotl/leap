import { useState } from 'react';
import { useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
    DialogDescription,
} from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Download, Search } from 'lucide-react';

export default function PpaImportModal({
    masterPpas = [],
    aipId,
}: {
    masterPpas: any[];
    aipId: number;
}) {
    const [open, setOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    const { data, setData, post, processing } = useForm({
        ppa_ids: [] as number[],
    });

    // 1. Filter for only ACTIVE PPAs
    // 2. Further filter based on the search term
    const activeAndFilteredPpas = masterPpas.filter((ppa) => {
        const isActive = ppa.is_active === true || ppa.is_active === 1;
        const matchesSearch =
            ppa.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            ppa.code_suffix?.includes(searchTerm);
        return isActive && matchesSearch;
    });

    const togglePpa = (id: number) => {
        const current = [...data.ppa_ids];
        const index = current.indexOf(id);
        if (index > -1) current.splice(index, 1);
        else current.push(id);
        setData('ppa_ids', current);
    };

    const handleImport = () => {
        post(`/aip/${aipId}/import`, {
            onSuccess: () => {
                setOpen(false);
                setData('ppa_ids', []); // Clear selection on success
            },
        });
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="default" className="ml-2">
                    <Download className="mr-2 h-4 w-4" /> Import from Master
                    Library
                </Button>
            </DialogTrigger>
            <DialogContent className="flex max-h-[90vh] max-w-2xl flex-col">
                <DialogHeader>
                    <DialogTitle>Import Active PPAs</DialogTitle>
                    <DialogDescription>
                        Showing all active Programs, Projects, and Activities
                        available for the current AIP.
                    </DialogDescription>
                </DialogHeader>

                {/* Search Bar */}
                <div className="relative my-2">
                    <Search className="absolute top-2.5 left-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search by title or code..."
                        className="pl-9"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <div className="mt-2 flex-1 overflow-y-auto rounded-md border p-0">
                    {activeAndFilteredPpas.length > 0 ? (
                        <div className="divide-y">
                            {activeAndFilteredPpas.map((ppa) => (
                                <div
                                    key={ppa.id}
                                    className={`flex items-start space-x-3 p-4 transition-colors hover:bg-slate-50 ${
                                        data.ppa_ids.includes(ppa.id)
                                            ? 'bg-blue-50/50'
                                            : ''
                                    }`}
                                    onClick={() => togglePpa(ppa.id)}
                                >
                                    <div className="pt-1">
                                        <Checkbox
                                            id={`ppa-${ppa.id}`}
                                            checked={data.ppa_ids.includes(
                                                ppa.id,
                                            )}
                                            onCheckedChange={() =>
                                                togglePpa(ppa.id)
                                            }
                                            // Prevent double-toggle if clicking label/container
                                            onClick={(e) => e.stopPropagation()}
                                        />
                                    </div>
                                    <div className="flex-1 cursor-pointer">
                                        <div className="mb-1 flex items-center gap-2">
                                            <span className="rounded bg-blue-50 px-1 font-mono text-xs font-bold text-blue-700">
                                                {ppa.code_suffix || 'N/A'}
                                            </span>
                                            <Badge
                                                variant="outline"
                                                className="h-5 text-[10px] uppercase"
                                            >
                                                {ppa.type}
                                            </Badge>
                                        </div>
                                        <p className="text-sm leading-none font-medium">
                                            {ppa.title}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="p-8 text-center text-sm text-muted-foreground">
                            No active PPAs found matching your criteria.
                        </div>
                    )}
                </div>

                <DialogFooter className="border-t pt-4">
                    <div className="flex-1 self-center text-sm text-muted-foreground">
                        {data.ppa_ids.length} item(s) selected
                    </div>
                    <Button variant="ghost" onClick={() => setOpen(false)}>
                        Cancel
                    </Button>
                    <Button
                        onClick={handleImport}
                        disabled={processing || data.ppa_ids.length === 0}
                    >
                        {processing ? 'Importing...' : `Add Selected PPAs`}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
