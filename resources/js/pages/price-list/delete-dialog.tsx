import {
    AlertDialog,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { router } from '@inertiajs/react';
import { PriceList } from '@/pages/types/types';
import { useState } from 'react';
import { Spinner } from '@/components/ui/spinner';
import { Button } from '@/components/ui/button';

interface DeleteDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    data: PriceList | null;
}

export default function DeleteDialog({
    open,
    onOpenChange,
    data,
}: DeleteDialogProps) {
    const [isLoading, setIsLoading] = useState(false);

    function handleDelete() {
        if (!data) return;

        router.visit(`/price-lists/${data.id}`, {
            method: 'delete',
            onStart: () => setIsLoading(true),
            onFinish: () => setIsLoading(false),
            onSuccess: () => onOpenChange(false),
        });
    }

    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent
                onEscapeKeyDown={(e) => isLoading && e.preventDefault()}
            >
                <AlertDialogHeader>
                    <AlertDialogTitle>
                        Are you absolutely sure?
                    </AlertDialogTitle>

                    <AlertDialogDescription>
                        This action cannot be undone. This will permanently
                        delete your account from our servers.
                    </AlertDialogDescription>
                </AlertDialogHeader>

                <AlertDialogFooter>
                    <AlertDialogCancel disabled={isLoading}>
                        Cancel
                    </AlertDialogCancel>

                    <Button onClick={handleDelete} disabled={isLoading}>
                        {isLoading ? (
                            <span className="flex items-center gap-1">
                                <Spinner />
                                Delete
                            </span>
                        ) : (
                            'Delete'
                        )}
                    </Button>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
