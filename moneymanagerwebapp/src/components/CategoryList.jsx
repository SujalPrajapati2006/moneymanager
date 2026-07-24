import {Layers2, Pencil, FolderPlus} from "lucide-react";
import {EmptyState} from "./StateCard.jsx";

const renderCategoryIcon = (category) => {
    const iconValue = category?.icon;
    if (iconValue && typeof iconValue === "string" && iconValue.trim() !== "") {
        const trimmed = iconValue.trim();
        if (trimmed.startsWith("http://") || trimmed.startsWith("https://") || trimmed.startsWith("data:")) {
            return (
                <img
                    src={trimmed}
                    alt={category.name}
                    className="w-7 h-7 object-contain"
                    onError={(e) => {
                        e.target.style.display = 'none';
                    }}
                />
            );
        }
        return <span className="text-2xl leading-none">{trimmed}</span>;
    }

    return <Layers2 className="text-purple-700" size={24} />;
};

const CategoryList = ({categories, onEditCategory, onAddCategory}) => {
    if (!categories || categories.length === 0) {
        return (
            <EmptyState
                title="No categories created yet"
                description="Organize your finances by creating custom income and expense categories."
                icon={FolderPlus}
                actionLabel="Add Category"
                onAction={onAddCategory}
            />
        );
    }

    return (
        <div className="card p-5">
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-gray-100">
                <h4 className="text-lg font-semibold text-gray-900">Category Sources</h4>
                <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2.5 py-1 rounded-full">
                    {categories.length} {categories.length === 1 ? 'category' : 'categories'}
                </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {categories.map((category) => (
                    <div
                        key={category.id}
                        className="group relative flex items-center gap-4 p-3 rounded-xl border border-gray-100 hover:border-purple-200 hover:bg-purple-50/30 transition-all">
                        <div className="w-12 h-12 flex items-center justify-center text-xl text-gray-800 bg-purple-50 rounded-full shrink-0 border border-purple-100">
                            {renderCategoryIcon(category)}
                        </div>

                        <div className="flex-1 flex items-center justify-between min-w-0">
                            <div className="min-w-0">
                                <p className="text-sm text-gray-900 font-semibold truncate">
                                    {category.name}
                                </p>
                                <p className="text-xs text-gray-400 mt-0.5 capitalize">
                                    {category.type}
                                </p>
                            </div>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => onEditCategory(category)}
                                    className="text-gray-400 hover:text-purple-600 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer p-1">
                                    <Pencil size={16} />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CategoryList;