import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';

import type { FiscalYear, Ppa, FlattenedPpa } from '@/types/global';

interface ExportToExcelProps {
    aipEntries: Ppa[];
    fiscalYear: FiscalYear;
    officeName: string;
}

// Helper to expand PPA by funding source (same logic as in index.tsx)
const expandPpaByFundingSource = (ppas: Ppa[], depth = 0): FlattenedPpa[] => {
    return ppas.flatMap((ppa): FlattenedPpa[] => {
        // 1. Recursively process children
        const expandedChildren = ppa.children
            ? expandPpaByFundingSource(ppa.children, depth + 1)
            : [];

        // 2. Find the AIP Entry for this year, then get its funding sources
        const activeAip = ppa.aip_entries?.[0] || null;
        const sources = activeAip?.ppa_funding_sources || [];

        // 3. If no funding sources or no AIP entry, return the PPA once with its children
        if (sources.length === 0) {
            return [
                {
                    ...ppa,
                    current_fs: null,
                    children: expandedChildren,
                    isFirstInGroup: true,
                    isLastInGroup: true,
                    groupSize: 1,
                    depth,
                },
            ];
        }

        // 4. Duplicate PPA for each funding source found in the AIP Entry
        return sources.map((fs, index) => {
            const isLast = index === sources.length - 1;

            return {
                ...ppa,
                current_fs: fs,
                // Only the last row in the duplicate group carries the nested children
                children: isLast ? expandedChildren : [],
                isFirstInGroup: index === 0,
                isLastInGroup: isLast,
                groupSize: sources.length,
                depth,
            };
        });
    });
};

// Format date to MM-DD format
const formatDate = (value: string | null | undefined) => {
    if (!value) return '-';
    const parts = value.split('-');
    if (parts.length === 3) {
        const shortMonths = [
            'Jan',
            'Feb',
            'Mar',
            'Apr',
            'May',
            'Jun',
            'Jul',
            'Aug',
            'Sep',
            'Oct',
            'Nov',
            'Dec',
        ];
        const monthName = shortMonths[parseInt(parts[1]) - 1];
        const day = parseInt(parts[2]);
        return `${monthName}-${day}`;
    }
    return value;
};

