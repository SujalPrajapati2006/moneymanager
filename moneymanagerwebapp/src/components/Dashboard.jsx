import Menubar from "./Menubar.jsx";
import Sidebar from "./Sidebar.jsx";
import MobileBottomNav from "./MobileBottomNav.jsx";
import {useContext} from "react";
import {AppContext} from "../context/AppContext.jsx";

const Dashboard = ({children, activeMenu}) => {
    const {user} = useContext(AppContext);
    return (
        <div className="min-h-screen bg-slate-50 flex flex-col">
            <Menubar activeMenu={activeMenu} />

            {user && (
                <div className="flex flex-1 relative">
                    {/* Desktop Sidebar (visible on lg: 1024px+) */}
                    <div className="hidden lg:block shrink-0">
                        <Sidebar activeMenu={activeMenu}/>
                    </div>

                    {/* Main content container */}
                    <main className="flex-1 w-full min-w-0 px-3 sm:px-6 lg:px-8 py-5 pb-24 lg:pb-8 overflow-x-hidden">
                        {children}
                    </main>

                    {/* Mobile Bottom Navigation for screens < lg */}
                    <MobileBottomNav activeMenu={activeMenu} />
                </div>
            )}
        </div>
    );
};

export default Dashboard;