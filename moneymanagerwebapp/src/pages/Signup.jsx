import {useState} from "react";
import {Link, useNavigate} from "react-router-dom";
import {assets} from "../assets/assets.js";
import Input from "../components/Input.jsx";
import {validateEmail, validatePassword} from "../util/validation.js";
import axiosConfig from "../util/axiosConfig.jsx";
import {API_ENDPOINTS} from "../util/apiEndpoints.js";
import toast from "react-hot-toast";
import {LoaderCircle, ArrowRight} from "lucide-react";
import ProfilePhotoSelector from "../components/ProfilePhotoSelector.jsx";
import uploadProfileImage from "../util/uploadProfileImage.js";
import Header from "../components/Header.jsx";
import PasswordRequirements from "../components/PasswordRequirements.jsx";

const Signup = () => {
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [fieldErrors, setFieldErrors] = useState({});
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [profilePhoto, setProfilePhoto] = useState(null);

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        let profileImageUrl = "";
        setIsLoading(true);
        setFieldErrors({});
        setError("");

        let errors = {};

        //basic validation
        if (!fullName.trim()) {
            errors.fullName = "Full name is required";
        }

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

        if (!validatePassword(password)) {
            setIsLoading(false);
            return;
        }

        //signup api call
        try {

            //upload image if present
            if (profilePhoto) {
                const imageUrl = await uploadProfileImage(profilePhoto);
                profileImageUrl = imageUrl || "";
            }
            const response = await axiosConfig.post(API_ENDPOINTS.REGISTER, {
                fullName,
                email,
                password,
                profileImageUrl
            })
            if (response.status === 201) {
                toast.success("Profile created successfully.");
                navigate("/login");
            }
        } catch(err) {
            console.error('Something went wrong', err);
            if (err.response?.status === 409) {
                const msg = err.response?.data?.message || "An account with this email already exists.";
                setFieldErrors(prev => ({ ...prev, email: msg }));
            } else if (err.response?.data && typeof err.response.data === "object") {
                const serverFieldErrors = {};
                Object.entries(err.response.data).forEach(([key, val]) => {
                    if (key !== "password") {
                        serverFieldErrors[key] = val;
                    }
                });
                if (Object.keys(serverFieldErrors).length > 0) {
                    setFieldErrors(serverFieldErrors);
                } else if (err.response?.data?.message) {
                    setError(err.response.data.message);
                }
            } else if (err.response?.data && typeof err.response.data === "string") {
                setError(err.response.data);
            } else {
                setError(err.message || "Something went wrong. Please try again.");
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

                <div className="relative z-10 w-full max-w-lg px-6">

                    <div className="bg-white bg-opacity-95 backdrop-blur-sm rounded-lg shadow-2xl p-8 max-h-[90vh] overflow-y-auto">
                        <h3 className="text-2xl font-semibold text-black text-center mb-2">
                            Create An Account
                        </h3>
                        <p className="text-sm text-slate-700 text-center mb-8">
                            Start tracking your spendings by joining with us.
                        </p>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="flex justify-center mb-6">
                                <ProfilePhotoSelector image={profilePhoto} setImage={setProfilePhoto} />
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <Input
                                    disabled={isLoading}
                                    value={fullName}
                                    onChange={(e) => {
                                        setFullName(e.target.value);
                                        if (fieldErrors.fullName) setFieldErrors(prev => ({...prev, fullName: ""}));
                                    }}
                                    label="Full Name"
                                    placeholder="Jhon Doe"
                                    type="text"
                                    error={fieldErrors.fullName}
                                />

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

                                <div className="col-span-1 sm:col-span-2">
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
                                    <PasswordRequirements password={password} />
                                </div>

                            </div>
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
                                        <span>Creating Account...</span>
                                    </>
                                ) : (
                                    <>
                                        <span>SIGN UP</span>
                                        <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                                    </>
                                )}
                            </button>

                            <p className="text-sm text-slate-800 text-center mt-6">
                                Already have an account?
                                <Link to="/login" className="font-medium text-primary underline hover:text-primary-dark transition-colors">Login</Link>
                            </p>
                        </form>
                    </div>

                </div>


            </div>
        </div>
    )
}

export default Signup;