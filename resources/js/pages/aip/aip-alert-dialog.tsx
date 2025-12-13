import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import type { AipAlertDialogProp } from '@/pages/aip/types';
import { Trash } from 'lucide-react';
// import axios from "axios";
import { router } from '@inertiajs/react';

export default function AipAlertDialog({ data }: AipAlertDialogProp) {
    console.log('aip-alert-dialog');

    async function deleteRow(): Promise<void> {
        router.delete(`http://localhost:8000/aip/${data.id}`, {
            onSuccess: () => {
                // router.reload();
            },
            onError: (errors) => {
                console.error('Delete failed:', errors);
            },
        });
    }

    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button size="icon" variant="destructive">
                    <Trash />
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>
                        Are you absolutely sure?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone. This will permanently
                        delete <b>{data.aipRefCode}</b> and remove the data from
                        our servers.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={deleteRow}>
                        Continue
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
