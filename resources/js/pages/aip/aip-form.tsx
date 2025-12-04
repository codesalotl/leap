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
import { useForm } from 'react-hook-form';
import { z } from 'zod';

type Aip = {
    id: number;
    aipRefCode: string;
    ppaDescription: string;
    implementingOfficeDepartmentLocation: string;
    scheduleOfImplementation: {
        startingDate: string;
        completionDate: string;
    };
    expectedOutputs: string;
    fundingSource: string;
    amount: {
        ps: number;
        mooe: number;
        fe: number;
        co: number;
        total: number;
    };
    amountOfCcExpenditure: {
        ccAdaptation: string;
        ccMitigation: string;
    };
    ccTypologyCode: string;
    children?: Aip[];
    created_at: string;
    updated_at: string;
};

type AipFormProp = {
    data: Aip;
};

const formSchema = z.object({
    // id: z.number(),
    aipRefCode: z.string(),
    ppaDescription: z.string(),
    implementingOfficeDepartmentLocation: z.string(),
    scheduleOfImplementation: z.object({
        startingDate: z.string(),
        completionDate: z.string(),
    }),
    expectedOutputs: z.string(),
    fundingSource: z.string(),
    amount: z.object({
        ps: z.string(),
        mooe: z.string(),
        fe: z.string(),
        co: z.string(),
        total: z.string(),
    }),
    amountOfCcExpenditure: z.object({
        ccAdaptation: z.string(),
        ccMitigation: z.string(),
    }),
    ccTypologyCode: z.string(),
    // children?: Aip[],
    // created_at: z.string(),
    // updated_at: z.string(),
});

export default function AipForm({ data }: AipFormProp) {
    // 1. Define your form.
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        // defaultValues: {
        //     aipRefCode: '',
        //     ppaDescription: '',
        //     implementingOfficeDepartmentLocation: '',
        //     scheduleOfImplementation: {
        //         startingDate: '',
        //         completionDate: '',
        //     },
        //     expectedOutputs: '',
        //     fundingSource: '',
        //     amount: {
        //         ps: 0,
        //         mooe: 0,
        //         fe: 0,
        //         co: 0,
        //         total: 0,
        //     },
        //     amountOfCcExpenditure: {
        //         ccAdaptation: '',
        //         ccMitigation: '',
        //     },
        //     ccTypologyCode: '',
        //     // children?: Aip[],
        // },
        defaultValues: data,
    });

    // 2. Define a submit handler.
    function onSubmit(values: z.infer<typeof formSchema>) {
        // Do something with the form values.
        // ✅ This will be type-safe and validated.
        console.log(values);
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
                                        <FormControl>
                                            <Input
                                                placeholder="shadcn"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
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
                                        <FormControl>
                                            <Input
                                                placeholder="shadcn"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
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
                                        <FormControl>
                                            <Input
                                                placeholder="shadcn"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
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
                                                <FormControl>
                                                    <Input
                                                        placeholder="shadcn"
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
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
                                                <FormControl>
                                                    <Input
                                                        placeholder="shadcn"
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
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
                                        <FormControl>
                                            <Input
                                                placeholder="shadcn"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="fundingSource"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Funding Source</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="shadcn"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
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
                                                <FormControl>
                                                    <Input
                                                        placeholder="shadcn"
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
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
                                                <FormControl>
                                                    <Input
                                                        placeholder="shadcn"
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
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
                                        <FormControl>
                                            <Input
                                                placeholder="shadcn"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
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
                                        <FormControl>
                                            <Input
                                                placeholder="shadcn"
                                                {...field}
                                            />
                                        </FormControl>
                                    </div>
                                    <FormMessage />
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
                                        <FormControl>
                                            <Input
                                                placeholder="shadcn"
                                                {...field}
                                            />
                                        </FormControl>
                                    </div>
                                    <FormMessage />
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
                                        <FormControl>
                                            <Input
                                                placeholder="shadcn"
                                                {...field}
                                            />
                                        </FormControl>
                                    </div>
                                    <FormMessage />
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
                                        <FormControl>
                                            <Input
                                                placeholder="shadcn"
                                                {...field}
                                            />
                                        </FormControl>
                                    </div>
                                    <FormMessage />
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
                                        <FormControl>
                                            <Input
                                                placeholder="shadcn"
                                                {...field}
                                            />
                                        </FormControl>
                                    </div>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                </div>

                {/*<Button type="submit">Submit</Button>*/}
            </form>
        </Form>
    );
}
