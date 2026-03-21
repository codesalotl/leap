import {
    AlertDialog,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import type { Office } from '@/types/global';
import { router } from '@inertiajs/react';
import { Spinner } from '@/components/ui/spinner';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

interface DeleteDialogProps {
    open: boolean;
    setOpen: (open: boolean) => void;
    initialData: Office | null;
}

export default function DeleteDialog({
    open,
    setOpen,
    initialData,
}: DeleteDialogProps) {
    const [isLoading, setIsLoading] = useState(false);

    function handleDelete() {
        router.visit(`/offices/${initialData?.id}`, {
            method: 'delete',
            onStart: () => setIsLoading(true),
            onFinish: () => setIsLoading(false),
            onSuccess: () => setOpen(false),
        });
    }

    return (
        <AlertDialog open={open} onOpenChange={setOpen}>
            <AlertDialogContent
                onEscapeKeyDown={(e) => isLoading && e.preventDefault()}
            >
                <AlertDialogHeader>
                    <AlertDialogTitle>
                        Are you absolutely sure?
                    </AlertDialogTitle>

                    <AlertDialogDescription>
                        This action cannot be undone. This will permanently
                        delete{' '}
                        <span className="font-bold">"{initialData?.name}"</span>
                        .
                    </AlertDialogDescription>
                </AlertDialogHeader>

                <AlertDialogFooter>
                    <AlertDialogCancel disabled={isLoading}>
                        Cancel
                    </AlertDialogCancel>

                    <Button
                        onClick={handleDelete}
                        variant={'destructive'}
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <span className="flex items-center gap-1">
                                <Spinner /> Deleting
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
