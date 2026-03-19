import { useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '@/components/ui/dialog';
import type { ChartOfAccount } from '@/pages/types/types';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { router } from '@inertiajs/react';

interface DeleteDialogProps {
    open: boolean;
    setOpen: (open: boolean) => void;
    initialData: ChartOfAccount | null;
}

export default function DeleteDialog({
    open,
    setOpen,
    initialData,
}: DeleteDialogProps) {
    const [isLoading, setIsLoading] = useState(false);

    function handleDelete() {
        if (!initialData) return;

        router.visit(`/chart-of-accounts/${initialData.id}`, {
            method: 'delete',
            onStart: () => setIsLoading(true),
            onFinish: () => setIsLoading(false),
            onSuccess: () => setOpen(false),
        });
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent
                onPointerDownOutside={(e) => isLoading && e.preventDefault()}
                onEscapeKeyDown={(e) => isLoading && e.preventDefault()}
            >
                <DialogHeader>
                    <DialogTitle>Delete Chart of Account</DialogTitle>
                    <DialogDescription>
                        Are you sure you want to delete the chart of account "
                        {initialData?.account_title}" ({initialData?.account_number})? 
                        This action cannot be undone.
                    </DialogDescription>
                </DialogHeader>

                <DialogFooter>
                    <Button
                        variant="outline"
                        onClick={() => setOpen(false)}
                        disabled={isLoading}
                    >
                        Cancel
                    </Button>

                    <Button
                        variant="destructive"
                        onClick={handleDelete}
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <span className="flex items-center gap-1">
                                <Spinner />
                                Deleting...
                            </span>
                        ) : (
                            'Delete'
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
