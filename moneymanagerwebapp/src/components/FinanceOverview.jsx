import CustomPieChart from "./CustomPieChart.jsx";
import {formatCurrency} from "../util/util.js";

const FinanceOverview = ({totalBalance = 0, totalIncome = 0, totalExpense = 0}) => {
    // Green for Total Income, Red for Total Expenses
    const COLORS = ["#016630", "#a0090e"];

    const balanceData = [
        { name: "Total Income", amount: totalIncome },
        { name: "Total Expenses", amount: totalExpense },
    ];

    return (
        <div className="card flex flex-col justify-between">
            <div>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-gray-100">
                    <div>
                        <h5 className="text-lg font-semibold text-gray-900">Financial Overview</h5>
                        <p className="text-xs text-gray-400 mt-0.5">Ratio of total income vs. expenses</p>
                    </div>
                    {/* Legend directly above/beside chart inside card header */}
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1.5">
                            <span className="w-2.5 h-2.5 rounded-full bg-[#016630] shrink-0"></span>
                            <span className="text-xs font-medium text-gray-600">Total Income</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <span className="w-2.5 h-2.5 rounded-full bg-[#a0090e] shrink-0"></span>
                            <span className="text-xs font-medium text-gray-600">Total Expenses</span>
                        </div>
                    </div>
                </div>

                <div className="pt-2 flex items-center justify-center">
                    <CustomPieChart
                        data={balanceData}
                        label="Total Balance"
                        totalAmount={formatCurrency(totalBalance)}
                        colors={COLORS}
                        showTextAnchor
                        hideLegend
                    />
                </div>
            </div>
        </div>
    );
};

export default FinanceOverview;