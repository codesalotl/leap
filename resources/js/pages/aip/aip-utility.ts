import type { Aip, AipFlat } from '@/pages/aip/types';

export function formatData(data: AipFlat[]): Aip[] {
    return data.map((obj) => {
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

export function nestData(data: Aip[]): Aip[] {
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
    // console.log(finalData);

    return finalData;
}
