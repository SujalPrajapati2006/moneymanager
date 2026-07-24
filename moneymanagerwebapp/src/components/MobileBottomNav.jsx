import { useNavigate } from "react-router-dom";
import { LayoutDashboard, ArrowUpCircle, ArrowDownCircle, Layers, Filter } from "lucide-react";

const NAV_ITEMS = [
    { label: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
    { label: "Income", path: "/income", icon: ArrowUpCircle },
    { label: "Expense", path: "/expense", icon: ArrowDownCircle },
    { label: "Category", path: "/category", icon: Layers },
    { label: "Filter", path: "/filter", icon: Filter },
];

const MobileBottomNav = ({ activeMenu }) => {
    const navigate = useNavigate();

    return (
        <nav className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-gray-200 z-40 lg:hidden px-2 py-1 shadow-lg">
            <div className="flex items-center justify-around max-w-md mx-auto">
                {NAV_ITEMS.map((item) => {
                    const Icon = item.icon;
                    const isActive = activeMenu === item.label;
                    return (
                        <button
                            key={item.label}
                            onClick={() => navigate(item.path)}
                            className={`flex flex-col items-center justify-center py-1.5 px-3 rounded-lg text-[11px] font-medium transition-colors cursor-pointer ${
                                isActive
                                    ? "text-purple-700 font-semibold"
                                    : "text-gray-500 hover:text-gray-900"
                            }`}
                        >
                            <Icon size={20} className={isActive ? "text-purple-700" : "text-gray-500"} />
                            <span className="mt-0.5">{item.label}</span>
                        </button>
                    );
                })}
            </div>
        </nav>
    );
};

export default MobileBottomNav;
