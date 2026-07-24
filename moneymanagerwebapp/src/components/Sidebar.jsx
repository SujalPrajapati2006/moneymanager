import {useContext} from "react";
import {AppContext} from "../context/AppContext.jsx";
import {User} from "lucide-react";
import {SIDE_BAR_DATA} from "../assets/assets.js";
import {useNavigate} from "react-router-dom";

const Sidebar = ({activeMenu}) => {
    const {user} = useContext(AppContext);
    const navigate = useNavigate();
    return (
        <div className="w-64 h-[calc(100vh-61px)] bg-white border-gray-200/50 p-5 sticky top-[61px] z-20">
            <div className="flex flex-col items-center justify-center gap-3 mt-3 mb-7">
                <div className="w-20 h-20 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center overflow-hidden font-bold text-2xl border-2 border-purple-200 shadow-sm">
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
                        <User className="w-10 h-10 text-purple-700" />
                    )}
                </div>
                <h5 className="text-gray-950 font-semibold text-center truncate max-w-full px-2">{user?.fullName || ""}</h5>
            </div>
            {SIDE_BAR_DATA.map((item, index) => (
                <button
                    onClick={() => navigate(item.path)}
                    key={`menu_${index}`}
                    className={`cursor-pointer w-full flex items-center gap-4 text-[15px] py-3 px-6 rounded-lg mb-3 ${activeMenu == item.label ? "text-white bg-purple-800": ""}`}>
                      <item.icon className="text-xl" />
                        {item.label}
                </button>
            ))}
        </div>
    )
}

export default Sidebar;