import { AlertTriangle, RefreshCw, FolderPlus, Plus, LoaderCircle } from "lucide-react";
import Button from "./Button.jsx";

export const LoadingState = ({ message = "Loading data..." }) => {
    return (
        <div className="card p-8 flex flex-col items-center justify-center text-center my-6 space-y-4">
            <div className="w-12 h-12 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center">
                <LoaderCircle className="w-6 h-6 animate-spin text-purple-700" />
            </div>
            <p className="text-sm font-medium text-gray-600">{message}</p>
            {/* Shimmer Placeholder bars */}
            <div className="w-full max-w-md space-y-3 pt-2">
                <div className="h-4 bg-gray-200 rounded-md animate-pulse w-3/4 mx-auto"></div>
                <div className="h-4 bg-gray-100 rounded-md animate-pulse w-1/2 mx-auto"></div>
            </div>
        </div>
    );
};

export const ErrorState = ({ message = "Couldn't load your data, please try again", onRetry }) => {
    return (
        <div className="card p-8 flex flex-col items-center justify-center text-center my-6 space-y-3 bg-red-50/50 border border-red-100">
            <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mb-1">
                <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
            <h4 className="text-base font-semibold text-gray-900">Failed to load data</h4>
            <p className="text-xs text-gray-600 max-w-md">{message}</p>
            {onRetry && (
                <div className="pt-3">
                    <button
                        onClick={onRetry}
                        className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-red-600 hover:bg-red-700 active:scale-95 transition-all rounded-lg shadow-sm cursor-pointer"
                    >
                        <RefreshCw size={14} />
                        Retry
                    </button>
                </div>
            )}
        </div>
    );
};

export const EmptyState = ({
    title = "No items found",
    description = "Get started by adding your first record.",
    icon: Icon = FolderPlus,
    actionLabel,
    onAction,
}) => {
    return (
        <div className="card p-8 flex flex-col items-center justify-center text-center my-6 space-y-3">
            <div className="w-14 h-14 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center mb-1 border border-purple-100">
                <Icon className="w-7 h-7 text-purple-700" />
            </div>
            <h4 className="text-base font-semibold text-gray-900">{title}</h4>
            <p className="text-xs text-gray-500 max-w-sm">{description}</p>
            {actionLabel && onAction && (
                <div className="pt-3">
                    <Button onClick={onAction} icon={Plus}>
                        {actionLabel}
                    </Button>
                </div>
            )}
        </div>
    );
};
