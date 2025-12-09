import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import AipForm from '@/pages/aip/aip-form';
import type { AipDialogProp } from '@/pages/aip/types';
import { BetweenHorizontalEnd, SquarePen } from 'lucide-react';

export default function AipDialog({ id, data, mode, hidden }: AipDialogProp) {
    // const [open, setOpen] = useState(false);

    console.log('aip-dialog');

    return (
        <Dialog
        // open={open}
        //  onOpenChange={setOpen}
        >
            <DialogTrigger asChild>
                {mode === 'add' || mode === 'create' ? (
                    <Button size="icon" className={hidden ? 'invisible' : ''}>
                        <BetweenHorizontalEnd />
                    </Button>
                ) : (
                    <Button size="icon" variant="secondary">
                        <SquarePen />
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent className="w-11/12 max-w-none sm:max-w-7xl">
                <DialogHeader>
                    <DialogTitle>
                        {mode === 'edit' ? 'Edit' : 'Add'}
                    </DialogTitle>
                    <DialogDescription>
                        This action cannot be undone. This will permanently
                        delete your account and remove your data from our
                        servers.
                    </DialogDescription>
                </DialogHeader>

                {/*<ScrollArea className="h-72 w-48 rounded-md border">*/}
                <ScrollArea className="h-100">
                    <AipForm id={id} data={data} mode={mode} />
                </ScrollArea>

                <DialogFooter>
                    <DialogClose asChild>
                        <Button variant="outline">Cancel</Button>
                    </DialogClose>
                    <Button type="submit" form="aip-form">
                        Save changes
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
