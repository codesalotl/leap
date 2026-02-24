import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogDescription,
} from '@/components/ui/alert-dialog';
import { Ppa } from '@/pages/types/types';
import { router } from '@inertiajs/react';

interface DeleteDialogProps {
    isDeleteAlertOpen: boolean;
    setIsDeleteAlertOpen: React.Dispatch<React.SetStateAction<boolean>>;
    selectedEntry: Ppa | null;
    setSelectedEntryId: string;
    // handleDelete: (selectedEntry: Ppa) => void;
}

export default function DeleteDialog({
    isDeleteAlertOpen,
    setIsDeleteAlertOpen,
    selectedEntry,
    setSelectedEntryId,
    // handleDelete,
}: DeleteDialogProps) {
    const handleDelete = (entry) => {
        console.log('Deleting entry');

        router.delete(`/aip-entries/${entry.aip_entry.id}`, {
            preserveScroll: true,
            onFinish: () => {
                setIsDeleteAlertOpen(false);
                setSelectedEntryId(null);
            },
        });
    };

    return (
        <AlertDialog
            open={isDeleteAlertOpen}
            onOpenChange={setIsDeleteAlertOpen}
        >
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>
                        Remove from AIP Summary?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                        Are you sure you want to remove{' '}
                        <span className="font-bold text-foreground">
                            "{selectedEntry?.title}"
                        </span>
                        ?
                        {selectedEntry?.children &&
                            selectedEntry.children.length > 0 && (
                                <span className="mt-2 block font-semibold text-destructive italic">
                                    Warning: This will also remove all nested
                                    sub-projects and activities.
                                </span>
                            )}
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel onClick={() => setSelectedEntryId(null)}>
                        Cancel
                    </AlertDialogCancel>
                    <AlertDialogAction
                        className="bg-destructive hover:bg-destructive/90"
                        onClick={() =>
                            selectedEntry && handleDelete(selectedEntry)
                        }
                    >
                        Confirm Removal
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
