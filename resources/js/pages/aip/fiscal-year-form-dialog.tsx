import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { router } from '@inertiajs/react';
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
import {
    Field,
    // FieldDescription,
    FieldError,
    FieldGroup,
    FieldLabel,
    FieldContent,
} from '@/components/ui/field';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Spinner } from '@/components/ui/spinner';
import { Plus } from 'lucide-react';
import { generateYearRange } from '@/pages/aip/utils/generate-year-range';

const formSchema = z.object({
    year: z.number().int(),
});

const yearNow = new Date().getFullYear();
const years = generateYearRange(yearNow, 5, 5);

export default function FiscalYearFormDialog() {
    const [open, setOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            year: yearNow,
        },
    });

    function onSubmit(data: z.infer<typeof formSchema>) {
        setIsLoading(true);

        router.post('/aip', data, {
            onSuccess: () => {
                setOpen(false);
                setIsLoading(false);
            },

            onError: (errors) => {
                if (errors.year) {
                    form.setError('year', {
                        type: 'manual',
                        message: errors.year,
                    });
                }
                setIsLoading(false);
            },
        });
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button>
                    <Plus />
                    Initialize AIP
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        Initialize Annual Investment Program
                    </DialogTitle>
                    <DialogDescription>
                        Select a fiscal year to initialize the AIP with.
                    </DialogDescription>
                </DialogHeader>

                <form
                    id="fiscal-year-form"
                    onSubmit={form.handleSubmit(onSubmit)}
                >
                    <FieldGroup>
                        <Controller
                            control={form.control}
                            name="year"
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldContent>
                                        <FieldLabel htmlFor="fiscal-year-form-year">
                                            Fiscal Year
                                        </FieldLabel>
                                        {/* <FieldDescription>Description...</FieldDescription> */}
                                    </FieldContent>

                                    <Select
                                        name={field.name}
                                        value={
                                            field.value
                                                ? String(field.value)
                                                : undefined
                                        }
                                        onValueChange={(value) =>
                                            field.onChange(Number(value))
                                        }
                                    >
                                        <SelectTrigger
                                            id="fiscal-year-form-year"
                                            aria-invalid={fieldState.invalid}
                                        >
                                            <SelectValue placeholder="Select year" />
                                        </SelectTrigger>

                                        <SelectContent>
                                            {years.map((year) => (
                                                <SelectItem
                                                    key={year}
                                                    value={String(year)}
                                                >
                                                    {year}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>

                                    {fieldState.invalid && (
                                        <FieldError
                                            errors={[fieldState.error]}
                                        />
                                    )}
                                </Field>
                            )}
                        />
                    </FieldGroup>
                </form>

                <DialogFooter>
                    <DialogClose asChild>
                        <Button variant="outline">Cancel</Button>
                    </DialogClose>
                    <Button
                        form="fiscal-year-form"
                        type="submit"
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <>
                                <Spinner />
                                Initializing
                            </>
                        ) : (
                            'Initialize'
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
