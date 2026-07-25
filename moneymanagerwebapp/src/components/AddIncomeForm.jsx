import {useEffect, useState} from "react";
import EmojiPickerPopup from "./EmojiPickerPopup.jsx";
import Input from "./Input.jsx";
import {Plus} from "lucide-react";
import Button from "./Button.jsx";
import axiosConfig from "../util/axiosConfig.jsx";
import { API_ENDPOINTS } from "../util/apiEndpoints.js";

const AddIncomeForm = ({onAddIncome, categories}) => {
    const [income, setIncome] = useState({
        name: '',
        amount: '',
        date: '',
        icon: '',
        categoryId: '',
        accountId: '',
        isRecurring: false,
        recurrenceFrequency: 'monthly',
        recurrenceEndDate: ''
    })
    const [accounts, setAccounts] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchAccounts = async () => {
            try {
                const res = await axiosConfig.get(API_ENDPOINTS.GET_ACCOUNTS);
                const fetched = res.data || [];
                setAccounts(fetched);
                if (fetched.length > 0 && !income.accountId) {
                    setIncome((prev) => ({ ...prev, accountId: fetched[0].id }));
                }
            } catch (err) {
                console.error("Error loading accounts:", err);
            }
        };
        fetchAccounts();
    }, []);

    const categoryOptions = categories.map(category => ({
        value: category.id,
        label: category.name
    }))

    const accountOptions = accounts.map((acc) => ({
        value: acc.id,
        label: `${acc.name} (${acc.type.replace("_", " ")})`,
    }));

    const handleChange = (key, value) => {
        setIncome({...income, [key]: value});
    }

    const handleAddIncome = async () => {
        setLoading(true);
        try {
            await onAddIncome(income);
        }finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        if (categories.length > 0 && !income.categoryId) {
            setIncome((prev) => ({...prev, categoryId: categories[0].id}))
        }
    }, [categories, income.categoryId]);

    return (
        <div>
            <EmojiPickerPopup
                icon={income.icon}
                onSelect={(selectedIcon) => handleChange('icon', selectedIcon)}
            />

            <Input
                value={income.name}
                onChange={({target}) => handleChange('name', target.value)}
                label="Income Source"
                placeholder="e.g., Salary, Freelance, Bonus"
                type="text"
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                    label="Category"
                    value={income.categoryId}
                    onChange={({target}) => handleChange('categoryId', target.value)}
                    isSelect={true}
                    options={categoryOptions}
                />
                <Input
                    label="Account"
                    value={income.accountId}
                    onChange={({target}) => handleChange('accountId', target.value)}
                    isSelect={true}
                    options={accountOptions}
                />
            </div>

            <Input
                value={income.amount}
                onChange={({target}) => handleChange('amount', target.value)}
                label="Amount"
                placeholder="e.g., 500.00"
                type="number"
            />

            <Input
                value={income.date}
                onChange={({target}) => handleChange('date', target.value)}
                label="Date"
                placeholder=""
                type="date"
            />

            <div className="flex items-center gap-3 my-4 p-3 bg-purple-50/60 rounded-lg border border-purple-100">
                <input
                    type="checkbox"
                    id="income-is-recurring"
                    checked={income.isRecurring}
                    onChange={(e) => handleChange("isRecurring", e.target.checked)}
                    className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500 border-gray-300 cursor-pointer"
                />
                <label htmlFor="income-is-recurring" className="text-sm font-medium text-gray-700 cursor-pointer select-none">
                    Repeat this transaction (Recurring)
                </label>
            </div>

            {income.isRecurring && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                        label="Frequency"
                        value={income.recurrenceFrequency}
                        onChange={({ target }) => handleChange("recurrenceFrequency", target.value)}
                        isSelect={true}
                        options={[
                            { value: "weekly", label: "Weekly" },
                            { value: "monthly", label: "Monthly" },
                            { value: "yearly", label: "Yearly" },
                        ]}
                    />
                    <Input
                        value={income.recurrenceEndDate}
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
                    onClick={handleAddIncome}
                    loading={loading}
                    disabled={loading}
                    icon={loading ? null : Plus}
                >
                    {loading ? "Adding..." : "Add Income"}
                </Button>
            </div>
        </div>
    )
}

export default AddIncomeForm;