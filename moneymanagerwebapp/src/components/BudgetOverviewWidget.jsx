import { formatCurrency } from "../util/util.js";
import { AlertTriangle, PiggyBank, ArrowUpRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const getProgressColor = (percentage) => {
    if (percentage > 100) return "bg-rose-500 text-rose-700 border-rose-200";
    if (percentage >= 70) return "bg-amber-500 text-amber-700 border-amber-200";
    return "bg-emerald-500 text-emerald-700 border-emerald-200";
};

export const getProgressTrackBg = (percentage) => {
    if (percentage > 100) return "bg-rose-100";
    if (percentage >= 70) return "bg-amber-100";
    return "bg-emerald-100";
};

const BudgetOverviewWidget = ({ budgets = [] }) => {
    const navigate = useNavigate();

    if (!budgets || budgets.length === 0) {
        return (
            <div className="card p-5 border border-gray-100 bg-white rounded-2xl shadow-xs">
                <div className="flex items-center justify-between mb-3">
                    <h4 className="text-base font-semibold text-gray-900 flex items-center gap-2">
                        <PiggyBank className="w-5 h-5 text-purple-600" />
                        Budget Overview
                    </h4>
                </div>
                <div className="text-center py-6 px-4 bg-purple-50/40 rounded-xl border border-dashed border-purple-200/80">
                    <p className="text-xs text-gray-600 mb-3">
                        No category budgets configured for this month yet. Set a monthly limit to track your spending!
                    </p>
                    <button
                        onClick={() => navigate("/category")}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-purple-700 bg-purple-100 hover:bg-purple-200 rounded-lg transition-colors cursor-pointer"
                    >
                        Configure Budgets
                        <ArrowUpRight size={14} />
                    </button>
                </div>
            </div>
        );
    }

    // Sort budgets by percentage used descending
    const sortedBudgets = [...budgets].map(b => {
        const spent = b.totalSpent || 0;
        const limit = b.monthlyLimit || 1;
        const percentage = (spent / limit) * 100;
        return { ...b, percentage, spent, limit };
    }).sort((a, b) => b.percentage - a.percentage);

    // Show top 3 closest to or over limit
    const topBudgets = sortedBudgets.slice(0, 3);

    // Check for exceeded budgets
    const exceededBudgets = sortedBudgets.filter(b => b.spent > b.limit);

    return (
        <div className="space-y-4">
            {/* Warning Banner for Exceeded Budgets */}
            {exceededBudgets.length > 0 && (
                <div className="space-y-2">
                    {exceededBudgets.map(b => {
                        const excess = b.spent - b.limit;
                        return (
                            <div
                                key={`exceeded_${b.id || b.categoryId}`}
                                className="flex items-center justify-between p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-rose-900 shadow-xs text-xs sm:text-sm font-medium animate-in fade-in duration-200"
                            >
                                <div className="flex items-center gap-2.5 min-w-0">
                                    <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0" />
                                    <span className="truncate">
                                        ⚠️ You've exceeded your <strong>{b.categoryName}</strong> budget by{" "}
                                        <strong className="text-rose-700">{formatCurrency(excess)}</strong> this month.
                                    </span>
                                </div>
                                <button
                                    onClick={() => navigate("/category")}
                                    className="text-xs font-semibold text-rose-700 hover:underline shrink-0 ml-2"
                                >
                                    Adjust Limit
                                </button>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Main Widget Card */}
            <div className="card p-5 border border-gray-100 bg-white rounded-2xl shadow-xs">
                <div className="flex items-center justify-between mb-4 pb-2 border-b border-gray-100">
                    <div>
                        <h4 className="text-base font-semibold text-gray-900 flex items-center gap-2">
                            <PiggyBank className="w-5 h-5 text-purple-600" />
                            Budget Overview
                        </h4>
                        <p className="text-xs text-gray-500 mt-0.5">
                            Categories closest to or over monthly limit
                        </p>
                    </div>
                    <button
                        onClick={() => navigate("/category")}
                        className="text-xs font-semibold text-purple-600 hover:text-purple-800 transition-colors flex items-center gap-1 cursor-pointer"
                    >
                        View All
                        <ArrowUpRight size={14} />
                    </button>
                </div>

                <div className="space-y-4">
                    {topBudgets.map((budget) => {
                        const barColor = getProgressColor(budget.percentage);
                        const trackBg = getProgressTrackBg(budget.percentage);
                        const clampedWidth = Math.min(budget.percentage, 100);

                        return (
                            <div key={budget.id || budget.categoryId} className="space-y-1.5">
                                <div className="flex items-center justify-between text-xs font-medium">
                                    <div className="flex items-center gap-2 min-w-0">
                                        <span className="text-base">
                                            {budget.categoryIcon && typeof budget.categoryIcon === "string" && budget.categoryIcon.startsWith("http") ? (
                                                <img src={budget.categoryIcon} alt={budget.categoryName} className="w-4 h-4 object-contain inline" />
                                            ) : (
                                                budget.categoryIcon || "💸"
                                            )}
                                        </span>
                                        <span className="text-gray-900 font-semibold truncate">
                                            {budget.categoryName}
                                        </span>
                                    </div>

                                    <div className="text-right shrink-0">
                                        <span className="text-gray-900 font-semibold">
                                            {formatCurrency(budget.spent)}
                                        </span>
                                        <span className="text-gray-400"> / {formatCurrency(budget.limit)}</span>
                                        <span className={`ml-2 px-1.5 py-0.5 rounded-full text-[10px] font-bold ${barColor.includes("rose") ? "bg-rose-100 text-rose-700" : barColor.includes("amber") ? "bg-amber-100 text-amber-700" : "bg-emerald-100 text-emerald-700"}`}>
                                            {budget.percentage.toFixed(0)}%
                                        </span>
                                    </div>
                                </div>

                                {/* Progress Bar Track */}
                                <div className={`w-full h-2.5 rounded-full ${trackBg} overflow-hidden`}>
                                    <div
                                        className={`h-full rounded-full transition-all duration-500 ${barColor.split(" ")[0]}`}
                                        style={{ width: `${clampedWidth}%` }}
                                    />
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default BudgetOverviewWidget;
