'use client';
import { Button } from '@/components/ui/button';
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from '@/components/ui/command';
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { router } from '@inertiajs/react';
import { CheckIcon, ChevronsUpDownIcon } from 'lucide-react';
import * as React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

// --- Types ---
type Program = {
    id: number;
    name: string;
};

type ProgramFormProps = {
    programs: Program[];
};

// --- Schema ---
const formSchema = z.object({
    // programId holds the string representation of the selected program's ID
    programId: z.string().min(1, {
        message: 'Please select a program.',
    }),
});

// Infer type for the form data
type FormValues = z.infer<typeof formSchema>;

export default function ProgramForm({ programs }: ProgramFormProps) {
    // State to manage the Popover/Combobox open state
    const [isComboboxOpen, setIsComboboxOpen] = React.useState(false);

    // 1. Define your form.
    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            programId: '',
        },
    });

    // 2. Define a submit handler.
    // function onSubmit(values: FormValues) {
    //     console.log('Form submitted successfully:', {
    //         ...values,
    //         // Convert the string ID back to a number for data processing, if required
    //         programId: Number(values.programId),
    //     });
    // }

    function onSubmit(values: FormValues) {
        router.post(
            '/aip',
            {
                programId: Number(values.programId),
            },
            {
                onSuccess: () => {
                    form.reset();
                    // Inertia automatically refreshes the page props here
                },
                onError: (errors) => {
                    console.error('Validation or Server Error:', errors);
                },
            },
        );
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                {/* 1. Program Select/Combobox Field */}
                <div className="flex">
                    <FormField
                        control={form.control}
                        name="programId"
                        render={({ field }) => {
                            // Find the program name for display based on the hook-form value (field.value)
                            const selectedProgram = programs.find(
                                (program) => String(program.id) === field.value,
                            );

                            return (
                                <FormItem className="flex flex-col">
                                    {/*<FormLabel>Program</FormLabel>*/}
                                    <Popover
                                        open={isComboboxOpen}
                                        onOpenChange={setIsComboboxOpen}
                                    >
                                        <PopoverTrigger asChild>
                                            <FormControl>
                                                <Button
                                                    variant="outline"
                                                    role="combobox"
                                                    aria-expanded={
                                                        isComboboxOpen
                                                    }
                                                    className={cn(
                                                        'w-[200px] justify-between',
                                                        !field.value &&
                                                            'text-muted-foreground',
                                                    )}
                                                >
                                                    {selectedProgram
                                                        ? selectedProgram.name
                                                        : 'Select a program'}
                                                    <ChevronsUpDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                                </Button>
                                            </FormControl>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-[200px] p-0">
                                            <Command>
                                                <CommandInput
                                                    placeholder="Search program..."
                                                    className="h-9"
                                                />
                                                <CommandList>
                                                    <CommandEmpty>
                                                        No program found.
                                                    </CommandEmpty>
                                                    <CommandGroup>
                                                        {programs.map(
                                                            (program) => (
                                                                <CommandItem
                                                                    value={String(
                                                                        program.id,
                                                                    )}
                                                                    key={
                                                                        program.id
                                                                    }
                                                                    onSelect={(
                                                                        currentValue,
                                                                    ) => {
                                                                        // Use field.onChange to update react-hook-form state
                                                                        field.onChange(
                                                                            currentValue ===
                                                                                field.value
                                                                                ? ''
                                                                                : currentValue,
                                                                        );
                                                                        setIsComboboxOpen(
                                                                            false,
                                                                        );
                                                                    }}
                                                                >
                                                                    {
                                                                        program.name
                                                                    }
                                                                    <CheckIcon
                                                                        className={cn(
                                                                            'ml-auto h-4 w-4',
                                                                            String(
                                                                                program.id,
                                                                            ) ===
                                                                                field.value
                                                                                ? 'opacity-100'
                                                                                : 'opacity-0',
                                                                        )}
                                                                    />
                                                                </CommandItem>
                                                            ),
                                                        )}
                                                    </CommandGroup>
                                                </CommandList>
                                            </Command>
                                        </PopoverContent>
                                    </Popover>
                                    {/*<FormDescription>
                                        Select the program you want to enroll in.
                                    </FormDescription>*/}
                                    {/*<FormMessage />*/}
                                </FormItem>
                            );
                        }}
                    />

                    <Button type="submit">Add Program</Button>
                </div>
            </form>
        </Form>
    );
}
