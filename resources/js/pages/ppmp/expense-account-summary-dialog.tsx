import { DataTable } from '@/components/data-table';
import columns from './cols/expense-account-summary-cols';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    // DialogTrigger,
} from '@/components/ui/dialog';
import type {
    Ppmp,
    FundingSource,
    PriceList,
    ChartOfAccount,
} from '@/types/global';

type PpmpWithFundingSource = Ppmp & FundingSource;
type PpmpWithFundingSourceAndPriceList = PpmpWithFundingSource & PriceList;
type PpmpWithFundingSourceAndPriceListAndCoa =
    PpmpWithFundingSourceAndPriceList & ChartOfAccount;

interface ExpenseAccountSummaryDialog {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    flatPpmpWithFsWithPlWithCoa: PpmpWithFundingSourceAndPriceListAndCoa[];
}

export default function ExpenseAccountSummaryDialog({
    open,
    onOpenChange,
    // flatPpmpWithFsWithPlWithCoa,
    coaWithPriceLists,
}: ExpenseAccountSummaryDialog) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            {/* <DialogTrigger>Open</DialogTrigger> */}
            <DialogContent className="sm:max-w-7xl">
                {/* <DialogContent> */}
                <DialogHeader>
                    <DialogTitle>Expense Account Summary</DialogTitle>
                    <DialogDescription className="sr-only" />
                </DialogHeader>

                {/* Content here */}
                <div className="overflow-hidden">
                    <DataTable
                        columns={columns}
                        data={coaWithPriceLists}
                        withFooter={true}
                    />
                </div>
            </DialogContent>
        </Dialog>
    );
}
