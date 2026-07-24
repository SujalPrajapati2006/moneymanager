import {useState} from "react";
import {Eye, EyeOff} from "lucide-react";

const Input = ({label, value, onChange, placeholder, type, isSelect, options, error, disabled}) => {
    const [showPassword, setShowPassword] = useState(false);

    const toggleShowPassword = () => {
        setShowPassword(!showPassword);
    }
    return (
        <div className="mb-2">
            <label className="text-[13px] text-slate-800 block mb-1">
                {label}
            </label>
            <div className="relative">
                {isSelect ? (
                    <select
                        disabled={disabled}
                        className={`w-full bg-transparent outline-none border ${error ? 'border-red-500' : 'border-gray-300'} rounded-md py-2 px-3 text-gray-700 leading focus:outline-none focus:border-purple-500 transition-colors disabled:opacity-60 disabled:cursor-not-allowed disabled:bg-slate-100/50`}
                        value={value}
                        onChange={(e) => onChange(e)}
                    >
                        {options.map((option) => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                ): (
                    <input
                        disabled={disabled}
                        className={`w-full bg-transparent outline-none border ${error ? 'border-red-500' : 'border-gray-300'} rounded-md py-2 px-3 ${type === 'password' ? 'pr-10' : 'pr-3'} text-sm text-gray-700 leading-tight focus:outline-none focus:border-purple-500 transition-colors disabled:opacity-60 disabled:cursor-not-allowed disabled:bg-slate-100/50 placeholder:text-slate-400 placeholder:text-sm`}
                        type={type === 'password' ? (showPassword ? 'text' : 'password') : type}
                        placeholder={placeholder}
                        value={value}
                        onChange={(e) => onChange(e)} />
                )}

                {type === 'password' && (
                    <button
                        type="button"
                        disabled={disabled}
                        onClick={toggleShowPassword}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none cursor-pointer p-1 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                        tabIndex={-1}
                        aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                        {showPassword ? (
                            <Eye size={18} className="text-purple-600" />
                        ) : (
                            <EyeOff size={18} className="text-slate-400" />
                        )}
                    </button>
                )}
            </div>
            {error && (
                <p className="text-xs text-red-500 mt-1 font-medium">{error}</p>
            )}
        </div>
    )
}

export default Input;