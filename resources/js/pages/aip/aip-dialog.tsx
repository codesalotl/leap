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
import AipForm from '@/pages/aip/aip-form';
import { BetweenHorizontalEnd, SquarePen } from 'lucide-react';

type Aip = {
    id: number;
    aipRefCode: string;
    ppaDescription: string;
    implementingOfficeDepartmentLocation: string;
    scheduleOfImplementation: {
        startingDate: string;
        completionDate: string;
    };
    expectedOutputs: string;
    fundingSource: string;
    amount: {
        ps: number;
        mooe: number;
        fe: number;
        co: number;
        total: number;
    };
    amountOfCcExpenditure: {
        ccAdaptation: string;
        ccMitigation: string;
    };
    ccTypologyCode: string;
    children?: Aip[];
    created_at: string;
    updated_at: string;
};

type AipDialog = {
    data?: Aip;
    mode: 'create' | 'add' | 'edit';
    hidden?: boolean;
};

export default function AipDialog({ data, mode, hidden }: AipDialog) {
    // console.log(mode);

    return (
        <Dialog>
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

                <AipForm data={data} />

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
