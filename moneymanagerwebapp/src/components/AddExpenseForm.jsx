import { useState, useEffect } from "react";
import EmojiPickerPopup from "./EmojiPickerPopup.jsx";
import Input from "./Input.jsx";
import { Plus } from "lucide-react";
import Button from "./Button.jsx";
import axiosConfig from "../util/axiosConfig.jsx";
import { API_ENDPOINTS } from "../util/apiEndpoints.js";

// Add 'categories' prop
const AddExpenseForm = ({ onAddExpense, categories }) => {
    const [expense, setExpense] = useState({
        name: "",
        categoryId: "",
        accountId: "",
        amount: "",
        date: "",
        icon: "",
        isRecurring: false,
        recurrenceFrequency: "monthly",
        recurrenceEndDate: "",
    });
    const [accounts, setAccounts] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchAccounts = async () => {
            try {
                const res = await axiosConfig.get(API_ENDPOINTS.GET_ACCOUNTS);
                const fetched = res.data || [];
                setAccounts(fetched);
                if (fetched.length > 0 && !expense.accountId) {
                    setExpense((prev) => ({ ...prev, accountId: fetched[0].id }));
                }
            } catch (err) {
                console.error("Error loading accounts:", err);
            }
        };
        fetchAccounts();
    }, []);

    // Effect to set a default category if categories are loaded and none is selected
    useEffect(() => {
        if (categories && categories.length > 0 && !expense.categoryId) {
            setExpense((prev) => ({ ...prev, categoryId: categories[0].id }));
        }
    }, [categories, expense.categoryId]);

    const handleChange = (key, value) => setExpense({ ...expense, [key]: value });

    const handleAddExpense = async () => {
        setLoading(true);
        try {
            await onAddExpense(expense);
        } finally {
            setLoading(false);
        }
    };

    const categoryOptions = categories.map((cat) => ({
        value: cat.id,
        label: `${cat.name}`,
    }));

    const accountOptions = accounts.map((acc) => ({
        value: acc.id,
        label: `${acc.name} (${acc.type.replace("_", " ")})`,
    }));

    return (
        <div>
            <EmojiPickerPopup
                icon={expense.icon}
                onSelect={(selectedIcon) => handleChange("icon", selectedIcon)}
            />

            <Input
                value={expense.name}
                onChange={({ target }) => handleChange("name", target.value)}
                label="Expense Title"
                placeholder="e.g., Electricity, Wifi, Groceries"
                type="text"
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                    label="Category"
                    value={expense.categoryId}
                    onChange={({ target }) => handleChange("categoryId", target.value)}
                    isSelect={true}
                    options={categoryOptions}
                />
                <Input
                    label="Account"
                    value={expense.accountId}
                    onChange={({ target }) => handleChange("accountId", target.value)}
                    isSelect={true}
                    options={accountOptions}
                />
            </div>

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