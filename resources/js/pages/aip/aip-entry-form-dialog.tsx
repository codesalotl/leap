import React, { useEffect } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Decimal from 'decimal.js';

// If you are using shadcn/ui, keep these imports as they are.
// If this is for a pure sandbox, you'd replace these with standard HTML tags.
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

// --- SCHEMA DEFINITION ---
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

// --- MOCK PROPS FOR INDEPENDENT VIEWING ---
interface AipFormProps {
    id?: number | null;
    data?: any;
    mode?: 'create' | 'add' | 'edit';
    onSuccess?: (values: FormValues) => void;
}

const CustomField = ({
    control,
    name,
    label,
    placeholder = '...',
    readOnly = false,
    type = 'text',
}: any) => (
    <FormField
        control={control}
        name={name}
        render={({ field }) => (
            <FormItem className="w-full">
                <FormLabel className="text-xs font-bold tracking-wider text-muted-foreground uppercase">
                    {label}
                </FormLabel>
                <FormControl>
                    <Input
                        type={type}
                        placeholder={placeholder}
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

export default function AipFormStandalone({
    id = null,
    data = null,
    mode = 'create',
    onSuccess,
}: AipFormProps) {
    // 1. Setup Default Values
    const defaultValues: FormValues = {
        aipRefCode: data?.aipRefCode || '',
        ppaDescription: data?.ppaDescription || '',
        implementingOfficeDepartmentLocation:
            data?.implementingOfficeDepartmentLocation || '',
        scheduleOfImplementation: {
            startingDate: data?.scheduleOfImplementation?.startingDate || '',
            completionDate:
                data?.scheduleOfImplementation?.completionDate || '',
        },
        expectedOutputs: data?.expectedOutputs || '',
        fundingSource: data?.fundingSource || '',
        amount: {
            ps: data?.amount?.ps || '0.00',
            mooe: data?.amount?.mooe || '0.00',
            fe: data?.amount?.fe || '0.00',
            co: data?.amount?.co || '0.00',
            total: data?.amount?.total || '0.00',
        },
        amountOfCcExpenditure: {
            ccAdaptation: data?.amountOfCcExpenditure?.ccAdaptation || '0.00',
            ccMitigation: data?.amountOfCcExpenditure?.ccMitigation || '0.00',
        },
        ccTypologyCode: data?.ccTypologyCode || '',
    };

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues,
    });

    // 2. Auto-calculation Logic
    const watchedAmounts = useWatch({ control: form.control, name: 'amount' });

    useEffect(() => {
        const { ps, mooe, fe, co } = watchedAmounts || {};
        try {
            const total = new Decimal(ps || 0)
                .plus(mooe || 0)
                .plus(fe || 0)
                .plus(co || 0)
                .toFixed(2);

            if (watchedAmounts?.total !== total) {
                form.setValue('amount.total', total);
            }
        } catch (e) {
            /* Ignore parsing errors during typing */
        }
    }, [watchedAmounts, form]);

    // 3. Independent Submit Handler
    function onSubmit(values: FormValues) {
        console.log('Form Submitted Successfully:', values);
        alert('Form Submitted! Check console for payload.');
        onSuccess?.(values);
    }

    return (
        <div className="mx-auto max-w-5xl rounded-xl border bg-background p-6 shadow-sm">
            <div className="mb-6 border-b pb-4">
                <h2 className="text-xl font-semibold capitalize">
                    {mode} AIP PPA
                </h2>
                <p className="text-sm text-muted-foreground">
                    Fill out the details for the Annual Investment Program.
                </p>
            </div>

            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-8"
                >
                    <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                        {/* Left Column */}
                        <div className="space-y-5">
                            <CustomField
                                control={form.control}
                                name="aipRefCode"
                                label="AIP Ref. Code"
                            />
                            <CustomField
                                control={form.control}
                                name="ppaDescription"
                                label="PPA Description"
                            />
                            <CustomField
                                control={form.control}
                                name="implementingOfficeDepartmentLocation"
                                label="Implementing Office"
                            />

                            <div className="space-y-4 rounded-lg border bg-muted/30 p-4">
                                <p className="text-sm font-bold">
                                    Schedule of Implementation
                                </p>
                                <div className="grid grid-cols-2 gap-4">
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
                        </div>

                        {/* Right Column */}
                        <div className="space-y-5">
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

                            <div className="space-y-4 rounded-lg border bg-blue-50/30 p-4">
                                <p className="text-sm font-bold">
                                    Climate Change Expenditure
                                </p>
                                <div className="grid grid-cols-2 gap-4">
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
                    </div>

                    {/* Financial Allocation Row */}
                    <div className="rounded-lg border bg-primary/5 p-5">
                        <p className="mb-4 text-sm font-bold">
                            Financial Allocation (PHP)
                        </p>
                        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-5">
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

                    <div className="flex justify-end gap-3 border-t pt-6">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => form.reset()}
                        >
                            Reset Form
                        </Button>
                        <Button type="submit">
                            {mode === 'edit' ? 'Update Entry' : 'Save Entry'}
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    );
}
