import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

export default function AipRefCodeInput() {
    return (
        <div>
            <Label htmlFor="sector">Sector</Label>
            <Select>
                <SelectTrigger className="w-[180px]" id="sector">
                    <SelectValue placeholder="Sector" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="1000">
                        1000 - General Public Services
                    </SelectItem>
                    <SelectItem value="3000">3000 - Social Services</SelectItem>
                    <SelectItem value="8000">
                        8000 - Economic Services
                    </SelectItem>
                    <SelectItem value="9000">9000 - Other Services</SelectItem>
                </SelectContent>
            </Select>

            <Label htmlFor="sub-sector">Sub-Sector</Label>
            <Select>
                <SelectTrigger className="w-[180px]" id="sub-sector">
                    <SelectValue placeholder="Sub-Sector" />
                </SelectTrigger>
                <SelectContent></SelectContent>
            </Select>

            <Label htmlFor="lgu-level">LGU Level</Label>
            <Select>
                <SelectTrigger className="w-[180px]" id="lgu-level">
                    <SelectValue placeholder="LGU Level" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="1">1 - Province</SelectItem>
                    <SelectItem value="2">2 - City</SelectItem>
                    <SelectItem value="3">3 - Municipality</SelectItem>
                </SelectContent>
            </Select>

            <Label htmlFor="office-type">Office Type</Label>
            <Select>
                <SelectTrigger className="w-[180px]" id="office-type">
                    <SelectValue placeholder="Office Type" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="1">1 - Mandatory</SelectItem>
                    <SelectItem value="2">2 - Optional</SelectItem>
                </SelectContent>
            </Select>

            <Label htmlFor="office">Office</Label>
            <Select>
                <SelectTrigger className="w-[180px]" id="office">
                    <SelectValue placeholder="Office" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="light">Light</SelectItem>
                    <SelectItem value="dark">Dark</SelectItem>
                    <SelectItem value="system">System</SelectItem>
                </SelectContent>
            </Select>

            <Label htmlFor="program">Program</Label>
            <Input id="program" placeholder="Program" readOnly></Input>

            <Label htmlFor="project">Project/Activity</Label>
            <Input id="project" placeholder="Project/Activity" readOnly></Input>

            <Label htmlFor="activity">Activity</Label>
            <Input id="activity" placeholder="Activity" readOnly></Input>
        </div>
    );
}
