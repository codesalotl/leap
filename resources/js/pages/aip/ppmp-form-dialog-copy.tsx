import { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { router } from '@inertiajs/react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import {
    Field,
    FieldError,
    FieldGroup,
    FieldLabel,
} from '@/components/ui/field';
import PpmpTable from '@/pages/aip/ppmp-table/data-table';
import { ChartOfAccount } from '@/pages/types/types';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';

interface PpmpDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    ppmpPriceList: any[];
    chartOfAccounts: ChartOfAccount[];
    selectedEntry: any;
    ppmpItems: any[];
}

const formSchema = z
    .object({
        ppmp_price_list_id: z.string().optional(),
        chart_of_account_id: z.string().optional(),
        item_name: z.string().optional(),
        unit_of_measurement: z.string().optional(),
        price: z.string().optional(),
    })
    .refine((data) => data.ppmp_price_list_id || data.item_name, {
        message: 'Either select an item or enter a custom item name',
        path: ['item_name'],
    })
    .refine(
        (data) => {
            if (data.ppmp_price_list_id) return true;
            return (
                data.item_name &&
                data.unit_of_measurement &&
                data.price &&
                data.chart_of_account_id
            );
        },
        {
            message: 'All fields are required for custom items',
            path: ['item_name'],
        },
    );

