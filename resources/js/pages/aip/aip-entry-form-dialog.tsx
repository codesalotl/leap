import React, { useEffect } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Decimal from 'decimal.js';
import { router } from '@inertiajs/react'; // Import Inertia router

import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';

const amountSchema = z
    .string()
    .trim()
    .regex(/^([0-9]\d*|0)(\.\d{1,2})?$/, 'Invalid amount');

const formSchema = z.object({
    aipRefCode: z.string().min(1, 'Reference code is required'),
    ppaDescription: z.string().min(1, 'Description is required'),
    implementingOfficeDepartmentLocation: z
        .string()
        .min(1, 'Location is required'),
    scheduleOfImplementation: z.object({
        startingDate: z.string().min(1, 'Start date is required'),
        completionDate: z.string().min(1, 'End date is required'),
    }),
    expectedOutputs: z.string().min(1, 'Outputs are required'),
    fundingSource: z.string().min(1, 'Funding source is required'),
    amount: z.object({
        ps: amountSchema,
        mooe: amountSchema,
        fe: amountSchema,
        co: amountSchema,
        total: z.string(),
    }),
    amountOfCcExpenditure: z.object({
        ccAdaptation: amountSchema,
        ccMitigation: amountSchema,
    }),
    ccTypologyCode: z.string().min(1, 'Typology code is required'),
});

type FormValues = z.infer<typeof formSchema>;

interface AipFormProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    data: any;
}

const CustomField = ({
    control,
    name,
    label,
    readOnly = false,
    type = 'text',
}: any) => (
    <FormField
        control={control}
        name={name}
        render={({ field }) => (
            <FormItem className="w-full">
                <FormLabel className="text-[10px] font-bold tracking-wider text-muted-foreground uppercase">
                    {label}
                </FormLabel>
                <FormControl>
                    <Input
                        type={type}
                        {...field}
                        readOnly={readOnly}
                        className={readOnly ? 'bg-muted/50 font-mono' : ''}
                    />
                </FormControl>
                <FormMessage />
            </FormItem>
        )}
    />
);

export default function AipEntryFormDialog({
    open,
    onOpenChange,
    data,
}: AipFormProps) {
    // Mapping incoming JSON (Snake Case) to Form State (Camel Case)
    const getInitialValues = (d: any): FormValues => ({
        aipRefCode: d?.aip_ref_code || '',
        ppaDescription: d?.ppa_desc || '',
        implementingOfficeDepartmentLocation:
            d?.implementing_office_department || '',
        scheduleOfImplementation: {
            startingDate:
                d?.sched_implementation?.start_date || d?.start_date || '',
            completionDate:
                d?.sched_implementation?.completion_date || d?.end_date || '',
        },
        expectedOutputs: d?.expected_outputs || d?.expected_output || '',
        fundingSource: d?.funding_source || '',
        amount: {
            ps: d?.amount?.ps || '0.00',
            mooe: d?.amount?.mooe || '0.00',
            fe: d?.amount?.fe || '0.00',
            co: d?.amount?.co || '0.00',
            total: d?.amount?.total || '0.00',
        },
        amountOfCcExpenditure: {
            // Note: In your JSON, these are top-level keys
            ccAdaptation: d?.cc_adaptation || d?.ccet_adaptation || '0.00',
            ccMitigation: d?.cc_mitigation || d?.ccet_mitigation || '0.00',
        },
        ccTypologyCode: d?.cc_typology_code || '',
    });

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: getInitialValues(data),
    });

    useEffect(() => {
        if (open) form.reset(getInitialValues(data));
    }, [data, open, form]);

    const watchedAmounts = useWatch({ control: form.control, name: 'amount' });

    useEffect(() => {
        const { ps, mooe, fe, co } = watchedAmounts || {};
        try {
            const total = new Decimal(ps || 0)
                .plus(mooe || 0)
                .plus(fe || 0)
                .plus(co || 0)
                .toFixed(2);
            if (watchedAmounts?.total !== total)
                form.setValue('amount.total', total);
        } catch (e) {}
    }, [watchedAmounts, form]);

    // Submission Handler
    function onSubmit(values: FormValues) {
        if (!data?.id) return;

        // Perform the Inertia PUT request to your defined route
        router.put(`/aip-entries/${data.id}`, values, {
            onSuccess: () => {
                onOpenChange(false);
                // Optional: Show a success toast here
            },
            preserveScroll: true,
        });
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-h-[90vh] max-w-full overflow-y-auto sm:max-w-4xl lg:max-w-5xl">
                <DialogHeader>
                    <DialogTitle>Edit AIP Entry</DialogTitle>
                    <DialogDescription>
                        Modify the details for this program/project allocation.
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form
                        id="aip-entry-form"
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-6"
                    >
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                            {/* Left Column */}
                            <div className="space-y-4">
                                <CustomField
                                    control={form.control}
                                    name="aipRefCode"
                                    label="AIP Ref. Code"
                                    readOnly
                                />
                                <CustomField
                                    control={form.control}
                                    name="ppaDescription"
                                    label="PPA Description"
                                />
                                <CustomField
                                    control={form.control}
                                    name="implementingOfficeDepartmentLocation"
                                    label="Office/Dept"
                                    readOnly
                                />
                                <div className="grid grid-cols-2 gap-4 rounded-lg border bg-muted/30 p-4">
                                    <CustomField
                                        control={form.control}
                                        name="scheduleOfImplementation.startingDate"
                                        label="Start Date"
                                        type="date"
                                    />
                                    <CustomField
                                        control={form.control}
                                        name="scheduleOfImplementation.completionDate"
                                        label="End Date"
                                        type="date"
                                    />
                                </div>
                            </div>
                            {/* Right Column */}
                            <div className="space-y-4">
                                <CustomField
                                    control={form.control}
                                    name="expectedOutputs"
                                    label="Expected Outputs"
                                />
                                <CustomField
                                    control={form.control}
                                    name="fundingSource"
                                    label="Funding Source"
                                />
                                <CustomField
                                    control={form.control}
                                    name="ccTypologyCode"
                                    label="CC Typology Code"
                                />
                                <div className="grid grid-cols-2 gap-4 rounded-lg border bg-muted/30 p-4">
                                    <CustomField
                                        control={form.control}
                                        name="amountOfCcExpenditure.ccAdaptation"
                                        label="Adaptation"
                                    />
                                    <CustomField
                                        control={form.control}
                                        name="amountOfCcExpenditure.ccMitigation"
                                        label="Mitigation"
                                    />
                                </div>
                            </div>
                        </div>
                        {/* Financial Allocation */}
                        <div className="rounded-lg border bg-muted/30 p-4">
                            <p className="mb-4 text-xs font-bold text-muted-foreground uppercase">
                                Financial Allocation (PHP)
                            </p>
                            <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
                                <CustomField
                                    control={form.control}
                                    name="amount.ps"
                                    label="PS"
                                />
                                <CustomField
                                    control={form.control}
                                    name="amount.mooe"
                                    label="MOOE"
                                />
                                <CustomField
                                    control={form.control}
                                    name="amount.fe"
                                    label="FE"
                                />
                                <CustomField
                                    control={form.control}
                                    name="amount.co"
                                    label="CO"
                                />
                                <CustomField
                                    control={form.control}
                                    name="amount.total"
                                    label="Total"
                                    readOnly
                                />
                            </div>
                        </div>
                    </form>
                </Form>
                <DialogFooter>
                    <Button
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                    >
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        form="aip-entry-form"
                        disabled={form.formState.isSubmitting}
                    >
                        {form.formState.isSubmitting
                            ? 'Saving...'
                            : 'Save changes'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
