import { formatData, nestData } from '@/pages/aip/aip-table';
import { describe, expect, test } from 'vitest';

describe('formatData', () => {
    test('groups related fields together', () => {
        const inputData = [
            {
                aipRefCode: 'AIP-001',
                ppaDescription: 'Training on Budgeting',
                implementingOfficeDepartmentLocation: 'HRD',
                startingDate: '2025-01-15',
                completionDate: '2025-01-16',
                expectedOutputs: '10 trained staff',
                fundingSource: 'GAA',
                ps: 10000,
                mooe: 5000,
                fe: 0,
                co: 0,
                total: 15000,
                ccAdaptation: 'A1',
                ccMitigation: 'M2',
                ccTypologyCode: 'CC-A',
                children: [],
            },
        ];

        const expectedData = [
            {
                aipRefCode: 'AIP-001',
                ppaDescription: 'Training on Budgeting',
                implementingOfficeDepartmentLocation: 'HRD',
                scheduleOfImplementation: {
                    startingDate: '2025-01-15',
                    completionDate: '2025-01-16',
                },
                expectedOutputs: '10 trained staff',
                fundingSource: 'GAA',
                amount: {
                    ps: 10000,
                    mooe: 5000,
                    fe: 0,
                    co: 0,
                    total: 15000,
                },
                amountOfCcExpenditure: {
                    ccAdaptation: 'A1',
                    ccMitigation: 'M2',
                },
                ccTypologyCode: 'CC-A',
                children: [],
            },
        ];

        const result = formatData(inputData);

        // Assert that the transformed data matches the expected structure and values
        expect(result).toEqual(expectedData);
    });
});

