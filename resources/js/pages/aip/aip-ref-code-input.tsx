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

type Sector = {
    id: number;
    code: string;
    sector: string;
};

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
    sectors: Sector[];
    lgu_levels: LguLevel[];
    office_types: OfficeType[];
    offices: Office[];
};

export default function AipRefCodeInput({
    sectors,
    lgu_levels,
    office_types,
    offices,
}: AipRefCodeInputProps) {
    const [selectedSector, setSelectedSector] = useState<number | null>(null);
    const [selectedLguLevel, setSelectedLguLevel] = useState<number | null>(
        null,
    );
    const [selectedOfficeType, setSelectedOfficeType] = useState<number | null>(
        null,
    );
    const [selectedOffice, setSelectedOffice] = useState<number | null>(null);

    function handleOfficeChange(officeId: string) {
        const office = offices.find((item) => {
            return item.id === Number(officeId);
        });

        if (office) {
            setSelectedLguLevel(office.lgu_level_id);
            setSelectedOfficeType(office.office_type_id);
            setSelectedOffice(office.id);
        }
    }

    const handleLguLevelChange = (value: string) => {
        setSelectedLguLevel(Number(value));
        setSelectedOffice(null);
    };

    const handleOfficeTypeChange = (value: string) => {
        setSelectedOfficeType(Number(value));
        setSelectedOffice(null);
    };

    function handleSectorChange(e: string) {
        setSelectedSector(Number(e));
    }

    const selectedSectorObject = sectors?.find(
        (sector) => sector.id === selectedSector,
    );

    const aipRefCode =
        `${selectedSectorObject ? selectedSectorObject.code : '0000'}` +
        '-000-' +
        `${selectedLguLevel !== null ? selectedLguLevel : '0'}` +
        `-${selectedOfficeType !== null ? selectedOfficeType : '0'}` +
        `-${selectedOffice !== null ? offices[selectedOffice].code : '00'}` +
        '-000-000-000';

    return (
        <div>
            <p>{aipRefCode}</p>

            <Label htmlFor="sector">Sector</Label>
            <Select onValueChange={handleSectorChange}>
                <SelectTrigger className="w-[180px]" id="sector">
                    <SelectValue placeholder="Sector" />
                </SelectTrigger>
                <SelectContent>
                    {sectors?.map((sector) => (
                        <SelectItem
                            key={sector.id}
                            value={sector.id.toString()}
                        >
                            {sector.sector}
                        </SelectItem>
                    ))}
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
                    {offices?.map((office) => (
                        <SelectItem
                            key={office.id}
                            value={office.id.toString()}
                        >
                            {office.office}
                        </SelectItem>
                    ))}
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
