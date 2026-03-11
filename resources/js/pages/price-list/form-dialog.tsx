import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { InputGroup, InputGroupTextarea } from '@/components/ui/input-group';
import {
    Command,
    CommandDialog,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from '@/components/ui/command';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { ChartOfAccount, PpmpCategory } from '@/pages/types/types';
import { router } from '@inertiajs/react';
import { Switch } from '@/components/ui/switch';
import { Check, ChevronsUpDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FormDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    chartOfAccounts: ChartOfAccount[];
    ppmpCategories: PpmpCategory[];
    ppmpPriceList: unknown[];
    selectedEntry: { id: number } | null;
    ppmpItems: unknown[];
}

const formSchema = z
    .object({
        aip_entry_id: z.number(),
        ppmp_price_list_id: z.number().optional(),
        expenseAccount: z
            .number()
            .refine((val) => val !== undefined && val !== null && val !== 0, {
                message: 'Expense account is required',
            }), // expense account
        category: z.number().optional(),
        customCategory: z.string().optional(),
        itemNo: z.string().min(1, 'Item number is required.'),
        description: z.string().min(1, 'Description is required.'),
        unitOfMeasurement: z
            .string()
            .min(1, 'Unit of measurement is required.'),
        price: z.string().min(1, 'Price is required.'),
        isCustomItem: z.boolean(),
        isCustomCategory: z.boolean(),
    })
    .refine(
        (data) => {
            if (data.isCustomItem) {
                return data.isCustomCategory
                    ? !!data.customCategory?.trim()
                    : !!data.category;
            }
            return true;
        },
        {
            message: 'Category is required',
            path: ['category'],
        },
    );

export default function FormDialog({
    open,
    onOpenChange,
    chartOfAccounts,
    ppmpCategories,

    ppmpPriceList = [],
    selectedEntry = null,
    ppmpItems = [],
}: FormDialogProps) {
    const [openExpenseCommand, setOpenExpenseCommand] = useState(false);
    const [openCategoryCommand, setOpenCategoryCommand] = useState(false);
    const [openDescriptionCommand, setOpenDescriptionCommand] = useState(false);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            aip_entry_id: selectedEntry?.id || 0,
            ppmp_price_list_id: 0,
            expenseAccount: undefined,
            category: undefined,
            customCategory: '',
            itemNo: '',
            description: '',
            unitOfMeasurement: '',
            price: '',
            isCustomItem: false,
            isCustomCategory: false,
        },
    });

    const isCustomItem = form.watch('isCustomItem');
    const isCustomCategory = form.watch('isCustomCategory');
    const selectedExpenseAccount = form.watch('expenseAccount');
    const selectedCategory = form.watch('category');

    const allPriceLists = chartOfAccounts.flatMap(
        (account) =>
            account.ppmp_price_lists?.map((priceList) => ({
                ...priceList,
                account_title: account.account_title,
                account_number: account.account_number,
            })) || [],
    );

    const filteredPriceLists = allPriceLists.filter((priceList) => {
        const matchesAccount = selectedExpenseAccount
            ? priceList.chart_of_account_id === selectedExpenseAccount
            : true;

        const matchesCategory = selectedCategory
            ? priceList.category?.id === selectedCategory
            : true;

        return matchesAccount && matchesCategory;
    });

    const isExpenseAccountChangingFromDescription = useRef(false);

    useEffect(() => {
        if (!isExpenseAccountChangingFromDescription.current && !isCustomItem) {
            form.setValue('description', '');
            form.setValue('itemNo', '');
            form.setValue('unitOfMeasurement', '');
            form.setValue('price', '');
            form.setValue('ppmp_price_list_id', 0);
        }

        isExpenseAccountChangingFromDescription.current = false;
    }, [selectedExpenseAccount, selectedCategory, form, isCustomItem]);

    useEffect(() => {
        form.setValue('description', '');
        form.setValue('itemNo', '');
        form.setValue('unitOfMeasurement', '');
        form.setValue('price', '');
        form.setValue('ppmp_price_list_id', 0);
        form.setValue('category', 0);
        form.setValue('customCategory', '');
    }, [isCustomItem, form]);

    useEffect(() => {
        form.setValue('category', undefined);
        form.setValue('customCategory', '');
    }, [isCustomCategory, form]);

    function onSubmit(data: z.infer<typeof formSchema>) {
        const itemNumber = parseInt(data.itemNo);

        if (isNaN(itemNumber) || itemNumber <= 0) {
            alert('Please enter a valid item number (positive integer)');
            return;
        }

        const price = parseFloat(data.price);
        if (isNaN(price) || price < 0) {
            alert('Please enter a valid price (positive number)');
            return;
        }

        const customItemData = {
            aip_entry_id: data.aip_entry_id,
            item_number: itemNumber,
            description: data.description,
            unit_of_measurement: data.unitOfMeasurement,
            price: price,
            chart_of_account_id: data.expenseAccount,
            ppmp_category_id: isCustomCategory ? null : data.category,
            custom_category: isCustomCategory ? data.customCategory : null,
        };

        console.log(customItemData);

        router.post('/ppmp/custom', customItemData, {
            onSuccess: () => onOpenChange(false),
            onError: (errors) =>
                console.error('Error creating custom PPMP item:', errors),
            preserveState: false,
        });
    }

    const handleReset = () => {
        form.reset({
            aip_entry_id: selectedEntry?.id || 0,
            ppmp_price_list_id: 0,
            expenseAccount: undefined,
            category: undefined,
            customCategory: '',
            itemNo: '',
            description: '',
            unitOfMeasurement: '',
            price: '',
            isCustomItem: false,
            isCustomCategory: false,
        });
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-2xl">
                <DialogHeader>
                    <DialogTitle>Add PPMP Item</DialogTitle>
                    <DialogDescription>
                        Add a new item to the PPMP list
                    </DialogDescription>
                </DialogHeader>

                <form id="form-rhf-demo" onSubmit={form.handleSubmit(onSubmit)}>
                    <div className="grid gap-4 md:grid-cols-2">
                        <div className="md:col-span-2">
                            <Controller
                                name="expenseAccount"
                                control={form.control}
                                render={({ field, fieldState }) => {
                                    const selectedAccount =
                                        chartOfAccounts.find(
                                            (acc) => acc.id === field.value,
                                        );
                                    return (
                                        <Field
                                            data-invalid={fieldState.invalid}
                                        >
                                            <FieldLabel htmlFor="expense-select">
                                                Expense Account
                                            </FieldLabel>

                                            <Button
                                                type="button"
                                                variant="outline"
                                                role="combobox"
                                                aria-expanded={
                                                    openExpenseCommand
                                                }
                                                className={cn(
                                                    'w-full justify-between px-3 text-left font-normal',
                                                    !field.value &&
                                                        'text-muted-foreground',
                                                    fieldState.invalid &&
                                                        'border-destructive ring-destructive',
                                                )}
                                                onClick={() =>
                                                    setOpenExpenseCommand(true)
                                                }
                                            >
                                                {selectedAccount ? (
                                                    <span className="truncate">
                                                        <code className="mr-2 rounded bg-muted p-0.5 text-xs">
                                                            {
                                                                selectedAccount.account_number
                                                            }
                                                        </code>
                                                        {
                                                            selectedAccount.account_title
                                                        }
                                                    </span>
                                                ) : (
                                                    'Select expense account'
                                                )}
                                                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                            </Button>

                                            <CommandDialog
                                                open={openExpenseCommand}
                                                onOpenChange={
                                                    setOpenExpenseCommand
                                                }
                                                className="sm:max-w-[600px]"
                                            >
                                                <Command>
                                                    <CommandInput placeholder="Search account number or title..." />

                                                    <CommandList>
                                                        <CommandEmpty>
                                                            No account found.
                                                        </CommandEmpty>

                                                        <CommandGroup heading="Chart of Accounts">
                                                            {chartOfAccounts.map(
                                                                (account) => (
                                                                    <CommandItem
                                                                        key={
                                                                            account.id
                                                                        }
                                                                        value={`${account.account_number} ${account.account_title}`}
                                                                        onSelect={() => {
                                                                            field.onChange(
                                                                                account.id,
                                                                            );
                                                                            setOpenExpenseCommand(
                                                                                false,
                                                                            );
                                                                        }}
                                                                    >
                                                                        <div className="flex w-full items-center justify-between">
                                                                            <div>
                                                                                <code className="mr-2 rounded bg-muted p-1 text-xs">
                                                                                    {
                                                                                        account.account_number
                                                                                    }
                                                                                </code>
                                                                                {
                                                                                    account.account_title
                                                                                }
                                                                            </div>

                                                                            {field.value ===
                                                                                account.id && (
                                                                                <Check className="ml-2 h-4 w-4 opacity-100" />
                                                                            )}
                                                                        </div>
                                                                    </CommandItem>
                                                                ),
                                                            )}
                                                        </CommandGroup>
                                                    </CommandList>
                                                </Command>
                                            </CommandDialog>

                                            {fieldState.invalid && (
                                                <FieldError
                                                    errors={[fieldState.error]}
                                                />
                                            )}
                                        </Field>
                                    );
                                }}
                            />
                        </div>

                        <div className="">
                            <Field>
                                <FieldLabel htmlFor="category-select">
                                    Category
                                </FieldLabel>

                                {isCustomCategory ? (
                                    <Controller
                                        name="customCategory"
                                        control={form.control}
                                        render={({ field, fieldState }) => (
                                            <>
                                                <Input
                                                    {...field}
                                                    placeholder="Enter custom category"
                                                    aria-invalid={
                                                        fieldState.invalid
                                                    }
                                                />
                                                {fieldState.invalid && (
                                                    <FieldError
                                                        errors={[
                                                            fieldState.error,
                                                        ]}
                                                    />
                                                )}
                                            </>
                                        )}
                                    />
                                ) : (
                                    <Controller
                                        name="category"
                                        control={form.control}
                                        render={({ field, fieldState }) => {
                                            const selectedCat =
                                                ppmpCategories.find(
                                                    (c) => c.id === field.value,
                                                );
                                            return (
                                                <>
                                                    <Button
                                                        type="button"
                                                        variant="outline"
                                                        role="combobox"
                                                        aria-expanded={
                                                            openCategoryCommand
                                                        }
                                                        className={cn(
                                                            'w-full justify-between px-3 text-left font-normal',
                                                            !field.value &&
                                                                'text-muted-foreground',
                                                            fieldState.invalid &&
                                                                'border-destructive ring-destructive',
                                                        )}
                                                        onClick={() =>
                                                            setOpenCategoryCommand(
                                                                true,
                                                            )
                                                        }
                                                    >
                                                        {selectedCat
                                                            ? selectedCat.name
                                                            : 'Select category'}

                                                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                                    </Button>

                                                    <CommandDialog
                                                        open={
                                                            openCategoryCommand
                                                        }
                                                        onOpenChange={
                                                            setOpenCategoryCommand
                                                        }
                                                        className="sm:max-w-[600px]"
                                                    >
                                                        <Command>
                                                            <CommandInput placeholder="Search category..." />

                                                            <CommandList>
                                                                <CommandEmpty>
                                                                    No category
                                                                    found.
                                                                </CommandEmpty>

                                                                <CommandGroup heading="Categories">
                                                                    {ppmpCategories.map(
                                                                        (
                                                                            category,
                                                                        ) => (
                                                                            <CommandItem
                                                                                key={
                                                                                    category.id
                                                                                }
                                                                                value={
                                                                                    category.name
                                                                                }
                                                                                onSelect={() => {
                                                                                    field.onChange(
                                                                                        category.id,
                                                                                    );
                                                                                    setOpenCategoryCommand(
                                                                                        false,
                                                                                    );
                                                                                }}
                                                                            >
                                                                                <div className="flex w-full items-center justify-between">
                                                                                    {
                                                                                        category.name
                                                                                    }

                                                                                    {field.value ===
                                                                                        category.id && (
                                                                                        <Check className="ml-2 h-4 w-4 opacity-100" />
                                                                                    )}
                                                                                </div>
                                                                            </CommandItem>
                                                                        ),
                                                                    )}
                                                                </CommandGroup>
                                                            </CommandList>
                                                        </Command>
                                                    </CommandDialog>

                                                    {fieldState.invalid && (
                                                        <FieldError
                                                            errors={[
                                                                fieldState.error,
                                                            ]}
                                                        />
                                                    )}
                                                </>
                                            );
                                        }}
                                    />
                                )}

                                {isCustomItem && (
                                    <div className="flex items-center space-x-2">
                                        <Switch
                                            id="custom-category-toggle"
                                            checked={isCustomCategory}
                                            onCheckedChange={(checked) =>
                                                form.setValue(
                                                    'isCustomCategory',
                                                    checked,
                                                )
                                            }
                                            size="sm"
                                        />

                                        <label
                                            htmlFor="custom-category-toggle"
                                            className="text-sm font-medium"
                                        >
                                            {isCustomCategory
                                                ? 'Custom Category'
                                                : 'Predefined Category'}
                                        </label>
                                    </div>
                                )}
                            </Field>
                        </div>

                        <div className="md:col-span-1">
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
                        </div>

                        <div className="md:col-span-2">
                            <Controller
                                name="description"
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid}>
                                        <FieldLabel htmlFor="form-rhf-demo-description">
                                            Procurement Item
                                        </FieldLabel>

                                        <InputGroup>
                                            <InputGroupTextarea
                                                {...field}
                                                id="form-rhf-demo-description"
                                                placeholder="Enter item description"
                                                rows={3}
                                                className="min-h-24 resize-none"
                                                aria-invalid={
                                                    fieldState.invalid
                                                }
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
                        </div>

                        <div className="md:col-span-1">
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
                        </div>

                        <div className="md:col-span-1">
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
                        </div>
                    </div>
                </form>

                <DialogFooter>
                    <Button
                        type="button"
                        variant="outline"
                        onClick={handleReset}
                    >
                        Reset
                    </Button>

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
