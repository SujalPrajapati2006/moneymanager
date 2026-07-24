import React from "react";
import { LoaderCircle } from "lucide-react";

/**
 * Primary Action Button component inspired by Linear, Stripe Dashboard, Vercel, Notion, Clerk, and Supabase.
 */
const Button = ({
    children,
    onClick,
    type = "button",
    loading = false,
    disabled = false,
    icon: Icon = null,
    className = "",
    fullWidth = false,
    ...props
}) => {
    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled || loading}
            className={`inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-purple-700 px-6 py-2.5 h-[44px] text-sm font-semibold text-white shadow-md shadow-violet-600/20 transition-all duration-300 hover:-translate-y-0.5 hover:scale-[1.03] hover:shadow-xl hover:shadow-violet-600/30 hover:from-violet-500 hover:to-purple-600 active:scale-95 active:translate-y-0 active:shadow-md focus:outline-none focus:ring-4 focus:ring-violet-300 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:translate-y-0 disabled:hover:shadow-md ${
                fullWidth ? "w-full" : ""
            } ${className}`}
            {...props}
        >
            {loading ? (
                <>
                    <LoaderCircle className="w-4 h-4 animate-spin shrink-0" />
                    <span>{children}</span>
                </>
            ) : (
                <>
                    {Icon && <Icon className="w-4 h-4 shrink-0" />}
                    <span>{children}</span>
                </>
            )}
        </button>
    );
};

export default Button;
