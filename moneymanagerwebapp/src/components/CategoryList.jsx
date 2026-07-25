import {Layers2, Pencil, FolderPlus, PiggyBank, Plus} from "lucide-react";
import {EmptyState} from "./StateCard.jsx";
import {formatCurrency} from "../util/util.js";
import {getProgressColor, getProgressTrackBg} from "./BudgetOverviewWidget.jsx";

const renderCategoryIcon = (category) => {
    const iconValue = category?.icon;
    if (iconValue && typeof iconValue === "string" && iconValue.trim() !== "") {
        const trimmed = iconValue.trim();
        if (trimmed.startsWith("http://") || trimmed.startsWith("https://") || trimmed.startsWith("data:")) {
            return (
                <img
                    src={trimmed}
                    alt={category.name}
                    className="w-7 h-7 object-contain"
                    onError={(e) => {
                        e.target.style.display = 'none';
                    }}
                />
            );
        }
        return <span className="text-2xl leading-none">{trimmed}</span>;
    }

    return <Layers2 className="text-purple-700" size={24} />;
};

const CategoryList = ({categories, budgets = [], onEditCategory, onAddCategory, onSetBudget}) => {
    if (!categories || categories.length === 0) {
        return (
            <EmptyState
                title="No categories created yet"
                description="Organize your finances by creating custom income and expense categories."
                icon={FolderPlus}
                actionLabel="Add Category"
                onAction={onAddCategory}
            />
        );
    }

    return (
        <div className="card p-5">
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-gray-100">
                <h4 className="text-lg font-semibold text-gray-900">Category Sources</h4>
                <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2.5 py-1 rounded-full">
                    {categories.length} {categories.length === 1 ? 'category' : 'categories'}
                </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {categories.map((category) => {
                    const isExpense = category.type?.toLowerCase() === "expense";
                    const budget = budgets.find((b) => b.categoryId === category.id);
                    const spent = budget?.totalSpent || 0;
                    const limit = budget?.monthlyLimit || 0;
                    const percentage = limit > 0 ? (spent / limit) * 100 : 0;

                    return (
                        <div
                            key={category.id}
                            className="group relative flex flex-col p-4 rounded-xl border border-gray-100 hover:border-purple-200 hover:bg-purple-50/20 transition-all space-y-3">
                            <div className="flex items-center gap-3">
                                <div className="w-11 h-11 flex items-center justify-center text-xl text-gray-800 bg-purple-50 rounded-full shrink-0 border border-purple-100">
                                    {renderCategoryIcon(category)}
                                </div>

                                <div className="flex-1 flex items-center justify-between min-w-0">
                                    <div className="min-w-0">
                                        <p className="text-sm text-gray-900 font-semibold truncate">
                                            {category.name}
                                        </p>
                                        <p className="text-xs text-gray-400 mt-0.5 capitalize">
                                            {category.type}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        {/* Set Budget button for Expense categories only */}
                                        {isExpense && (
                                            <button
                                                onClick={() => onSetBudget(category, budget)}
                                                title={budget ? "Edit Budget" : "Set Monthly Budget"}
                                                className={`text-xs font-medium px-2 py-1 rounded-lg flex items-center gap-1 transition-all cursor-pointer ${
                                                    budget
                                                        ? "bg-purple-100 text-purple-700 hover:bg-purple-200"
                                                        : "text-gray-500 hover:text-purple-700 hover:bg-gray-100 border border-gray-200"
                                                }`}
                                            >
                                                <PiggyBank size={14} />
                                                <span>{budget ? "Budget" : "Set Budget"}</span>
                                            </button>
                                        )}

                                        <button
                                            onClick={() => onEditCategory(category)}
                                            className="text-gray-400 hover:text-purple-600 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer p-1">
                                            <Pencil size={16} />
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Budget progress bar (Only rendered if budget is set) */}
                            {budget && isExpense && (
                                <div className="pt-2 border-t border-gray-100 space-y-1.5">
                                    <div className="flex items-center justify-between text-xs font-medium">
                                        <span className="text-gray-600">
                                            {formatCurrency(spent)} / <strong className="text-gray-900">{formatCurrency(limit)}</strong>
                                        </span>
                                        <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                                            percentage > 100 ? "bg-rose-100 text-rose-700" : percentage >= 70 ? "bg-amber-100 text-amber-700" : "bg-emerald-100 text-emerald-700"
                                        }`}>
                                            {percentage.toFixed(0)}%
                                        </span>
                                    </div>

                                    {/* Horizontal progress bar */}
                                    <div className={`w-full h-2 rounded-full ${getProgressTrackBg(percentage)} overflow-hidden`}>
                                        <div
                                            className={`h-full rounded-full transition-all duration-500 ${getProgressColor(percentage).split(" ")[0]}`}
                                            style={{ width: `${Math.min(percentage, 100)}%` }}
                                        />
                                    </div>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default CategoryList;