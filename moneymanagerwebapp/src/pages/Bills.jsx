import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useUser } from "../hooks/useUser.jsx";
import axiosConfig from "../util/axiosConfig.jsx";
import { API_ENDPOINTS } from "../util/apiEndpoints.js";
import Dashboard from "../components/Dashboard.jsx";
import Modal from "../components/Modal.jsx";
import DeleteAlert from "../components/DeleteAlert.jsx";
import { LoadingState, ErrorState } from "../components/StateCard.jsx";
import { Plus, ReceiptText, CheckCircle2, Clock, AlertCircle, Trash2, Check, DollarSign } from "lucide-react";

const Bills = () => {
    useUser();

    const [bills, setBills] = useState([]);
    const [categories, setCategories] = useState([]);
    const [accounts, setAccounts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const [openAddModal, setOpenAddModal] = useState(false);
    const [openPayModal, setOpenPayModal] = useState(false);
    const [selectedBillForPay, setSelectedBillForPay] = useState(null);
    const [createExpenseToggle, setCreateExpenseToggle] = useState(true);
    const [payAccountId, setPayAccountId] = useState("");

    const [deletingBillId, setDeletingBillId] = useState(null);

    const [formData, setFormData] = useState({
        name: "",
        amount: "",
        dueDate: "",
        categoryId: "",
    });

    const fetchBills = async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await axiosConfig.get(API_ENDPOINTS.GET_BILLS);
            setBills(res.data || []);
        } catch (err) {
            console.error("Error fetching bills:", err);
            setError(err.response?.data?.message || "Failed to load bills.");
        } finally {
            setLoading(false);
        }
    };

    const fetchCategories = async () => {
        try {
            const res = await axiosConfig.get(API_ENDPOINTS.CATEGORY_BY_TYPE("expense"));
            setCategories(res.data || []);
        } catch (err) {
            console.error("Error fetching categories:", err);
        }
    };

    const fetchAccounts = async () => {
        try {
            const res = await axiosConfig.get(API_ENDPOINTS.GET_ACCOUNTS);
            setAccounts(res.data || []);
            if (res.data && res.data.length > 0) {
                setPayAccountId(res.data[0].id);
            }
        } catch (err) {
            console.error("Error fetching accounts:", err);
        }
    };

    useEffect(() => {
        fetchBills();
        fetchCategories();
        fetchAccounts();
    }, []);

    const handleAddBill = async (e) => {
        e.preventDefault();
        if (!formData.name.trim()) {
            toast.error("Bill name is required");
            return;
        }
        if (!formData.amount || Number(formData.amount) <= 0) {
            toast.error("Amount must be greater than 0");
            return;
        }
        if (!formData.dueDate) {
            toast.error("Due date is required");
            return;
        }

        try {
            await axiosConfig.post(API_ENDPOINTS.ADD_BILL, {
                name: formData.name.trim(),
                amount: Number(formData.amount),
                dueDate: formData.dueDate,
                categoryId: formData.categoryId ? Number(formData.categoryId) : null,
            });
            toast.success("Bill reminder added successfully!");
            setOpenAddModal(false);
            setFormData({ name: "", amount: "", dueDate: "", categoryId: "" });
            fetchBills();
        } catch (err) {
            console.error("Error adding bill:", err);
            toast.error(err.response?.data?.message || "Failed to add bill.");
        }
    };

    const handleOpenPayModal = (bill) => {
        setSelectedBillForPay(bill);
        setCreateExpenseToggle(true);
        if (accounts.length > 0) {
            setPayAccountId(accounts[0].id);
        }
        setOpenPayModal(true);
    };

    const handleConfirmPay = async () => {
        if (!selectedBillForPay) return;
        if (createExpenseToggle && !payAccountId) {
            toast.error("Please select an Account for auto-expense creation");
            return;
        }

        try {
            await axiosConfig.put(
                API_ENDPOINTS.PAY_BILL(selectedBillForPay.id, payAccountId, createExpenseToggle)
            );
            toast.success("Bill marked as paid!");
            setOpenPayModal(false);
            fetchBills();
        } catch (err) {
            console.error("Error paying bill:", err);
            toast.error(err.response?.data?.message || "Failed to mark bill as paid.");
        }
    };

    const handleDeleteBill = async () => {
        if (!deletingBillId) return;
        try {
            await axiosConfig.delete(API_ENDPOINTS.DELETE_BILL(deletingBillId));
            toast.success("Bill deleted successfully");
            setDeletingBillId(null);
            fetchBills();
        } catch (err) {
            console.error("Error deleting bill:", err);
            toast.error("Failed to delete bill");
        }
    };

    const getUrgencyBadge = (dueDateStr, isPaid) => {
        if (isPaid) {
            return {
                text: "Paid",
                color: "bg-emerald-50 text-emerald-700 border-emerald-200",
                icon: CheckCircle2
            };
        }

        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const due = new Date(dueDateStr);
        due.setHours(0, 0, 0, 0);

        const diffTime = due.getTime() - today.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays < 0) {
            return {
                text: `Overdue by ${Math.abs(diffDays)} day${Math.abs(diffDays) > 1 ? "s" : ""}`,
                color: "bg-red-50 text-red-700 border-red-200 font-bold",
                icon: AlertCircle,
                isOverdue: true
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

    const unpaidBills = bills.filter((b) => !b.isPaid);
    const paidBills = bills.filter((b) => b.isPaid);
    const overdueBillsCount = unpaidBills.filter((b) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const due = new Date(b.dueDate);
        due.setHours(0, 0, 0, 0);
        return due < today;
    }).length;

    return (
        <Dashboard activeMenu="Bills">
            <div className="my-5 mx-auto space-y-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
                    <div>
                        <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                            <ReceiptText className="text-purple-600" size={24} />
                            Bill Reminders
                        </h2>
                        <p className="text-xs text-gray-500 mt-0.5">Track upcoming and overdue bill payments</p>
                    </div>
                    <button
                        onClick={() => setOpenAddModal(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white font-medium text-xs rounded-xl shadow-sm transition-all"
                    >
                        <Plus size={16} /> Add Bill Reminder
                    </button>
                </div>

                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-3">
                        <div className="p-3 bg-purple-50 text-purple-600 rounded-xl">
                            <Clock size={20} />
                        </div>
                        <div>
                            <p className="text-xs font-semibold text-gray-500">Unpaid Bills</p>
                            <h3 className="text-lg font-bold text-gray-900">{unpaidBills.length} Bills</h3>
                        </div>
                    </div>

                    <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-3">
                        <div className="p-3 bg-red-50 text-red-600 rounded-xl">
                            <AlertCircle size={20} />
                        </div>
                        <div>
                            <p className="text-xs font-semibold text-gray-500">Overdue Bills</p>
                            <h3 className="text-lg font-bold font-mono text-red-600">{overdueBillsCount} Overdue</h3>
                        </div>
                    </div>

                    <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-3">
                        <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
                            <CheckCircle2 size={20} />
                        </div>
                        <div>
                            <p className="text-xs font-semibold text-gray-500">Completed Payments</p>
                            <h3 className="text-lg font-bold text-gray-900">{paidBills.length} Paid</h3>
                        </div>
                    </div>
                </div>

                {loading && <LoadingState message="Loading your bills..." />}

                {error && !loading && (
                    <ErrorState message={error} onRetry={fetchBills} />
                )}

                {!loading && !error && (
                    <div className="space-y-6">
                        {/* Unpaid & Overdue Bills Section */}
                        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
                            <h3 className="text-base font-bold text-gray-900 mb-4 flex items-center gap-2">
                                <Clock size={18} className="text-purple-600" />
                                Upcoming & Overdue Bills ({unpaidBills.length})
                            </h3>

                            {unpaidBills.length === 0 ? (
                                <div className="p-6 text-center bg-gray-50 rounded-xl border border-dashed border-gray-200">
                                    <CheckCircle2 size={28} className="mx-auto text-emerald-500 mb-1" />
                                    <p className="text-xs font-semibold text-gray-600">All caught up! No pending bills.</p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {unpaidBills.map((bill) => {
                                        const badge = getUrgencyBadge(bill.dueDate, bill.isPaid);
                                        const BadgeIcon = badge.icon;

                                        return (
                                            <div
                                                key={bill.id}
                                                className={`p-4 rounded-xl border transition-all flex flex-col justify-between ${
                                                    badge.isOverdue ? "bg-red-50/40 border-red-200" : "bg-gray-50/70 border-gray-100"
                                                }`}
                                            >
                                                <div>
                                                    <div className="flex items-start justify-between gap-2 mb-2">
                                                        <div>
                                                            <h4 className="text-sm font-bold text-gray-900">{bill.name}</h4>
                                                            <p className="text-xs text-gray-500 font-medium mt-0.5">
                                                                {bill.categoryName || "Uncategorized"}
                                                            </p>
                                                        </div>
                                                        <span className="text-base font-extrabold text-gray-900">
                                                            ₹{Number(bill.amount).toLocaleString("en-IN")}
                                                        </span>
                                                    </div>

                                                    <div className="flex items-center justify-between mt-3">
                                                        <span className={`inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full border ${badge.color}`}>
                                                            <BadgeIcon size={13} />
                                                            {badge.text}
                                                        </span>
                                                        <span className="text-xs text-gray-400 font-medium">
                                                            Due: {bill.dueDate}
                                                        </span>
                                                    </div>
                                                </div>

                                                <div className="flex items-center justify-between gap-2 mt-4 pt-3 border-t border-gray-200/60">
                                                    <button
                                                        onClick={() => handleOpenPayModal(bill)}
                                                        className="flex-1 py-1.5 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 shadow-sm"
                                                    >
                                                        <Check size={14} /> Mark as Paid
                                                    </button>
                                                    <button
                                                        onClick={() => setDeletingBillId(bill.id)}
                                                        className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                                                        title="Delete Bill"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>

                        {/* Paid Bills Section */}
                        {paidBills.length > 0 && (
                            <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
                                <h3 className="text-base font-bold text-gray-900 mb-4 flex items-center gap-2">
                                    <CheckCircle2 size={18} className="text-emerald-600" />
                                    Paid Bills History ({paidBills.length})
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {paidBills.map((bill) => (
                                        <div
                                            key={bill.id}
                                            className="p-4 rounded-xl border border-gray-100 bg-gray-50/40 flex items-center justify-between opacity-80"
                                        >
                                            <div>
                                                <h4 className="text-sm font-bold text-gray-800 line-through">{bill.name}</h4>
                                                <p className="text-xs text-gray-400 mt-0.5">Paid • {bill.dueDate}</p>
                                            </div>
                                            <div className="text-right">
                                                <span className="text-sm font-bold text-gray-700">
                                                    ₹{Number(bill.amount).toLocaleString("en-IN")}
                                                </span>
                                                <button
                                                    onClick={() => setDeletingBillId(bill.id)}
                                                    className="block ml-auto mt-1 text-gray-400 hover:text-red-600"
                                                    title="Delete Record"
                                                >
                                                    <Trash2 size={14} />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* Add Bill Modal */}
                <Modal
                    isOpen={openAddModal}
                    onClose={() => setOpenAddModal(false)}
                    title="Add Bill Reminder"
                >
                    <form onSubmit={handleAddBill} className="space-y-4">
                        <div>
                            <label className="block text-xs font-semibold text-gray-700 mb-1">Bill Name *</label>
                            <input
                                type="text"
                                placeholder="e.g. Electricity Bill, WiFi, Rent"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                className="w-full text-xs border border-gray-200 rounded-xl px-3 py-2 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-500"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-gray-700 mb-1">Amount (₹) *</label>
                            <input
                                type="number"
                                step="0.01"
                                placeholder="e.g. 2000"
                                value={formData.amount}
                                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                                className="w-full text-xs border border-gray-200 rounded-xl px-3 py-2 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-500"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-gray-700 mb-1">Due Date *</label>
                            <input
                                type="date"
                                value={formData.dueDate}
                                onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                                className="w-full text-xs border border-gray-200 rounded-xl px-3 py-2 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-500"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-gray-700 mb-1">Expense Category (Optional)</label>
                            <select
                                value={formData.categoryId}
                                onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                                className="w-full text-xs border border-gray-200 rounded-xl px-3 py-2 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-500 cursor-pointer"
                            >
                                <option value="">No Category</option>
                                {categories.map((cat) => (
                                    <option key={cat.id} value={cat.id}>
                                        {cat.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="flex justify-end gap-2 pt-3">
                            <button
                                type="button"
                                onClick={() => setOpenAddModal(false)}
                                className="px-4 py-2 border border-gray-200 text-xs font-medium rounded-xl text-gray-600 hover:bg-gray-50"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="px-4 py-2 bg-purple-600 text-xs font-bold text-white rounded-xl hover:bg-purple-700"
                            >
                                Save Bill
                            </button>
                        </div>
                    </form>
                </Modal>

                {/* Mark as Paid Modal */}
                <Modal
                    isOpen={openPayModal}
                    onClose={() => setOpenPayModal(false)}
                    title="Mark Bill as Paid"
                >
                    {selectedBillForPay && (
                        <div className="space-y-4">
                            <div className="bg-purple-50 border border-purple-100 p-3.5 rounded-xl text-xs text-purple-900">
                                <p className="font-bold text-sm text-purple-950">{selectedBillForPay.name}</p>
                                <p className="mt-1 text-purple-800">
                                    Amount: <span className="font-extrabold text-gray-900">₹{Number(selectedBillForPay.amount).toLocaleString("en-IN")}</span>
                                </p>
                            </div>

                            <div className="border border-gray-200 rounded-xl p-3.5 space-y-3 bg-gray-50">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={createExpenseToggle}
                                        onChange={(e) => setCreateExpenseToggle(e.target.checked)}
                                        className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500 cursor-pointer"
                                    />
                                    <span className="text-xs font-bold text-gray-800">
                                        Create matching Expense transaction automatically
                                    </span>
                                </label>

                                {createExpenseToggle && (
                                    <div className="pt-2 pl-6">
                                        <label className="block text-xs font-semibold text-gray-700 mb-1">
                                            Select Account for Expense *
                                        </label>
                                        <select
                                            value={payAccountId}
                                            onChange={(e) => setPayAccountId(e.target.value)}
                                            className="w-full text-xs border border-gray-200 rounded-xl px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-purple-500 cursor-pointer"
                                        >
                                            {accounts.map((acc) => (
                                                <option key={acc.id} value={acc.id}>
                                                    {acc.name} ({acc.type.replace("_", " ")})
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                )}
                            </div>

                            <div className="flex justify-end gap-2 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setOpenPayModal(false)}
                                    className="px-4 py-2 border border-gray-200 text-xs font-medium rounded-xl text-gray-600 hover:bg-gray-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="button"
                                    onClick={handleConfirmPay}
                                    className="px-4 py-2 bg-purple-600 text-xs font-bold text-white rounded-xl hover:bg-purple-700 flex items-center gap-1.5"
                                >
                                    <Check size={16} /> Confirm Payment
                                </button>
                            </div>
                        </div>
                    )}
                </Modal>

                {/* Delete Alert Modal */}
                <Modal
                    isOpen={!!deletingBillId}
                    onClose={() => setDeletingBillId(null)}
                    title="Delete Bill Reminder"
                >
                    <DeleteAlert
                        content="Are you sure you want to delete this bill reminder? This action cannot be undone."
                        onDelete={handleDeleteBill}
                    />
                </Modal>
            </div>
        </Dashboard>
    );
};

export default Bills;
