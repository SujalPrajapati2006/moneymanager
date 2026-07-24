import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {useUser} from "../hooks/useUser.jsx";
import axiosConfig from "../util/axiosConfig.jsx";
import {API_ENDPOINTS} from "../util/apiEndpoints.js";
import Dashboard from "../components/Dashboard.jsx";
import ExpenseOverview from "../components/ExpenseOverview.jsx";
import ExpenseList from "../components/ExpenseList.jsx";
import Modal from "../components/Modal.jsx";
import AddExpenseForm from "../components/AddExpenseForm.jsx";
import DeleteAlert from "../components/DeleteAlert.jsx";
import {LoadingState, ErrorState} from "../components/StateCard.jsx";

const Expense = () => {
    useUser();
    const navigate = useNavigate();
    const [expenseData, setExpenseData] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [openAddExpenseModal, setOpenAddExpenseModal] = useState(false);
    const [openDeleteAlert, setOpenDeleteAlert] = useState({
        show: false,
        data: null,
    });

    // Get All Expense Details
    const fetchExpenseDetails = async () => {
        setLoading(true);
        setError(null);

        try {
            const response = await axiosConfig.get(API_ENDPOINTS.GET_ALL_EXPENSE);
            if (response.data) {
                setExpenseData(response.data || []);
            }
        } catch (err) {
            console.error("Failed to fetch expense details:", err);
            setError(err.response?.data?.message || "Couldn't load expense data. Please try again.");
            toast.error("Failed to fetch expense details.");
        } finally {
            setLoading(false);
        }
    };

    // Fetch Expense Categories
    const fetchExpenseCategories = async () => {
        try {
            const response = await axiosConfig.get(API_ENDPOINTS.CATEGORY_BY_TYPE("expense"));
            if (response.data) {
                setCategories(response.data || []);
            }
        } catch (err) {
            console.error("Failed to fetch expense categories:", err);
        }
    };


    // Handle Add Expense
    const handleAddExpense = async (expense) => {
        const { name, categoryId, amount, date, icon } = expense;

        if (!name.trim()) {
            toast.error("Name is required.");
            return;
        }

        // Validation Checks
        if (!categoryId) {
            toast.error("Category is required.");
            return;
        }

        if (!amount || isNaN(amount) || Number(amount) <= 0) {
            toast.error("Amount should be a valid number greater than 0.");
            return;
        }

        if (!date) {
            toast.error("Date is required.");
            return;
        }

        const today = new Date().toISOString().split('T')[0];
        if (date > today) {
            toast.error('Date cannot be in the future');
            return;
        }

        try {
            await axiosConfig.post(API_ENDPOINTS.ADD_EXPENSE, {
                name,
                categoryId,
                amount: Number(amount),
                date,
                icon,
            });

            setOpenAddExpenseModal(false);
            toast.success("Expense added successfully.");
            fetchExpenseDetails();
            fetchExpenseCategories();
        } catch (err) {
            console.error("Error adding expense:", err);
            toast.error(err.response?.data?.message || "Failed to add expense.");
        }
    };

    // Delete Expense
    const deleteExpense = async (id) => {
        try {
            await axiosConfig.delete(API_ENDPOINTS.DELETE_EXPENSE(id));

            setOpenDeleteAlert({ show: false, data: null });
            toast.success("Expense deleted successfully.");
            fetchExpenseDetails();
        } catch (err) {
            console.error("Error deleting expense:", err);
            toast.error(err.response?.data?.message || "Failed to delete expense.");
        }
    };

    const handleDownloadExpenseDetails = async () => {
        try {
            const response = await axiosConfig.get(
                API_ENDPOINTS.EXPENSE_EXCEL_DOWNLOAD,
                {
                    responseType: "blob",
                }
            );

            let filename = "expense_details.xlsx";

            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", filename);
            document.body.appendChild(link);
            link.click();
            link.parentNode.removeChild(link);
            window.URL.revokeObjectURL(url);

            toast.success("Expense details downloaded successfully.");
        } catch (err) {
            console.error("Error downloading expense details:", err);
            toast.error("Failed to download expense details.");
        }
    };

    const handleEmailExpenseDetails = async () => {
        try {
            const response = await axiosConfig.get(API_ENDPOINTS.EMAIL_EXPENSE);
            if(response.status === 200) {
                toast.success("Expense details emailed successfully.");
            }
        }catch (err) {
            console.error("Error emailing expense details:", err);
            toast.error("Failed to email expense details.");
        }
    }

    useEffect(() => {
        fetchExpenseDetails();
        fetchExpenseCategories();
    }, []);

    return (
        <Dashboard activeMenu="Expense">
            <div className="my-5 mx-auto">
                <div className="grid grid-cols-1 gap-6">
                    {loading && <LoadingState message="Loading expense records..." />}

                    {error && !loading && (
                        <ErrorState
                            message={error}
                            onRetry={fetchExpenseDetails}
                        />
                    )}

                    {!loading && !error && (
                        <>
                            <div>
                                <ExpenseOverview
                                    transactions={expenseData}
                                    onExpenseIncome={() => setOpenAddExpenseModal(true)}
                                />
                            </div>

                            <ExpenseList
                                transactions={expenseData}
                                onDelete={(id) => {
                                    setOpenDeleteAlert({ show: true, data: id });
                                }}
                                onDownload={handleDownloadExpenseDetails}
                                onEmail={handleEmailExpenseDetails}
                                onAddExpense={() => setOpenAddExpenseModal(true)}
                            />
                        </>
                    )}

                    <Modal
                        isOpen={openAddExpenseModal}
                        onClose={() => setOpenAddExpenseModal(false)}
                        title="Add Expense"
                    >
                        <AddExpenseForm
                            onAddExpense={handleAddExpense}
                            categories={categories}
                        />
                    </Modal>

                    <Modal
                        isOpen={openDeleteAlert.show}
                        onClose={() => setOpenDeleteAlert({ show: false, data: null })}
                        title="Delete Expense"
                    >
                        <DeleteAlert
                            content="Are you sure you want to delete this expense detail?"
                            onDelete={() => deleteExpense(openDeleteAlert.data)}
                        />
                    </Modal>
                </div>
            </div>
        </Dashboard>
    );
};

export default Expense;