import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { PpmpPriceList } from './data-table/columns';

interface DeleteDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    item: PpmpPriceList | null;
    onConfirm: () => void;
    isDeleting?: boolean;
}

export default function DeleteDialog({
    open,
    onOpenChange,
    item,
    onConfirm,
    isDeleting = false,
}: DeleteDialogProps) {
    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete the PPMP price list item:
                        <br />
                        <br />
                        <strong>Item Code:</strong> {item?.item_code}
                        <br />
                        <strong>Description:</strong> {item?.item_description}
                        <br />
                        <strong>Unit Price:</strong> ₱{item?.unit_price}/{item?.unit}
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel disabled={isDeleting}>
                        Cancel
                    </AlertDialogCancel>
                    <AlertDialogAction
                        onClick={onConfirm}
                        disabled={isDeleting}
                        className="bg-red-600 hover:bg-red-700"
                    >
                        {isDeleting ? 'Deleting...' : 'Delete'}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
