    import { useMemo } from 'react';
import {
    ResponsiveContainer,
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
} from 'recharts';
import {formatCurrency} from "../util/util.js";

const CustomLineChart = ({ data }) => {
    // Deterministic Y-axis upper bound calculated strictly from dataset max value
    const yMax = useMemo(() => {
        if (!data || data.length === 0) return 1000;
        const maxVal = Math.max(...data.map((d) => Number(d.totalAmount) || 0));
        if (maxVal <= 0) return 1000;
        const target = maxVal * 1.1;
        const magnitude = Math.pow(10, Math.floor(Math.log10(target)));
        return Math.ceil(target / (magnitude / 2 || 1)) * (magnitude / 2 || 1);
    }, [data]);

    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            const dataPoint = payload[0].payload;

            // Group items by exact item name/category to avoid stale or missing labels
            const groupedItemsForTooltip = (dataPoint.items || []).reduce((acc, item) => {
                const displayName = item.name || item.categoryName || item.category?.name || "Transaction";
                const amount = Number(item.amount || 0);

                if (!acc[displayName]) {
                    acc[displayName] = {
                        name: displayName,
                        totalAmount: 0,
                    };
                }
                acc[displayName].totalAmount += amount;
                return acc;
            }, {});

            // Convert grouped object to array for mapping
            const categoriesInTooltip = Object.values(groupedItemsForTooltip);

            return (
                <div className="bg-white shadow-md rounded-lg p-2.5 border border-gray-200 min-w-[150px]">
                    {/* Display the formatted date at the top of the tooltip */}
                    <p className="text-sm font-semibold text-gray-800 mb-1">{label}</p>
                    <hr className="my-1 border-gray-200" />
                    {/* Display the total amount for the date */}
                    <p className="text-sm text-gray-700 font-bold mb-2">
                        Total: <span className="text-purple-800">{formatCurrency(dataPoint.totalAmount)}</span>
                    </p>

                    {/* Iterate over the newly grouped categories for a consolidated view */}
                    {categoriesInTooltip && categoriesInTooltip.length > 0 && (
                        <div className="mt-2 pt-2 border-t border-gray-200 space-y-1">
                            <p className="text-xs font-semibold text-gray-500 mb-1">Details:</p>
                            {categoriesInTooltip.map((groupedItem, index) => (
                                <div key={index} className="flex justify-between gap-4 text-xs text-gray-700">
                                    <span>{groupedItem.name}:</span>
                                    <span className="font-medium text-gray-900">{formatCurrency(groupedItem.totalAmount)}</span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            );
        }
        return null;
    };

    return (
        <div className="bg-white">
            <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={data}>
                    <defs>
                        <linearGradient id="expenseGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#875cf5" stopOpacity={0.4} />
                            <stop offset="95%" stopColor="#875cf5" stopOpacity={0} />
                        </linearGradient>
                    </defs>

                    <CartesianGrid stroke="#f1f5f9" strokeDasharray="3 3" />
                    <XAxis dataKey="month" tick={{ fontSize: 12, fill: "#64748b" }} stroke="none" />
                    <YAxis
                        domain={[0, yMax]}
                        tick={{ fontSize: 12, fill: "#64748b" }}
                        stroke="none"
                        tickFormatter={(val) => (val >= 1000 ? `${(val / 1000).toFixed(0)}k` : val)}
                    />
                    <Tooltip content={<CustomTooltip />} />

                    <Area
                        type="monotone"
                        dataKey="totalAmount"
                        stroke="#875cf5"
                        fill="url(#expenseGradient)"
                        strokeWidth={3}
                        dot={{ r: 3, fill: "#ab8df8" }}
                    />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
};

export default CustomLineChart;