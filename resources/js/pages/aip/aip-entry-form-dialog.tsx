import React, { useEffect } from 'react';
import { useForm, useWatch, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import Decimal from 'decimal.js';
import { router } from '@inertiajs/react';
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
import {
    Field,
    FieldDescription,
    FieldError,
    FieldGroup,
    FieldLabel,
    FieldContent,
} from '@/components/ui/field';
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

interface LguLevel {
    code: string;
    created_at: string;
    id: number;
    level: string;
    updated_at: string;
}

interface OfficeType {
    code: string;
    created_at: string;
    id: number;
    type: string;
    updated_at: string;
}

interface Office {
    code: string;
    created_at: string;
    full_code: string;
    id: number;
    is_lee: boolean;
    lgu_level: LguLevel;
    lgu_level_id: number;
    name: string;
    office_type: OfficeType;
    office_type_id: number;
    sector: string | null;
    sector_id: string | null;
    update_at: string;
}

export interface AipEntry {
    id: number;
    ppa_id: number;
    parent_ppa_id: number | null;
    aip_ref_code: string;
    ppa_desc: string;
    implementing_office_department: string;
    sched_implementation: {
        start_date: string;
        completion_date: string;
    };
    expected_outputs: string;
    funding_source: string;
    amount: {
        ps: string;
        mooe: string;
        fe: string;
        co: string;
        total: string;
    };
    cc_adaptation: string;
    cc_mitigation: string;
    cc_typology_code: string;
    children?: AipEntry[];
}

interface AipFormProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    data: AipEntry;
    mode: string;
    offices: Office[];
}

const amountSchema = z
    .string()
    .trim()
    .regex(/^([0-9]\d*|0)(\.\d{1,2})?$/, 'Invalid amount');

