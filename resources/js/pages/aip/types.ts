export type Aip = {
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

export type AipFlat = {
    id: number;
    aipRefCode: string;
    ppaDescription: string;
    implementingOfficeDepartmentLocation: string;
    startingDate: string;
    completionDate: string;
    expectedOutputs: string;
    fundingSource: string;
    ps: string;
    mooe: string;
    fe: string;
    co: string;
    total: string;
    ccAdaptation: string;
    ccMitigation: string;
    ccTypologyCode: string;
    children?: Aip[];
    created_at: string;
    updated_at: string;
};

export type AipProp = {
    data: AipFlat[];
};

export type AipAlertDialogProp = {
    data: Aip;
};

export type AipDialogProp = {
    data: Aip;
    mode: 'create' | 'add' | 'edit';
    hidden?: boolean;
};

export type AipFormProp = {
    data: Aip;
    mode: 'create' | 'add' | 'edit';
};