describe('nestData', () => {
    test('nests the data', () => {
        const inputData = [
            {
                id: 1,
                aipRefCode: 'AIP-2025-001',
                ppaDescription: 'Concreting of Farm-to-Market Road',
                implementingOfficeDepartmentLocation: 'Engineering Office',
                expectedOutputs: '1.5km Road Concreted',
                fundingSource: '20% Development Fund',
                ccTypologyCode: 'N/A',
                created_at: '2025-12-02T08:55:51.000000Z',
                updated_at: '2025-12-02T08:55:51.000000Z',
                parentId: 3,
                scheduleOfImplementation: {
                    startingDate: '2025-01-15 08:00:00',
                    completionDate: '2025-06-30 17:00:00',
                },
                amount: {
                    ps: '0.00',
                    mooe: '50000.00',
                    fe: '0.00',
                    co: '850000.00',
                    total: '900000.00',
                },
                amountOfCcExpenditure: {
                    ccAdaptation: '0.00',
                    ccMitigation: '0.00',
                },
            },
            {
                id: 2,
                aipRefCode: 'AIP-2025-002',
                ppaDescription: 'Procurement of Medical Supplies',
                implementingOfficeDepartmentLocation: 'Municipal Health Office',
                expectedOutputs: 'Supplies Delivered',
                fundingSource: 'General Fund',
                ccTypologyCode: 'N/A',
                created_at: '2025-12-02T08:55:51.000000Z',
                updated_at: '2025-12-02T08:55:51.000000Z',
                parentId: 4,
                scheduleOfImplementation: {
                    startingDate: '2025-02-01 08:00:00',
                    completionDate: '2025-02-28 17:00:00',
                },
                amount: {
                    ps: '0.00',
                    mooe: '150000.00',
                    fe: '0.00',
                    co: '0.00',
                    total: '150000.00',
                },
                amountOfCcExpenditure: {
                    ccAdaptation: '0.00',
                    ccMitigation: '0.00',
                },
            },
            {
                id: 3,
                aipRefCode: 'AIP-2025-003',
                ppaDescription: 'Coastal Clean-up Drive',
                implementingOfficeDepartmentLocation: 'MENRO',
                expectedOutputs: '5 Barangays Cleaned',
                fundingSource: 'General Fund',
                ccTypologyCode: 'CC-A-01',
                created_at: '2025-12-02T08:55:51.000000Z',
                updated_at: '2025-12-02T08:55:51.000000Z',
                parentId: null,
                scheduleOfImplementation: {
                    startingDate: '2025-03-05 08:00:00',
                    completionDate: '2025-03-05 17:00:00',
                },
                amount: {
                    ps: '0.00',
                    mooe: '25000.00',
                    fe: '0.00',
                    co: '0.00',
                    total: '25000.00',
                },
                amountOfCcExpenditure: {
                    ccAdaptation: '25000.00',
                    ccMitigation: '0.00',
                },
            },
            {
                id: 4,
                aipRefCode: 'AIP-2025-004',
                ppaDescription: 'Construction of Multi-Purpose Hall',
                implementingOfficeDepartmentLocation: 'Engineering Office',
                expectedOutputs: 'Building Completed',
                fundingSource: 'Capital Outlay',
                ccTypologyCode: 'N/A',
                created_at: '2025-12-02T08:55:51.000000Z',
                updated_at: '2025-12-02T08:55:51.000000Z',
                parentId: null,
                scheduleOfImplementation: {
                    startingDate: '2025-04-01 08:00:00',
                    completionDate: '2025-10-15 17:00:00',
                },
                amount: {
                    ps: '0.00',
                    mooe: '0.00',
                    fe: '0.00',
                    co: '950000.00',
                    total: '950000.00',
                },
                amountOfCcExpenditure: {
                    ccAdaptation: '0.00',
                    ccMitigation: '0.00',
                },
            },
            {
                id: 5,
                aipRefCode: 'AIP-2025-005',
                ppaDescription: 'Skills Training for OSY',
                implementingOfficeDepartmentLocation: 'DSWD',
                expectedOutputs: '50 Youths Trained',
                fundingSource: 'GAD Fund',
                ccTypologyCode: 'N/A',
                created_at: '2025-12-02T08:55:51.000000Z',
                updated_at: '2025-12-02T08:55:51.000000Z',
                parentId: null,
                scheduleOfImplementation: {
                    startingDate: '2025-05-10 08:00:00',
                    completionDate: '2025-05-12 17:00:00',
                },
                amount: {
                    ps: '10000.00',
                    mooe: '45000.00',
                    fe: '0.00',
                    co: '0.00',
                    total: '55000.00',
                },
                amountOfCcExpenditure: {
                    ccAdaptation: '0.00',
                    ccMitigation: '0.00',
                },
            },
            {
                id: 6,
                aipRefCode: 'AIP-2025-006',
                ppaDescription: 'Installation of Solar Street Lights',
                implementingOfficeDepartmentLocation: 'General Services',
                expectedOutputs: '20 Units Installed',
                fundingSource: '20% Development Fund',
                ccTypologyCode: 'CC-M-05',
                created_at: '2025-12-02T08:55:51.000000Z',
                updated_at: '2025-12-02T08:55:51.000000Z',
                parentId: 1,
                scheduleOfImplementation: {
                    startingDate: '2025-06-01 08:00:00',
                    completionDate: '2025-07-30 17:00:00',
                },
                amount: {
                    ps: '0.00',
                    mooe: '20000.00',
                    fe: '0.00',
                    co: '300000.00',
                    total: '320000.00',
                },
                amountOfCcExpenditure: {
                    ccAdaptation: '0.00',
                    ccMitigation: '320000.00',
                },
            },
            {
                id: 7,
                aipRefCode: 'AIP-2025-007',
                ppaDescription: 'Purchase of IT Equipment',
                implementingOfficeDepartmentLocation: "Mayor's Office",
                expectedOutputs: '10 Laptops Purchased',
                fundingSource: 'General Fund',
                ccTypologyCode: 'N/A',
                created_at: '2025-12-02T08:55:51.000000Z',
                updated_at: '2025-12-02T08:55:51.000000Z',
                parentId: 1,
                scheduleOfImplementation: {
                    startingDate: '2025-01-20 08:00:00',
                    completionDate: '2025-02-20 17:00:00',
                },
                amount: {
                    ps: '0.00',
                    mooe: '0.00',
                    fe: '0.00',
                    co: '450000.00',
                    total: '450000.00',
                },
                amountOfCcExpenditure: {
                    ccAdaptation: '0.00',
                    ccMitigation: '0.00',
                },
            },
            {
                id: 8,
                aipRefCode: 'AIP-2025-008',
                ppaDescription: 'Disaster Preparedness Seminar',
                implementingOfficeDepartmentLocation: 'MDRRMO',
                expectedOutputs: '100 Participants',
                fundingSource: 'LDRRM Fund',
                ccTypologyCode: 'CC-A-03',
                created_at: '2025-12-02T08:55:51.000000Z',
                updated_at: '2025-12-02T08:55:51.000000Z',
                parentId: 4,
                scheduleOfImplementation: {
                    startingDate: '2025-07-01 08:00:00',
                    completionDate: '2025-07-03 17:00:00',
                },
                amount: {
                    ps: '15000.00',
                    mooe: '85000.00',
                    fe: '0.00',
                    co: '0.00',
                    total: '100000.00',
                },
                amountOfCcExpenditure: {
                    ccAdaptation: '100000.00',
                    ccMitigation: '0.00',
                },
            },
            {
                id: 9,
                aipRefCode: 'AIP-2025-009',
                ppaDescription: 'Loan Amortization Payment',
                implementingOfficeDepartmentLocation: 'Treasury',
                expectedOutputs: 'Loan Paid',
                fundingSource: 'General Fund',
                ccTypologyCode: 'N/A',
                created_at: '2025-12-02T08:55:51.000000Z',
                updated_at: '2025-12-02T08:55:51.000000Z',
                parentId: 3,
                scheduleOfImplementation: {
                    startingDate: '2025-01-01 08:00:00',
                    completionDate: '2025-12-31 17:00:00',
                },
                amount: {
                    ps: '0.00',
                    mooe: '0.00',
                    fe: '500000.00',
                    co: '0.00',
                    total: '500000.00',
                },
                amountOfCcExpenditure: {
                    ccAdaptation: '0.00',
                    ccMitigation: '0.00',
                },
            },
            {
                id: 10,
                aipRefCode: 'AIP-2025-010',
                ppaDescription: 'Agricultural Seeds Distribution',
                implementingOfficeDepartmentLocation: 'Agriculture Office',
                expectedOutputs: '500 Farmers Benefited',
                fundingSource: 'General Fund',
                ccTypologyCode: 'CC-A-09',
                created_at: '2025-12-02T08:55:51.000000Z',
                updated_at: '2025-12-02T08:55:51.000000Z',
                parentId: 4,
                scheduleOfImplementation: {
                    startingDate: '2025-08-15 08:00:00',
                    completionDate: '2025-08-20 17:00:00',
                },
                amount: {
                    ps: '0.00',
                    mooe: '120000.00',
                    fe: '0.00',
                    co: '0.00',
                    total: '120000.00',
                },
                amountOfCcExpenditure: {
                    ccAdaptation: '60000.00',
                    ccMitigation: '0.00',
                },
            },
        ];

        const expectedData = [
            {
                id: 3,
                aipRefCode: 'AIP-2025-003',
                ppaDescription: 'Coastal Clean-up Drive',
                implementingOfficeDepartmentLocation: 'MENRO',
                expectedOutputs: '5 Barangays Cleaned',
                fundingSource: 'General Fund',
                ccTypologyCode: 'CC-A-01',
                created_at: '2025-12-02T08:55:51.000000Z',
                updated_at: '2025-12-02T08:55:51.000000Z',
                parentId: null,
                scheduleOfImplementation: {
                    startingDate: '2025-03-05 08:00:00',
                    completionDate: '2025-03-05 17:00:00',
                },
                amount: {
                    ps: '0.00',
                    mooe: '25000.00',
                    fe: '0.00',
                    co: '0.00',
                    total: '25000.00',
                },
                amountOfCcExpenditure: {
                    ccAdaptation: '25000.00',
                    ccMitigation: '0.00',
                },
                children: [
                    {
                        id: 1,
                        aipRefCode: 'AIP-2025-001',
                        ppaDescription: 'Concreting of Farm-to-Market Road',
                        implementingOfficeDepartmentLocation:
                            'Engineering Office',
                        expectedOutputs: '1.5km Road Concreted',
                        fundingSource: '20% Development Fund',
                        ccTypologyCode: 'N/A',
                        created_at: '2025-12-02T08:55:51.000000Z',
                        updated_at: '2025-12-02T08:55:51.000000Z',
                        parentId: 3,
                        scheduleOfImplementation: {
                            startingDate: '2025-01-15 08:00:00',
                            completionDate: '2025-06-30 17:00:00',
                        },
                        amount: {
                            ps: '0.00',
                            mooe: '50000.00',
                            fe: '0.00',
                            co: '850000.00',
                            total: '900000.00',
                        },
                        amountOfCcExpenditure: {
                            ccAdaptation: '0.00',
                            ccMitigation: '0.00',
                        },
                        children: [
                            {
                                id: 6,
                                aipRefCode: 'AIP-2025-006',
                                ppaDescription:
                                    'Installation of Solar Street Lights',
                                implementingOfficeDepartmentLocation:
                                    'General Services',
                                expectedOutputs: '20 Units Installed',
                                fundingSource: '20% Development Fund',
                                ccTypologyCode: 'CC-M-05',
                                created_at: '2025-12-02T08:55:51.000000Z',
                                updated_at: '2025-12-02T08:55:51.000000Z',
                                parentId: 1,
                                scheduleOfImplementation: {
                                    startingDate: '2025-06-01 08:00:00',
                                    completionDate: '2025-07-30 17:00:00',
                                },
                                amount: {
                                    ps: '0.00',
                                    mooe: '20000.00',
                                    fe: '0.00',
                                    co: '300000.00',
                                    total: '320000.00',
                                },
                                amountOfCcExpenditure: {
                                    ccAdaptation: '0.00',
                                    ccMitigation: '320000.00',
                                },
                            },
                            {
                                id: 7,
                                aipRefCode: 'AIP-2025-007',
                                ppaDescription: 'Purchase of IT Equipment',
                                implementingOfficeDepartmentLocation:
                                    "Mayor's Office",
                                expectedOutputs: '10 Laptops Purchased',
                                fundingSource: 'General Fund',
                                ccTypologyCode: 'N/A',
                                created_at: '2025-12-02T08:55:51.000000Z',
                                updated_at: '2025-12-02T08:55:51.000000Z',
                                parentId: 1,
                                scheduleOfImplementation: {
                                    startingDate: '2025-01-20 08:00:00',
                                    completionDate: '2025-02-20 17:00:00',
                                },
                                amount: {
                                    ps: '0.00',
                                    mooe: '0.00',
                                    fe: '0.00',
                                    co: '450000.00',
                                    total: '450000.00',
                                },
                                amountOfCcExpenditure: {
                                    ccAdaptation: '0.00',
                                    ccMitigation: '0.00',
                                },
                            },
                        ],
                    },
                    {
                        id: 9,
                        aipRefCode: 'AIP-2025-009',
                        ppaDescription: 'Loan Amortization Payment',
                        implementingOfficeDepartmentLocation: 'Treasury',
                        expectedOutputs: 'Loan Paid',
                        fundingSource: 'General Fund',
                        ccTypologyCode: 'N/A',
                        created_at: '2025-12-02T08:55:51.000000Z',
                        updated_at: '2025-12-02T08:55:51.000000Z',
                        parentId: 3,
                        scheduleOfImplementation: {
                            startingDate: '2025-01-01 08:00:00',
                            completionDate: '2025-12-31 17:00:00',
                        },
                        amount: {
                            ps: '0.00',
                            mooe: '0.00',
                            fe: '500000.00',
                            co: '0.00',
                            total: '500000.00',
                        },
                        amountOfCcExpenditure: {
                            ccAdaptation: '0.00',
                            ccMitigation: '0.00',
                        },
                    },
                ],
            },
            {
                id: 4,
                aipRefCode: 'AIP-2025-004',
                ppaDescription: 'Construction of Multi-Purpose Hall',
                implementingOfficeDepartmentLocation: 'Engineering Office',
                expectedOutputs: 'Building Completed',
                fundingSource: 'Capital Outlay',
                ccTypologyCode: 'N/A',
                created_at: '2025-12-02T08:55:51.000000Z',
                updated_at: '2025-12-02T08:55:51.000000Z',
                parentId: null,
                scheduleOfImplementation: {
                    startingDate: '2025-04-01 08:00:00',
                    completionDate: '2025-10-15 17:00:00',
                },
                amount: {
                    ps: '0.00',
                    mooe: '0.00',
                    fe: '0.00',
                    co: '950000.00',
                    total: '950000.00',
                },
                amountOfCcExpenditure: {
                    ccAdaptation: '0.00',
                    ccMitigation: '0.00',
                },
                children: [
                    {
                        id: 2,
                        aipRefCode: 'AIP-2025-002',
                        ppaDescription: 'Procurement of Medical Supplies',
                        implementingOfficeDepartmentLocation:
                            'Municipal Health Office',
                        expectedOutputs: 'Supplies Delivered',
                        fundingSource: 'General Fund',
                        ccTypologyCode: 'N/A',
                        created_at: '2025-12-02T08:55:51.000000Z',
                        updated_at: '2025-12-02T08:55:51.000000Z',
                        parentId: 4,
                        scheduleOfImplementation: {
                            startingDate: '2025-02-01 08:00:00',
                            completionDate: '2025-02-28 17:00:00',
                        },
                        amount: {
                            ps: '0.00',
                            mooe: '150000.00',
                            fe: '0.00',
                            co: '0.00',
                            total: '150000.00',
                        },
                        amountOfCcExpenditure: {
                            ccAdaptation: '0.00',
                            ccMitigation: '0.00',
                        },
                    },
                    {
                        id: 8,
                        aipRefCode: 'AIP-2025-008',
                        ppaDescription: 'Disaster Preparedness Seminar',
                        implementingOfficeDepartmentLocation: 'MDRRMO',
                        expectedOutputs: '100 Participants',
                        fundingSource: 'LDRRM Fund',
                        ccTypologyCode: 'CC-A-03',
                        created_at: '2025-12-02T08:55:51.000000Z',
                        updated_at: '2025-12-02T08:55:51.000000Z',
                        parentId: 4,
                        scheduleOfImplementation: {
                            startingDate: '2025-07-01 08:00:00',
                            completionDate: '2025-07-03 17:00:00',
                        },
                        amount: {
                            ps: '15000.00',
                            mooe: '85000.00',
                            fe: '0.00',
                            co: '0.00',
                            total: '100000.00',
                        },
                        amountOfCcExpenditure: {
                            ccAdaptation: '100000.00',
                            ccMitigation: '0.00',
                        },
                    },
                    {
                        id: 10,
                        aipRefCode: 'AIP-2025-010',
                        ppaDescription: 'Agricultural Seeds Distribution',
                        implementingOfficeDepartmentLocation:
                            'Agriculture Office',
                        expectedOutputs: '500 Farmers Benefited',
                        fundingSource: 'General Fund',
                        ccTypologyCode: 'CC-A-09',
                        created_at: '2025-12-02T08:55:51.000000Z',
                        updated_at: '2025-12-02T08:55:51.000000Z',
                        parentId: 4,
                        scheduleOfImplementation: {
                            startingDate: '2025-08-15 08:00:00',
                            completionDate: '2025-08-20 17:00:00',
                        },
                        amount: {
                            ps: '0.00',
                            mooe: '120000.00',
                            fe: '0.00',
                            co: '0.00',
                            total: '120000.00',
                        },
                        amountOfCcExpenditure: {
                            ccAdaptation: '60000.00',
                            ccMitigation: '0.00',
                        },
                    },
                ],
            },
            {
                id: 5,
                aipRefCode: 'AIP-2025-005',
                ppaDescription: 'Skills Training for OSY',
                implementingOfficeDepartmentLocation: 'DSWD',
                expectedOutputs: '50 Youths Trained',
                fundingSource: 'GAD Fund',
                ccTypologyCode: 'N/A',
                created_at: '2025-12-02T08:55:51.000000Z',
                updated_at: '2025-12-02T08:55:51.000000Z',
                parentId: null,
                scheduleOfImplementation: {
                    startingDate: '2025-05-10 08:00:00',
                    completionDate: '2025-05-12 17:00:00',
                },
                amount: {
                    ps: '10000.00',
                    mooe: '45000.00',
                    fe: '0.00',
                    co: '0.00',
                    total: '55000.00',
                },
                amountOfCcExpenditure: {
                    ccAdaptation: '0.00',
                    ccMitigation: '0.00',
                },
            },
        ];

        const result = nestData(inputData);

        // Assert that the transformed data matches the expected structure and values
        expect(result).toEqual(expectedData);
    });
});
