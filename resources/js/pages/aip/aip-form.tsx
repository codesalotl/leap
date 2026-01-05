import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import type { AipFormProp } from '@/pages/aip/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { router } from '@inertiajs/react';
import Decimal from 'decimal.js';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const formSchema = z.object({
    // id: z.number(),
    aipRefCode: z.string().nonempty(),
    ppaDescription: z.string().nonempty(),
    implementingOfficeDepartmentLocation: z.string().nonempty(),
    scheduleOfImplementation: z.object({
        startingDate: z.string().nonempty(),
        completionDate: z.string().nonempty(),
    }),
    expectedOutputs: z.string().nonempty(),
    fundingSource: z.string().nonempty(),
    amount: z.object({
        ps: z
            .string()
            .trim()
            .min(1, 'Amount is required.')
            .regex(
                /^([1-9]\d*|0)(\.\d{1,2})?$/,
                'Must be a valid non-negative amount with up to 2 decimal places (e.g., 100.00)',
            )
            .refine(
                (val) => {
                    const num = parseFloat(val);
                    return num > 0;
                },
                {
                    message: 'Amount must be greater than zero.',
                },
            ),
        mooe: z.string().nonempty(),
        fe: z.string().nonempty(),
        co: z.string().nonempty(),
        total: z.string().nonempty(),
    }),
    amountOfCcExpenditure: z.object({
        ccAdaptation: z.string().nonempty(),
        ccMitigation: z.string().nonempty(),
    }),
    ccTypologyCode: z.string().nonempty(),
    // children?: Aip[],
    // created_at: z.string(),
    // updated_at: z.string(),
});

function calculateTotal(
    ps: string,
    mooe: string,
    fe: string,
    co: string,
): string {
    const psDecimal = new Decimal(ps);
    const mooeDecimal = new Decimal(mooe);
    const feDecimal = new Decimal(fe);
    const coDecimal = new Decimal(co);

    const totalAmount = psDecimal
        .plus(mooeDecimal)
        .plus(feDecimal)
        .plus(coDecimal);

    return totalAmount.toString();
}

