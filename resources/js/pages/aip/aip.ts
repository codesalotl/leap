type Aip = {
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
    created_at: string;
    updated_at: string;
};

type AipRaw = {
    id: number;
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
    created_at: string;
    updated_at: string;
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

export function nestData(data: AipRaw[]): Aip[] {
    console.log(data);

    const finalData: Aip[] = [];

    const map = new Map();

    // store all items in map
    // data.forEach((item) => map.set(item.id, { ...item, children: [] }));
    data.forEach((item) => map.set(item.id, { ...item }));

    // attach to parent
    map.forEach((item) => {
        // console.log(item);

        if (item.parentId === null) {
            finalData.push(item);
        } else {
            const parent = map.get(item.parentId);

            if (!parent.children) {
                parent.children = [];
            }

            // console.log(parent);

            if (parent) {
                parent.children.push(item);
            }
        }
    });

    // console.log(map);
    console.log(finalData);

    return finalData;
}
