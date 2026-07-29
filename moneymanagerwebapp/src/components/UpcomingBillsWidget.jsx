import { ReceiptText, ArrowRight, AlertCircle, Clock, CheckCircle2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

const UpcomingBillsWidget = ({ bills = [] }) => {
    const navigate = useNavigate();

    if (!bills || bills.length === 0) {
        return (
            <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm my-6">
                <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                        <ReceiptText className="text-purple-600" size={20} />
                        <h3 className="text-base font-bold text-gray-900">Upcoming Bills</h3>
                    </div>
                    <button
                        onClick={() => navigate("/bills")}
                        className="text-xs font-semibold text-purple-600 hover:text-purple-700 flex items-center gap-1"
                    >
                        Manage Bills <ArrowRight size={14} />
                    </button>
                </div>
                <div className="bg-gray-50 border border-dashed border-gray-200 rounded-xl p-4 text-center">
                    <CheckCircle2 className="mx-auto text-emerald-500 mb-1" size={24} />
                    <p className="text-xs text-gray-600 font-medium">No upcoming bills due right now!</p>
                </div>
            </div>
        );
    }

    const getUrgencyBadge = (dueDateStr) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const due = new Date(dueDateStr);
        due.setHours(0, 0, 0, 0);

        const diffTime = due.getTime() - today.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays < 0) {
            return {
                text: `Overdue by ${Math.abs(diffDays)} day${Math.abs(diffDays) > 1 ? "s" : ""}`,
                color: "bg-red-50 text-red-700 border-red-200",
                icon: AlertCircle
            };
        } else if (diffDays <= 2) {
            return {
                text: diffDays === 0 ? "Due Today" : diffDays === 1 ? "Due Tomorrow" : "Due in 2 days",
                color: "bg-red-50 text-red-700 border-red-200",
                icon: Clock
            };
        } else if (diffDays <= 7) {
            return {
                text: `Due in ${diffDays} days`,
                color: "bg-amber-50 text-amber-700 border-amber-200",
                icon: Clock
            };
        } else {
            return {
                text: `Due in ${diffDays} days`,
                color: "bg-emerald-50 text-emerald-700 border-emerald-200",
                icon: Clock
            };
        }
    };

    return (
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm my-6">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <div className="p-2 bg-purple-50 text-purple-600 rounded-xl">
                        <ReceiptText size={18} />
                    </div>
                    <div>
                        <h3 className="text-base font-bold text-gray-900">Upcoming Bills</h3>
                        <p className="text-xs text-gray-500">Next unpaid bill reminders</p>
                    </div>
                </div>
                <button
                    onClick={() => navigate("/bills")}
                    className="text-xs font-semibold text-purple-600 hover:text-purple-700 flex items-center gap-1 hover:underline"
                >
                    View All <ArrowRight size={14} />
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {bills.map((bill) => {
                    const badge = getUrgencyBadge(bill.dueDate);
                    const BadgeIcon = badge.icon;

                    return (
                        <div
                            key={bill.id}
                            className="bg-gray-50/70 border border-gray-100 rounded-xl p-3.5 flex flex-col justify-between hover:border-gray-200 transition-all"
                        >
                            <div className="flex items-start justify-between gap-2 mb-2">
                                <div>
                                    <h4 className="text-xs font-bold text-gray-900 truncate">{bill.name}</h4>
                                    <p className="text-xs text-gray-500 font-medium mt-0.5">
                                        {bill.categoryName || "Bill"}
                                    </p>
                                </div>
                                <span className="text-xs font-extrabold text-gray-900">
                                    ₹{Number(bill.amount).toLocaleString("en-IN")}
                                </span>
                            </div>

                            <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-100">
                                <span className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full border ${badge.color}`}>
                                    <BadgeIcon size={12} />
                                    {badge.text}
                                </span>
                                <button
                                    onClick={() => navigate("/bills")}
                                    className="text-[11px] font-bold text-purple-600 hover:text-purple-800"
                                >
                                    Pay →
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default UpcomingBillsWidget;