export default function PpmpDialog({
    open,
    onOpenChange,
    ppmpPriceList = [],
    chartOfAccounts,
    selectedEntry = null,
    ppmpItems = [],
}: PpmpDialogProps) {
    const [filteredPriceList, setFilteredPriceList] = useState(ppmpPriceList);
    const [useCustomItem, setUseCustomItem] = useState(false);

    const mooeAccounts = chartOfAccounts.filter(
        (account) => account.expense_class === 'MOOE',
    );

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            ppmp_price_list_id: '',
            chart_of_account_id: '',
            item_name: '',
            unit_of_measurement: '',
            price: '',
        },
    });

    const { watch, setValue, handleSubmit, control, reset } = form;
    const selectedPriceListId = watch('ppmp_price_list_id');
    const selectedChartAccountId = watch('chart_of_account_id');

    const handleToggleChange = (isCustom: boolean) => {
        setUseCustomItem(isCustom);
        reset({
            ppmp_price_list_id: '',
            chart_of_account_id: '',
            item_name: '',
            unit_of_measurement: '',
            price: '',
        });
    };

    // Auto-populate logic
    useEffect(() => {
        if (selectedPriceListId && !useCustomItem) {
            const selectedItem = ppmpPriceList.find(
                (item) => item.id.toString() === selectedPriceListId,
            );
            if (selectedItem) {
                setValue(
                    'chart_of_account_id',
                    selectedItem.chart_of_account_id.toString(),
                );
                setValue('item_name', selectedItem.description);
                setValue(
                    'unit_of_measurement',
                    selectedItem.unit_of_measurement,
                );
                setValue('price', selectedItem.price.toString());
            }
        }
    }, [selectedPriceListId, ppmpPriceList, setValue, useCustomItem]);

    // Filter Logic
    useEffect(() => {
        if (selectedChartAccountId) {
            const filtered = ppmpPriceList.filter(
                (item) =>
                    item.chart_of_account_id.toString() ===
                    selectedChartAccountId,
            );
            setFilteredPriceList(filtered);
        } else {
            setFilteredPriceList(ppmpPriceList);
        }
    }, [selectedChartAccountId, ppmpPriceList]);

    function onSubmit(data: z.infer<typeof formSchema>) {
        if (!selectedEntry) {
            alert('Please select an AIP entry first');
            return;
        }

        const baseMonthlyData = {
            aip_entry_id: selectedEntry.id,
            quantity: 0,
            jan_qty: 0,
            jan_amount: 0,
            feb_qty: 0,
            feb_amount: 0,
            mar_qty: 0,
            mar_amount: 0,
            apr_qty: 0,
            apr_amount: 0,
            may_qty: 0,
            may_amount: 0,
            jun_qty: 0,
            jun_amount: 0,
            jul_qty: 0,
            jul_amount: 0,
            aug_qty: 0,
            aug_amount: 0,
            sep_qty: 0,
            sep_amount: 0,
            oct_qty: 0,
            oct_amount: 0,
            nov_qty: 0,
            nov_amount: 0,
            dec_qty: 0,
            dec_amount: 0,
        };

        if (data.ppmp_price_list_id) {
            router.post(
                '/ppmp',
                {
                    ...baseMonthlyData,
                    ppmp_price_list_id: parseInt(data.ppmp_price_list_id),
                },
                {
                    onSuccess: () => {
                        reset();
                        // Consider using router.reload({ only: ['ppmpItems'] }) for better performance
                        router.reload();
                    },
                },
            );
        } else {
            const lastItemNumber =
                ppmpPriceList.length > 0
                    ? Math.max(
                          ...ppmpPriceList.map(
                              (item) => parseInt(item.item_number) || 0,
                          ),
                      )
                    : 0;

            const customPriceListData = {
                item_number: lastItemNumber + 1,
                description: data.item_name,
                unit_of_measurement: data.unit_of_measurement,
                price: parseFloat(data.price || '0'),
                chart_of_account_id: parseInt(data.chart_of_account_id || '0'),
            };

            router.post('/ppmp-price-list', customPriceListData, {
                onSuccess: (response: any) => {
                    // Check if response has props, otherwise might need to fetch
                    const newList = response.props.ppmpPriceList || [];
                    const newItem = newList[newList.length - 1];
                    const newId = newItem ? newItem.id : null;

                    if (newId) {
                        router.post(
                            '/ppmp',
                            { ...baseMonthlyData, ppmp_price_list_id: newId },
                            {
                                onSuccess: () => {
                                    reset();
                                    router.reload();
                                },
                            },
                        );
                    }
                },
            });
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="flex h-[90vh] flex-col lg:max-w-[90vw]">
                <DialogHeader>
                    <DialogTitle>PPMP Management</DialogTitle>
                    <DialogDescription>
                        Add procurement items and view the PPMP table below.
                    </DialogDescription>
                </DialogHeader>

                <ScrollArea className="h-100">
                    {/* Mode Toggle */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                            <Switch
                                id="mode-switch"
                                checked={useCustomItem}
                                onCheckedChange={handleToggleChange}
                            />
                            <FieldLabel
                                htmlFor="mode-switch"
                                className="cursor-pointer font-bold"
                            >
                                {useCustomItem
                                    ? 'Custom Item Mode'
                                    : 'Price List Mode'}
                            </FieldLabel>
                        </div>
                    </div>

                    <form
                        onSubmit={handleSubmit(onSubmit)}
                        className="space-y-4"
                    >
                        {/* <FieldGroup className="grid grid-cols-1 items-start gap-4 md:grid-cols-2 lg:grid-cols-4"> */}
                        {/* 1. Item Selection (Price List Mode) */}
                        {!useCustomItem && (
                            <Controller
                                name="ppmp_price_list_id"
                                control={control}
                                render={({ field, fieldState }) => (
                                    <Field
                                        className="col-span-1 md:col-span-2"
                                        data-invalid={fieldState.invalid}
                                    >
                                        <FieldLabel htmlFor={field.name}>
                                            Select Item
                                        </FieldLabel>
                                        <Select
                                            name={field.name}
                                            value={field.value}
                                            onValueChange={field.onChange}
                                        >
                                            <SelectTrigger
                                                id={field.name}
                                                aria-invalid={
                                                    fieldState.invalid
                                                }
                                            >
                                                <SelectValue placeholder="Search price list..." />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {filteredPriceList.map(
                                                    (item) => (
                                                        <SelectItem
                                                            key={item.id}
                                                            value={item.id.toString()}
                                                        >
                                                            {item.item_number} -{' '}
                                                            {item.description}
                                                        </SelectItem>
                                                    ),
                                                )}
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
                        )}

                        {/* 2. Custom Item Name (Custom Mode) */}
                        {useCustomItem && (
                            <Controller
                                name="item_name"
                                control={control}
                                render={({ field, fieldState }) => (
                                    <Field
                                        className="col-span-1 md:col-span-2"
                                        data-invalid={fieldState.invalid}
                                    >
                                        <FieldLabel htmlFor={field.name}>
                                            Item Name
                                        </FieldLabel>
                                        <Input
                                            {...field}
                                            id={field.name}
                                            placeholder="Enter item name..."
                                            aria-invalid={fieldState.invalid}
                                        />
                                        {fieldState.invalid && (
                                            <FieldError
                                                errors={[fieldState.error]}
                                            />
                                        )}
                                    </Field>
                                )}
                            />
                        )}

                        {/* 3. Chart of Account */}
                        <Controller
                            name="chart_of_account_id"
                            control={control}
                            render={({ field, fieldState }) => (
                                <Field
                                    className="col-span-1 md:col-span-2"
                                    data-invalid={fieldState.invalid}
                                >
                                    <FieldLabel htmlFor={field.name}>
                                        Chart of Account (MOOE)
                                    </FieldLabel>
                                    <Select
                                        name={field.name}
                                        value={field.value}
                                        onValueChange={field.onChange}
                                    >
                                        <SelectTrigger
                                            id={field.name}
                                            aria-invalid={fieldState.invalid}
                                        >
                                            <SelectValue placeholder="Select account" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {mooeAccounts.map((acc) => (
                                                <SelectItem
                                                    key={acc.id}
                                                    value={acc.id.toString()}
                                                >
                                                    {acc.account_number} -{' '}
                                                    {acc.account_title}
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

                        {/* 4. Unit of Measurement */}
                        <Controller
                            name="unit_of_measurement"
                            control={control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor={field.name}>
                                        Unit
                                    </FieldLabel>
                                    <Input
                                        {...field}
                                        id={field.name}
                                        disabled={!useCustomItem}
                                        placeholder="pcs/ream"
                                        aria-invalid={fieldState.invalid}
                                    />
                                    {fieldState.invalid && (
                                        <FieldError
                                            errors={[fieldState.error]}
                                        />
                                    )}
                                </Field>
                            )}
                        />

                        {/* 5. Price */}
                        <Controller
                            name="price"
                            control={control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor={field.name}>
                                        Price
                                    </FieldLabel>
                                    <Input
                                        {...field}
                                        id={field.name}
                                        type="number"
                                        step="0.01"
                                        disabled={!useCustomItem}
                                        placeholder="0.00"
                                        aria-invalid={fieldState.invalid}
                                    />
                                    {fieldState.invalid && (
                                        <FieldError
                                            errors={[fieldState.error]}
                                        />
                                    )}
                                </Field>
                            )}
                        />
                        {/* </FieldGroup> */}

                        <div className="flex justify-end gap-2 pt-4">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => reset()}
                            >
                                Clear
                            </Button>
                            <Button type="submit">Add Item to PPMP</Button>
                        </div>
                    </form>

                    <Separator />

                    <div className="w-full">
                        <h3 className="mb-2 text-lg font-semibold">
                            Current PPMP Items
                        </h3>
                        <ScrollArea className="w-100">
                            <PpmpTable
                                ppmpItems={ppmpItems}
                                selectedEntry={selectedEntry}
                            />
                            <ScrollBar orientation="horizontal" />
                        </ScrollArea>
                    </div>
                    <ScrollBar orientation="vertical" />
                </ScrollArea>
            </DialogContent>
        </Dialog>
    );
}
