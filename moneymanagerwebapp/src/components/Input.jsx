import {useState} from "react";
import {Eye, EyeOff} from "lucide-react";

const Input = ({label, value, onChange, placeholder, type, isSelect, options, error}) => {
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
                        className={`w-full bg-transparent outline-none border ${error ? 'border-red-500' : 'border-gray-300'} rounded-md py-2 px-3 text-gray-700 leading focus:outline-none focus:border-purple-500 transition-colors`}
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
                        className={`w-full bg-transparent outline-none border ${error ? 'border-red-500' : 'border-gray-300'} rounded-md py-2 px-3 pr-10 text-gray-700 leading-tight focus:outline-none focus:border-purple-500 transition-colors`}
                        type={type === 'password' ? (showPassword ? 'text' : 'password') : type}
                        placeholder={placeholder}
                        value={value}
                        onChange={(e) => onChange(e)} />
                )}

                {type === 'password' && (
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer">
                        {showPassword ? (
                            <Eye
                                size={20}
                                className="text-primary"
                                onClick={toggleShowPassword}
                            />
                        ) : (
                            <EyeOff
                                size={20}
                                className="text-slate-400"
                                onClick={toggleShowPassword}
                            />
                        )}
                    </span>
                )}
            </div>
            {error && (
                <p className="text-xs text-red-500 mt-1 font-medium">{error}</p>
            )}
        </div>
    )
}

export default Input;