export default function AipForm({
    id,
    aipRefCode,
    collectionId,
    data,
    mode,
}: AipFormProp) {
    // console.log(collectionId);
    // console.log(mode);
    console.log(id);
    console.log(data);
    console.log(aipRefCode);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: data,
    });

    const { watch, setValue } = form;

    useEffect(() => {
        const subscription = watch((value, { name, type }) => {
            if (
                name === 'amount.ps' ||
                name === 'amount.mooe' ||
                name === 'amount.fe' ||
                name === 'amount.co'
            ) {
                const { ps, mooe, fe, co } = value.amount;
                const newTotal = calculateTotal(ps, mooe, fe, co);

                setValue('amount.total', newTotal, { shouldValidate: true });
            }
        });

        return () => subscription.unsubscribe();
    }, [watch, setValue]);

    async function onSubmit(values: z.infer<typeof formSchema>) {
        let inertiaMethod: 'post' | 'patch' = 'post';
        let endpoint: string = '';

        const payload = {
            ...values,
            collectionId,
            id,
        };

        console.log(payload);

        switch (mode) {
            case 'create':
                inertiaMethod = 'post';
                endpoint = 'aip';
                break;
            case 'add':
                inertiaMethod = 'post';
                endpoint = `aip/${id}`;
                break;
            case 'edit':
                inertiaMethod = 'patch';
                endpoint = `aip/${data?.id}`;
                break;
            default:
                return;
        }

        router[inertiaMethod](`/${endpoint}`, payload, {
            onSuccess: () => {
                form.reset();
            },
            onError: (errors) => {
                console.error('Submission failed with errors:', errors);
            },
        });
    }

    return (
        <Form {...form}>
            <form
                id="aip-form"
                onSubmit={form.handleSubmit(onSubmit)}
                className="flex flex-col gap-4"
            >
                <div className="flex gap-4">
                    <div className="flex-1">
                        <div className="flex flex-col gap-4">
                            <FormField
                                control={form.control}
                                name="aipRefCode"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>AIP Ref. Code</FormLabel>
                                        <div>
                                            <FormControl>
                                                <Input
                                                    placeholder="shadcn"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </div>
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="ppaDescription"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            Program/Project/Activity Description
                                        </FormLabel>
                                        <div>
                                            <FormControl>
                                                <Input
                                                    placeholder="shadcn"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </div>
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="implementingOfficeDepartmentLocation"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            Implementing Office Department
                                            Location
                                        </FormLabel>
                                        <div>
                                            <FormControl>
                                                <Input
                                                    placeholder="shadcn"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </div>
                                    </FormItem>
                                )}
                            />

                            <div className="flex flex-col gap-2">
                                <p className="text-sm text-muted-foreground">
                                    Schedule of Implementation
                                </p>
                                <div className="flex flex-col gap-4">
                                    <FormField
                                        control={form.control}
                                        name="scheduleOfImplementation.startingDate"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>
                                                    Starting Date
                                                </FormLabel>
                                                <div>
                                                    <FormControl>
                                                        <Input
                                                            placeholder="shadcn"
                                                            {...field}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </div>
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="scheduleOfImplementation.completionDate"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>
                                                    Completion Date
                                                </FormLabel>
                                                <div>
                                                    <FormControl>
                                                        <Input
                                                            placeholder="shadcn"
                                                            {...field}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </div>
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex-1">
                        <div className="flex flex-col gap-4">
                            <FormField
                                control={form.control}
                                name="expectedOutputs"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Expected Outputs</FormLabel>
                                        <div>
                                            <FormControl>
                                                <Input
                                                    placeholder="shadcn"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </div>
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="fundingSource"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Funding Source</FormLabel>
                                        <div>
                                            <FormControl>
                                                <Input
                                                    placeholder="shadcn"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </div>
                                    </FormItem>
                                )}
                            />

                            <div className="flex flex-col gap-2">
                                <p className="text-sm text-muted-foreground">
                                    Amount of Climate Change Expenditure
                                </p>
                                <div className="flex flex-col gap-4">
                                    <FormField
                                        control={form.control}
                                        name="amountOfCcExpenditure.ccAdaptation"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>
                                                    Climate Change Adaption
                                                </FormLabel>
                                                <div>
                                                    <FormControl>
                                                        <Input
                                                            placeholder="shadcn"
                                                            {...field}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </div>
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="amountOfCcExpenditure.ccMitigation"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>
                                                    Climate Change Mitigation
                                                </FormLabel>
                                                <div>
                                                    <FormControl>
                                                        <Input
                                                            placeholder="shadcn"
                                                            {...field}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </div>
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            </div>

                            <FormField
                                control={form.control}
                                name="ccTypologyCode"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>CC Typology Code</FormLabel>
                                        <div>
                                            <FormControl>
                                                <Input
                                                    placeholder="shadcn"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </div>
                                    </FormItem>
                                )}
                            />
                        </div>
                    </div>
                </div>

                <div className="flex flex-col gap-2">
                    <p className="text-sm text-muted-foreground">Amount</p>
                    <div className="flex gap-4">
                        <FormField
                            control={form.control}
                            name="amount.ps"
                            render={({ field }) => (
                                <FormItem className="flex-1">
                                    <div className="flex flex-col justify-between gap-2">
                                        <FormLabel>
                                            Personal Services (PS)
                                        </FormLabel>
                                        <div>
                                            <FormControl>
                                                <Input
                                                    placeholder="0.00"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </div>
                                    </div>
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="amount.mooe"
                            render={({ field }) => (
                                <FormItem className="flex-1">
                                    <div className="flex flex-col justify-between gap-2">
                                        <FormLabel>
                                            Maintenance and Other Operating
                                            Expenses (MOOE)
                                        </FormLabel>
                                        <div>
                                            <FormControl>
                                                <Input
                                                    placeholder="0.00"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </div>
                                    </div>
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="amount.fe"
                            render={({ field }) => (
                                <FormItem className="flex-1">
                                    <div className="flex flex-col justify-between gap-2">
                                        <FormLabel>
                                            Financial Expenses (FE)
                                        </FormLabel>
                                        <div>
                                            <FormControl>
                                                <Input
                                                    placeholder="0.00"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </div>
                                    </div>
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="amount.co"
                            render={({ field }) => (
                                <FormItem className="flex-1">
                                    <div className="flex flex-col justify-between gap-2">
                                        <FormLabel>
                                            Capital Outlay (CO)
                                        </FormLabel>
                                        <div>
                                            <FormControl>
                                                <Input
                                                    placeholder="0.00"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </div>
                                    </div>
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="amount.total"
                            render={({ field }) => (
                                <FormItem className="flex-1">
                                    <div className="flex flex-col justify-between gap-2">
                                        <FormLabel>Total</FormLabel>
                                        <div>
                                            <FormControl>
                                                <Input
                                                    placeholder="0.00"
                                                    {...field}
                                                    readOnly
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </div>
                                    </div>
                                </FormItem>
                            )}
                        />
                    </div>
                </div>
                {/* <Button type="submit">Submit</Button> */}
            </form>
        </Form>
    );
}
