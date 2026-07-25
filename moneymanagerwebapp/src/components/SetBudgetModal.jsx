import { useState, useEffect } from "react";
import Modal from "./Modal.jsx";
import Button from "./Button.jsx";
import { DollarSign, Trash2 } from "lucide-react";
import toast from "react-hot-toast";

const SetBudgetModal = ({ isOpen, onClose, category, currentBudget, onSaveBudget, onDeleteBudget }) => {
    const [monthlyLimit, setMonthlyLimit] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (currentBudget && currentBudget.monthlyLimit != null) {
            setMonthlyLimit(currentBudget.monthlyLimit.toString());
        } else {
            setMonthlyLimit("");
        }
    }, [currentBudget, isOpen]);

    if (!category) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        const limitNum = parseFloat(monthlyLimit);

        if (!monthlyLimit || isNaN(limitNum) || limitNum <= 0) {
            toast.error("Please enter a valid monthly limit greater than 0.");
            return;
        }

        setIsSubmitting(true);
        try {
            await onSaveBudget(category.id, limitNum);
            onClose();
        } catch (err) {
            console.error("Failed to save budget", err);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async () => {
        if (!currentBudget?.id) return;
        setIsSubmitting(true);
        try {
            await onDeleteBudget(currentBudget.id);
            onClose();
        } catch (err) {
            console.error("Failed to delete budget", err);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={`Set monthly budget for ${category.name}`}
        >
            <form onSubmit={handleSubmit} className="space-y-5">
                <div className="flex items-center gap-3 p-3 bg-purple-50/60 rounded-xl border border-purple-100">
                    <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-xl shrink-0">
                        {category.icon && typeof category.icon === "string" && category.icon.startsWith("http") ? (
                            <img src={category.icon} alt={category.name} className="w-6 h-6 object-contain" />
                        ) : (
                            category.icon || "💸"
                        )}
                    </div>
                    <div>
                        <h5 className="text-sm font-semibold text-gray-900">{category.name}</h5>
                        <p className="text-xs text-gray-500 capitalize">{category.type} Category</p>
                    </div>
                </div>

                <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5 uppercase tracking-wider">
                        Monthly Budget Limit (₹)
                    </label>
                    <div className="relative rounded-xl shadow-xs">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400 font-bold">
                            ₹
                        </div>
                        <input
                            type="number"
                            step="any"
                            min="1"
                            placeholder="e.g., 8000"
                            value={monthlyLimit}
                            onChange={(e) => setMonthlyLimit(e.target.value)}
                            disabled={isSubmitting}
                            className="w-full pl-8 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium text-gray-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent transition-all"
                            autoFocus
                        />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                        Set the maximum spending limit for this category for the current month.
                    </p>
                </div>

                <div className="flex items-center justify-end gap-3 pt-2 border-t border-gray-100">
                    {currentBudget?.id && (
                        <button
                            type="button"
                            onClick={handleDelete}
                            disabled={isSubmitting}
                            className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer mr-auto"
                        >
                            <Trash2 size={14} />
                            Remove Budget
                        </button>
                    )}

                    <button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-xl transition-colors cursor-pointer"
                    >
                        Cancel
                    </button>

                    <Button
                        type="submit"
                        disabled={isSubmitting}
                        icon={DollarSign}
                    >
                        {isSubmitting ? "Saving..." : "Save Budget"}
                    </Button>
                </div>
            </form>
        </Modal>
    );
};

export default SetBudgetModal;