// Format number with 2 decimal places
const formatNumber = (value: any) => {
    const num = parseFloat(value);
    if (!value || isNaN(num) || num === 0) return '-';
    return new Intl.NumberFormat('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(num);
};

export async function exportToExcel({
    aipEntries,
    fiscalYear,
    officeName,
}: ExportToExcelProps) {
    const office = officeName.toUpperCase() || '';

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('AIP Summary');

    // Define columns matching PDF layout (no header to prevent automatic header row)
    worksheet.columns = [
        { key: 'aipRefCode', width: 15 },
        { key: 'description', width: 35 },
        { key: 'office', width: 25 },
        { key: 'startDate', width: 12 },
        { key: 'endDate', width: 12 },
        { key: 'expectedOutput', width: 30 },
        { key: 'fundingSource', width: 15 },
        { key: 'ps', width: 12 },
        { key: 'mooe', width: 12 },
        { key: 'fe', width: 12 },
        { key: 'co', width: 12 },
        { key: 'total', width: 12 },
        { key: 'adaptation', width: 12 },
        { key: 'mitigation', width: 12 },
        { key: 'typology', width: 12 },
    ];

    // Ensure columns A through O have enough width for centering
    for (let i = 1; i <= 15; i++) {
        worksheet.getColumn(i).width = 15;
    }

    // Add title rows
    worksheet.mergeCells('A1:O1');
    const titleCell = worksheet.getCell('A1');
    titleCell.value = `CY ${fiscalYear.year} Annual Investment Program (AIP)`;
    titleCell.font = { bold: true, size: 14, name: 'Century Gothic' };
    titleCell.alignment = { horizontal: 'center', vertical: 'middle' };

    worksheet.mergeCells('A2:O2');
    const subtitleCell = worksheet.getCell('A2');
    subtitleCell.value = 'By Program / Project / Activity - by Sector';
    subtitleCell.font = { bold: true, size: 12, name: 'Century Gothic' };
    subtitleCell.alignment = { horizontal: 'center', vertical: 'middle' };

    worksheet.mergeCells('A3:O3');
    const officeCell = worksheet.getCell('A3');
    officeCell.value = `OFFICE: ${office}`;
    officeCell.font = { bold: true, size: 10, name: 'Century Gothic' };
    officeCell.alignment = { horizontal: 'center', vertical: 'middle' };

    // Force alignment on merged cells using loop
    for (let i = 1; i <= 3; i++) {
        const row = worksheet.getRow(i);
        row.eachCell({ includeEmpty: true }, (cell) => {
            cell.alignment = { vertical: 'middle', horizontal: 'center' };
        });
    }

    worksheet.addRow([]);

    // Add header row with styling
    // const headerRow = worksheet.getRow(worksheet.rowCount + 1);
    const headerRow = worksheet.getRow(5);
    headerRow.values = [
        'AIP REF. CODE',
        'PROGRAM / PROJECT / ACTIVITY DESCRIPTION',
        'IMPLEMENTING OFFICE / DEPARTMENT / LOCATION',
        'STARTING DATE',
        'COMPLETION DATE',
        'EXPECTED OUTPUTS',
        'FUNDING SOURCE',
        'PERSONAL SERVICES (PS)',
        'MAINTENANCE & OTHER OPERATING EXPENSES (MOOE)',
        'FINANCIAL EXPENSES (FE)',
        'CAPITAL OUTLAY (CO)',
        'TOTAL',
        'Climate Change Adaptation',
        'Climate Change Mitigation',
        'CC Typology Code',
    ];
    headerRow.font = { bold: true, size: 8, name: 'Century Gothic' };
    headerRow.alignment = { horizontal: 'center', vertical: 'middle' };
    headerRow.height = 30;
    headerRow.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'deeaf6' },
    };

    // Expand data by funding source
    const expandedData = expandPpaByFundingSource(aipEntries);

    // Track totals
    let totalPs = 0;
    let totalMooe = 0;
    let totalFe = 0;
    let totalCo = 0;
    let totalGrand = 0;
    let totalAdaptation = 0;
    let totalMitigation = 0;

    // Add data rows with hierarchical numbering
    let rootCounter = 0;
    const stack = [...expandedData].toReversed().map((item) => ({
        item,
        level: 0,
        path: [] as number[],
    }));

    while (stack.length > 0) {
        const { item, level, path } = stack.pop()!;

        let displayTitle = item.name;
        if (level === 0) {
            const letter = String.fromCharCode(65 + rootCounter);
            displayTitle = `${letter}. ${displayTitle}`;
            rootCounter++;
        } else {
            const outlineString = path.join('.');
            const suffix = level === 1 ? '.' : '';
            displayTitle = `${outlineString}${suffix} ${displayTitle}`;
        }

        const aipEntry = item.aip_entries?.[0];
        const fs = item.current_fs;

        // Calculate total for this row
        const ps = parseFloat(fs?.ps_amount || '0');
        const mooe = parseFloat(fs?.mooe_amount || '0');
        const fe = parseFloat(fs?.fe_amount || '0');
        const co = parseFloat(fs?.co_amount || '0');
        const rowTotal = ps + mooe + fe + co;
        const adaptation = parseFloat(fs?.ccet_adaptation || '0');
        const mitigation = parseFloat(fs?.ccet_mitigation || '0');

        // Accumulate totals (only for first row in group to avoid double counting)
        if (item.isFirstInGroup || !fs) {
            totalPs += ps;
            totalMooe += mooe;
            totalFe += fe;
            totalCo += co;
            totalGrand += rowTotal;
            totalAdaptation += adaptation;
            totalMitigation += mitigation;
        }

        // Format office acronym
        let officeAcronym = '-';
        if (item.office?.parent?.acronym && item.office?.acronym) {
            officeAcronym = `${item.office.parent.acronym}/${item.office.acronym}`;
        } else if (item.office?.acronym) {
            officeAcronym = item.office.acronym;
        }

        // Only show PPA details for first funding source in group
        const showPpaDetails = item.isFirstInGroup || !fs;

        worksheet.addRow({
            aipRefCode: showPpaDetails ? item.full_code || '-' : '',
            description: showPpaDetails ? displayTitle : '',
            office: showPpaDetails ? officeAcronym : '',
            startDate: showPpaDetails ? formatDate(aipEntry?.start_date) : '',
            endDate: showPpaDetails ? formatDate(aipEntry?.end_date) : '',
            expectedOutput: showPpaDetails
                ? aipEntry?.expected_output || '-'
                : '',
            fundingSource: fs?.funding_source?.code || '-',
            ps: fs ? formatNumber(ps) : '-',
            mooe: fs ? formatNumber(mooe) : '-',
            fe: fs ? formatNumber(fe) : '-',
            co: fs ? formatNumber(co) : '-',
            total: fs ? formatNumber(rowTotal) : '-',
            adaptation: fs ? formatNumber(adaptation) : '-',
            mitigation: fs ? formatNumber(mitigation) : '-',
            typology:
                fs && showPpaDetails
                    ? (aipEntry as any)?.typology?.code || '-'
                    : '-',
        });

        // Apply indentation to description column
        const currentRow = worksheet.getRow(worksheet.rowCount);
        if (showPpaDetails && level > 0) {
            const descriptionCell = currentRow.getCell('description');
            descriptionCell.alignment = { indent: level * 2 };
        }

        // Process children
        if (item.children && item.children.length > 0) {
            for (let i = item.children.length - 1; i >= 0; i--) {
                stack.push({
                    item: item.children[i],
                    level: level + 1,
                    path: level === 0 ? [i + 1] : [...path, i + 1],
                });
            }
        }
    }

    // Add grand total row
    worksheet.addRow([]);
    const totalRow = worksheet.addRow({
        description: 'GRAND TOTAL',
        ps: formatNumber(totalPs),
        mooe: formatNumber(totalMooe),
        fe: formatNumber(totalFe),
        co: formatNumber(totalCo),
        total: formatNumber(totalGrand),
        adaptation: formatNumber(totalAdaptation),
        mitigation: formatNumber(totalMitigation),
    });

    totalRow.font = { bold: true, size: 8, name: 'Century Gothic' };
    totalRow.alignment = { horizontal: 'right' };
    totalRow.eachCell((cell) => {
        cell.border = {
            top: { style: 'thin' },
            bottom: { style: 'thin' },
        };
    });

    // Apply column styling
    worksheet.columns.forEach((column) => {
        column.font = {
            name: 'Century Gothic',
            size: 8,
        };
        column.alignment = {
            vertical: 'middle',
            wrapText: true,
        };
        column.border = {
            top: { style: 'thin' },
            left: { style: 'thin' },
            bottom: { style: 'thin' },
            right: { style: 'thin' },
        };
    });

    // Center-align specific columns
    [
        'aipRefCode',
        'office',
        'startDate',
        'endDate',
        'fundingSource',
        'ps',
        'mooe',
        'fe',
        'co',
        'total',
        'adaptation',
        'mitigation',
        'typology',
    ].forEach((key) => {
        const column = worksheet.getColumn(key);
        column.alignment = {
            ...column.alignment,
            horizontal: 'center',
        };
    });

    // Right-align numeric columns
    ['ps', 'mooe', 'fe', 'co', 'total', 'adaptation', 'mitigation'].forEach(
        (key) => {
            const column = worksheet.getColumn(key);
            column.alignment = {
                ...column.alignment,
                horizontal: 'right',
            };
            column.numFmt = '#,##0.00';
        },
    );

    // Left-align text columns
    ['description', 'expectedOutput'].forEach((key) => {
        const column = worksheet.getColumn(key);
        column.alignment = {
            ...column.alignment,
            horizontal: 'left',
        };
    });

    // Generate and save Excel file
    const buf = await workbook.xlsx.writeBuffer();
    saveAs(new Blob([buf]), `AIP_Summary_FY${fiscalYear.year}.xlsx`);
}
