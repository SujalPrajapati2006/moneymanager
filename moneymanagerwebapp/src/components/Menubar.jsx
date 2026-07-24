import { useState, useRef, useEffect, useContext } from "react";
import {User, LogOut, X, Menu} from "lucide-react";
import { useNavigate } from "react-router-dom";
import {assets} from "../assets/assets.js";
import {AppContext} from "../context/AppContext.jsx";
import Sidebar from "./Sidebar.jsx";

const Menubar = ({ activeMenu }) => {
    const [openSideMenu, setOpenSideMenu] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);
    const dropdownRef = useRef(null);
    const { clearUser, user } = useContext(AppContext);
    const navigate = useNavigate();

    // Handle click outside to close dropdown
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setShowDropdown(false);
            }
        };

        // Add event listener when dropdown is open
        if (showDropdown) {
            document.addEventListener("mousedown", handleClickOutside);
        }

        // Cleanup event listener
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [showDropdown]);

    const toggleDropdown = () => {
        setShowDropdown(!showDropdown);
    };

    const handleLogout = () => {
        localStorage.clear();
        clearUser();
        setShowDropdown(false);
        navigate("/login");
    };

    return (
        <div className="flex items-center justify-between gap-5 bg-white border border-b border-gray-200/50 backdrop-blur-[2px] py-4 px-4 sm:px-7 sticky top-0 z-30">
            {/* Left side - Menu button and title */}
            <div className="flex items-center gap-5">
                <button
                    className="block lg:hidden text-black hover:bg-gray-100 p-1 rounded transition-colors"
                    onClick={() => {
                        setOpenSideMenu(!openSideMenu);
                    }}
                >
                    {openSideMenu ? (
                        <X className="text-2xl" />
                    ) : (
                        <Menu className="text-2xl" />
                    )}
                </button>

                <div className="flex items-center gap-2">
                    <img src={assets.logo} alt="logo" className="h-10 w-10" />
                    <span className="text-lg font-medium text-black truncate">Money Manager</span>
                </div>
            </div>

            {/* Right side - Avatar dropdown */}
            <div className="relative shrink-0" ref={dropdownRef}>
                <button
                    onClick={toggleDropdown}
                    className="flex items-center gap-2.5 px-3 py-1.5 bg-gray-50 hover:bg-gray-100 border border-gray-200/80 rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-purple-800 focus:ring-offset-1 cursor-pointer max-w-[180px] sm:max-w-[220px]"
                    aria-label="User profile menu"
                >
                    <div className="w-8 h-8 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center overflow-hidden shrink-0 font-semibold text-xs border border-purple-200">
                        {user?.profileImageUrl ? (
                            <img
                                src={user.profileImageUrl}
                                alt={user?.fullName || "Profile"}
                                className="w-full h-full object-cover rounded-full"
                                onError={(e) => { e.target.style.display = 'none'; }}
                            />
                        ) : user?.fullName ? (
                            <span>{user.fullName.charAt(0).toUpperCase()}</span>
                        ) : (
                            <User className="w-4 h-4 text-purple-700" />
                        )}
                    </div>
                    <span className="text-sm font-medium text-gray-700 truncate max-w-[90px] sm:max-w-[140px]">
                        {user?.fullName || "Profile"}
                    </span>
                </button>

                {/* Dropdown Menu */}
                {showDropdown && (
                    <div className="absolute right-0 mt-2 w-56 sm:w-64 bg-white rounded-xl shadow-xl border border-gray-200 py-1 z-50 animate-in fade-in duration-150">
                        {/* User info section */}
                        <div className="px-4 py-3 border-b border-gray-100">
                            <div className="flex items-center gap-3">
                                <div className="w-9 h-9 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center overflow-hidden shrink-0 font-semibold text-sm border border-purple-200">
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
                                        <User className="w-4.5 h-4.5 text-purple-700" />
                                    )}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-semibold text-gray-900 truncate">
                                        {user?.fullName || "User"}
                                    </p>
                                    <p className="text-xs text-gray-500 truncate mt-0.5">{user?.email || ""}</p>
                                </div>
                            </div>
                        </div>

                        {/* Dropdown options */}
                        <div className="py-1">
                            <button
                                onClick={handleLogout}
                                className="flex items-center gap-3 w-full px-4 py-2 text-sm text-gray-700
                                 hover:bg-gray-50 transition-colors duration-150"
                            >
                                <LogOut className="w-4 h-4 text-gray-500" />
                                <span>Logout</span>
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Mobile side menu drawer and backdrop */}
            {openSideMenu && (
                <>
                    {/* Backdrop */}
                    <div
                        className="fixed inset-0 bg-black/50 backdrop-blur-xs z-40 lg:hidden"
                        onClick={() => setOpenSideMenu(false)}
                    />
                    {/* Drawer */}
                    <div className="fixed top-0 left-0 bottom-0 w-72 max-w-[85vw] bg-white z-50 shadow-2xl overflow-y-auto lg:hidden">
                        <div className="flex items-center justify-between p-4 border-b border-gray-100">
                            <div className="flex items-center gap-2">
                                <img src={assets.logo} alt="logo" className="h-8 w-8" />
                                <span className="text-base font-semibold text-black">Money Manager</span>
                            </div>
                            <button
                                onClick={() => setOpenSideMenu(false)}
                                className="p-1.5 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 cursor-pointer"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="p-2">
                            <Sidebar activeMenu={activeMenu} onItemClick={() => setOpenSideMenu(false)} />
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default Menubar;
