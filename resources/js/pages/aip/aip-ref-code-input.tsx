import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { useState } from 'react';

type LguLevel = {
    id: number;
    lgu_level: string;
};

type OfficeType = {
    id: number;
    office_type: string;
};

type Office = {
    id: number;
    code: string;
    office: string;
    lgu_level_id: number;
    office_type_id: number;
};

type AipRefCodeInputProps = {
    lgu_levels: LguLevel[];
    office_types: OfficeType[];
    offices: Office[];
};

export default function AipRefCodeInput({
    lgu_levels,
    office_types,
    offices,
}: AipRefCodeInputProps) {
    // console.log(lgu_levels);
    // console.log(office_types);
    // console.log(offices);

    const [selectedLguLevel, setSelectedLguLevel] = useState<number | null>(
        null,
    );
    const [selectedOfficeType, setSelectedOfficeType] = useState<number | null>(
        null,
    );
    const [selectedOffice, setSelectedOffice] = useState<number | null>(null);

    console.log(selectedLguLevel);
    console.log(selectedOfficeType);

    function handleOfficeChange(officeId: string) {
        const office = offices.find((item) => {
            return item.id === Number(officeId);
        });

        console.log(office);

        if (office) {
            setSelectedLguLevel(office.lgu_level_id);
            setSelectedOfficeType(office.office_type_id);
            setSelectedOffice(office.id);
        }
    }

    const handleLguLevelChange = (value: string) => {
        // Clear the auto-populated fields if the user manually changes an FK
        setSelectedLguLevel(Number(value));
        setSelectedOffice(null);
    };

    const handleOfficeTypeChange = (value: string) => {
        // Clear the auto-populated fields if the user manually changes an FK
        setSelectedOfficeType(Number(value));
        setSelectedOffice(null);
    };

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
            <Select
                value={
                    selectedLguLevel === null ? '' : selectedLguLevel.toString()
                }
                onValueChange={handleLguLevelChange}
            >
                <SelectTrigger className="w-[180px]" id="lgu-level">
                    <SelectValue placeholder="LGU Level" />
                </SelectTrigger>
                <SelectContent>
                    {lgu_levels?.map((level) => (
                        <SelectItem key={level.id} value={level.id.toString()}>
                            {level.lgu_level}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>

            <Label htmlFor="office-type">Office Type</Label>
            <Select
                value={
                    selectedOfficeType === null
                        ? ''
                        : selectedOfficeType.toString()
                }
                onValueChange={handleOfficeTypeChange}
            >
                <SelectTrigger className="w-[180px]" id="office-type">
                    <SelectValue placeholder="Office Type" />
                </SelectTrigger>
                <SelectContent>
                    {office_types?.map((type) => (
                        <SelectItem key={type.id} value={type.id.toString()}>
                            {type.office_type}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>

            <Label htmlFor="office">Office</Label>
            <Select
                value={selectedOffice === null ? '' : selectedOffice.toString()}
                onValueChange={handleOfficeChange}
            >
                <SelectTrigger className="w-[180px]" id="office">
                    <SelectValue placeholder="Office" />
                </SelectTrigger>
                <SelectContent>
                    {offices?.map((office) => {
                        // console.log(office);
                        return (
                            <SelectItem
                                key={office.id}
                                value={office.id.toString()}
                            >
                                {office.office}
                            </SelectItem>
                        );
                    })}
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
