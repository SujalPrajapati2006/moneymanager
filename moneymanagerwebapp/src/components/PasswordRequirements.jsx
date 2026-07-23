import React from "react";
import { Check, X } from "lucide-react";

export const getPasswordRequirements = (password = "") => {
    return [
        {
            id: "uppercase",
            label: "At least 1 uppercase letter",
            isMet: /[A-Z]/.test(password),
        },
        {
            id: "lowercase",
            label: "At least 1 lowercase letter",
            isMet: /[a-z]/.test(password),
        },
        {
            id: "digit",
            label: "At least 1 digit",
            isMet: /\d/.test(password),
        },
        {
            id: "special",
            label: "At least 1 special character",
            isMet: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>/?]/.test(password),
        },
    ];
};

const PasswordRequirements = ({ password }) => {
    if (!password) return null;

    const requirements = getPasswordRequirements(password);

    return (
        <div className="mt-2 p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs space-y-1.5 transition-all shadow-sm">
            <p className="font-medium text-slate-700 mb-1">Password Requirements:</p>
            <div className="flex flex-col gap-1.5">
                {requirements.map((req) => (
                    <div
                        key={req.id}
                        className={`flex items-center gap-1.5 font-medium transition-colors ${
                            req.isMet ? "text-emerald-600" : "text-red-500"
                        }`}
                    >
                        {req.isMet ? (
                            <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        ) : (
                            <X className="w-3.5 h-3.5 text-red-500 shrink-0" />
                        )}
                        <span>{req.label}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default PasswordRequirements;
