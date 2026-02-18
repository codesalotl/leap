import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import {
    Field,
    // FieldContent,
    FieldError,
    // FieldGroup,
    FieldLabel,
    // FieldDescription,
} from '@/components/ui/field';
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

// Import toggle component
import { Switch } from '@/components/ui/switch';
import { Check, ChevronsUpDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PpmpFormDialogProps {
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
            }),
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

export default function PpmpFormDialog({
    open,
    onOpenChange,
    chartOfAccounts,
    ppmpCategories,
    ppmpPriceList = [],
    selectedEntry = null,
    ppmpItems = [],
}: PpmpFormDialogProps) {
    // State for the Command Dialogs
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

    // Watch the custom item toggle
    const isCustomItem = form.watch('isCustomItem');
    const isCustomCategory = form.watch('isCustomCategory');
    const selectedExpenseAccount = form.watch('expenseAccount');
    const selectedCategory = form.watch('category');

    // Flatten all price lists from all chart of accounts
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

    // Track if expense account change was triggered by description selection
    const isExpenseAccountChangingFromDescription = React.useRef(false);

    // Clear description and related fields when expense account changes manually (only in price list mode)
    React.useEffect(() => {
        // This runs whenever selectedExpenseAccount or selectedCategory changes
        if (!isExpenseAccountChangingFromDescription.current && !isCustomItem) {
            // Clearing the fields
            form.setValue('description', '');
            form.setValue('itemNo', '');
            form.setValue('unitOfMeasurement', '');
            form.setValue('price', '');
            form.setValue('ppmp_price_list_id', 0);
        }

        // Reset the guard for the next selection
        isExpenseAccountChangingFromDescription.current = false;

        // Added selectedCategory here so manual category changes trigger this block
    }, [selectedExpenseAccount, selectedCategory, form, isCustomItem]);

    // Clear fields when switching between modes
    React.useEffect(() => {
        form.setValue('description', '');
        form.setValue('itemNo', '');
        form.setValue('unitOfMeasurement', '');
        form.setValue('price', '');
        form.setValue('ppmp_price_list_id', 0);
        form.setValue('category', 0);
        form.setValue('customCategory', '');
    }, [isCustomItem, form]);

    // Clear category fields when switching between custom and predefined categories
    React.useEffect(() => {
        form.setValue('category', undefined);
        form.setValue('customCategory', '');
    }, [isCustomCategory, form]);

    function onSubmit(data: z.infer<typeof formSchema>) {
        // console.log(data);

        if (isCustomItem) {
            // console.log('yes custom item');

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
        } else {
            // console.log('no custom item');

            if (!data.ppmp_price_list_id) {
                alert('Please select an item from the price list');
                return;
            }

            const submitData = {
                aip_entry_id: data.aip_entry_id,
                ppmp_price_list_id: data.ppmp_price_list_id,
            };

            router.post('/ppmp', submitData, {
                onSuccess: () => onOpenChange(false),
                onError: (errors) =>
                    console.error('Error creating PPMP item:', errors),
                preserveState: false,
            });
        }
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
            {/* Increased width to max-w-2xl for better side-by-side layout */}
            <DialogContent className="sm:max-w-2xl">
                <DialogHeader>
                    <DialogTitle>Add PPMP Item</DialogTitle>
                    <DialogDescription>
                        Add a new item to the PPMP list
                    </DialogDescription>
                </DialogHeader>

                {/* Toggle for Price List vs Custom Item */}
                <div className="flex items-center space-x-2 py-2">
                    <Switch
                        id="custom-item-toggle"
                        checked={isCustomItem}
                        onCheckedChange={(checked) =>
                            form.setValue('isCustomItem', checked)
                        }
                    />
                    <label
                        htmlFor="custom-item-toggle"
                        className="text-sm font-medium"
                    >
                        {isCustomItem ? 'Custom Item' : 'Price List Item'}
                    </label>
                </div>

                <form id="form-rhf-demo" onSubmit={form.handleSubmit(onSubmit)}>
                    {/* Replaced FieldGroup with CSS Grid */}
                    <div className="grid gap-4 md:grid-cols-2">
                        {/* Row 1: Expense Account (Full Width) */}
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
                                            {/*<FieldContent>*/}
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
                                            {/*</FieldContent>*/}
                                        </Field>
                                    );
                                }}
                            />
                        </div>

                        {/* Row 2: Category (Left) */}
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

                        {/* Row 2: Item No (Right) */}
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
                                            readOnly={!isCustomItem}
                                            disabled={!isCustomItem}
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

                        {/* Row 3: Description (Full Width) */}
                        <div className="md:col-span-2">
                            <Controller
                                name="description"
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid}>
                                        <FieldLabel htmlFor="form-rhf-demo-description">
                                            Procurement Item
                                        </FieldLabel>

                                        {isCustomItem ? (
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
                                        ) : (
                                            <>
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    role="combobox"
                                                    aria-expanded={
                                                        openDescriptionCommand
                                                    }
                                                    className={cn(
                                                        'h-auto min-h-[30px] w-full justify-between px-3 text-left font-normal whitespace-normal',
                                                        !field.value &&
                                                            'text-muted-foreground',
                                                        fieldState.invalid &&
                                                            'border-destructive ring-destructive',
                                                    )}
                                                    disabled={
                                                        !filteredPriceLists.length
                                                    }
                                                    onClick={() =>
                                                        setOpenDescriptionCommand(
                                                            true,
                                                        )
                                                    }
                                                >
                                                    {field.value ? (
                                                        <span className="line-clamp-2">
                                                            {field.value}
                                                        </span>
                                                    ) : (
                                                        <span>
                                                            {!filteredPriceLists.length
                                                                ? 'No items found (Select Expense/Category)'
                                                                : 'Search item...'}
                                                        </span>
                                                    )}
                                                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                                </Button>

                                                <CommandDialog
                                                    open={
                                                        openDescriptionCommand
                                                    }
                                                    onOpenChange={
                                                        setOpenDescriptionCommand
                                                    }
                                                    className="sm:max-w-[600px]"
                                                >
                                                    <Command>
                                                        <CommandInput placeholder="Search item description..." />
                                                        <CommandList>
                                                            <CommandEmpty>
                                                                No item found.
                                                            </CommandEmpty>
                                                            <CommandGroup heading="Price List Items">
                                                                {filteredPriceLists.map(
                                                                    (
                                                                        priceList,
                                                                    ) => (
                                                                        <CommandItem
                                                                            key={
                                                                                priceList.id
                                                                            }
                                                                            value={
                                                                                priceList.description
                                                                            }
                                                                            onSelect={() => {
                                                                                field.onChange(
                                                                                    priceList.description,
                                                                                );
                                                                                isExpenseAccountChangingFromDescription.current = true;

                                                                                form.setValue(
                                                                                    'itemNo',
                                                                                    priceList.item_number.toString(),
                                                                                );
                                                                                form.setValue(
                                                                                    'unitOfMeasurement',
                                                                                    priceList.unit_of_measurement,
                                                                                );
                                                                                form.setValue(
                                                                                    'price',
                                                                                    priceList.price,
                                                                                );
                                                                                form.setValue(
                                                                                    'expenseAccount',
                                                                                    priceList.chart_of_account_id,
                                                                                );
                                                                                form.setValue(
                                                                                    'ppmp_price_list_id',
                                                                                    priceList.id,
                                                                                );
                                                                                form.setValue(
                                                                                    'category',
                                                                                    priceList
                                                                                        .category
                                                                                        ?.id ||
                                                                                        0,
                                                                                );

                                                                                setOpenDescriptionCommand(
                                                                                    false,
                                                                                );
                                                                            }}
                                                                        >
                                                                            <div className="flex w-full flex-col gap-1">
                                                                                <div className="flex items-center justify-between">
                                                                                    <span className="font-medium">
                                                                                        {
                                                                                            priceList.description
                                                                                        }
                                                                                    </span>
                                                                                    {field.value ===
                                                                                        priceList.description && (
                                                                                        <Check className="ml-2 h-4 w-4" />
                                                                                    )}
                                                                                </div>
                                                                                <span className="text-xs text-muted-foreground">
                                                                                    <code className="mr-1 rounded bg-muted p-0.5">
                                                                                        {
                                                                                            priceList.account_number
                                                                                        }
                                                                                    </code>
                                                                                    {
                                                                                        priceList.unit_of_measurement
                                                                                    }{' '}
                                                                                    @{' '}
                                                                                    {
                                                                                        priceList.price
                                                                                    }
                                                                                </span>
                                                                            </div>
                                                                        </CommandItem>
                                                                    ),
                                                                )}
                                                            </CommandGroup>
                                                        </CommandList>
                                                    </Command>
                                                </CommandDialog>

                                                {/*<FieldDescription>
                                                    Click to search items from
                                                    the price list.
                                                </FieldDescription>*/}
                                            </>
                                        )}

                                        {fieldState.invalid && (
                                            <FieldError
                                                errors={[fieldState.error]}
                                            />
                                        )}
                                    </Field>
                                )}
                            />
                        </div>

                        {/* Row 4: Unit (Left) */}
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
                                            readOnly={!isCustomItem}
                                            disabled={!isCustomItem}
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

                        {/* Row 4: Price (Right) */}
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
                                            readOnly={!isCustomItem}
                                            disabled={!isCustomItem}
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
