import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';

import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';

import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

import React from 'react';
import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';
import ReactDOM from 'react-dom';
import { PDFViewer } from '@react-pdf/renderer';

export default function ExportToPdfDialog({
    open,
    onOpenChange,
    aipEntries,
    fiscalYear,
}) {
    const COLUMN_WIDTHS = [6, 12, 7, 5, 5, 7, 7, 7, 10, 6, 6, 8, 5, 5, 4];
    const keys = [
        'full_code',
        'title',
        'office.name',
        'aip_entry.start_date',
        'aip_entry.end_date',
        'aip_entry.expected_output',
        'aip_entry.funding_source',
        'aip_entry.ps_amount',
        'aip_entry.mooe_amount',
        'aip_entry.fe_amount',
        'aip_entry.co_amount',
        'aip_entry.total_amount',
        'aip_entry.ccet_adaptation',
        'aip_entry.ccet_mitigation',
        'aip_entry.typology',
    ];
    const office =
        'OFFICE OF THE PROVINCIAL GOVERNOR - INFORMATION AND COMMUNICATIONS TECHNOLOGY UNIT';

    const styles = StyleSheet.create({
        page: { padding: 36 },
        tableCol: {
            // borderRightWidth: 1,
            // borderBottomWidth: 1,
            // borderColor: '#000',
        },
        tableCell: { margin: 2, fontSize: 6, textAlign: 'center' },
        headerGroup: { flexDirection: 'column', padding: 0 },
    });

    const getNestedValue = (obj, path) => {
        return (
            path.split('.').reduce((acc, part) => acc && acc[part], obj) ?? ''
        );
    };

    const MyDocument = ({ data }) => {
        const renderOrderedRows = (initialEntries) => {
            const result = [];
            let rootCounter = 0;

            // We use a stack for Depth-First Search (DFS)
            const stack = [...initialEntries].reverse().map((item) => ({
                item,
                level: 0,
                path: [],
            }));

            while (stack.length > 0) {
                // Destructure 'path' so it is available in this scope
                const { item, level, path } = stack.pop();
                let displayTitle = getNestedValue(item, 'title');

                if (level === 0) {
                    // Level 0: Programs use Letters (A, B, C...)
                    const letter = String.fromCharCode(65 + rootCounter);
                    displayTitle = `${letter}. ${displayTitle}`;
                    rootCounter++;
                } else {
                    // Level 1+: Hierarchical numbers (1., 1.1, 1.1.1)
                    // .join('.') creates the "1.1.1" string
                    const outlineString = path.join('.');
                    // Adding a trailing dot for level 1 (e.g., "1.") as requested
                    const suffix = level === 1 ? '.' : '';
                    displayTitle = `${outlineString}${suffix} ${displayTitle}`;
                }

                result.push(
                    <View
                        key={`${item.id}-${level}`}
                        style={[
                            {
                                flexDirection: 'row',
                            },
                        ]}
                        wrap={false} // <--- Add this property here
                    >
                        {COLUMN_WIDTHS.map((width, colIndex) => (
                            <View
                                key={colIndex}
                                style={[
                                    styles.tableCol,
                                    {
                                        width: `${width}%`,
                                        borderRightWidth: 1,
                                        borderLeftWidth: colIndex === 0 ? 1 : 0,
                                    },
                                ]}
                            >
                                <Text
                                    style={[
                                        styles.tableCell,
                                        colIndex === 0 ? { fontSize: 4 } : {},
                                        colIndex === 1
                                            ? {
                                                  textAlign: 'left',
                                                  // paddingLeft: level * 8,
                                                  fontWeight:
                                                      level === 0
                                                          ? 'bold'
                                                          : 'normal',
                                              }
                                            : {},
                                    ]}
                                >
                                    {colIndex === 1
                                        ? displayTitle
                                        : getNestedValue(item, keys[colIndex])}
                                </Text>
                            </View>
                        ))}
                    </View>,
                );

                if (item.children && item.children.length > 0) {
                    for (let i = item.children.length - 1; i >= 0; i--) {
                        stack.push({
                            item: item.children[i],
                            level: level + 1,
                            // If level 0, the first child starts path [1]
                            // If deeper, append current index + 1 to the path array
                            path: level === 0 ? [i + 1] : [...path, i + 1],
                        });
                    }
                }
            }
            return result;
        };

        return (
            <Document>
                <Page
                    size={[612, 936]}
                    orientation="landscape"
                    style={styles.page}
                >
                    <View
                        style={{
                            display: 'table',
                            width: '100%',
                            borderBottomWidth: 1,
                        }}
                    >
                        {/* HEADER ROW 0 */}
                        <View fixed>
                            {/* TOP MIDDLE TITLE */}
                            <View
                                style={{
                                    marginBottom: 10,
                                    marginTop: 5,
                                    textAlign: 'center',
                                }}
                            >
                                <Text
                                    style={{ fontSize: 10, fontWeight: 'bold' }}
                                >
                                    CY ${fiscalYear.year} Annual Investment
                                    Program (AIP)
                                </Text>
                                <Text
                                    style={{ fontSize: 9, fontWeight: 'bold' }}
                                >
                                    By Program / Project / Activity - by Sector
                                </Text>
                            </View>

                            {/* OFFICE INFORMATION (Left Aligned) */}
                            <View
                                style={{ marginBottom: 5, textAlign: 'left' }}
                            >
                                <Text
                                    style={{ fontSize: 8, fontWeight: 'bold' }}
                                >
                                    {`OFFICE: ${office}`}
                                </Text>
                            </View>

                            <View
                                style={[
                                    {
                                        flexDirection: 'row',
                                        borderTopWidth: 1,
                                        borderBottomWidth: 1,
                                        // borderColor: '#000',
                                    },
                                ]}
                            >
                                <View
                                    style={[
                                        styles.tableCol,
                                        {
                                            width: `${COLUMN_WIDTHS[0]}%`,
                                            // borderLeftWidth: 1,
                                            borderRightWidth: 1,
                                        },
                                    ]}
                                >
                                    <Text style={[styles.tableCell]}>
                                        AIP REF. CODE
                                    </Text>
                                </View>
                                <View
                                    style={[
                                        styles.tableCol,
                                        {
                                            width: `${COLUMN_WIDTHS[1]}%`,
                                            borderRightWidth: 1,
                                        },
                                    ]}
                                >
                                    <Text style={styles.tableCell}>
                                        PROGRAM / PROJECT / ACTITIVTY
                                        DESCRIPTION
                                    </Text>
                                </View>
                                <View
                                    style={[
                                        styles.tableCol,
                                        {
                                            width: `${COLUMN_WIDTHS[2]}%`,
                                            borderRightWidth: 1,
                                        },
                                    ]}
                                >
                                    <Text style={[styles.tableCell]}>
                                        IMPLEMENTING OFFICE / DEPARTMENT /
                                        LOCATION
                                    </Text>
                                </View>

                                <View
                                    style={[
                                        styles.tableCol,
                                        styles.headerGroup,
                                        {
                                            width: `${COLUMN_WIDTHS[3] + COLUMN_WIDTHS[4]}%`,
                                        },
                                    ]}
                                >
                                    <View
                                        style={{
                                            borderBottomWidth: 1,
                                            borderRightWidth: 1,
                                            flex: 1,
                                        }}
                                    >
                                        <Text style={[styles.tableCell]}>
                                            SCHEDULE OF IMPLEMENTATION
                                        </Text>
                                    </View>
                                    <View
                                        style={{
                                            flexDirection: 'row',
                                            display: 'flex',
                                        }}
                                    >
                                        <View
                                            style={[
                                                styles.tableCol,
                                                {
                                                    width: '50%',
                                                    borderRightWidth: 1,
                                                    // borderLeftWidth: 0,
                                                    // borderBottomWidth: 0,
                                                },
                                            ]}
                                        >
                                            <Text style={[styles.tableCell]}>
                                                STARTING DATE
                                            </Text>
                                        </View>
                                        <View
                                            style={[
                                                styles.tableCol,
                                                {
                                                    width: '50%',
                                                    borderRightWidth: 1,

                                                    // borderBottomWidth: 0,
                                                },
                                            ]}
                                        >
                                            <Text style={styles.tableCell}>
                                                COMPLETION DATE
                                            </Text>
                                        </View>
                                    </View>
                                </View>

                                <View
                                    style={[
                                        styles.tableCol,
                                        {
                                            width: `${COLUMN_WIDTHS[5]}%`,
                                            borderRightWidth: 1,
                                        },
                                    ]}
                                >
                                    <Text style={styles.tableCell}>
                                        EXPECTED OUTPUTS
                                    </Text>
                                </View>
                                <View
                                    style={[
                                        styles.tableCol,
                                        {
                                            width: `${COLUMN_WIDTHS[6]}%`,
                                            borderRightWidth: 1,
                                        },
                                    ]}
                                >
                                    <Text style={styles.tableCell}>
                                        FUNDING SOURCE
                                    </Text>
                                </View>

                                <View
                                    style={[
                                        styles.tableCol,
                                        styles.headerGroup,
                                        {
                                            width: `${COLUMN_WIDTHS.slice(7, 12).reduce((a, b) => a + b, 0)}%`,
                                            borderRightWidth: 1,
                                        },
                                    ]}
                                >
                                    <View
                                        style={{
                                            borderBottomWidth: 1,
                                        }}
                                    >
                                        <Text style={styles.tableCell}>
                                            AMOUNT (In thousand pesos)
                                        </Text>
                                    </View>
                                    <View
                                        style={{
                                            flexDirection: 'row',
                                            flex: 1,
                                        }}
                                    >
                                        {[
                                            'PERSONAL SERVICES',
                                            'MAINTENANCE & OTHER OPERATING EXPENSES',
                                            'FINANCIAL EXPENSES',
                                            'CAPITAL OUTLAY',
                                            'TOTAL',
                                        ].map((label, i) => (
                                            <View
                                                key={label}
                                                style={[
                                                    styles.tableCol,
                                                    {
                                                        width: `${(COLUMN_WIDTHS[7 + i] / COLUMN_WIDTHS.slice(7, 12).reduce((a, b) => a + b, 0)) * 100}%`,
                                                        // borderRightWidth:
                                                        //     i === 4 ? 0 : 1,
                                                        // i === 0 ? 0 : 1,
                                                        // borderBottomWidth: 0,
                                                    },
                                                ]}
                                            >
                                                <Text style={styles.tableCell}>
                                                    {label}
                                                </Text>
                                            </View>
                                        ))}
                                    </View>
                                </View>

                                <View
                                    style={[
                                        styles.tableCol,
                                        styles.headerGroup,
                                        {
                                            width: `${COLUMN_WIDTHS.slice(12, 14).reduce((a, b) => a + b, 0)}%`,
                                            borderRightWidth: 1,
                                        },
                                    ]}
                                >
                                    <View
                                        style={{
                                            borderBottomWidth: 1,
                                        }}
                                    >
                                        <Text style={styles.tableCell}>
                                            Climate Change Expenditure (In
                                            thousand pesos)
                                        </Text>
                                    </View>
                                    <View style={{ flexDirection: 'row' }}>
                                        {[
                                            'Climate Change Adaptation',
                                            'Climate Change Mitigation',
                                        ].map((label, i) => (
                                            <View
                                                key={label}
                                                style={[
                                                    styles.tableCol,
                                                    {
                                                        width: `${(COLUMN_WIDTHS[12 + i] / COLUMN_WIDTHS.slice(12, 14).reduce((a, b) => a + b, 0)) * 100}%`,
                                                        // borderLeftWidth:
                                                        //     i === 0 ? 0 : 1,
                                                        // borderBottomWidth: 0,
                                                    },
                                                ]}
                                            >
                                                <Text style={styles.tableCell}>
                                                    {label}
                                                </Text>
                                            </View>
                                        ))}
                                    </View>
                                </View>
                                <View
                                    style={[
                                        styles.tableCol,
                                        {
                                            width: `${COLUMN_WIDTHS[14]}%`,
                                            borderRightWidth: 1,
                                        },
                                    ]}
                                >
                                    <Text style={styles.tableCell}>
                                        CC Typology Code
                                    </Text>
                                </View>
                            </View>

                            {/* HEADER ROW 1 (Numbers) */}
                            <View
                                style={[
                                    {
                                        flexDirection: 'row',
                                        // borderRightWidth: 1,
                                        // borderColor: '#000',
                                    },
                                ]}
                            >
                                {COLUMN_WIDTHS.map((width, i) => (
                                    <View
                                        key={i}
                                        style={[
                                            styles.tableCol,
                                            {
                                                width: `${width}%`,
                                                borderRightWidth: 1,
                                            },
                                        ]}
                                    >
                                        <Text style={styles.tableCell}>
                                            {i + 1}
                                        </Text>
                                    </View>
                                ))}
                            </View>
                        </View>

                        {/* ITERATIVE DATA ROWS */}
                        {renderOrderedRows(aipEntries)}
                    </View>
                </Page>
            </Document>
        );
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="m-0 h-full rounded-none p-0 pt-11 sm:max-w-full">
                <DialogTitle className="sr-only">PDF Viewer</DialogTitle>
                <DialogDescription className="sr-only">
                    Visual preview of the AIP Report.
                </DialogDescription>
                <div className="h-full rounded-none bg-white sm:max-w-full">
                    <PDFViewer width="100%" height="100%" showToolbar={true}>
                        <MyDocument data={aipEntries} />
                    </PDFViewer>
                </div>
            </DialogContent>
        </Dialog>
    );
}
