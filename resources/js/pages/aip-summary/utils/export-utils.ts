import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { AipEntry } from '@/pages/types/types';
import { formatNumber } from '@/pages/aip-summary/table/columns';
import { FiscalYear } from '@/pages/types/types';

export const flattenForExport = (entries: Ppa[], depth = 0): any[] => {
    let flat: any[] = [];
    entries.forEach((entry) => {
        const indent = '    '.repeat(depth);
        const prefix = depth > 0 ? '↳ ' : '';
        flat.push({
            ...entry,
            indented_desc: `${indent}${prefix}${entry.ppa_desc}`,
        });
        if (entry.children && entry.children.length > 0) {
            flat = [
                ...flat,
                ...flattenForExport(entry.children, depth + 1),
            ];
        }
    });
    return flat;
};

export const exportToExcel = (aipEntries: Ppa[], fiscalYear: FiscalYear) => {
    const flatData = flattenForExport(aipEntries);
    const data = flatData.map((e) => ({
        'AIP Ref Code': e.aip_ref_code ?? '',
        'Program/Project/Activity Description': e.indented_desc ?? '',
        'Implementing Office': e.implementing_office_department ?? '',
        'Start Date': e.sched_implementation?.start_date ?? '',
        'Completion Date': e.sched_implementation?.completion_date ?? '',
        'Expected Outputs': e.expected_outputs ?? '',
        'Funding Source': e.funding_source ?? '',
        PS: e.amount?.ps ?? '0.00',
        MOOE: e.amount?.mooe ?? '0.00',
        FE: e.amount?.fe ?? '0.00',
        CO: e.amount?.co ?? '0.00',
        Total: e.amount?.total ?? '0.00',
        'CC Adaptation': e.cc_adaptation ?? '0.00',
        'CC Mitigation': e.cc_mitigation ?? '0.00',
        'Typology Code': e.cc_typology_code ?? '',
    }));

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'AIP Summary');
    XLSX.writeFile(wb, `AIP_Summary_${fiscalYear.year}.xlsx`);
};

export const exportToPDF = (aipEntries: Ppa[], fiscalYear: FiscalYear) => {
    const doc = new jsPDF('l', 'mm', 'a4');
    const flatData = flattenForExport(aipEntries);

    doc.setFontSize(10);
    doc.text(
        `Annual Investment Program (AIP) Summary FY ${fiscalYear.year}`,
        14,
        10,
    );

    autoTable(doc, {
        startY: 15,
        head: [
            [
                'Ref Code',
                'Description',
                'Office',
                'Start',
                'End',
                'Outputs',
                'Source',
                'PS',
                'MOOE',
                'FE',
                'CO',
                'Total',
                'Adapt',
                'Mitig',
                'Typo',
            ],
        ],
        body: flatData.map((e) => [
            e.aip_ref_code ?? '',
            e.indented_desc ?? '',
            e.implementing_office_department ?? '',
            e.sched_implementation?.start_date ?? '',
            e.sched_implementation?.completion_date ?? '',
            e.expected_outputs ?? '',
            e.funding_source ?? '',
            formatNumber(e.amount?.ps ?? '0'),
            formatNumber(e.amount?.mooe ?? '0'),
            formatNumber(e.amount?.fe ?? '0'),
            formatNumber(e.amount?.co ?? '0'),
            formatNumber(e.amount?.total ?? '0'),
            formatNumber(e.cc_adaptation ?? '0'),
            formatNumber(e.cc_mitigation ?? '0'),
            e.cc_typology_code ?? '',
        ]),
        styles: { fontSize: 5.5, cellPadding: 1, valign: 'middle' },
        headStyles: { fillColor: [40, 40, 40], halign: 'center' },
        margin: { left: 5, right: 5 },
    });

    doc.save(`AIP_Summary_${fiscalYear.year}.pdf`);
};
