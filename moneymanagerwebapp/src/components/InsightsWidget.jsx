import { Sparkles, TrendingUp, Info, History } from "lucide-react";

const InsightsWidget = ({ insightsData }) => {
    if (!insightsData) return null;

    const { hasSufficientData, insights } = insightsData;

    return (
        <div className="bg-gradient-to-r from-purple-900 to-indigo-900 text-white rounded-2xl p-5 shadow-md relative overflow-hidden my-6">
            {/* Background Decorative Blur */}
            <div className="absolute -right-8 -bottom-8 w-40 h-40 bg-purple-500/20 rounded-full blur-2xl pointer-events-none" />

            <div className="flex items-center gap-2.5 mb-3.5">
                <div className="p-2 bg-purple-700/50 rounded-xl backdrop-blur-md text-amber-300">
                    <Sparkles size={20} />
                </div>
                <div>
                    <h3 className="text-base font-bold tracking-tight">Smart Financial Insights</h3>
                    <p className="text-xs text-purple-200 font-medium">Automated pattern analysis based on your activity</p>
                </div>
            </div>

            {!hasSufficientData ? (
                <div className="flex items-start gap-3 bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/10 mt-3 text-purple-100 text-xs">
                    <History className="shrink-0 text-amber-300 mt-0.5" size={18} />
                    <p className="leading-relaxed">
                        {insights && insights.length > 0
                            ? insights[0]
                            : "Keep logging transactions — we'll start showing spending insights once you have a bit more history."}
                    </p>
                </div>
            ) : (
                <div className="space-y-2.5 mt-3">
                    {insights?.map((text, idx) => (
                        <div
                            key={idx}
                            className="flex items-start gap-3 bg-white/10 backdrop-blur-md rounded-xl p-3.5 border border-white/10 text-xs text-purple-50 transition-all hover:bg-white/15"
                        >
                            <TrendingUp className="shrink-0 text-emerald-400 mt-0.5" size={16} />
                            <p className="leading-relaxed font-medium">{text}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default InsightsWidget;