const formSchema = z.object({
    ppa_id: z.number(),
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

export default function AipEntryFormDialog({
    open,
    onOpenChange,
    data,
    mode,
    offices,
}: AipFormProps) {
    console.log(data);
    // console.log(offices);

    // Mapping incoming JSON (Snake Case) to Form State (Camel Case)
    const getInitialValues = (d: any): z.infer<typeof formSchema> => ({
        ppa_id: d?.ppa_id || '',
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

    const form = useForm<z.infer<typeof formSchema>>({
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
        } catch (e) {
            // form.setValue('amount.total', '0.00');
        }
    }, [watchedAmounts, form]);

    function onSubmit(values: z.infer<typeof formSchema>) {
        console.log('values', values);

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
                                <Controller
                                    name="aipRefCode"
                                    control={form.control}
                                    render={({ field, fieldState }) => (
                                        <Field
                                            data-invalid={fieldState.invalid}
                                        >
                                            <FieldLabel htmlFor={field.name}>
                                                AIP Reference Code
                                            </FieldLabel>
                                            <Input
                                                {...field}
                                                id={field.name}
                                                aria-invalid={
                                                    fieldState.invalid
                                                }
                                                placeholder="Login button not working on mobile"
                                                autoComplete="off"
                                                readOnly
                                            />
                                            {/*<FieldDescription>
                                                Provide a concise title for your
                                                bug report.
                                            </FieldDescription>*/}
                                            {fieldState.invalid && (
                                                <FieldError
                                                    errors={[fieldState.error]}
                                                />
                                            )}
                                        </Field>
                                    )}
                                />

                                <Controller
                                    name="ppaDescription"
                                    control={form.control}
                                    render={({ field, fieldState }) => (
                                        <Field
                                            data-invalid={fieldState.invalid}
                                        >
                                            <FieldLabel htmlFor={field.name}>
                                                Program/Project/Activity
                                                Description
                                            </FieldLabel>
                                            <Input
                                                {...field}
                                                id={field.name}
                                                aria-invalid={
                                                    fieldState.invalid
                                                }
                                                placeholder="Login button not working on mobile"
                                                autoComplete="off"
                                            />
                                            {/*<FieldDescription>
                                                Provide a concise title for your
                                                bug report.
                                            </FieldDescription>*/}
                                            {fieldState.invalid && (
                                                <FieldError
                                                    errors={[fieldState.error]}
                                                />
                                            )}
                                        </Field>
                                    )}
                                />

                                <Controller
                                    name="implementingOfficeDepartmentLocation"
                                    control={form.control}
                                    render={({ field, fieldState }) => (
                                        <Field
                                            orientation="responsive"
                                            data-invalid={fieldState.invalid}
                                        >
                                            <FieldContent>
                                                <FieldLabel
                                                    htmlFor={field.name}
                                                >
                                                    Implementing
                                                    Office/Department
                                                </FieldLabel>
                                                {/*<FieldDescription>
                                                    Provide a concise title for your
                                                    bug report.
                                                </FieldDescription>*/}
                                                {fieldState.invalid && (
                                                    <FieldError
                                                        errors={[
                                                            fieldState.error,
                                                        ]}
                                                    />
                                                )}
                                            </FieldContent>
                                            {/*<Input
                                                {...field}
                                                id={field.name}
                                                aria-invalid={
                                                    fieldState.invalid
                                                }
                                                placeholder="Login button not working on mobile"
                                                autoComplete="off"
                                            />*/}
                                            <Select
                                                name={field.name}
                                                value={field.value}
                                                onValueChange={field.onChange}
                                                disabled={mode !== 'add'}
                                            >
                                                <SelectTrigger
                                                    id={field.name}
                                                    aria-invalid={
                                                        fieldState.invalid
                                                    }
                                                    className="min-w-[120px]"
                                                >
                                                    <SelectValue placeholder="Select" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {offices?.map((office) => (
                                                        <SelectItem
                                                            key={office.id}
                                                            value={office.name} // Or office.id, depending on what your schema expects
                                                        >
                                                            {office.name}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </Field>
                                    )}
                                />

                                <div className="grid grid-cols-2 gap-4 rounded-lg border bg-muted/30 p-4">
                                    <Controller
                                        name="scheduleOfImplementation.startingDate"
                                        control={form.control}
                                        render={({ field, fieldState }) => (
                                            <Field
                                                data-invalid={
                                                    fieldState.invalid
                                                }
                                            >
                                                <FieldLabel
                                                    htmlFor={field.name}
                                                >
                                                    Start Date
                                                </FieldLabel>
                                                <Input
                                                    {...field}
                                                    id={field.name}
                                                    aria-invalid={
                                                        fieldState.invalid
                                                    }
                                                    placeholder="Login button not working on mobile"
                                                    autoComplete="off"
                                                />
                                                {/*<FieldDescription>
                                                    Provide a concise title for your
                                                    bug report.
                                                </FieldDescription>*/}
                                                {fieldState.invalid && (
                                                    <FieldError
                                                        errors={[
                                                            fieldState.error,
                                                        ]}
                                                    />
                                                )}
                                            </Field>
                                        )}
                                    />

                                    <Controller
                                        name="scheduleOfImplementation.completionDate"
                                        control={form.control}
                                        render={({ field, fieldState }) => (
                                            <Field
                                                data-invalid={
                                                    fieldState.invalid
                                                }
                                            >
                                                <FieldLabel
                                                    htmlFor={field.name}
                                                >
                                                    Completion Date
                                                </FieldLabel>
                                                <Input
                                                    {...field}
                                                    id={field.name}
                                                    aria-invalid={
                                                        fieldState.invalid
                                                    }
                                                    placeholder="Login button not working on mobile"
                                                    autoComplete="off"
                                                />
                                                {/*<FieldDescription>
                                                    Provide a concise title for your
                                                    bug report.
                                                </FieldDescription>*/}
                                                {fieldState.invalid && (
                                                    <FieldError
                                                        errors={[
                                                            fieldState.error,
                                                        ]}
                                                    />
                                                )}
                                            </Field>
                                        )}
                                    />
                                </div>
                            </div>

                            {/* Right Column */}
                            <div className="space-y-4">
                                <Controller
                                    name="expectedOutputs"
                                    control={form.control}
                                    render={({ field, fieldState }) => (
                                        <Field
                                            data-invalid={fieldState.invalid}
                                        >
                                            <FieldLabel htmlFor={field.name}>
                                                Expected Outputs
                                            </FieldLabel>
                                            <Input
                                                {...field}
                                                id={field.name}
                                                aria-invalid={
                                                    fieldState.invalid
                                                }
                                                placeholder="Login button not working on mobile"
                                                autoComplete="off"
                                            />
                                            {/*<FieldDescription>
                                                Provide a concise title for your
                                                bug report.
                                            </FieldDescription>*/}
                                            {fieldState.invalid && (
                                                <FieldError
                                                    errors={[fieldState.error]}
                                                />
                                            )}
                                        </Field>
                                    )}
                                />

                                <Controller
                                    name="fundingSource"
                                    control={form.control}
                                    render={({ field, fieldState }) => (
                                        <Field
                                            data-invalid={fieldState.invalid}
                                        >
                                            <FieldLabel htmlFor={field.name}>
                                                Funding Source
                                            </FieldLabel>
                                            <Input
                                                {...field}
                                                id={field.name}
                                                aria-invalid={
                                                    fieldState.invalid
                                                }
                                                placeholder="Login button not working on mobile"
                                                autoComplete="off"
                                            />
                                            {/*<FieldDescription>
                                                Provide a concise title for your
                                                bug report.
                                            </FieldDescription>*/}
                                            {fieldState.invalid && (
                                                <FieldError
                                                    errors={[fieldState.error]}
                                                />
                                            )}
                                        </Field>
                                    )}
                                />

                                <Controller
                                    name="ccTypologyCode"
                                    control={form.control}
                                    render={({ field, fieldState }) => (
                                        <Field
                                            data-invalid={fieldState.invalid}
                                        >
                                            <FieldLabel htmlFor={field.name}>
                                                CC Typology Code
                                            </FieldLabel>
                                            <Input
                                                {...field}
                                                id={field.name}
                                                aria-invalid={
                                                    fieldState.invalid
                                                }
                                                placeholder="Login button not working on mobile"
                                                autoComplete="off"
                                            />
                                            {/*<FieldDescription>
                                                Provide a concise title for your
                                                bug report.
                                            </FieldDescription>*/}
                                            {fieldState.invalid && (
                                                <FieldError
                                                    errors={[fieldState.error]}
                                                />
                                            )}
                                        </Field>
                                    )}
                                />

                                <div className="grid grid-cols-2 gap-4 rounded-lg border bg-muted/30 p-4">
                                    <Controller
                                        name="amountOfCcExpenditure.ccAdaptation"
                                        control={form.control}
                                        render={({ field, fieldState }) => (
                                            <Field
                                                data-invalid={
                                                    fieldState.invalid
                                                }
                                            >
                                                <FieldLabel
                                                    htmlFor={field.name}
                                                >
                                                    Climate Change Adaptation
                                                </FieldLabel>
                                                <Input
                                                    {...field}
                                                    id={field.name}
                                                    aria-invalid={
                                                        fieldState.invalid
                                                    }
                                                    placeholder="Login button not working on mobile"
                                                    autoComplete="off"
                                                />
                                                {/*<FieldDescription>
                                                    Provide a concise title for your
                                                    bug report.
                                                </FieldDescription>*/}
                                                {fieldState.invalid && (
                                                    <FieldError
                                                        errors={[
                                                            fieldState.error,
                                                        ]}
                                                    />
                                                )}
                                            </Field>
                                        )}
                                    />

                                    <Controller
                                        name="amountOfCcExpenditure.ccMitigation"
                                        control={form.control}
                                        render={({ field, fieldState }) => (
                                            <Field
                                                data-invalid={
                                                    fieldState.invalid
                                                }
                                            >
                                                <FieldLabel
                                                    htmlFor={field.name}
                                                >
                                                    Climate Change Mitigation
                                                </FieldLabel>
                                                <Input
                                                    {...field}
                                                    id={field.name}
                                                    aria-invalid={
                                                        fieldState.invalid
                                                    }
                                                    placeholder="Login button not working on mobile"
                                                    autoComplete="off"
                                                />
                                                {/*<FieldDescription>
                                                    Provide a concise title for your
                                                    bug report.
                                                </FieldDescription>*/}
                                                {fieldState.invalid && (
                                                    <FieldError
                                                        errors={[
                                                            fieldState.error,
                                                        ]}
                                                    />
                                                )}
                                            </Field>
                                        )}
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
                                <Controller
                                    name="amount.ps"
                                    control={form.control}
                                    render={({ field, fieldState }) => (
                                        <Field
                                            data-invalid={fieldState.invalid}
                                        >
                                            <FieldLabel htmlFor={field.name}>
                                                PS
                                            </FieldLabel>
                                            <Input
                                                {...field}
                                                id={field.name}
                                                aria-invalid={
                                                    fieldState.invalid
                                                }
                                                placeholder="Login button not working on mobile"
                                                autoComplete="off"
                                            />
                                            {/*<FieldDescription>
                                                Provide a concise title for your
                                                bug report.
                                            </FieldDescription>*/}
                                            {fieldState.invalid && (
                                                <FieldError
                                                    errors={[fieldState.error]}
                                                />
                                            )}
                                        </Field>
                                    )}
                                />

                                <Controller
                                    name="amount.mooe"
                                    control={form.control}
                                    render={({ field, fieldState }) => (
                                        <Field
                                            data-invalid={fieldState.invalid}
                                        >
                                            <FieldLabel htmlFor={field.name}>
                                                MOOE
                                            </FieldLabel>
                                            <Input
                                                {...field}
                                                id={field.name}
                                                aria-invalid={
                                                    fieldState.invalid
                                                }
                                                placeholder="Login button not working on mobile"
                                                autoComplete="off"
                                            />
                                            {/*<FieldDescription>
                                                Provide a concise title for your
                                                bug report.
                                            </FieldDescription>*/}
                                            {fieldState.invalid && (
                                                <FieldError
                                                    errors={[fieldState.error]}
                                                />
                                            )}
                                        </Field>
                                    )}
                                />

                                <Controller
                                    name="amount.fe"
                                    control={form.control}
                                    render={({ field, fieldState }) => (
                                        <Field
                                            data-invalid={fieldState.invalid}
                                        >
                                            <FieldLabel htmlFor={field.name}>
                                                FE
                                            </FieldLabel>
                                            <Input
                                                {...field}
                                                id={field.name}
                                                aria-invalid={
                                                    fieldState.invalid
                                                }
                                                placeholder="Login button not working on mobile"
                                                autoComplete="off"
                                            />
                                            {/*<FieldDescription>
                                                Provide a concise title for your
                                                bug report.
                                            </FieldDescription>*/}
                                            {fieldState.invalid && (
                                                <FieldError
                                                    errors={[fieldState.error]}
                                                />
                                            )}
                                        </Field>
                                    )}
                                />

                                <Controller
                                    name="amount.co"
                                    control={form.control}
                                    render={({ field, fieldState }) => (
                                        <Field
                                            data-invalid={fieldState.invalid}
                                        >
                                            <FieldLabel htmlFor={field.name}>
                                                CO
                                            </FieldLabel>
                                            <Input
                                                {...field}
                                                id={field.name}
                                                aria-invalid={
                                                    fieldState.invalid
                                                }
                                                placeholder="Login button not working on mobile"
                                                autoComplete="off"
                                            />
                                            {/*<FieldDescription>
                                                Provide a concise title for your
                                                bug report.
                                            </FieldDescription>*/}
                                            {fieldState.invalid && (
                                                <FieldError
                                                    errors={[fieldState.error]}
                                                />
                                            )}
                                        </Field>
                                    )}
                                />

                                <Controller
                                    name="amount.total"
                                    control={form.control}
                                    render={({ field, fieldState }) => (
                                        <Field
                                            data-invalid={fieldState.invalid}
                                        >
                                            <FieldLabel htmlFor={field.name}>
                                                TOTAL
                                            </FieldLabel>
                                            <Input
                                                {...field}
                                                id={field.name}
                                                aria-invalid={
                                                    fieldState.invalid
                                                }
                                                placeholder="Login button not working on mobile"
                                                autoComplete="off"
                                                readOnly
                                            />
                                            {/*<FieldDescription>
                                                Provide a concise title for your
                                                bug report.
                                            </FieldDescription>*/}
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
