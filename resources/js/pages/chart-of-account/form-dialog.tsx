import { useEffect, useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogClose,
} from '@/components/ui/dialog';
import type { ChartOfAccount } from '@/types/global';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
    Field,
    FieldError,
    FieldGroup,
    FieldLabel,
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Spinner } from '@/components/ui/spinner';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { router } from '@inertiajs/react';

interface FormDialogProps {
    open: boolean;
    setOpen: (open: boolean) => void;
    initialData: ChartOfAccount | null;
}

const formSchema = z.object({
    account_number: z
        .string()
        .trim()
        .min(1, { message: 'Account number is required' }),
    account_title: z
        .string()
        .trim()
        .min(1, { message: 'Account title is required' }),
    account_type: z.enum(
        ['ASSET', 'LIABILITY', 'EQUITY', 'REVENUE', 'EXPENSE'],
        {
            required_error: 'Account type is required',
        },
    ),
    expense_class: z.enum(['PS', 'MOOE', 'FE', 'CO']).nullable(),
    account_series: z.string().trim().nullable(),
    is_postable: z.boolean(),
    is_active: z.boolean(),
    normal_balance: z.enum(['DEBIT', 'CREDIT'], {
        required_error: 'Normal balance is required',
    }),
    description: z.string().trim().nullable(),
});

