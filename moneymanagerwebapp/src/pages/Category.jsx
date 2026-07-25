import Dashboard from "../components/Dashboard.jsx";
import {useUser} from "../hooks/useUser.jsx";
import {Plus} from "lucide-react";
import CategoryList from "../components/CategoryList.jsx";
import {useEffect, useState} from "react";
import axiosConfig from "../util/axiosConfig.jsx";
import {API_ENDPOINTS} from "../util/apiEndpoints.js";
import toast from "react-hot-toast";
import Modal from "../components/Modal.jsx";
import AddCategoryForm from "../components/AddCategoryForm.jsx";
import SetBudgetModal from "../components/SetBudgetModal.jsx";
import Button from "../components/Button.jsx";
import {LoadingState, ErrorState} from "../components/StateCard.jsx";

const Category = () => {
    useUser();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [categoryData, setCategoryData] = useState([]);
    const [budgets, setBudgets] = useState([]);
    const [openAddCategoryModal, setOpenAddCategoryModal] = useState(false);
    const [openEditCategoryModal, setOpenEditCategoryModal] = useState(false);
    const [openBudgetModal, setOpenBudgetModal] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [selectedBudgetCategory, setSelectedBudgetCategory] = useState(null);
    const [selectedCategoryBudget, setSelectedCategoryBudget] = useState(null);

    const fetchCategoryDetails = async () => {
        setLoading(true);
        setError(null);

        try {
            const [catRes, budgetRes] = await Promise.all([
                axiosConfig.get(API_ENDPOINTS.GET_ALL_CATEGORIES),
                axiosConfig.get(API_ENDPOINTS.GET_BUDGETS())
            ]);

            if (catRes.status === 200) {
                setCategoryData(catRes.data || []);
            }
            if (budgetRes.status === 200) {
                setBudgets(budgetRes.data || []);
            }
        }catch(err) {
            console.error('Something went wrong while fetching category data:', err);
            setError(err.response?.data?.message || "Couldn't load categories. Please try again.");
            toast.error("Failed to load category data.");
        } finally {
            setLoading(false);
        }
    };

    const fetchBudgets = async () => {
        try {
            const res = await axiosConfig.get(API_ENDPOINTS.GET_BUDGETS());
            if (res.status === 200) {
                setBudgets(res.data || []);
            }
        } catch (err) {
            console.error("Failed to refresh budgets", err);
        }
    };

    useEffect(() => {
        fetchCategoryDetails();
    }, []);

    const handleAddCategory = async (category) => {
        const {name, type, icon} = category;

        if (!name.trim()) {
            toast.error("Category Name is required");
            return;
        }

        const isDuplicate = categoryData.some((c) => {
            return c.name.toLowerCase() === name.trim().toLowerCase();
        });

        if (isDuplicate) {
            toast.error("Category Name already exists");
            return;
        }

        try {
            const response = await axiosConfig.post(API_ENDPOINTS.ADD_CATEGORY, {name, type, icon});
            if (response.status === 201) {
                toast.success("Category added successfully");
                setOpenAddCategoryModal(false);
                if (response.data && response.data.id) {
                    setCategoryData((prev) => [...prev, response.data]);
                }
                fetchCategoryDetails();
            }
        }catch (error) {
            console.error('Error adding category:', error);
            toast.error(error.response?.data?.message || "Failed to add category.");
        }
    };

    const handleEditCategory = (categoryToEdit) => {
        setSelectedCategory(categoryToEdit);
        setOpenEditCategoryModal(true);
    };

    const handleOpenBudgetModal = (category, existingBudget) => {
        setSelectedBudgetCategory(category);
        setSelectedCategoryBudget(existingBudget || null);
        setOpenBudgetModal(true);
    };

    const handleSaveBudget = async (categoryId, monthlyLimit) => {
        try {
            const response = await axiosConfig.post(API_ENDPOINTS.SAVE_BUDGET, {
                categoryId,
                monthlyLimit
            });
            if (response.status === 200 || response.status === 201) {
                toast.success("Budget saved successfully!");
                await fetchBudgets();
            }
        } catch (err) {
            console.error("Error saving budget:", err);
            toast.error(err.response?.data?.message || "Failed to save budget.");
        }
    };

    const handleDeleteBudget = async (budgetId) => {
        try {
            await axiosConfig.delete(API_ENDPOINTS.DELETE_BUDGET(budgetId));
            toast.success("Budget removed.");
            await fetchBudgets();
        } catch (err) {
            console.error("Error deleting budget:", err);
            toast.error("Failed to remove budget.");
        }
    };

    const handleUpdateCategory = async (updatedCategory) => {
        const {id, name, type, icon} = updatedCategory;
        if (!name.trim()) {
            toast.error("Category Name is required");
            return;
        }

        if (!id) {
            toast.error("Category ID is missing for update");
            return;
        }

        try {
            const response = await axiosConfig.put(API_ENDPOINTS.UPDATE_CATEGORY(id), {name, type, icon});
            setOpenEditCategoryModal(false);
            setSelectedCategory(null);
            toast.success("Category updated successfully");
            if (response.data && response.data.id) {
                setCategoryData((prev) => prev.map((c) => c.id === id ? response.data : c));
            }
            fetchCategoryDetails();
        }catch(error) {
            console.error('Error updating category:', error.response?.data?.message || error.message);
            toast.error(error.response?.data?.message || "Failed to update category.");
        }
    };

    return (
        <Dashboard activeMenu="Category">
            <div className="my-5 mx-auto space-y-6">
                <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-semibold text-gray-900">All Categories</h2>
                    <Button
                        onClick={() => setOpenAddCategoryModal(true)}
                        icon={Plus}
                    >
                        Add Category
                    </Button>
                </div>

                {loading && <LoadingState message="Loading your category list..." />}

                {error && !loading && (
                    <ErrorState
                        message={error}
                        onRetry={fetchCategoryDetails}
                    />
                )}

                {!loading && !error && (
                    <CategoryList
                        categories={categoryData}
                        budgets={budgets}
                        onEditCategory={handleEditCategory}
                        onSetBudget={handleOpenBudgetModal}
                        onAddCategory={() => setOpenAddCategoryModal(true)}
                    />
                )}

                {/* Add Category Modal */}
                <Modal
                    isOpen={openAddCategoryModal}
                    onClose={() => setOpenAddCategoryModal(false)}
                    title="Add Category"
                >
                    <AddCategoryForm onAddCategory={handleAddCategory}/>
                </Modal>

                {/* Edit Category Modal */}
                <Modal
                    onClose={() =>{
                        setOpenEditCategoryModal(false);
                        setSelectedCategory(null);
                    }}
                    isOpen={openEditCategoryModal}
                    title="Update Category"
                >
                    <AddCategoryForm
                        initialCategoryData={selectedCategory}
                        onAddCategory={handleUpdateCategory}
                        isEditing={true}
                    />
                </Modal>

                {/* Set Budget Modal */}
                <SetBudgetModal
                    isOpen={openBudgetModal}
                    onClose={() => {
                        setOpenBudgetModal(false);
                        setSelectedBudgetCategory(null);
                        setSelectedCategoryBudget(null);
                    }}
                    category={selectedBudgetCategory}
                    currentBudget={selectedCategoryBudget}
                    onSaveBudget={handleSaveBudget}
                    onDeleteBudget={handleDeleteBudget}
                />
            </div>
        </Dashboard>
    );
};

export default Category;