type Aip = {
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
        ps: number;
        mooe: number;
        fe: number;
        co: number;
        total: number;
    };
    amountOfCcExpenditure: {
        ccAdaptation: string;
        ccMitigation: string;
    };
    ccTypologyCode: string;
    children?: Aip[];
};

type AipRaw = {
    aipRefCode: string;
    ppaDescription: string;
    implementingOfficeDepartmentLocation: string;
    startingDate: string;
    completionDate: string;
    expectedOutputs: string;
    fundingSource: string;
    ps: number;
    mooe: number;
    fe: number;
    co: number;
    total: number;
    ccAdaptation: string;
    ccMitigation: string;
    ccTypologyCode: string;
    children?: Aip[];
};

export function formatData(data: AipRaw[]): Aip[] {
    return data.map((obj) => {
        // console.log(obj);

        const {
            startingDate,
            completionDate,
            ps,
            mooe,
            fe,
            co,
            total,
            ccAdaptation,
            ccMitigation,
            ...rest
        } = obj;

        return {
            ...rest,
            scheduleOfImplementation: {
                startingDate: startingDate,
                completionDate: completionDate,
            },
            amount: {
                ps: ps,
                mooe: mooe,
                fe: fe,
                co: co,
                total: total,
            },
            amountOfCcExpenditure: {
                ccAdaptation: ccAdaptation,
                ccMitigation: ccMitigation,
            },
        };
    });
}

export function nestData(data): Aip[] {
    let finalData = [];

    const parent = data
        .filter((row) => {
            return row.parentId === null;
        })
        .map((row) => {
            return { ...row, children: [] };
        });

    const children = data.filter((row) => {
        return row.parentId !== null;
    });

    // const grandChilden;

    return finalData;
}
