import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import { router } from '@inertiajs/react';
import Decimal from 'decimal.js';
import { useEffect, useCallback } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { z } from 'zod';

// Define the schema once
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
    id?: number | null; // Parent ID when adding child, or Record ID when editing
    collectionId?: number;
    data?: any; // Existing record for edit mode
    mode: 'create' | 'add' | 'edit';
    onSuccess?: () => void;
}

/**
 * Reusable Field Component to reduce boilerplate
 */
const CustomField = ({
    control,
    name,
    label,
    placeholder = '...',
    readOnly = false,
}: any) => (
    <FormField
        control={control}
        name={name}
        render={({ field }) => (
            <FormItem className="w-full">
                <FormLabel>{label}</FormLabel>
                <FormControl>
                    <Input
                        placeholder={placeholder}
                        {...field}
                        readOnly={readOnly}
                    />
                </FormControl>
                <FormMessage />
            </FormItem>
        )}
    />
);

export default function AipForm({
    id,
    collectionId,
    data,
    mode,
    onSuccess,
}: AipFormProps) {
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

    // Reset form whenever data or mode changes (Crucial for Shared Dialogs)
    useEffect(() => {
        form.reset(defaultValues);
    }, [data, mode, id]);

    // Watch amounts for total calculation
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
            // Silence decimal errors during typing
        }
    }, [watchedAmounts, form]);

    async function onSubmit(values: z.infer<typeof formSchema>) {
        // We send 'parent_id' if we are adding a child to an existing row
        // We send 'id' only if we are editing an existing row
        const payload = {
            ...values,
            parent_id: mode === 'add' ? id : null,
        };

        let inertiaMethod: 'post' | 'patch' = 'post';
        let endpoint = '/aip-ppa'; // Your URL

        if (mode === 'edit') {
            inertiaMethod = 'patch';
            endpoint = `/aip-ppa/${data?.id}`;
        }

        router[inertiaMethod](endpoint, payload, {
            onSuccess: () => {
                form.reset();
                onSuccess?.(); // Close dialog
            },
        });
    }

    return (
        <Form {...form}>
            <form
                id="aip-form"
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
                        />
                        <CustomField
                            control={form.control}
                            name="ppaDescription"
                            label="Program/Project/Activity Description"
                        />
                        <CustomField
                            control={form.control}
                            name="implementingOfficeDepartmentLocation"
                            label="Implementing Office/Dept"
                        />

                        <div className="space-y-4 rounded-lg border bg-muted/20 p-4">
                            <p className="text-sm font-semibold">
                                Schedule of Implementation
                            </p>
                            <div className="grid grid-cols-2 gap-4">
                                <CustomField
                                    control={form.control}
                                    name="scheduleOfImplementation.startingDate"
                                    label="Start"
                                />
                                <CustomField
                                    control={form.control}
                                    name="scheduleOfImplementation.completionDate"
                                    label="Completion"
                                />
                            </div>
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

                        <div className="space-y-4 rounded-lg border bg-muted/20 p-4">
                            <p className="text-sm font-semibold">
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

                {/* Bottom Row: Financials */}
                <div className="rounded-lg border bg-secondary/10 p-4">
                    <p className="mb-4 text-sm font-semibold">
                        Financial Allocation
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
    );
}
