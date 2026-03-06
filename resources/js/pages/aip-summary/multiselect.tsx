'use client';

import React, { useState } from 'react';
import { Check, ChevronsUpDown, X } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';

import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandDialog,
} from '@/components/ui/command';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';

import { FundingSource } from '@/pages/types/types';

interface MultiSelectProps {
    options: FundingSource[];
    value: string[];
    onChange: (value: string[]) => void;
    placeholder?: string;
}

export function MultiSelect({
    options,
    value,
    onChange,
    placeholder = 'Select items',
}: MultiSelectProps) {
    console.log(value);

    const [openDialog, setOpenDialog] = useState(false);

    const toggle = (val: string) => {
        if (value.includes(val)) {
            onChange(value.filter((v) => v !== val));
        } else {
            onChange([...value, val]);
        }
    };

    const remove = (val: string) => {
        onChange(value.filter((v) => v !== val));
    };

    return (
        <>
            <div className="flex flex-col gap-2">
                <Button
                    variant="outline"
                    role="combobox"
                    className="h-auto w-full justify-between py-2"
                    onClick={() => setOpenDialog(true)}
                >
                    <div className="flex flex-wrap gap-1">
                        {value.length === 0 && (
                            <span className="text-muted-foreground">
                                {placeholder}
                            </span>
                        )}

                        {value.map((val) => {
                            const option = options.find(
                                (o) => String(o.id) === val,
                            );

                            return (
                                <Badge key={val} variant="secondary">
                                    {option?.code}
                                    <X
                                        className="ml-1 h-3 w-3 cursor-pointer"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            remove(val);
                                        }}
                                    />
                                </Badge>
                            );
                        })}
                    </div>

                    <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
                </Button>

                <div className="flex flex-col gap-2">
                    {value.map((val) => {
                        const option = options.find(
                            (o) => String(o.id) === val,
                        );

                        return (
                            <div className="rounded-md border bg-muted p-2 text-white">
                                {option?.code}
                            </div>
                        );
                    })}
                </div>
            </div>

            <CommandDialog
                open={openDialog}
                onOpenChange={setOpenDialog}
                className="top-1/4 sm:max-w-[800px]"
            >
                <Command>
                    <CommandInput placeholder="Search..." />
                    <CommandEmpty>No item found.</CommandEmpty>

                    <CommandGroup>
                        <ScrollArea className="h-100">
                            {options.map((option) => (
                                <CommandItem
                                    key={option.id}
                                    onSelect={() => toggle(String(option.id))}
                                    className="py-2"
                                >
                                    <Checkbox
                                        checked={value.includes(
                                            String(option.id),
                                        )}
                                        className="mr-2"
                                    />

                                    <div>
                                        <p className="text-xs opacity-50">
                                            {option.fund_type}
                                        </p>
                                        <div className="flex items-center gap-2">
                                            <p className="font-bold text-nowrap">
                                                {option.code}
                                            </p>

                                            <Separator orientation="vertical" />

                                            <p className="bg-yellow">
                                                {option.title}
                                            </p>
                                        </div>
                                    </div>
                                </CommandItem>
                            ))}
                        </ScrollArea>
                    </CommandGroup>
                </Command>
            </CommandDialog>
        </>
    );
}
