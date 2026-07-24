import {useContext, useState} from "react";
import {Link, useNavigate} from "react-router-dom";
import {assets} from "../assets/assets.js";
import Input from "../components/Input.jsx";
import {validateEmail} from "../util/validation.js";
import axiosConfig from "../util/axiosConfig.jsx";
import {API_ENDPOINTS} from "../util/apiEndpoints.js";
import {AppContext} from "../context/AppContext.jsx";
import {LoaderCircle, ArrowRight} from "lucide-react";
import Header from "../components/Header.jsx";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [fieldErrors, setFieldErrors] = useState({});
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const {setUser} = useContext(AppContext);

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setFieldErrors({});
        setError("");

        let errors = {};
        //basic validation
        if (!email.trim()) {
            errors.email = "Email is required";
        } else if (!validateEmail(email)) {
            errors.email = "Please enter valid email address";
        }

        if (!password.trim()) {
            errors.password = "Password is required";
        }

        if (Object.keys(errors).length > 0) {
            setFieldErrors(errors);
            setIsLoading(false);
            return;
        }

        //LOGIN API call
        try {
            const response = await axiosConfig.post(API_ENDPOINTS.LOGIN, {
                email,
                password,
            });
            const {token, user} = response.data;
            if (token) {
                localStorage.setItem("token", token);
                setUser(user);
                navigate("/dashboard");
            }
        }catch(error) {
            if (error.response && error.response.data.message) {
                setError(error.response.data.message);
            } else {
                console.error('Something went wrong', error);
                setError(error.message);
            }
        } finally {
            setIsLoading(false);
        }

    }

    return (
        <div className="h-screen w-full flex flex-col">
            <Header />
            <div className="flex-grow w-full relative flex items-center justify-center overflow-hidden">
                {/* Background image with blur*/}
                <img src={assets.login_bg} alt="Background" className="absolute inset-0 w-full h-full object-cover filter blur-sm" />

                <div className="relative z-10 w-full max-w-md px-6">

                    <div className="bg-white bg-opacity-95 backdrop-blur-sm rounded-lg shadow-2xl p-8">
                        <h3 className="text-2xl font-semibold text-black text-center mb-2">
                            Welcome Back
                        </h3>
                        <p className="text-sm text-slate-700 text-center mb-6">
                            Please enter your details to login in
                        </p>

                        {/* Recruiter / Interviewer Demo Credentials Banner */}
                        <div className="mb-6 p-4 rounded-xl bg-purple-50/80 border border-purple-200/80 text-left shadow-sm">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-xs font-bold uppercase tracking-wider text-purple-700 bg-purple-200/70 px-2 py-0.5 rounded-md flex items-center gap-1">
                                    🔑 Recruiter / Demo Login
                                </span>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setEmail("test@test.com");
                                        setPassword("Test@#12");
                                        setFieldErrors({});
                                        setError(null);
                                    }}
                                    className="text-xs font-semibold text-purple-600 hover:text-purple-800 underline cursor-pointer transition-colors"
                                >
                                    Auto-fill
                                </button>
                            </div>
                            <div className="text-xs text-slate-700 space-y-1 font-mono">
                                <div><span className="font-semibold text-slate-500">Email:</span> test@test.com</div>
                                <div><span className="font-semibold text-slate-500">Password:</span> Test@#12</div>
                            </div>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">

                            <Input
                                disabled={isLoading}
                                value={email}
                                onChange={(e) => {
                                    setEmail(e.target.value);
                                    if (fieldErrors.email) setFieldErrors(prev => ({...prev, email: ""}));
                                }}
                                label="Email Address"
                                placeholder="name@example.com"
                                type="text"
                                error={fieldErrors.email}
                            />

                            <Input
                                disabled={isLoading}
                                value={password}
                                onChange={(e) => {
                                    setPassword(e.target.value);
                                    if (fieldErrors.password) setFieldErrors(prev => ({...prev, password: ""}));
                                }}
                                label="Password"
                                placeholder="*********"
                                type="password"
                                error={fieldErrors.password}
                            />

                            {error && (
                                <p className="text-red-800 text-sm text-center bg-red-50 p-2 rounded">
                                    {error}
                                </p>
                            )}

                            <button
                                disabled={isLoading}
                                type="submit"
                                className="group relative w-full min-h-[48px] h-12 py-3 px-6 rounded-xl font-semibold text-white tracking-wide text-base bg-gradient-to-r from-purple-600 via-violet-600 to-indigo-600 hover:from-purple-700 hover:via-violet-700 hover:to-indigo-700 shadow-md shadow-purple-500/25 hover:shadow-lg hover:shadow-purple-500/35 hover:-translate-y-0.5 hover:scale-[1.01] active:scale-[0.98] active:translate-y-0 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-all duration-200 ease-in-out cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none flex items-center justify-center gap-2 overflow-hidden mt-2"
                            >
                                {isLoading ? (
                                    <>
                                        <LoaderCircle className="animate-spin w-5 h-5 text-white" />
                                        <span>Logging in...</span>
                                    </>
                                ) : (
                                    <>
                                        <span>LOGIN</span>
                                        <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                                    </>
                                )}
                            </button>

                            <p className="text-sm text-slate-800 text-center mt-6">
                                Don't have an account?
                                <Link to="/signup" className="font-medium text-primary underline hover:text-primary-dark transition-colors">Signup</Link>
                            </p>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Login;