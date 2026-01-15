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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { generateYearRange } from '@/pages/aip/utils';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { router } from '@inertiajs/react';

const formSchema = z.object({
    year: z.number().int(),
});

export default function FiscalYearDialog() {
    const years = generateYearRange(2026, 5, 5);

    // 1. Define your form.
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            year: 2026,
        },
    });

    // 2. Define a submit handler.
    function onSubmit(values: z.infer<typeof formSchema>) {
        // console.log(values);

        router.post('/aip', values, {
            onSuccess: () => console.log('Saved!'),
            // onError: (errors) => console.log('Validation Errors:', errors),
            onError: (errors) => {
                // Handle backend errors
                if (errors.year) {
                    form.setError('year', {
                        type: 'manual',
                        message: errors.year,
                    });
                }
            },
        });
    }

    return (
        <Dialog>
            <Form {...form}>
                {/* <form id="year-dialog" onSubmit={onSubmit}> */}
                <form
                    id="year-dialog"
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-8"
                >
                    <DialogTrigger asChild>
                        <Button>Initialize AIP</Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                            <DialogTitle>
                                Initialize Annual Investment Program
                            </DialogTitle>
                            <DialogDescription>
                                Select a fiscal year to initialize the AIP with.
                            </DialogDescription>
                        </DialogHeader>

                        <div className="grid gap-4 py-2">
                            <div className="grid gap-3">
                                {/* <Label htmlFor="name-1">Year</Label> */}

                                <FormField
                                    control={form.control}
                                    name="year"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Fiscal Year</FormLabel>
                                            <FormControl>
                                                <Select
                                                    onValueChange={(value) =>
                                                        field.onChange(
                                                            Number(value),
                                                        )
                                                    }
                                                    defaultValue={
                                                        field.value
                                                            ? String(
                                                                  field.value,
                                                              )
                                                            : undefined
                                                    }
                                                >
                                                    <SelectTrigger className="w-full">
                                                        <SelectValue placeholder="Select year" />
                                                    </SelectTrigger>

                                                    <SelectContent>
                                                        {years.map((year) => (
                                                            <SelectItem
                                                                key={year}
                                                                value={String(
                                                                    year,
                                                                )}
                                                            >
                                                                {year}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </FormControl>
                                            {/*<FormDescription>
                                                This is your public display
                                                name.
                                            </FormDescription>*/}
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </div>

                        <DialogFooter>
                            <DialogClose asChild>
                                <Button variant="outline">Cancel</Button>
                            </DialogClose>
                            <Button form="year-dialog" type="submit">
                                Save changes
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </form>
            </Form>
        </Dialog>
    );
}
