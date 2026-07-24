import moment from "moment";
import {Download, Mail, Coins} from "lucide-react";
import TransactionInfoCard from "./TransactionInfoCard.jsx";
import {EmptyState} from "./StateCard.jsx";

const ExpenseList = ({ transactions, onDelete, onDownload, onEmail, onAddExpense }) => {
    if (!transactions || transactions.length === 0) {
        return (
            <EmptyState
                title="No expenses recorded yet"
                description="Start tracking your daily expenses, bills, and payments."
                icon={Coins}
                actionLabel="Add Expense"
                onAction={onAddExpense}
            />
        );
    }

    return (
        <div className="card">
            <div className="flex items-center justify-between mb-4">
                <h5 className="text-lg font-semibold">All Expenses</h5>
                <div className="flex items-center justify-end gap-2">
                    <button className="card-btn" onClick={onEmail}>
                        <Mail size={15} className="text-base" /> Email
                    </button>
                    <button className="card-btn" onClick={onDownload}>
                        <Download size={15} className="text-base" /> Download
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {transactions?.map((expense) => (
                    <TransactionInfoCard
                        key={expense.id}
                        title={expense.name}
                        icon={expense.icon}
                        date={moment(expense.date).format("Do MMM YYYY")}
                        amount={expense.amount}
                        type="expense"
                        onDelete={() => onDelete(expense.id)}
                    />
                ))}
            </div>
        </div>
    );
};

export default ExpenseList;
