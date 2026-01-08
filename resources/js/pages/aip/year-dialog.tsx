import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

export default function YearDialog() {
    const currentYear = new Date().getFullYear();
    const yearsData = null;

    console.log(currentYear);

    // function handleYearCalculation(currentYear, length) {
    //     currentYear - length + 1;

    //     for (let i = 0; i < length; i++) {}

    //     // return;
    // }

    return (
        <Dialog>
            <form>
                <DialogTrigger asChild>
                    <Button>Initialize AIP</Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Edit profile</DialogTitle>
                        <DialogDescription>
                            Make changes to your profile here. Click save when
                            you&apos;re done.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="grid gap-4">
                        <div className="grid gap-3">
                            <Label htmlFor="name-1">Year</Label>

                            {/*<Input
                                id="name-1"
                                name="name"
                                defaultValue="Pedro Duarte"
                            />*/}

                            <Select>
                                <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder="Select year" />
                                </SelectTrigger>
                                <SelectContent>
                                    {/*<SelectGroup>*/}
                                    {/*<SelectLabel>Fruits</SelectLabel>*/}
                                    <SelectItem value="apple">Apple</SelectItem>
                                    <SelectItem value="banana">
                                        Banana
                                    </SelectItem>
                                    <SelectItem value="blueberry">
                                        Blueberry
                                    </SelectItem>
                                    <SelectItem value="grapes">
                                        Grapes
                                    </SelectItem>
                                    <SelectItem value="pineapple">
                                        Pineapple
                                    </SelectItem>
                                    {/*</SelectGroup>*/}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant="outline">Cancel</Button>
                        </DialogClose>
                        <Button type="submit">Save changes</Button>
                    </DialogFooter>
                </DialogContent>
            </form>
        </Dialog>
    );
}
