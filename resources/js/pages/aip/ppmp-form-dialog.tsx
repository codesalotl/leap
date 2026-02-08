import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import * as z from 'zod';
import * as React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import {
    Field,
    FieldDescription,
    FieldError,
    FieldGroup,
    FieldLabel,
    FieldContent,
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import {
    InputGroup,
    InputGroupAddon,
    InputGroupText,
    InputGroupTextarea,
} from '@/components/ui/input-group';
import {
    Command,
    CommandDialog,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
    CommandSeparator,
    CommandShortcut,
} from '@/components/ui/command';
import { Label } from '@/components/ui/label';
import {
    Combobox,
    ComboboxContent,
    ComboboxEmpty,
    ComboboxInput,
    ComboboxItem,
    ComboboxList,
} from '@/components/ui/combobox';

interface PpmpFormDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    ppmpPriceList: unknown[];
    chartOfAccounts: unknown[];
    selectedEntry: unknown;
    ppmpItems: unknown[];
}

const frameworks = [
    'Next.js',
    'SvelteKit',
    'Nuxt.js',
    'Remix',
    'Astro',
] as const;

const formSchema = z.object({
    expenseAccount: z.string().min(1, 'Expense account is required.'),
    itemNo: z.string().min(1, 'Item number is required.'),
    description: z.string().min(1, 'Description is required.'),
    unitOfMeasurement: z.string().min(1, 'Unit of measurement is required.'),
    price: z.string().min(1, 'Price is required.'),
});

export default function PpmpFormDialog({
    open,
    onOpenChange,
    ppmpPriceList = [],
    chartOfAccounts,
    selectedEntry = null,
    ppmpItems = [],
}: PpmpFormDialogProps) {
    const [commandOpen, setCommandOpen] = React.useState(false);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            expenseAccount: ['Hello', 'World'],
            itemNo: '',
            description: '',
            unitOfMeasurement: '',
            price: '',
        },
    });

    function onSubmit(data: z.infer<typeof formSchema>) {
        // Do something with the form values.
        console.log(data);
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Add PPMP Item</DialogTitle>
                    <DialogDescription>
                        Add a new item to the PPMP list
                    </DialogDescription>
                </DialogHeader>

                <form id="form-rhf-demo" onSubmit={form.handleSubmit(onSubmit)}>
                    <FieldGroup>
                        <Controller
                            name="expenseAccount"
                            control={form.control}
                            render={({ field, fieldState }) => {
                                console.log(field);

                                return (
                                    <Field
                                        orientation="responsive"
                                        data-invalid={fieldState.invalid}
                                    >
                                        <FieldContent>
                                            <FieldLabel htmlFor="form-rhf-demo-title">
                                                Expense Account
                                            </FieldLabel>
                                        </FieldContent>
                                        {/* <Input
                                            {...field}
                                            id="form-rhf-demo-title"
                                            aria-invalid={fieldState.invalid}
                                            placeholder="Login button not working on mobile"
                                            autoComplete="off"
                                        /> */}

                                        <Combobox items={frameworks}>
                                            <ComboboxInput placeholder="Select a framework" />
                                            <ComboboxContent>
                                                <ComboboxEmpty>
                                                    No items found.
                                                </ComboboxEmpty>
                                                <ComboboxList>
                                                    {(item) => (
                                                        <ComboboxItem
                                                            key={item}
                                                            value={item}
                                                        >
                                                            {item}
                                                        </ComboboxItem>
                                                    )}
                                                </ComboboxList>
                                            </ComboboxContent>
                                        </Combobox>

                                        {fieldState.invalid && (
                                            <FieldError
                                                errors={[fieldState.error]}
                                            />
                                        )}
                                    </Field>
                                );
                            }}
                        />

                        <Controller
                            name="expenseAccount"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor="form-rhf-demo-expense-account">
                                        Expense Account
                                    </FieldLabel>
                                    <Input
                                        {...field}
                                        id="form-rhf-demo-expense-account"
                                        aria-invalid={fieldState.invalid}
                                        placeholder="Select expense account"
                                        autoComplete="off"
                                    />
                                    {fieldState.invalid && (
                                        <FieldError
                                            errors={[fieldState.error]}
                                        />
                                    )}
                                </Field>
                            )}
                        />

                        <Controller
                            name="itemNo"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor="form-rhf-demo-item-no">
                                        Item No.
                                    </FieldLabel>
                                    <Input
                                        {...field}
                                        id="form-rhf-demo-item-no"
                                        aria-invalid={fieldState.invalid}
                                        placeholder="Enter item number"
                                        autoComplete="off"
                                    />
                                    {fieldState.invalid && (
                                        <FieldError
                                            errors={[fieldState.error]}
                                        />
                                    )}
                                </Field>
                            )}
                        />

                        <Controller
                            name="description"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor="form-rhf-demo-description">
                                        Description
                                    </FieldLabel>
                                    <InputGroup>
                                        <InputGroupTextarea
                                            {...field}
                                            id="form-rhf-demo-description"
                                            placeholder="Enter item description"
                                            rows={3}
                                            className="min-h-24 resize-none"
                                            aria-invalid={fieldState.invalid}
                                        />
                                    </InputGroup>
                                    {fieldState.invalid && (
                                        <FieldError
                                            errors={[fieldState.error]}
                                        />
                                    )}
                                </Field>
                            )}
                        />

                        <Controller
                            name="unitOfMeasurement"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor="form-rhf-demo-unit">
                                        Unit of Measurement
                                    </FieldLabel>
                                    <Input
                                        {...field}
                                        id="form-rhf-demo-unit"
                                        aria-invalid={fieldState.invalid}
                                        placeholder="Enter unit of measurement"
                                        autoComplete="off"
                                    />
                                    {fieldState.invalid && (
                                        <FieldError
                                            errors={[fieldState.error]}
                                        />
                                    )}
                                </Field>
                            )}
                        />

                        <Controller
                            name="price"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor="form-rhf-demo-price">
                                        Price
                                    </FieldLabel>
                                    <Input
                                        {...field}
                                        id="form-rhf-demo-price"
                                        type="number"
                                        step="0.01"
                                        aria-invalid={fieldState.invalid}
                                        placeholder="0.00"
                                        autoComplete="off"
                                    />
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
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                    >
                        Cancel
                    </Button>
                    <Button type="submit" form="form-rhf-demo">
                        Add Item
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
