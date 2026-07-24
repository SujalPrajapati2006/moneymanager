import {
    PieChart,
    Pie,
    Cell,
    Tooltip,
    ResponsiveContainer,
    Legend,
} from "recharts";
import CustomTooltip from "./CustomTooltip.jsx";
import CustomLegend from "./CustomLegend.jsx";

const CustomPieChart = ({ data, label, totalAmount, showTextAnchor, colors, hideLegend = false }) => {

    return (
        <ResponsiveContainer width="100%" height={320}>
            <PieChart>
                <Pie
                    data={data}
                    dataKey="amount"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={110}
                    innerRadius={80}
                    labelLine={false}
                >
                    {data.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                    ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                {!hideLegend && <Legend content={<CustomLegend />} />}

                {showTextAnchor && (
                    <>
                        <text
                            x="50%"
                            y="50%"
                            dy={-15}
                            textAnchor="middle"
                            fill="#64748b"
                            fontSize="13px"
                            fontWeight="500"
                        >
                            {label}
                        </text>
                        <text
                            x="50%"
                            y="50%"
                            dy={16}
                            textAnchor="middle"
                            fill="#0f172a"
                            fontSize="22px"
                            fontWeight="700"
                        >
                            {totalAmount}
                        </text>
                    </>
                )}
            </PieChart>
        </ResponsiveContainer>
    );
};

export default CustomPieChart;