export default function FormDialog({
    open,
    setOpen,
    initialData,
}: FormDialogProps) {
    console.log(initialData);

    const [isLoading, setIsLoading] = useState(false);

    const isEditing = !!initialData;

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            account_number: '',
            account_title: '',
            account_type: 'ASSET',
            expense_class: null,
            account_series: '',
            is_postable: true,
            is_active: true,
            normal_balance: 'DEBIT',
            description: '',
        },
    });

    useEffect(() => {
        if (open) {
            form.reset(
                initialData ?? {
                    account_number: '',
                    account_title: '',
                    account_type: 'ASSET',
                    expense_class: null,
                    account_series: '',
                    is_postable: true,
                    is_active: true,
                    normal_balance: 'DEBIT',
                    description: '',
                },
            );
        }
    }, [initialData, open, form]);

    function onSubmit(data: z.infer<typeof formSchema>) {
        isEditing
            ? router.visit(`/chart-of-accounts/${initialData.id}`, {
                  method: 'patch',
                  data,
                  onStart: () => setIsLoading(true),
                  onFinish: () => setIsLoading(false),
                  onSuccess: () => setOpen(false),
              })
            : router.visit('/chart-of-accounts', {
                  method: 'post',
                  data,
                  onStart: () => setIsLoading(true),
                  onFinish: () => setIsLoading(false),
                  onSuccess: () => setOpen(false),
              });
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent
                className="flex max-h-[90vh] flex-col gap-0 overflow-hidden"
                onPointerDownOutside={(e) => isLoading && e.preventDefault()}
                onEscapeKeyDown={(e) => isLoading && e.preventDefault()}
            >
                <DialogHeader>
                    <DialogTitle>
                        {isEditing
                            ? 'Edit Chart of Account'
                            : 'Add New Chart of Account'}
                    </DialogTitle>
                    <DialogDescription>
                        {isEditing
                            ? 'Modify the details of the existing chart of account below.'
                            : 'Fill in the information to create a new chart of account record.'}
                    </DialogDescription>
                </DialogHeader>

                <div className="flex min-h-0 flex-1 pt-2">
                    <ScrollArea className="w-full flex-1 pr-3">
                        <form
                            id="chart-of-account-form"
                            onSubmit={form.handleSubmit(onSubmit)}
                        >
                            <FieldGroup className="pb-4">
                                <Controller
                                    name="account_number"
                                    control={form.control}
                                    render={({ field, fieldState }) => (
                                        <Field
                                            data-invalid={fieldState.invalid}
                                        >
                                            <FieldLabel htmlFor="chart-of-account-form-account-number">
                                                Account Number
                                                <span className="text-red-500">
                                                    *
                                                </span>
                                            </FieldLabel>

                                            <Input
                                                {...field}
                                                id="chart-of-account-form-account-number"
                                                aria-invalid={
                                                    fieldState.invalid
                                                }
                                                placeholder="e.g., 5-02-03-010"
                                                autoComplete="off"
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
                                    name="account_title"
                                    control={form.control}
                                    render={({ field, fieldState }) => (
                                        <Field
                                            data-invalid={fieldState.invalid}
                                        >
                                            <FieldLabel htmlFor="chart-of-account-form-account-title">
                                                Account Title
                                                <span className="text-red-500">
                                                    *
                                                </span>
                                            </FieldLabel>

                                            <Input
                                                {...field}
                                                id="chart-of-account-form-account-title"
                                                aria-invalid={
                                                    fieldState.invalid
                                                }
                                                placeholder="e.g., Office Supplies Expenses"
                                                autoComplete="off"
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
                                    name="account_type"
                                    control={form.control}
                                    render={({ field, fieldState }) => (
                                        <Field
                                            data-invalid={fieldState.invalid}
                                        >
                                            <FieldLabel htmlFor="chart-of-account-form-account-type">
                                                Account Type
                                                <span className="text-red-500">
                                                    *
                                                </span>
                                            </FieldLabel>

                                            <select
                                                {...field}
                                                id="chart-of-account-form-account-type"
                                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                                            >
                                                <option value="ASSET">
                                                    ASSET
                                                </option>
                                                <option value="LIABILITY">
                                                    LIABILITY
                                                </option>
                                                <option value="EQUITY">
                                                    EQUITY
                                                </option>
                                                <option value="REVENUE">
                                                    REVENUE
                                                </option>
                                                <option value="EXPENSE">
                                                    EXPENSE
                                                </option>
                                            </select>

                                            {fieldState.invalid && (
                                                <FieldError
                                                    errors={[fieldState.error]}
                                                />
                                            )}
                                        </Field>
                                    )}
                                />

                                <Controller
                                    name="expense_class"
                                    control={form.control}
                                    render={({ field, fieldState }) => (
                                        <Field
                                            data-invalid={fieldState.invalid}
                                        >
                                            <FieldLabel htmlFor="chart-of-account-form-expense-class">
                                                Expense Class
                                            </FieldLabel>

                                            <select
                                                {...field}
                                                id="chart-of-account-form-expense-class"
                                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                                            >
                                                <option value="">None</option>
                                                <option value="PS">PS</option>
                                                <option value="MOOE">
                                                    MOOE
                                                </option>
                                                <option value="FE">FE</option>
                                                <option value="CO">CO</option>
                                            </select>

                                            {fieldState.invalid && (
                                                <FieldError
                                                    errors={[fieldState.error]}
                                                />
                                            )}
                                        </Field>
                                    )}
                                />

                                <Controller
                                    name="account_series"
                                    control={form.control}
                                    render={({ field, fieldState }) => (
                                        <Field
                                            data-invalid={fieldState.invalid}
                                        >
                                            <FieldLabel htmlFor="chart-of-account-form-account-series">
                                                Account Series
                                            </FieldLabel>

                                            <Input
                                                {...field}
                                                id="chart-of-account-form-account-series"
                                                aria-invalid={
                                                    fieldState.invalid
                                                }
                                                placeholder="e.g., 5-02"
                                                autoComplete="off"
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
                                    name="level"
                                    control={form.control}
                                    render={({ field, fieldState }) => (
                                        <Field
                                            data-invalid={fieldState.invalid}
                                        >
                                            <FieldLabel htmlFor="chart-of-account-form-level">
                                                Level
                                            </FieldLabel>

                                            <Input
                                                {...field}
                                                type="number"
                                                id="chart-of-account-form-level"
                                                aria-invalid={
                                                    fieldState.invalid
                                                }
                                                placeholder="1"
                                                min="1"
                                                max="10"
                                                onChange={(e) =>
                                                    field.onChange(
                                                        parseInt(
                                                            e.target.value,
                                                        ) || 1,
                                                    )
                                                }
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
                                    name="normal_balance"
                                    control={form.control}
                                    render={({ field, fieldState }) => (
                                        <Field
                                            data-invalid={fieldState.invalid}
                                        >
                                            <FieldLabel htmlFor="chart-of-account-form-normal-balance">
                                                Normal Balance
                                                <span className="text-red-500">
                                                    *
                                                </span>
                                            </FieldLabel>

                                            <select
                                                {...field}
                                                id="chart-of-account-form-normal-balance"
                                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                                            >
                                                <option value="DEBIT">
                                                    DEBIT
                                                </option>
                                                <option value="CREDIT">
                                                    CREDIT
                                                </option>
                                            </select>

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
                                        <Field
                                            data-invalid={fieldState.invalid}
                                        >
                                            <FieldLabel htmlFor="chart-of-account-form-description">
                                                Description
                                            </FieldLabel>

                                            <Textarea
                                                {...field}
                                                value={field.value ?? ''}
                                                id="chart-of-account-form-description"
                                                aria-invalid={
                                                    fieldState.invalid
                                                }
                                                placeholder="Description..."
                                                autoComplete="off"
                                                className="min-h-15"
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
                                    name="is_postable"
                                    control={form.control}
                                    render={({ field, fieldState }) => (
                                        <Field
                                            data-invalid={fieldState.invalid}
                                        >
                                            <div className="flex flex-col gap-1">
                                                <FieldLabel htmlFor="is_postable">
                                                    Is Postable
                                                </FieldLabel>

                                                <label htmlFor="is_postable">
                                                    <div className="flex items-center gap-2 rounded-md border p-2">
                                                        <Checkbox
                                                            id="is_postable"
                                                            checked={
                                                                field.value
                                                            }
                                                            onCheckedChange={
                                                                field.onChange
                                                            }
                                                        />

                                                        <span>
                                                            {field.value
                                                                ? 'True'
                                                                : 'False'}
                                                        </span>
                                                    </div>
                                                </label>
                                            </div>

                                            {fieldState.invalid && (
                                                <FieldError
                                                    errors={[fieldState.error]}
                                                />
                                            )}
                                        </Field>
                                    )}
                                />

                                <Controller
                                    name="is_active"
                                    control={form.control}
                                    render={({ field, fieldState }) => (
                                        <Field
                                            data-invalid={fieldState.invalid}
                                        >
                                            <div className="flex flex-col gap-1">
                                                <FieldLabel htmlFor="is_active">
                                                    Is Active
                                                </FieldLabel>

                                                <label htmlFor="is_active">
                                                    <div className="flex items-center gap-2 rounded-md border p-2">
                                                        <Checkbox
                                                            id="is_active"
                                                            checked={
                                                                field.value
                                                            }
                                                            onCheckedChange={
                                                                field.onChange
                                                            }
                                                        />

                                                        <span>
                                                            {field.value
                                                                ? 'True'
                                                                : 'False'}
                                                        </span>
                                                    </div>
                                                </label>
                                            </div>

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
                    </ScrollArea>
                </div>

                <DialogFooter>
                    <DialogClose asChild disabled={isLoading}>
                        <Button variant="outline">Cancel</Button>
                    </DialogClose>

                    <Button
                        type="submit"
                        form="chart-of-account-form"
                        disabled={isLoading}
                    >
                        {isEditing ? (
                            isLoading ? (
                                <span className="flex items-center gap-1">
                                    <Spinner />
                                    Saving Changes
                                </span>
                            ) : (
                                'Save Changes'
                            )
                        ) : isLoading ? (
                            <span className="flex items-center gap-1">
                                <Spinner />
                                Creating Account
                            </span>
                        ) : (
                            'Create Account'
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
