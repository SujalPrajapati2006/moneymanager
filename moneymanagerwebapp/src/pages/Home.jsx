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
import {LoadingState, ErrorState} from "../components/StateCard.jsx";

const Home = () => {
    useUser();

    const navigate = useNavigate();
    const [dashboardData, setDashboardData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchDashboardData = async () => {
        setLoading(true);
        setError(null);

        try {
            const response = await axiosConfig.get(API_ENDPOINTS.DASHBOARD_DATA);
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
        fetchDashboardData();
    }, []);

    return (
        <div>
            <Dashboard activeMenu="Dashboard">
                <div className="my-5 mx-auto space-y-6">
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