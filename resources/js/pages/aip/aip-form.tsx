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
import axios from 'axios';
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
    ps: string;
    mooe: string;
    fe: string;
    co: string;
    total: string;
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
  // console.log(data);

  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: data,
  });

  // 2. Define a submit handler.
  // async function onSubmit(values: z.infer<typeof formSchema>) {
  //     console.log(values);

  //     // const csrfToken = document.head.querySelector(
  //     //     'meta[name="csrf-token"]',
  //     // ).content;

  //     const csrfMetaTag = document.head.querySelector(
  //         'meta[name="csrf-token"]',
  //     );

  //     // Use optional chaining to safely access .content.
  //     // If csrfMetaTag is null, the result of the whole expression is undefined.
  //     // Then, use nullish coalescing (??) to default to an empty string if undefined/null.
  //     const csrfToken = csrfMetaTag?.content ?? '';

  //     // You can now use csrfToken, which is guaranteed to be a string (the token or '').
  //     // You should then check if it's an empty string before making a request.
  //     if (csrfToken === '') {
  //         console.error('CSRF token not found in the HTML header!');
  //         // Handle the error (e.g., prevent the POST request)
  //     }

  //     try {
  //         const res = await fetch('http://localhost:8000/add-aip', {
  //             method: 'POST',
  //             headers: {
  //                 'Content-Type': 'application/json',
  //                 'X-CSRF-TOKEN': csrfToken,
  //             },
  //             body: JSON.stringify(values),
  //         });

  //         if (!res.ok) {
  //             // Servers often return details about the error in the body
  //             const errorData = await res.json();
  //             throw new Error(
  //                 `HTTP error! Status: ${res.status}. Details: ${errorData.message || 'Unknown error'}`,
  //             );
  //         }

  //         const data = await res.json();
  //         console.log('Successfully Created User:', data);
  //     } catch (error) {
  //         console.error('POST request failed:', error.message);
  //     }
  // }

  // Ensure you have credentials enabled so cookies are sent
  // axiossssssssssssssss.defaults.withCredentials = true;

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      // No headers needed manually; Axios grabs the cookie automatically
      const res = await axios.post('http://localhost:8000/add-aip', values);
      console.log('Successfully Created User:', res.data);
    } catch (error) {
      console.error('Error:', error.response?.data || error.message);
    }
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
                        <Input placeholder="shadcn" {...field} />
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
                    <FormLabel>Program/Project/Activity Description</FormLabel>
                    <div>
                      <FormControl>
                        <Input placeholder="shadcn" {...field} />
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
                      Implementing Office Department Location
                    </FormLabel>
                    <div>
                      <FormControl>
                        <Input placeholder="shadcn" {...field} />
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
                        <FormLabel>Starting Date</FormLabel>
                        <div>
                          <FormControl>
                            <Input placeholder="shadcn" {...field} />
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
                        <FormLabel>Completion Date</FormLabel>
                        <div>
                          <FormControl>
                            <Input placeholder="shadcn" {...field} />
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
                        <Input placeholder="shadcn" {...field} />
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
                        <Input placeholder="shadcn" {...field} />
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
                        <FormLabel>Climate Change Adaption</FormLabel>
                        <div>
                          <FormControl>
                            <Input placeholder="shadcn" {...field} />
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
                        <FormLabel>Climate Change Mitigation</FormLabel>
                        <div>
                          <FormControl>
                            <Input placeholder="shadcn" {...field} />
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
                        <Input placeholder="shadcn" {...field} />
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
                    <FormLabel>Personal Services (PS)</FormLabel>
                    <div>
                      <FormControl>
                        <Input placeholder="shadcn" {...field} />
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
                      Maintenance and Other Operating Expenses (MOOE)
                    </FormLabel>
                    <div>
                      <FormControl>
                        <Input placeholder="shadcn" {...field} />
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
                    <FormLabel>Financial Expenses (FE)</FormLabel>
                    <div>
                      <FormControl>
                        <Input placeholder="shadcn" {...field} />
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
                    <FormLabel>Capital Outlay (CO)</FormLabel>
                    <div>
                      <FormControl>
                        <Input placeholder="shadcn" {...field} />
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
                        <Input placeholder="shadcn" {...field} />
                      </FormControl>
                      <FormMessage />
                    </div>
                  </div>
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
