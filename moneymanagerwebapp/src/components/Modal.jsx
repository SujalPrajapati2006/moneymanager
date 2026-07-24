import React from "react";
import {X} from "lucide-react";

const Modal = ({ isOpen, onClose, children, title }) => {
    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex justify-center items-center p-3 sm:p-4 w-full h-full bg-black/50 backdrop-blur-xs animate-in fade-in duration-200"
            onClick={(e) => {
                if (e.target === e.currentTarget) onClose();
            }}
        >
            <div className="relative w-full max-w-lg sm:max-w-xl max-h-[90vh] flex flex-col bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden">
                {/* Modal header */}
                <div className="flex items-center justify-between p-4 sm:p-5 border-b border-gray-100 shrink-0 bg-gray-50/50">
                    <h3 className="text-lg sm:text-xl font-semibold text-gray-900 truncate">
                        {title}
                    </h3>

                    <button
                        type="button"
                        className="text-gray-400 hover:bg-gray-100 hover:text-gray-600 rounded-full p-2 transition-colors cursor-pointer"
                        onClick={onClose}
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Modal body (scrollable on mobile) */}
                <div className="p-4 sm:p-6 text-gray-700 overflow-y-auto max-h-[calc(90vh-70px)]">
                    {children}
                </div>
            </div>
        </div>
    );
};

export default Modal;
