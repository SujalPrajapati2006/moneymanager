import { useState, useEffect } from "react";
import EmojiPickerPopup from "./EmojiPickerPopup.jsx";
import Input from "./Input.jsx";
import { Plus } from "lucide-react";
import Button from "./Button.jsx";

// Add 'categories' prop
const AddExpenseForm = ({ onAddExpense, categories }) => {
    const [expense, setExpense] = useState({ // Renamed 'income' state to 'expense' for clarity
        name: "",
        categoryId: "", // Changed from 'category' to 'categoryId'
        amount: "",
        date: "",
        icon: "", // Icon might be associated with the selected category, or kept separate for custom entries
        isRecurring: false,
        recurrenceFrequency: "monthly",
        recurrenceEndDate: "",
    });
    const [loading, setLoading] = useState(false);

    // Effect to set a default category if categories are loaded and none is selected
    useEffect(() => {
        if (categories && categories.length > 0 && !expense.categoryId) {
            // Automatically select the first category as default if none is chosen
            setExpense((prev) => ({ ...prev, categoryId: categories[0].id })); // Use categories[0].id for MySQL
        }
    }, [categories, expense.categoryId]);

    const handleChange = (key, value) => setExpense({ ...expense, [key]: value }); // Changed setIncome to setExpense

    const handleAddExpense = async () => {
        setLoading(true);
        try {
            await onAddExpense(expense);
        } finally {
            setLoading(false);
        }
    };

    // Map categories to the format expected by the reusable Input dropdown
    const categoryOptions = categories.map((cat) => ({
        value: cat.id, // Correct for MySQL 'id'
        label: `${cat.name}`, // Display icon and name in dropdown
    }));

    return (
        <div>
            <EmojiPickerPopup
                icon={expense.icon} // Uses expense.icon now
                onSelect={(selectedIcon) => handleChange("icon", selectedIcon)}
            />

            <Input
                value={expense.name}
                onChange={({ target }) => handleChange("name", target.value)}
                label="Expense Title"
                placeholder="e.g., Electricity, Wifi, Groceries"
                type="text"
            />

            {/* Replaced Input for 'Category' text with a dropdown for 'Category' */}
            <Input
                label="Category"
                value={expense.categoryId}
                onChange={({ target }) => handleChange("categoryId", target.value)}
                isSelect={true}
                options={categoryOptions}
            />

            <Input
                value={expense.amount}
                onChange={({ target }) => handleChange("amount", target.value)}
                label="Amount"
                placeholder="e.g., 150.00"
                type="number"
            />

            <Input
                value={expense.date}
                onChange={({ target }) => handleChange("date", target.value)}
                label="Date"
                placeholder=""
                type="date"
            />

            <div className="flex items-center gap-3 my-4 p-3 bg-purple-50/60 rounded-lg border border-purple-100">
                <input
                    type="checkbox"
                    id="expense-is-recurring"
                    checked={expense.isRecurring}
                    onChange={(e) => handleChange("isRecurring", e.target.checked)}
                    className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500 border-gray-300 cursor-pointer"
                />
                <label htmlFor="expense-is-recurring" className="text-sm font-medium text-gray-700 cursor-pointer select-none">
                    Repeat this transaction (Recurring)
                </label>
            </div>

            {expense.isRecurring && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                        label="Frequency"
                        value={expense.recurrenceFrequency}
                        onChange={({ target }) => handleChange("recurrenceFrequency", target.value)}
                        isSelect={true}
                        options={[
                            { value: "weekly", label: "Weekly" },
                            { value: "monthly", label: "Monthly" },
                            { value: "yearly", label: "Yearly" },
                        ]}
                    />
                    <Input
                        value={expense.recurrenceEndDate}
                        onChange={({ target }) => handleChange("recurrenceEndDate", target.value)}
                        label="End Date (Optional)"
                        placeholder=""
                        type="date"
                    />
                </div>
            )}

            <div className="flex justify-end mt-6">
                <Button
                    type="button"
                    onClick={handleAddExpense}
                    loading={loading}
                    disabled={loading}
                    icon={loading ? null : Plus}
                >
                    {loading ? "Adding..." : "Add Expense"}
                </Button>
            </div>
        </div>
    );
};

export default AddExpenseForm;