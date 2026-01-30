import PpmpTable from '@/pages/aip/ppmp-table/page';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useEffect, useState } from 'react';
import { router } from '@inertiajs/react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
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

const formSchema = z.object({
    ppmp_price_list_id: z.string().optional(),
    chart_of_account_id: z.string().optional(),
    item_name: z.string().optional(),
    unit_of_measurement: z.string().optional(),
    price: z.string().optional(),
}).refine((data) => data.ppmp_price_list_id || data.item_name, {
    message: "Either select an item or enter a custom item name",
    path: ["item_name"],
}).refine((data) => {
    if (data.ppmp_price_list_id) {
        return true; // Unit and price come from selection
    }
    // For custom items, all fields are required
    return data.item_name && data.unit_of_measurement && data.price && data.chart_of_account_id;
}, {
    message: "Item name, unit, price, and chart of account are required for custom items",
    path: ["item_name"],
});

export default function PpmpDialog({ open, onOpenChange, ppmpPriceList = [], chartOfAccounts = [], selectedEntry = null, ppmpItems = [] }) {
    const [filteredPriceList, setFilteredPriceList] = useState(ppmpPriceList);
    const [useCustomItem, setUseCustomItem] = useState(false);
    
    // Filter chart of accounts to show only MOOE accounts
    const mooeAccounts = chartOfAccounts.filter(account => 
        account.expense_class === 'MOOE' || 
        account.account_number?.startsWith('5-02')
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

    const { watch, setValue } = form;
    const selectedPriceListId = watch('ppmp_price_list_id');
    const selectedChartAccountId = watch('chart_of_account_id');
    const itemName = watch('item_name');

    // Handle toggle between select and custom
    const handleToggleChange = (isCustom: boolean) => {
        setUseCustomItem(isCustom);
        if (isCustom) {
            // Switching to custom mode
            setValue('ppmp_price_list_id', '');
            setValue('item_name', '');
            setValue('unit_of_measurement', '');
            setValue('price', '');
            setValue('chart_of_account_id', '');
        } else {
            // Switching to select mode
            setValue('item_name', '');
            setValue('unit_of_measurement', '');
            setValue('price', '');
            setValue('ppmp_price_list_id', '');
            setValue('chart_of_account_id', '');
        }
    };

    // Auto-populate chart of account when price list is selected
    useEffect(() => {
        if (selectedPriceListId && !useCustomItem) {
            const selectedItem = ppmpPriceList.find(item => item.id.toString() === selectedPriceListId);
            if (selectedItem) {
                setValue('chart_of_account_id', selectedItem.chart_of_account_id.toString());
                setValue('item_name', selectedItem.description);
                setValue('unit_of_measurement', selectedItem.unit_of_measurement);
                setValue('price', selectedItem.price.toString());
            }
        }
    }, [selectedPriceListId, ppmpPriceList, setValue, useCustomItem]);

    // Filter price list when chart of account is selected
    useEffect(() => {
        if (selectedChartAccountId) {
            const filtered = ppmpPriceList.filter(item => 
                item.chart_of_account_id.toString() === selectedChartAccountId
            );
            setFilteredPriceList(filtered);
        } else {
            setFilteredPriceList(ppmpPriceList);
        }
    }, [selectedChartAccountId, ppmpPriceList]);

    function onSubmit(values: z.infer<typeof formSchema>) {
        console.log('Form submitted with values:', values);
        console.log('Selected entry:', selectedEntry);
        
        if (!selectedEntry) {
            console.error('No AIP entry selected');
            alert('Please select an AIP entry first');
            return;
        }

        if (values.ppmp_price_list_id) {
            // Using existing price list item
            const ppmpData = {
                aip_entry_id: selectedEntry.id,
                ppmp_price_list_id: parseInt(values.ppmp_price_list_id),
                quantity: 0, // Leave blank as requested
                // Monthly quantities - all start at 0
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

            router.post('/ppmp', ppmpData, {
                onSuccess: (page) => {
                    console.log('PPMP item created successfully', page);
                    form.reset();
                    onOpenChange(false);
                    router.reload();
                },
                onError: (errors) => {
                    console.error('Error creating PPMP item:', errors);
                    // Show error message to user
                    alert('Error creating PPMP item: ' + JSON.stringify(errors));
                },
                onFinish: () => {
                    console.log('PPMP creation request finished');
                },
            });
        } else {
            // Custom item - create price list entry first, then PPMP
            
            // Find the last item number and increment it
            const lastItemNumber = ppmpPriceList.length > 0 
                ? Math.max(...ppmpPriceList.map(item => parseInt(item.item_number) || 0))
                : 0;
            
            const customPriceListData = {
                item_number: lastItemNumber + 1, // Increment last item number
                description: values.item_name,
                unit_of_measurement: values.unit_of_measurement,
                price: parseFloat(values.price),
                chart_of_account_id: parseInt(values.chart_of_account_id),
            };

            // First create the custom price list entry
            router.post('/ppmp-price-list', customPriceListData, {
                onSuccess: (response) => {
                    console.log('Custom price list created successfully', response);
                    
                    // Then create the PPMP item with the new price list ID
                    const ppmpData = {
                        aip_entry_id: selectedEntry.id,
                        ppmp_price_list_id: response.props.ppmpPriceList[response.props.ppmpPriceList.length - 1].id, // Get the newly created item
                        quantity: 0,
                        // Monthly quantities - all start at 0
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

                    router.post('/ppmp', ppmpData, {
                        onSuccess: () => {
                            console.log('Custom PPMP item created successfully');
                            form.reset();
                            onOpenChange(false);
                            router.reload();
                        },
                        onError: (errors) => {
                            console.error('Error creating custom PPMP item:', errors);
                            alert('Error creating custom PPMP item: ' + JSON.stringify(errors));
                        },
                    });
                },
                onError: (errors) => {
                    console.error('Error creating custom price list item:', errors);
                    alert('Error creating custom price list item: ' + JSON.stringify(errors));
                },
            });
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            {/* h-[90vh] ensures the dialog has a consistent height.
        overflow-hidden prevents the dialog itself from showing a double scrollbar.
      */}
            <DialogContent className="flex h-[90vh] w-full max-w-[90vw] flex-col overflow-y-auto p-0 lg:max-w-7xl">
                {/* Header - Fixed at the top */}
                <DialogHeader className="flex-none p-6 pb-2">
                    <DialogTitle className="text-2xl">
                        PPMP Management
                    </DialogTitle>
                    <DialogDescription>
                        Add procurement items and view the PPMP table below.
                    </DialogDescription>
                </DialogHeader>

                {/* Main Content - Native scrolling */}
                <div className="space-y-8 p-6 pb-10">
                    {/* Form Section */}
                    <section className="space-y-4">
                        <h3 className="text-lg font-semibold">
                            Add New Item
                        </h3>
                        <Form {...form}>
                            <form
                                onSubmit={form.handleSubmit(onSubmit)}
                                className="space-y-4"
                            >
                                <div className="grid grid-cols-1 gap-4">
                                    {/* Toggle for Select vs Custom */}
                                    <div className="col-span-1">
                                        <div className="flex items-center space-x-2">
                                            <Switch
                                                checked={useCustomItem}
                                                onCheckedChange={handleToggleChange}
                                            />
                                            <FormLabel className="text-sm font-medium">
                                                {useCustomItem ? 'Add Custom Item' : 'Select from Price List'}
                                            </FormLabel>
                                        </div>
                                        <FormDescription>
                                            {useCustomItem 
                                                ? 'Enter a custom item name and select chart of account'
                                                : 'Select an item from the PPMP price list'
                                            }
                                        </FormDescription>
                                    </div>

                                    {!useCustomItem ? (
                                        // Select from Price List Mode
                                        <FormField
                                            control={form.control}
                                            name="ppmp_price_list_id"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>
                                                        Select Item
                                                    </FormLabel>
                                                    <Select
                                                        onValueChange={(value) => {
                                                            field.onChange(value);
                                                            // Clear chart account if price list is cleared
                                                            if (!value) {
                                                                setValue('chart_of_account_id', '');
                                                                setValue('item_name', '');
                                                                setValue('unit_of_measurement', '');
                                                                setValue('price', '');
                                                            }
                                                        }}
                                                        value={field.value}
                                                    >
                                                        <FormControl>
                                                            <SelectTrigger>
                                                                <SelectValue placeholder="Select PPMP item" />
                                                            </SelectTrigger>
                                                        </FormControl>
                                                        <SelectContent>
                                                            {filteredPriceList.map((item) => (
                                                                <SelectItem key={item.id} value={item.id.toString()}>
                                                                    {item.item_number} - {item.description}
                                                                </SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    ) : (
                                        // Custom Item Mode
                                        <FormField
                                            control={form.control}
                                            name="item_name"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>
                                                        Custom Item Name
                                                    </FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            placeholder="Enter custom item name"
                                                            {...field}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    )}

                                    <FormField
                                        control={form.control}
                                        name="chart_of_account_id"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>
                                                    Chart of Account (MOOE)
                                                </FormLabel>
                                                <Select
                                                    onValueChange={(value) => {
                                                        field.onChange(value);
                                                        // Clear price list if chart account changes
                                                        if (!useCustomItem && value !== selectedChartAccountId) {
                                                            setValue('ppmp_price_list_id', '');
                                                        }
                                                    }}
                                                    value={field.value}
                                                >
                                                    <FormControl>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Select MOOE chart of account" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        {mooeAccounts.map((account) => (
                                                            <SelectItem key={account.id} value={account.id.toString()}>
                                                                {account.account_code} - {account.account_title}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="unit_of_measurement"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>
                                                    Unit of Measurement
                                                </FormLabel>
                                                <FormControl>
                                                    <Input
                                                        placeholder="e.g., pcs, ream, month"
                                                        {...field}
                                                        disabled={!useCustomItem}
                                                    />
                                                </FormControl>
                                                <FormDescription>
                                                    {!useCustomItem 
                                                        ? "Auto-filled from selection"
                                                        : "Enter unit of measurement"
                                                    }
                                                </FormDescription>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="price"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>
                                                    Price
                                                </FormLabel>
                                                <FormControl>
                                                    <Input
                                                        type="number"
                                                        step="0.01"
                                                        placeholder="0.00"
                                                        {...field}
                                                        disabled={!useCustomItem}
                                                    />
                                                </FormControl>
                                                <FormDescription>
                                                    {!useCustomItem 
                                                        ? "Auto-filled from selection"
                                                        : "Enter unit price"
                                                    }
                                                </FormDescription>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <div className="flex justify-end space-x-2">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => form.reset()}
                                    >
                                        Clear
                                    </Button>
                                    <Button type="submit">Add Item</Button>
                                </div>
                            </form>
                        </Form>
                    </section>

                    <Separator />

                    {/* Table Section */}
                    <section className="space-y-4">
                        <h3 className="text-lg font-semibold">
                            Current PPMP Items
                        </h3>

                        {/* Table with horizontal scroll */}
                        <div className="rounded-md border bg-card overflow-x-auto">
                            <div className="min-w-[800px] p-4">
                                <PpmpTable ppmpItems={ppmpItems} selectedEntry={selectedEntry} />
                            </div>
                        </div>
                    </section>
                </div>
            </DialogContent>
        </Dialog>
    );
}
