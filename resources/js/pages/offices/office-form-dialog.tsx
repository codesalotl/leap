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
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { router } from '@inertiajs/react';
import { useEffect, useMemo } from 'react';

// Define the schema based on your database requirements
const formSchema = z.object({
    sector_id: z.string().min(1, 'Sector is required'),
    lgu_level_id: z.string().min(1, 'LGU Level is required'),
    office_type_id: z.string().min(1, 'Office Type is required'),
    code: z.string().min(1).max(3, 'Suffix must be 1-3 characters'),
    name: z.string().min(1, 'Office name is required').max(100),
    is_lee: z.boolean().default(false),
});

type OfficeFormValues = z.infer<typeof formSchema>;

interface Props {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    office?: any; // If provided, we are in Edit mode
    sectors: any[];
    lguLevels: any[];
    officeTypes: any[];
}

export default function OfficeFormDialog({
    open,
    onOpenChange,
    office,
    sectors,
    lguLevels,
    officeTypes,
}: Props) {
    const form = useForm<OfficeFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            sector_id: '',
            lgu_level_id: '',
            office_type_id: '',
            code: '',
            name: '',
            is_lee: false,
        },
    });

    // Reset form when office prop changes (for editing) or dialog opens
    useEffect(() => {
        if (office) {
            form.reset({
                sector_id: String(office.sector_id),
                lgu_level_id: String(office.lgu_level_id),
                office_type_id: String(office.office_type_id),
                code: office.code,
                name: office.name,
                is_lee: !!office.is_lee,
            });
        } else {
            form.reset({
                sector_id: '',
                lgu_level_id: '',
                office_type_id: '',
                code: '',
                name: '',
                is_lee: false,
            });
        }
    }, [office, open]);

    // Live Preview Logic
    const watchedValues = form.watch();
    const generatedCode = useMemo(() => {
        const sector =
            sectors.find((s) => String(s.id) === watchedValues.sector_id)
                ?.code ?? '0000';
        const lgu =
            lguLevels.find((l) => String(l.id) === watchedValues.lgu_level_id)
                ?.code ?? '0';
        const type =
            officeTypes.find(
                (t) => String(t.id) === watchedValues.office_type_id,
            )?.code ?? '00';
        const suffix = watchedValues.code.padStart(3, '0');

        return `${sector}-000-${lgu}-${type}-${suffix}`;
    }, [watchedValues, sectors, lguLevels, officeTypes]);

    function onSubmit(values: OfficeFormValues) {
        if (office) {
            router.put(`/offices/${office.id}`, values, {
                onSuccess: () => {
                    onOpenChange(false);
                    form.reset();
                },
                onError: (errors) => {
                    // If the backend returns a 'code' error (unique constraint)
                    // react-hook-form will automatically display it if using Shadcn <FormMessage />
                    console.error(errors);
                }
            });
        } else {
            router.post('/offices', values, {
                onSuccess: () => {
                    onOpenChange(false);
                    form.reset();
                },
             });
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>
                        {office ? 'Edit Office' : 'Create New Office'}
                    </DialogTitle>
                    <DialogDescription>
                        Fill in the details below. The account code is generated
                        automatically.
                    </DialogDescription>
                </DialogHeader>

                <div className="my-4 rounded-lg bg-muted p-3 text-center">
                    <span className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                        Generated Account Code
                    </span>
                    <div className="font-mono text-xl font-bold text-primary">
                        {generatedCode}
                    </div>
                </div>

                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-4"
                    >
                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="lgu_level_id"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>LGU Level</FormLabel>
                                        <Select
                                            onValueChange={field.onChange}
                                            value={field.value}
                                        >
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select Level" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {lguLevels.map((item) => (
                                                    <SelectItem
                                                        key={item.id}
                                                        value={String(item.id)}
                                                    >
                                                        {item.level}
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
                                name="office_type_id"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Office Type</FormLabel>
                                        <Select
                                            onValueChange={field.onChange}
                                            value={field.value}
                                        >
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select Type" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {officeTypes.map((item) => (
                                                    <SelectItem
                                                        key={item.id}
                                                        value={String(item.id)}
                                                    >
                                                        {item.code} -{' '}
                                                        {item.type}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <FormField
                            control={form.control}
                            name="sector_id"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Sector</FormLabel>
                                    <Select
                                        onValueChange={field.onChange}
                                        value={field.value}
                                    >
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select Sector" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {sectors.map((item) => (
                                                <SelectItem
                                                    key={item.id}
                                                    value={String(item.id)}
                                                >
                                                    {item.code} - {item.sector}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="grid grid-cols-4 gap-4">
                            <div className="col-span-1">
                                <FormField
                                    control={form.control}
                                    name="code"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Suffix</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="001"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <div className="col-span-3">
                                <FormField
                                    control={form.control}
                                    name="name"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Office Name</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="Office of the Mayor"
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
                            name="is_lee"
                            render={({ field }) => (
                                <FormItem className="flex flex-row items-start space-y-0 space-x-3 rounded-md border p-4">
                                    <FormControl>
                                        <Checkbox
                                            checked={field.value}
                                            onCheckedChange={field.onChange}
                                        />
                                    </FormControl>
                                    <div className="space-y-1 leading-none">
                                        <FormLabel>
                                            Local Economic Enterprise (LEE)
                                        </FormLabel>
                                        <FormDescription>
                                            Check if this office operates as a
                                            business-like entity.
                                        </FormDescription>
                                    </div>
                                </FormItem>
                            )}
                        />

                        <DialogFooter>
                            <Button
                                type="submit"
                                disabled={form.formState.isSubmitting}
                            >
                                {office ? 'Save Changes' : 'Create Office'}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
