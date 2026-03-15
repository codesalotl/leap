import {
    AlertDialog,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { usePage, router } from '@inertiajs/react';
import type { PriceList } from '@/pages/types/types';
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
    const { errors } = usePage().props;

    function handleDelete() {
        if (!data) return;

        router.visit(`/price-lists/${data.id}`, {
            method: 'delete',
            preserveState: true,
            preserveScroll: true,
            onStart: () => setIsLoading(true),
            onFinish: () => setIsLoading(false),
            onSuccess: () => {
                if (Object.keys(errors).length === 0) {
                    onOpenChange(false);
                }
            },
        });
    }

    function handleCancel() {
        router.reload({ only: ['errors'] });
        onOpenChange(false);
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

                    <AlertDialogDescription asChild>
                        <div className="flex flex-col gap-4">
                            <div>
                                This action cannot be undone. This will
                                permanently delete{' '}
                                <span className="font-bold">
                                    "{data?.description}"
                                </span>
                                .
                            </div>

                            {Object.keys(errors).length === 0 || (
                                <span className="font-bold text-destructive">
                                    Error: Other items have dependecy to this
                                </span>
                            )}
                        </div>
                    </AlertDialogDescription>
                </AlertDialogHeader>

                <AlertDialogFooter>
                    <AlertDialogCancel
                        onClick={handleCancel}
                        disabled={isLoading}
                    >
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
