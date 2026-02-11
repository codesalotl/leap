import React from 'react';
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
    FieldContent,
    FieldError,
    FieldGroup,
    FieldLabel,
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { InputGroup, InputGroupTextarea } from '@/components/ui/input-group';
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { ChartOfAccount, PpmpCategory } from '@/pages/types/types';
import { router } from '@inertiajs/react';

// Import toggle component
import { Switch } from '@/components/ui/switch';

interface PpmpFormDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    chartOfAccounts: ChartOfAccount[];
    ppmpCategories: PpmpCategory[];
    ppmpPriceList: unknown[];
    selectedEntry: { id: number } | null;
    ppmpItems: unknown[];
}

const formSchema = z.object({
    aip_entry_id: z.number(),
    ppmp_price_list_id: z.number().optional(),
    expenseAccount: z
        .number()
        .refine((val) => val !== undefined && val !== null, {
            message: 'Expense account is required',
        }),
    category: z.number(),
    itemNo: z.string().min(1, 'Item number is required.'),
    description: z.string().min(1, 'Description is required.'),
    unitOfMeasurement: z.string().min(1, 'Unit of measurement is required.'),
    price: z.string().min(1, 'Price is required.'),
    isCustomItem: z.boolean().default(false),
});

export default function PpmpFormDialog({
    open,
    onOpenChange,
    chartOfAccounts,
    ppmpCategories,
    ppmpPriceList = [],
    selectedEntry = null,
    ppmpItems = [],
}: PpmpFormDialogProps) {
    // console.log(chartOfAccounts);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            aip_entry_id: selectedEntry?.id || 0,
            ppmp_price_list_id: 0,
            expenseAccount: undefined,
            category: undefined,
            itemNo: '',
            description: '',
            unitOfMeasurement: '',
            price: '',
            isCustomItem: false,
        },
    });

    // Watch the custom item toggle
    const isCustomItem = form.watch('isCustomItem');
    const selectedExpenseAccount = form.watch('expenseAccount');

    // Flatten all price lists from all chart of accounts
    const allPriceLists = chartOfAccounts.flatMap(
        (account) =>
            account.ppmp_price_lists?.map((priceList) => ({
                ...priceList,
                account_title: account.account_title,
                account_number: account.account_number,
            })) || [],
    );

    // Filter price lists based on selected expense account
    const filteredPriceLists = selectedExpenseAccount
        ? allPriceLists.filter(
              (priceList) =>
                  priceList.chart_of_account_id === selectedExpenseAccount,
          )
        : allPriceLists;

    console.log(filteredPriceLists);

    // Track if expense account change was triggered by description selection
    const isExpenseAccountChangingFromDescription = React.useRef(false);

    // Clear description and related fields when expense account changes manually (only in price list mode)
    React.useEffect(() => {
        if (!isExpenseAccountChangingFromDescription.current && !isCustomItem) {
            form.setValue('description', '');
            form.setValue('itemNo', '');
            form.setValue('unitOfMeasurement', '');
            form.setValue('price', '');
            form.setValue('ppmp_price_list_id', 0);
        }
        isExpenseAccountChangingFromDescription.current = false;
    }, [selectedExpenseAccount, form, isCustomItem]);

    // Clear fields when switching between modes
    React.useEffect(() => {
        form.setValue('description', '');
        form.setValue('itemNo', '');
        form.setValue('unitOfMeasurement', '');
        form.setValue('price', '');
        form.setValue('ppmp_price_list_id', 0);
    }, [isCustomItem, form]);

    function onSubmit(data: z.infer<typeof formSchema>) {
        console.log(data);

        if (isCustomItem) {
            // Custom item mode - use the dedicated custom route
            const customItemData = {
                aip_entry_id: data.aip_entry_id,
                item_number: parseInt(data.itemNo),
                description: data.description,
                unit_of_measurement: data.unitOfMeasurement,
                price: parseFloat(data.price),
                chart_of_account_id: data.expenseAccount,
                ppmp_category_id: data.category,
            };

            console.log('Creating custom PPMP item:', customItemData);

            // Single API call that creates both price list and PPMP
            router.post('/ppmp/custom', customItemData, {
                onSuccess: () => {
                    console.log('Custom PPMP item created successfully');
                    onOpenChange(false); // Close dialog on success
                },
                onError: (errors) => {
                    console.error('Error creating custom PPMP item:', errors);
                },
                preserveState: false,
            });
        } else {
            // Price list mode - use existing price list
            if (!data.ppmp_price_list_id) {
                alert('Please select an item from the price list');
                return;
            }

            const submitData = {
                aip_entry_id: data.aip_entry_id,
                ppmp_price_list_id: data.ppmp_price_list_id,
            };

            console.log('Submitting price list item:', submitData);

            // Make API call using Inertia router
            router.post('/ppmp', submitData, {
                onSuccess: () => {
                    console.log('PPMP item created successfully');
                    onOpenChange(false); // Close dialog on success
                },
                onError: (errors) => {
                    console.error('Error creating PPMP item:', errors);
                },
                preserveState: false, // Refresh the page data
            });
        }
    }

    const handleReset = () => {
        form.reset({
            aip_entry_id: selectedEntry?.id || 0,
            ppmp_price_list_id: 0,
            expenseAccount: undefined,
            itemNo: '',
            description: '',
            unitOfMeasurement: '',
            price: '',
            isCustomItem: false,
        });
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Add PPMP Item</DialogTitle>
                    <DialogDescription>
                        Add a new item to the PPMP list
                    </DialogDescription>
                </DialogHeader>

                {/* Toggle for Price List vs Custom Item */}
                <div className="flex items-center space-x-2">
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
                    <FieldGroup>
                        <Controller
                            name="expenseAccount"
                            control={form.control}
                            render={({ field, fieldState }) => {
                                return (
                                    <Field data-invalid={fieldState.invalid}>
                                        <FieldContent>
                                            <FieldLabel htmlFor="expense-select">
                                                Expense Account
                                            </FieldLabel>

                                            {fieldState.invalid && (
                                                <FieldError
                                                    errors={[fieldState.error]}
                                                />
                                            )}
                                        </FieldContent>

                                        <Select
                                            onValueChange={(val) =>
                                                field.onChange(Number(val))
                                            }
                                            value={
                                                field.value
                                                    ? field.value.toString()
                                                    : ''
                                            }
                                        >
                                            <SelectTrigger
                                                id="expense-select"
                                                aria-invalid={
                                                    fieldState.invalid
                                                }
                                                className="w-full"
                                            >
                                                <SelectValue placeholder="Select expense account" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectGroup>
                                                    {chartOfAccounts.map(
                                                        (account) => (
                                                            <SelectItem
                                                                key={account.id}
                                                                value={account.id.toString()}
                                                            >
                                                                <code className="mr-2 bg-muted p-1 text-xs">
                                                                    {
                                                                        account.account_number
                                                                    }
                                                                </code>
                                                                {
                                                                    account.account_title
                                                                }
                                                            </SelectItem>
                                                        ),
                                                    )}
                                                </SelectGroup>
                                            </SelectContent>
                                        </Select>

                                        {/* {fieldState.invalid && (
                                            <FieldError
                                                errors={[fieldState.error]}
                                            />
                                        )} */}
                                    </Field>
                                );
                            }}
                        />

                        <Controller
                            name="category"
                            control={form.control}
                            render={({ field, fieldState }) => {
                                return (
                                    <Field data-invalid={fieldState.invalid}>
                                        <FieldContent>
                                            <FieldLabel htmlFor="category-select">
                                                Expense Account
                                            </FieldLabel>

                                            {fieldState.invalid && (
                                                <FieldError
                                                    errors={[fieldState.error]}
                                                />
                                            )}
                                        </FieldContent>

                                        <Select
                                            onValueChange={(val) =>
                                                field.onChange(Number(val))
                                            }
                                            value={
                                                field.value
                                                    ? field.value.toString()
                                                    : ''
                                            }
                                        >
                                            <SelectTrigger
                                                id="category-select"
                                                aria-invalid={
                                                    fieldState.invalid
                                                }
                                                className="w-full"
                                            >
                                                <SelectValue placeholder="Select category" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectGroup>
                                                    {ppmpCategories.map(
                                                        (category) => (
                                                            <SelectItem
                                                                key={
                                                                    category.id
                                                                }
                                                                value={category.id.toString()}
                                                            >
                                                                {category.name}
                                                            </SelectItem>
                                                        ),
                                                    )}
                                                </SelectGroup>
                                            </SelectContent>
                                        </Select>

                                        {/* {fieldState.invalid && (
                                            <FieldError
                                                errors={[fieldState.error]}
                                            />
                                        )} */}
                                    </Field>
                                );
                            }}
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
                                        readOnly={!isCustomItem}
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
                                    {isCustomItem ? (
                                        // Custom mode - text input
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
                                        // Price list mode - select dropdown
                                        <Select
                                            onValueChange={(val) => {
                                                const selectedPriceList =
                                                    filteredPriceLists.find(
                                                        (pl) =>
                                                            pl.id.toString() ===
                                                            val,
                                                    );

                                                console.log(selectedPriceList);

                                                if (selectedPriceList) {
                                                    field.onChange(
                                                        selectedPriceList.description,
                                                    );
                                                    // Set flag to prevent clearing fields when expense account changes
                                                    isExpenseAccountChangingFromDescription.current = true;
                                                    // Auto-fill other fields
                                                    form.setValue(
                                                        'itemNo',
                                                        selectedPriceList.item_number.toString(),
                                                    );
                                                    form.setValue(
                                                        'unitOfMeasurement',
                                                        selectedPriceList.unit_of_measurement,
                                                    );
                                                    form.setValue(
                                                        'price',
                                                        selectedPriceList.price,
                                                    );
                                                    form.setValue(
                                                        'expenseAccount',
                                                        selectedPriceList.chart_of_account_id,
                                                    );
                                                    form.setValue(
                                                        'ppmp_price_list_id',
                                                        selectedPriceList.id,
                                                    );
                                                    form.setValue(
                                                        'category',
                                                        selectedPriceList
                                                            .category.id,
                                                    );
                                                }
                                            }}
                                            value={
                                                filteredPriceLists
                                                    .find(
                                                        (pl) =>
                                                            pl.description ===
                                                            field.value,
                                                    )
                                                    ?.id.toString() || ''
                                            }
                                        >
                                            <SelectTrigger
                                                id="form-rhf-demo-description"
                                                aria-invalid={
                                                    fieldState.invalid
                                                }
                                                className="w-full"
                                            >
                                                <SelectValue placeholder="Select item description" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectGroup>
                                                    {filteredPriceLists.map(
                                                        (priceList) => (
                                                            <SelectItem
                                                                key={
                                                                    priceList.id
                                                                }
                                                                value={priceList.id.toString()}
                                                            >
                                                                <div className="flex flex-col py-1">
                                                                    <span className="font-medium">
                                                                        {
                                                                            priceList.description
                                                                        }
                                                                    </span>
                                                                    <span className="text-sm text-muted-foreground">
                                                                        <code className="mr-1 bg-muted p-1 text-xs">
                                                                            {
                                                                                priceList.account_number
                                                                            }
                                                                        </code>
                                                                        {
                                                                            priceList.account_title
                                                                        }{' '}
                                                                        -{' '}
                                                                        {
                                                                            priceList.unit_of_measurement
                                                                        }{' '}
                                                                        @{' '}
                                                                        {
                                                                            priceList.price
                                                                        }
                                                                    </span>
                                                                </div>
                                                            </SelectItem>
                                                        ),
                                                    )}
                                                </SelectGroup>
                                            </SelectContent>
                                        </Select>
                                    )}
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
                                        readOnly={!isCustomItem}
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
                                        readOnly={!isCustomItem}
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
