import { useState, useEffect } from "react";
import Menubar from "../components/Menubar.jsx";
import Sidebar from "../components/Sidebar.jsx";
import MobileBottomNav from "../components/MobileBottomNav.jsx";
import axiosConfig from "../util/axiosConfig.jsx";
import { API_ENDPOINTS } from "../util/apiEndpoints.js";
import { formatCurrency } from "../util/util.js";
import { Building2, CreditCard, Banknote, Wallet, Plus, Pencil, Trash2, ShieldAlert } from "lucide-react";
import Button from "../components/Button.jsx";
import Modal from "../components/Modal.jsx";
import Input from "../components/Input.jsx";
import { LoadingState, ErrorState, EmptyState } from "../components/StateCard.jsx";
import toast from "react-hot-toast";

const ACCOUNT_TYPES = [
    { value: "bank", label: "Bank Account", icon: Building2 },
    { value: "cash", label: "Cash", icon: Banknote },
    { value: "credit_card", label: "Credit Card", icon: CreditCard },
    { value: "wallet", label: "UPI / Digital Wallet", icon: Wallet },
];

const Accounts = () => {
    const [accounts, setAccounts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Modal state for Add/Edit
    const [openModal, setOpenModal] = useState(false);
    const [editingAccount, setEditingAccount] = useState(null);
    const [formData, setFormData] = useState({ name: "", type: "bank" });
    const [submitting, setSubmitting] = useState(false);

    // Modal state for Delete & Reassign
    const [openDeleteModal, setOpenDeleteModal] = useState(false);
    const [deletingAccount, setDeletingAccount] = useState(null);
    const [reassignOption, setReassignOption] = useState("reassign"); // "reassign" or "delete_all"
    const [targetAccountId, setTargetAccountId] = useState("");

    const fetchAccounts = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await axiosConfig.get(API_ENDPOINTS.GET_ACCOUNTS);
            setAccounts(response.data || []);
        } catch (err) {
            console.error("Error fetching accounts:", err);
            setError("Couldn't load your accounts. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAccounts();
    }, []);

    const handleOpenAddModal = () => {
        setEditingAccount(null);
        setFormData({ name: "", type: "bank" });
        setOpenModal(true);
    };

    const handleOpenEditModal = (account) => {
        setEditingAccount(account);
        setFormData({ name: account.name, type: account.type });
        setOpenModal(true);
    };

    const handleSubmitAccount = async (e) => {
        e.preventDefault();
        if (!formData.name.trim()) {
            toast.error("Please enter an account name");
            return;
        }

        setSubmitting(true);
        try {
            if (editingAccount) {
                await axiosConfig.put(API_ENDPOINTS.UPDATE_ACCOUNT(editingAccount.id), formData);
                toast.success("Account updated successfully!");
            } else {
                await axiosConfig.post(API_ENDPOINTS.ADD_ACCOUNT, formData);
                toast.success("Account added successfully!");
            }
            setOpenModal(false);
            fetchAccounts();
        } catch (err) {
            console.error("Error saving account:", err);
            toast.error(err.response?.data?.message || "Failed to save account");
        } finally {
            setSubmitting(false);
        }
    };

    const handleOpenDeleteModal = (account) => {
        if (accounts.length <= 1) {
            toast.error("You must have at least one active account");
            return;
        }
        setDeletingAccount(account);
        const otherAccounts = accounts.filter((a) => a.id !== account.id);
        setTargetAccountId(otherAccounts.length > 0 ? otherAccounts[0].id : "");
        setReassignOption("reassign");
        setOpenDeleteModal(true);
    };

    const handleDeleteAccount = async () => {
        if (!deletingAccount) return;
        setSubmitting(true);
        try {
            const reassignId = reassignOption === "reassign" ? targetAccountId : null;
            await axiosConfig.delete(API_ENDPOINTS.DELETE_ACCOUNT(deletingAccount.id, reassignId));
            toast.success("Account removed successfully");
            setOpenDeleteModal(false);
            fetchAccounts();
        } catch (err) {
            console.error("Error deleting account:", err);
            toast.error(err.response?.data?.message || "Failed to delete account");
        } finally {
            setSubmitting(false);
        }
    };

    const getAccountIcon = (type) => {
        switch (type?.toLowerCase()) {
            case "bank":
                return <Building2 className="w-6 h-6 text-blue-600" />;
            case "credit_card":
                return <CreditCard className="w-6 h-6 text-purple-600" />;
            case "wallet":
                return <Wallet className="w-6 h-6 text-emerald-600" />;
            default:
                return <Banknote className="w-6 h-6 text-amber-600" />;
        }
    };

    const otherAccountsForReassign = accounts.filter((a) => deletingAccount && a.id !== deletingAccount.id);

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <Menubar activeMenu="Accounts" />
            <div className="flex flex-1">
                <Sidebar activeMenu="Accounts" />
                <main className="flex-1 p-4 lg:p-6 pb-20 lg:pb-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">Accounts & Balances</h1>
                            <p className="text-sm text-gray-500 mt-1">
                                Manage bank accounts, cash, credit cards, and digital wallets.
                            </p>
                        </div>
                        <Button onClick={handleOpenAddModal} icon={Plus}>
                            Add Account
                        </Button>
                    </div>

                    {loading ? (
                        <LoadingState message="Loading your accounts..." />
                    ) : error ? (
                        <ErrorState message={error} onRetry={fetchAccounts} />
                    ) : accounts.length === 0 ? (
                        <EmptyState
                            title="No accounts found"
                            description="Create your first account to separate your cash and bank balances."
                            icon={Building2}
                            actionLabel="Add Account"
                            onAction={handleOpenAddModal}
                        />
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                            {accounts.map((account) => (
                                <div
                                    key={account.id}
                                    className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-shadow relative group"
                                >
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="flex items-center gap-3">
                                            <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
                                                {getAccountIcon(account.type)}
                                            </div>
                                            <div>
                                                <h3 className="font-semibold text-gray-900 text-base">{account.name}</h3>
                                                <span className="inline-block px-2 py-0.5 rounded text-[11px] font-medium bg-gray-100 text-gray-600 capitalize mt-0.5">
                                                    {account.type.replace("_", " ")}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-1 opacity-90 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button
                                                onClick={() => handleOpenEditModal(account)}
                                                className="p-1.5 text-gray-400 hover:text-purple-700 rounded-lg hover:bg-gray-100 transition-colors"
                                                title="Edit Account"
                                            >
                                                <Pencil size={16} />
                                            </button>
                                            <button
                                                onClick={() => handleOpenDeleteModal(account)}
                                                className="p-1.5 text-gray-400 hover:text-red-700 rounded-lg hover:bg-gray-100 transition-colors"
                                                title="Delete Account"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </div>

                                    <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between">
                                        <span className="text-xs text-gray-500 font-medium">Current Balance</span>
                                        <span className={`text-lg font-bold ${account.balance >= 0 ? "text-gray-900" : "text-red-600"}`}>
                                            {formatCurrency(account.balance || 0)}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </main>
            </div>
            <MobileBottomNav activeMenu="Accounts" />

            {/* Add / Edit Account Modal */}
            <Modal
                isOpen={openModal}
                onClose={() => setOpenModal(false)}
                title={editingAccount ? "Edit Account" : "Add New Account"}
            >
                <form onSubmit={handleSubmitAccount} className="space-y-4">
                    <Input
                        label="Account Name"
                        placeholder="e.g. HDFC Bank, Personal Cash, Paytm"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                    />

                    <Input
                        label="Account Type"
                        isSelect={true}
                        value={formData.type}
                        onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                        options={ACCOUNT_TYPES.map((t) => ({ value: t.value, label: t.label }))}
                    />

                    <div className="flex justify-end gap-3 mt-6">
                        <Button type="button" variant="outline" onClick={() => setOpenModal(false)}>
                            Cancel
                        </Button>
                        <Button type="submit" loading={submitting} disabled={submitting}>
                            {editingAccount ? "Save Changes" : "Create Account"}
                        </Button>
                    </div>
                </form>
            </Modal>

            {/* Delete Confirmation & Reassign Modal */}
            <Modal
                isOpen={openDeleteModal}
                onClose={() => setOpenDeleteModal(false)}
                title="Delete Account"
            >
                <div className="space-y-4">
                    <div className="flex items-center gap-3 p-3 bg-amber-50 rounded-xl border border-amber-200 text-amber-800 text-sm">
                        <ShieldAlert className="shrink-0 text-amber-600" size={20} />
                        <p>
                            Deleting <strong>{deletingAccount?.name}</strong>. How would you like to handle its transactions?
                        </p>
                    </div>

                    <div className="space-y-3 pt-2">
                        <label className="flex items-start gap-3 p-3 rounded-xl border border-gray-200 cursor-pointer hover:bg-gray-50">
                            <input
                                type="radio"
                                name="reassignOption"
                                value="reassign"
                                checked={reassignOption === "reassign"}
                                onChange={() => setReassignOption("reassign")}
                                className="mt-1 text-purple-600 focus:ring-purple-500"
                            />
                            <div>
                                <span className="text-sm font-semibold text-gray-900 block">Reassign transactions</span>
                                <span className="text-xs text-gray-500">Move all incomes & expenses to another active account</span>
                            </div>
                        </label>

                        {reassignOption === "reassign" && (
                            <div className="pl-7">
                                <Input
                                    label="Select Target Account"
                                    isSelect={true}
                                    value={targetAccountId}
                                    onChange={(e) => setTargetAccountId(e.target.value)}
                                    options={otherAccountsForReassign.map((a) => ({ value: a.id, label: a.name }))}
                                />
                            </div>
                        )}

                        <label className="flex items-start gap-3 p-3 rounded-xl border border-red-200 bg-red-50/40 cursor-pointer hover:bg-red-50">
                            <input
                                type="radio"
                                name="reassignOption"
                                value="delete_all"
                                checked={reassignOption === "delete_all"}
                                onChange={() => setReassignOption("delete_all")}
                                className="mt-1 text-red-600 focus:ring-red-500"
                            />
                            <div>
                                <span className="text-sm font-semibold text-red-900 block">Delete all transactions</span>
                                <span className="text-xs text-red-600">Permanently delete all incomes & expenses in this account</span>
                            </div>
                        </label>
                    </div>

                    <div className="flex justify-end gap-3 mt-6">
                        <Button type="button" variant="outline" onClick={() => setOpenDeleteModal(false)}>
                            Cancel
                        </Button>
                        <Button type="button" variant="danger" loading={submitting} onClick={handleDeleteAccount}>
                            Confirm Delete
                        </Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default Accounts;
