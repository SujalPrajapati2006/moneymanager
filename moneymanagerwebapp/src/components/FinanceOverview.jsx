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
        <div className="card">
            <div className="flex items-center justify-between">
                <h5 className="text-lg font-semibold">Financial Overview</h5>
            </div>

            <CustomPieChart
                data={balanceData}
                label="Total Balance"
                totalAmount={formatCurrency(totalBalance)}
                colors={COLORS}
                showTextAnchor
            />
        </div>
    );
};

export default FinanceOverview;