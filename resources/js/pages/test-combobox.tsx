"use client"

import * as React from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm, Controller } from "react-hook-form"
import * as z from "zod"
import { CheckIcon, SearchIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { 
  Field, 
  FieldLabel, 
  FieldDescription, 
  FieldError 
} from "@/components/ui/field" 

const frameworks = [
  { value: "next.js", label: "Next.js" },
  { value: "sveltekit", label: "SvelteKit" },
  { value: "nuxt.js", label: "Nuxt.js" },
  { value: "remix", label: "Remix" },
  { value: "astro", label: "Astro" },
  { value: "react", label: "React" },
  { value: "vue", label: "Vue.js" },
  { value: "angular", label: "Angular" },
  { value: "solidjs", label: "SolidJS" },
  { value: "qwik", label: "Qwik" },
];

const formSchema = z.object({
  username: z
    .string()
    .min(2, "Username must be at least 2 characters.")
    .max(20, "Username must be under 20 characters.")
    .regex(/^[a-zA-Z0-9_]+$/, "Username can only contain letters, numbers, and underscores."),
  choice: z
    .string({
      required_error: "Please select a framework to continue.",
    })
    .min(1, "Selection is required."),
})

type FormValues = z.infer<typeof formSchema>

export default function CommandFormPage() {
  const [mainDialogOpen, setMainDialogOpen] = React.useState(false)
  const [commandOpen, setCommandOpen] = React.useState(false)

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      choice: "",
    },
    mode: "onChange", 
  })

  function onSubmit(data: FormValues) {
    console.log("Form Validated & Submitted:", data)
    setMainDialogOpen(false)
    form.reset()
  }

  return (
    <div className="p-8 flex flex-col items-center">
      <Dialog open={mainDialogOpen} onOpenChange={setMainDialogOpen}>
        <DialogTrigger asChild>
          <Button variant="default">Create New Entry</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add Item</DialogTitle>
            <DialogDescription>
              Choose your project identity and tech stack.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 pt-4">
            
            {/* Username Field */}
            <Controller
              name="username"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>Username</FieldLabel>
                  <Input 
                    {...field} 
                    id={field.name} 
                    placeholder="shadcn_user"
                    aria-invalid={fieldState.invalid}
                  />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />

            {/* Framework Choice Field */}
            <Controller
              name="choice"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Framework Selection</FieldLabel>
                  
                  <Button
                    type="button"
                    variant="outline"
                    aria-invalid={fieldState.invalid}
                    className={cn(
                      "w-full justify-between font-normal",
                      !field.value && "text-muted-foreground",
                      fieldState.invalid && "border-destructive ring-destructive"
                    )}
                    onClick={() => setCommandOpen(true)}
                  >
                    {field.value 
                      ? frameworks.find(f => f.value === field.value)?.label 
                      : "Search frameworks..."}
                    <SearchIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>

                  {/* CommandDialog logic */}
                  <CommandDialog open={commandOpen} onOpenChange={setCommandOpen}>
                    <Command> {/* CRITICAL: The context provider must be here */}
                      <CommandInput placeholder="Type a framework to search..." />
                      <CommandList>
                        <CommandEmpty>No results found.</CommandEmpty>
                        <CommandGroup heading="Suggestions">
                          {frameworks.map((f) => (
                            <CommandItem
                              key={f.value}
                              value={f.label}
                              // Your UI uses a data-attribute for the checkmark
                              data-checked={field.value === f.value} 
                              onSelect={() => {
                                field.onChange(f.value)
                                setCommandOpen(false)
                              }}
                            >
                              {f.label}
                              {/* Your CommandItem already handles CheckIcon via CSS, 
                                  but we'll keep the logic clean here */}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </CommandDialog>

                  <FieldDescription>
                    Press the button to open the command palette.
                  </FieldDescription>
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />

            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button 
                type="button" 
                variant="ghost" 
                onClick={() => {
                  setMainDialogOpen(false);
                  form.reset();
                }}
              >
                Cancel
              </Button>
              <Button type="submit">Save Changes</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}