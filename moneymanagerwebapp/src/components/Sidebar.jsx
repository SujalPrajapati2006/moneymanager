import {useContext} from "react";
import {AppContext} from "../context/AppContext.jsx";
import {User} from "lucide-react";
import {SIDE_BAR_DATA} from "../assets/assets.js";
import {useNavigate} from "react-router-dom";

const Sidebar = ({activeMenu, onItemClick}) => {
    const {user} = useContext(AppContext);
    const navigate = useNavigate();

    const handleNavigate = (path) => {
        navigate(path);
        if (onItemClick) onItemClick();
    };

    return (
        <div className="w-64 lg:h-[calc(100vh-65px)] bg-white border-r border-gray-200/50 p-4 lg:sticky top-[65px] z-20">
            <div className="flex flex-col items-center justify-center gap-3 mt-2 mb-6">
                <div className="w-16 h-16 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center overflow-hidden font-bold text-xl border-2 border-purple-200 shadow-sm shrink-0">
                    {user?.profileImageUrl ? (
                        <img
                            src={user.profileImageUrl}
                            alt={user?.fullName || "User"}
                            className="w-full h-full object-cover rounded-full"
                            onError={(e) => { e.target.style.display = 'none'; }}
                        />
                    ) : user?.fullName ? (
                        <span>{user.fullName.charAt(0).toUpperCase()}</span>
                    ) : (
                        <User className="w-8 h-8 text-purple-700" />
                    )}
                </div>
                <h5 className="text-gray-950 font-semibold text-center truncate max-w-full px-2 text-sm">{user?.fullName || ""}</h5>
            </div>
            {SIDE_BAR_DATA.map((item, index) => (
                <button
                    onClick={() => handleNavigate(item.path)}
                    key={`menu_${index}`}
                    className={`cursor-pointer w-full flex items-center gap-3.5 text-sm font-medium py-2.5 px-4 rounded-xl mb-2 transition-all ${
                        activeMenu == item.label
                            ? "text-white bg-purple-800 shadow-md shadow-purple-800/20 font-semibold"
                            : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                    }`}
                >
                    <item.icon className="text-lg shrink-0" />
                    <span className="truncate">{item.label}</span>
                </button>
            ))}
        </div>
    );
};

export default Sidebar;