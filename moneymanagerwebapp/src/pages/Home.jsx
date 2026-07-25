import Dashboard from "../components/Dashboard.jsx";
import {useUser} from "../hooks/useUser.jsx";
import InfoCard from "../components/InfoCard.jsx";
import {Coins, Wallet, WalletCards} from "lucide-react";
import {useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";
import axiosConfig from "../util/axiosConfig.jsx";
import {API_ENDPOINTS} from "../util/apiEndpoints.js";
import toast from "react-hot-toast";
import RecentTransactions from "../components/RecentTransactions.jsx";
import FinanceOverview from "../components/FinanceOverview.jsx";
import BudgetOverviewWidget from "../components/BudgetOverviewWidget.jsx";
import {LoadingState, ErrorState} from "../components/StateCard.jsx";

const Home = () => {
    useUser();

    const navigate = useNavigate();
    const [dashboardData, setDashboardData] = useState(null);
    const [accounts, setAccounts] = useState([]);
    const [selectedAccountId, setSelectedAccountId] = useState("all");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchAccounts = async () => {
        try {
            const res = await axiosConfig.get(API_ENDPOINTS.GET_ACCOUNTS);
            setAccounts(res.data || []);
        } catch (err) {
            console.error("Error fetching accounts:", err);
        }
    };

    const fetchDashboardData = async (accountId = selectedAccountId) => {
        setLoading(true);
        setError(null);

        try {
            const url = accountId && accountId !== "all"
                ? `${API_ENDPOINTS.DASHBOARD_DATA}?accountId=${accountId}`
                : API_ENDPOINTS.DASHBOARD_DATA;
            const response = await axiosConfig.get(url);
            if (response.status === 200) {
                setDashboardData(response.data);
            }
        }catch (err) {
            console.error('Something went wrong while fetching dashboard data:', err);
            setError(err.response?.data?.message || "Couldn't load dashboard data. Please try again.");
            toast.error('Failed to load dashboard data');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAccounts();
        fetchDashboardData("all");
    }, []);

    const handleAccountChange = (e) => {
        const value = e.target.value;
        setSelectedAccountId(value);
        fetchDashboardData(value);
    };

    return (
        <div>
            <Dashboard activeMenu="Dashboard">
                <div className="my-5 mx-auto space-y-6">
                    {/* Header & Account Selector */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
                        <div>
                            <h2 className="text-xl font-bold text-gray-900">Dashboard Overview</h2>
                            <p className="text-xs text-gray-500 mt-0.5">Summary of your financial activity</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <label className="text-xs font-semibold text-gray-600">Account:</label>
                            <select
                                value={selectedAccountId}
                                onChange={handleAccountChange}
                                className="text-xs font-medium border border-gray-200 rounded-xl px-3 py-2 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-500 cursor-pointer"
                            >
                                <option value="all">All Accounts Combined</option>
                                {accounts.map((acc) => (
                                    <option key={acc.id} value={acc.id}>
                                        {acc.name} ({acc.type.replace("_", " ")})
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {loading && <LoadingState message="Fetching your financial overview..." />}

                    {error && !loading && (
                        <ErrorState
                            message={error}
                            onRetry={fetchDashboardData}
                        />
                    )}

                    {!loading && !error && (
                        <>
                            {/* Top Summary Cards */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <InfoCard
                                    icon={<WalletCards />}
                                    label="Total Balance"
                                    value={dashboardData?.totalBalance || 0}
                                    color="bg-purple-800"
                                />
                                <InfoCard
                                    icon={<Wallet />}
                                    label="Total Income"
                                    value={dashboardData?.totalIncome || 0}
                                    color="bg-green-800"
                                />
                                <InfoCard
                                    icon={<Coins />}
                                    label="Total Expense"
                                    value={dashboardData?.totalExpense || 0}
                                    color="bg-red-800"
                                />
                            </div>

                            {/* Budget Overview Widget & Exceeded Warning Banner */}
                            <BudgetOverviewWidget budgets={dashboardData?.budgets || []} />

                            {/* Main Dashboard Section */}
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                <FinanceOverview
                                    totalBalance={dashboardData?.totalBalance || 0}
                                    totalIncome={dashboardData?.totalIncome || 0}
                                    totalExpense={dashboardData?.totalExpense || 0}
                                />

                                <RecentTransactions
                                    transactions={dashboardData?.recentTransactions}
                                    onMore={() => navigate("/expense")}
                                />
                            </div>
                        </>
                    )}
                </div>
            </Dashboard>
        </div>
    );
};

export default Home;