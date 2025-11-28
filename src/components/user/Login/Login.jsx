  import React, { useState, useEffect } from "react";
  // import { Link } from "react-router-dom";
  import {
    IoArrowForwardCircleSharp,
    IoArrowBackCircleSharp,
    IoMailOutline,
    IoLockClosedOutline,
    IoPersonOutline,
    IoCallOutline,
    IoCheckmarkCircle,
    IoCloseCircle,
  } from "react-icons/io5";
  import { motion, AnimatePresence } from "framer-motion";
  import { useNavigate } from "react-router-dom";
  import { RegisterUser } from "../../../Services/userApi";
  import { OtpForUserRegistration } from "../../../Services/userApi";
  import { submitOTP } from "../../../Services/userApi";
  import OtpInput from "../OtpSubmit/otp"; // Import OtpInput from the working Login component path
  import { useAuth } from "../../../Context/UserContext";
  import maxtreo from '../../../Images/maxtreobgremoved.png'
  import GoogleLoginComponent from "../../user/Google/GoogleLoginComponent";

  const ModernLoginForm = ({ isModal = false, onClose }) => {
    const navigate = useNavigate();
    const {  setToken } = useAuth();
    const [isLogin, setIsLogin] = useState(true);
    const [sentingotp, setsentingtOtp] = useState(false);
    const [message, setMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [showEmailInput, setShowEmailInput] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const [phoneError, setPhoneError] = useState("");
    const [agreedToTerms, setAgreedToTerms] = useState(false);
    const [currentField, setCurrentField] = useState("email");
    const [formData, setFormData] = useState({
      email: "",
      password: "",
      cpassword: "",
      first_name: "",
      phone_number: "",
      otp: "",
      role: "user",
    });
    const [validationState, setValidationState] = useState({
      hasMinLength: false,
      hasNumber: false,
      hasSpecialChar: false,
      passwordsMatch: false,
    });
    const [showValidation, setShowValidation] = useState(false);
    const [formFieldsVisible, setFormFieldsVisible] = useState({
      email: true,
      password: false,
      terms: false,
      otp: false,
    });
    const registrationFields = ["email", "password", "terms", "otp"];
    const calculateProgress = () => {
      const currentIndex = registrationFields.indexOf(currentField);
      if (currentIndex === -1) return 0;
      return (currentIndex / (registrationFields.length - 1)) * 100;
    };
    useEffect(() => {
      setValidationState({
        hasMinLength: formData.password.length >= 8,
        hasNumber: /\d/.test(formData.password),
        hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(formData.password),
        passwordsMatch:
          formData.password === formData.cpassword && formData.password !== "",
      });
    }, [formData.password, formData.cpassword]);
    const isValidPhoneNumber = (phone) => {
      if (!phone) return false;
      const isDigitsOnly = /^\d+$/.test(phone);
      const isCorrectLength = phone.length >= 10 && phone.length <= 12;
      return isDigitsOnly && isCorrectLength;
    };
    // Digits-only handler for manual OTP inputs (used in registration)
    const handleOtpChange = (e) => {
      const { name, value } = e.target;
      const numericOtp = value.replace(/\D/g, "").slice(0, 6);
      setFormData((prev) => ({ ...prev, [name]: numericOtp }));
    };
    const handlePhoneChange = (e) => {
      const { name, value } = e.target;
      if (name === "phone_number") {
        const numericValue = value.replace(/\D/g, "");
        setFormData({
          ...formData,
          [name]: numericValue,
        });
        if (numericValue && !/^\d+$/.test(numericValue)) {
          setPhoneError("Only numbers are allowed");
        } else if (
          numericValue &&
          (numericValue.length < 10 || numericValue.length > 12)
        ) {
          setPhoneError("Phone number must be 10-12 digits");
        } else {
          setPhoneError("");
        }
      } else {
        handleChange(e);
      }
    };
    const handleChange = (e) => {
      const { name, value } = e.target;
      setFormData((prev) => ({ ...prev, [name]: value }));
      if (!showValidation && name === "password" && value.length > 0) {
        setShowValidation(true);
      }
    };
    const isPasswordValid = () => {
      return (
        validationState.hasMinLength &&
        validationState.hasNumber &&
        validationState.hasSpecialChar
      );
    };
    const isFormValid = () => {
      return isPasswordValid() && validationState.passwordsMatch;
    };
    const isFieldValid = (fieldName) => {
      if (fieldName === "terms") return agreedToTerms;
      return !!formData[fieldName];
    };
    const moveToNextField = () => {
      const currentIndex = registrationFields.indexOf(currentField);
      if (currentIndex < registrationFields.length - 1) {
        const nextField = registrationFields[currentIndex + 1];
        setCurrentField(nextField);
        setFormFieldsVisible((prev) => {
          const updated = { ...prev };
          for (let i = 0; i <= currentIndex + 1; i++) {
            updated[registrationFields[i]] = true;
          }
          return updated;
        });
      }
    };
    const moveToPreviousField = () => {
      const currentIndex = registrationFields.indexOf(currentField);
      if (currentIndex > 0) {
        setCurrentField(registrationFields[currentIndex - 1]);
      }
    };
    const getStepFromField = (field) => {
      if (["first_name", "email", "phone_number"].includes(field)) return 1;
      if (["password", "cpassword"].includes(field)) return 2;
      if (["terms"].includes(field)) return 3;
      if (["otp"].includes(field)) return 4;
      return 1;
    };
    const getCurrentStep = () => {
      return getStepFromField(currentField);
    };
    const handleSendOTP = async () => {
      const email = formData.email;

      if (email === "") {
        setErrorMessage("Please enter an email");
        return;
      }

      localStorage.setItem("email", email);

      let result = await submitOTP(email);
      console.log("otp login response:",result)

      if (result.success) {
        setMessage("OTP sent successfully");
        setShowEmailInput(false);
        setTimeout(() => {
          setsentingtOtp(true);
        }, 300);
      } else {
        setShowEmailInput(true);
        if (result.isActive === false) {
          setErrorMessage("This user is inactive. Please contact administrator.");
        } else {
          setErrorMessage(
            result.errorMessage || "Something went wrong. Please try again."
          );
        }
      }
    };
    const handleSubmit = async (e) => {
      e.preventDefault();
      setIsLoading(true);
      setErrorMessage("");

      const registrationData = {
        email: formData.email,
        password: formData.password,
        first_name: formData.first_name,
        phone_number: formData.phone_number,
        role: "user",
      };

      try {
        let response = await RegisterUser(registrationData);

        if (response.status === 400) {
          setErrorMessage(response.response.data.detail);
        } else {
          setMessage(
            "Registration successful! Please enter the OTP sent to your email."
          );
          moveToNextField();
        }
      } catch (error) {
        setErrorMessage(
          error.response?.data?.detail || "Registration failed. Please try again."
        );
      } finally {
        setIsLoading(false);
      }
    };
    const verifyOTPRegistration = async (e) => {
      e.preventDefault();

      setErrorMessage("");
      setMessage("");

      if (!formData.otp) {
        setErrorMessage("Please enter the verification code");
        return;
      }

      const otpData = {
        otp: formData.otp,
        identifier: formData.email,
      };

      try {
        const response = await OtpForUserRegistration(otpData);

        if (response.status === 200 || response.status === 201) {
          setMessage("Verification successful!");

          const data = response.data;
          localStorage.setItem("refresh", data.refresh);

          if (setToken) {
            setToken(data.access);
          }

          setTimeout(() => {
            if (isModal && onClose) {
              onClose(); // Close modal on success in modal mode
            } else {
              navigate("/");
            }
          }, 1000);
        } else {
          setErrorMessage(
            response.data?.detail || "Invalid OTP. Please try again."
          );
        }
      } catch (error) {
        setErrorMessage(
          error.response?.data?.detail || "Error verifying OTP. Please try again."
        );
      }
    };
    
const verifyLoginOTP = async (otp) => {
  setErrorMessage("");
  setMessage("");
  if (!otp) {
    setErrorMessage("Please enter the verification code");
    return;
  }
  const otpData = {
    otp: otp,
    identifier: formData.email,
  };
  try {
    // Call API (pass setToken/setIsAdmin if needed; unchanged)
    const result = await OtpForUserRegistration(otpData, setToken);  // Adjust params as before
    
    if (result.data === true || result.success) {  // Handle both old/new returns
      setMessage("Login successful!");
      const data = result.fullData || result;  // Get full backend data
      
      // FIXED CHECK: Use role directly (ignores is_admin)
      const isAdminUser = data.role === "admin";
      console.log("Role check:", data.role, "| Redirecting as admin?", isAdminUser);
      
      setTimeout(() => {
        if (isModal && onClose) {
          onClose();
        } else {
          if (isAdminUser) {
            navigate("/admin/dashboard");
          } else {
            navigate("/");
          }
        }
      }, 1000);
    } else {
      setErrorMessage("Invalid OTP. Please try again.");
    }
  } catch (error) {
    setErrorMessage("Error verifying OTP. Please try again.");
  }
};

    const handleResendOTP = async () => {
      const email = formData.email;
      if (!email) {
        setErrorMessage("No email found");
        return;
      }

      localStorage.setItem("email", email);

      let result = await submitOTP(email);

      if (result.success) {
        setMessage("OTP resent successfully");
      } else {
        setErrorMessage(
          result.errorMessage || "Failed to resend OTP. Please try again."
        );
      }

      setTimeout(() => {
        setMessage("");
        setErrorMessage("");
      }, 3000);
    };
    const resetLoginForm = () => {
      setsentingtOtp(false);
      setShowEmailInput(true);
      setMessage("");
      setErrorMessage("");
      setFormData({
        email: "",
        password: "",
        cpassword: "",
        first_name: "",
        phone_number: "",
        otp: "",
        role: "user",
      });
    };
    const resetRegistrationForm = () => {
      setCurrentField("email");
      setFormFieldsVisible({
        email: true,
        password: false,
        terms: false,
        otp: false,
      });
      setMessage("");
      setErrorMessage("");
      setAgreedToTerms(false);
      setShowValidation(false);
      setFormData({
        email: "",
        password: "",
        cpassword: "",
        first_name: "",
        phone_number: "",
        otp: "",
        role: "user",
      });
    };
    const currentStep = getCurrentStep();

    if (isModal) {
      // Modal-optimized layout: No side image, full width form, flexible height
      return (
        <div className="w-full p-4 flex flex-col items-center justify-center min-h-[400px]">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="w-full"
          >
            <div className="flex items-center justify-center space-x-1 mb-4">
              <img
                src={maxtreo}
                alt="Maxtreo Logo"
                className="w-16 h-16 object-contain cursor-pointer"
                onClick={onClose} // Close on logo click in modal
              />
              <h1 className="text-2xl font-bold text-gray-800">Welcome to Maxtreo</h1>
            </div>

            {/* Tab Switcher - Reduced size for modal */}
            <div className="flex bg-gray-100 rounded-full p-1 mb-6">
              <button
                className={`flex-1 py-2 rounded-full font-semibold text-sm transition-all duration-300 ${
                  isLogin
                    ? "bg-white text-blue-600 shadow-md"
                    : "text-gray-600 hover:text-gray-800"
                }`}
                onClick={() => {
                  setIsLogin(true);
                  resetLoginForm();
                }}
              >
                Login
              </button>
              <button
                className={`flex-1 py-2 rounded-full font-semibold text-sm transition-all duration-300 ${
                  !isLogin
                    ? "bg-white text-blue-600 shadow-md"
                    : "text-gray-600 hover:text-gray-800"
                }`}
                onClick={() => {
                  setIsLogin(false);
                  resetRegistrationForm();
                }}
              >
                Register
              </button>
            </div>

            {/* Alerts - Same as before */}
            <AnimatePresence>
              {message && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="mb-3 p-3 bg-green-50 border border-green-200 text-green-700 rounded-lg flex items-start text-sm"
                >
                  <IoCheckmarkCircle className="text-lg mr-2 flex-shrink-0 mt-0.5" />
                  <span>{message}</span>
                </motion.div>
              )}
              {errorMessage && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="mb-3 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg flex items-start text-sm"
                >
                  <IoCloseCircle className="text-lg mr-2 flex-shrink-0 mt-0.5" />
                  <span>{errorMessage}</span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Form Content - Reduced padding, full width */}
            <div className="bg-white rounded-xl shadow-lg p-6 max-h-[60vh] overflow-y-auto">
              <AnimatePresence mode="wait">
                {isLogin ? (
                  <motion.div
                    key="login"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    layout
                    className="w-full"
                  >
                    <div>
                      <h2 className="text-2xl font-bold mb-2 text-blue-600">
                        Welcome Back
                      </h2>
                      <p className="text-gray-600 mb-6 text-sm">Sign in to continue your journey</p>
                      <AnimatePresence mode="wait">
                        {showEmailInput && (
                          <motion.div
                            key="email-input"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                          >
                            <div className="relative mb-4 group">
                              <IoMailOutline className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg group-focus-within:text-blue-600 transition-colors" />
                              <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="Email address"
                                className="w-full pl-10 pr-3 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-600 focus:outline-none transition-all bg-gray-50 focus:bg-white text-sm"
                              />
                            </div>
                            <button
                              onClick={handleSendOTP}
                              className="w-full py-3 bg-blue-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all duration-300 flex items-center justify-center group text-sm"
                            >
                              <span>Generate OTP</span>
                              <IoArrowForwardCircleSharp className="ml-2 text-lg group-hover:translate-x-1 transition-transform" />
                            </button>
                          </motion.div>
                        )}
                        {sentingotp && (
                          <motion.div
                            key="otp-input"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-center"
                          >
                            <p className="text-gray-600 mb-4 text-sm">
                              Enter the verification code sent to your email
                            </p>
                            {/* Use OtpInput from working Login component for login flow */}
                            <OtpInput email={formData.email} onSubmit={verifyLoginOTP} />
                            <button
                              onClick={handleResendOTP}
                              className="mt-3 text-blue-600 hover:underline text-xs"
                            >
                              Resend Code
                            </button>
                          </motion.div>
                        )}
                      </AnimatePresence>
                      <AnimatePresence mode="wait">
                        {!sentingotp && (
                          <motion.div
                            key="social-login"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="my-4"
                          >
                            {/* OR Divider - Reduced */}
                            <div className="flex items-center my-4">
                              <div className="flex-grow border-t border-gray-300"></div>
                              <p className="text-center text-gray-500 text-xs uppercase tracking-wider px-3">
                                OR
                              </p>
                              <div className="flex-grow border-t border-gray-300"></div>
                            </div>
                            <div className="flex justify-center">
                              <GoogleLoginComponent />
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="register"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    layout
                    className="w-full"
                  >
                    <div>
                      {/* Progress Bar - Reduced size */}
                      <div className="mb-6">
                        <div className="flex justify-between mb-2">
                          {[1, 2, 3, 4].map((step) => (
                            <div
                              key={step}
                              className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition-all duration-300 ${
                                currentStep >= step
                                  ? "bg-blue-600 text-white shadow-lg scale-110"
                                  : "bg-gray-200 text-gray-400"
                              }`}
                            >
                              {step}
                            </div>
                          ))}
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-1.5">
                          <div
                            className="bg-blue-600 h-1.5 rounded-full transition-all duration-500"
                            style={{ width: `${calculateProgress()}%` }}
                          ></div>
                        </div>
                      </div>
                      {/* Step Titles - Reduced */}
                      <motion.div
                        key={currentStep}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-6"
                      >
                        <h2 className="text-xl font-bold text-blue-600 mb-1">
                          {currentStep === 1 && "Basic Information"}
                          {currentStep === 2 && "Secure Your Account"}
                          {currentStep === 3 && "Terms & Conditions"}
                          {currentStep === 4 && "Verify Your Email"}
                        </h2>
                        <p className="text-gray-600 text-xs">
                          {currentStep === 1 && "Let's get started with your details"}
                          {currentStep === 2 && "Create a strong password"}
                          {currentStep === 3 && "Almost there!"}
                          {currentStep === 4 && "Check your inbox for the code"}
                        </p>
                      </motion.div>
                      {/* Step 1: Basic Info - Reduced spacing */}
                      {currentField === "email" && formFieldsVisible.email && (
                        <motion.div
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          className="space-y-3"
                        >
                          <div className="relative group">
                            <IoPersonOutline className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg group-focus-within:text-blue-600 transition-colors" />
                            <input
                              type="text"
                              name="first_name"
                              value={formData.first_name}
                              onChange={handleChange}
                              placeholder="Full Name"
                              className="w-full pl-10 pr-3 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-600 focus:outline-none transition-all bg-gray-50 focus:bg-white text-sm"
                            />
                          </div>
                          <div className="relative group">
                            <IoMailOutline className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg group-focus-within:text-blue-600 transition-colors" />
                            <input
                              type="email"
                              name="email"
                              value={formData.email}
                              onChange={handleChange}
                              placeholder="Email address"
                              className="w-full pl-10 pr-3 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-600 focus:outline-none transition-all bg-gray-50 focus:bg-white text-sm"
                            />
                          </div>
                          <div className="relative group">
                            <IoCallOutline className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg group-focus-within:text-blue-600 transition-colors" />
                            <input
                              type="tel"
                              name="phone_number"
                              value={formData.phone_number}
                              onChange={handlePhoneChange}
                              placeholder="Phone number"
                              className={`w-full pl-10 pr-3 py-3 border-2 rounded-lg focus:outline-none transition-all bg-gray-50 focus:bg-white text-sm ${
                                phoneError
                                  ? "border-red-500 focus:border-red-500"
                                  : "border-gray-200 focus:border-blue-600"
                              }`}
                            />
                            {phoneError && (
                              <p className="text-red-500 text-xs mt-1 ml-1">{phoneError}</p>
                            )}
                          </div>
                          <button
                            disabled={
                              !(
                                isFieldValid("email") &&
                                isFieldValid("phone_number") &&
                                isFieldValid("first_name") &&
                                isValidPhoneNumber(formData.phone_number)
                              )
                            }
                            className={`w-full py-3 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center group text-sm ${
                              isFieldValid("email") &&
                              isFieldValid("phone_number") &&
                              isFieldValid("first_name") &&
                              isValidPhoneNumber(formData.phone_number)
                                ? "bg-blue-600 text-white hover:shadow-lg"
                                : "bg-gray-200 text-gray-400 cursor-not-allowed"
                            }`}
                            onClick={moveToNextField}
                          >
                            <span>Continue</span>
                            <IoArrowForwardCircleSharp className="ml-2 text-lg group-hover:translate-x-1 transition-transform" />
                          </button>
                        </motion.div>
                      )}
                      {/* Step 2: Password - Reduced spacing */}
                      {currentField === "password" && formFieldsVisible.password && (
                        <motion.div
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          className="space-y-3"
                        >
                          <div className="relative group">
                            <IoLockClosedOutline className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg group-focus-within:text-blue-600 transition-colors" />
                            <input
                              type="password"
                              name="password"
                              value={formData.password}
                              onChange={handleChange}
                              placeholder="Create password"
                              className="w-full pl-10 pr-3 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-600 focus:outline-none transition-all bg-gray-50 focus:bg-white text-sm"
                            />
                          </div>
                          {showValidation && (
                            <div className="bg-blue-50 p-3 rounded-lg border border-blue-100 text-sm">
                              <p className="text-xs font-semibold mb-2 text-blue-900">
                                Password must contain:
                              </p>
                              <div className="space-y-1">
                                {[
                                  { key: "hasMinLength", text: "At least 8 characters" },
                                  { key: "hasNumber", text: "At least one number" },
                                  { key: "hasSpecialChar", text: "At least one special character" },
                                ].map(({ key, text }) => (
                                  <div
                                    key={key}
                                    className={`flex items-center text-xs ${
                                      validationState[key]
                                        ? "text-green-600"
                                        : "text-gray-500"
                                    }`}
                                  >
                                    {validationState[key] ? (
                                      <IoCheckmarkCircle className="mr-1 text-sm" />
                                    ) : (
                                      <div className="w-1.5 h-1.5 rounded-full bg-gray-300 mr-1"></div>
                                    )}
                                    {text}
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                          <div className="relative group">
                            <IoLockClosedOutline className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg group-focus-within:text-blue-600 transition-colors" />
                            <input
                              type="password"
                              name="cpassword"
                              value={formData.cpassword}
                              onChange={handleChange}
                              placeholder="Confirm password"
                              className={`w-full pl-10 pr-3 py-3 border-2 rounded-lg focus:outline-none transition-all bg-gray-50 focus:bg-white text-sm ${
                                formData.cpassword && !validationState.passwordsMatch
                                  ? "border-red-500 focus:border-red-500"
                                  : "border-gray-200 focus:border-blue-600"
                              }`}
                            />
                            {formData.cpassword && !validationState.passwordsMatch && (
                              <p className="text-red-500 text-xs mt-1">
                                Passwords don't match
                              </p>
                            )}
                          </div>
                          <div className="flex gap-2">
                            <button
                              className="flex-1 py-3 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition-all flex items-center justify-center text-sm"
                              onClick={moveToPreviousField}
                            >
                              <IoArrowBackCircleSharp className="mr-1 text-lg" />
                              Back
                            </button>
                            <button
                              className={`flex-1 py-3 rounded-lg font-semibold transition-all flex items-center justify-center text-sm ${
                                isFormValid()
                                  ? "bg-blue-600 text-white hover:shadow-lg"
                                  : "bg-gray-200 text-gray-400 cursor-not-allowed"
                              }`}
                              onClick={moveToNextField}
                              disabled={!isFormValid()}
                            >
                              Continue
                              <IoArrowForwardCircleSharp className="ml-1 text-lg" />
                            </button>
                          </div>
                        </motion.div>
                      )}
                      {/* Step 3: Terms - Reduced */}
                      {currentField === "terms" && formFieldsVisible.terms && (
                        <motion.div
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          className="space-y-4"
                        >
                          <div className="bg-gray-50 p-4 rounded-lg border-2 border-gray-200 text-sm">
                            <label className="flex items-start cursor-pointer">
                              <input
                                type="checkbox"
                                checked={agreedToTerms}
                                onChange={() => setAgreedToTerms(!agreedToTerms)}
                                className="mt-1 w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-600"
                              />
                              <span className="ml-2 text-xs text-gray-700 leading-relaxed">
                                I agree that Maxtreo may use and share my email to enable
                                personalized advertising and to send me info about new
                                releases, updates, and events.
                              </span>
                            </label>
                          </div>
                          <div className="flex gap-2">
                            <button
                              className="flex-1 py-3 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition-all flex items-center justify-center text-sm"
                              onClick={moveToPreviousField}
                            >
                              <IoArrowBackCircleSharp className="mr-1 text-lg" />
                              Back
                            </button>
                            <button
                              className={`flex-1 py-3 rounded-lg font-semibold transition-all flex items-center justify-center text-sm ${
                                agreedToTerms
                                  ? "bg-blue-600 text-white hover:shadow-lg"
                                  : "bg-gray-200 text-gray-400 cursor-not-allowed"
                              }`}
                              onClick={handleSubmit}
                              disabled={!agreedToTerms || isLoading}
                            >
                              {isLoading ? (
                                <>
                                  <svg
                                    className="animate-spin h-4 w-4 mr-1"
                                    viewBox="0 0 24 24"
                                  >
                                    <circle
                                      className="opacity-25"
                                      cx="12"
                                      cy="12"
                                      r="10"
                                      stroke="currentColor"
                                      strokeWidth="4"
                                      fill="none"
                                    />
                                    <path
                                      className="opacity-75"
                                      fill="currentColor"
                                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                    />
                                  </svg>
                                  Processing...
                                </>
                              ) : (
                                <>
                                  Create Account
                                  <IoArrowForwardCircleSharp className="ml-1 text-lg" />
                                </>
                              )}
                            </button>
                          </div>
                        </motion.div>
                      )}
                      {/* Step 4: OTP for Registration (manual input with digits filter) - Reduced */}
                      {currentField === "otp" && formFieldsVisible.otp && (
                        <motion.div
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          className="text-center space-y-4"
                        >
                          <div className="bg-blue-50 p-3 rounded-lg border border-blue-100 text-sm">
                            <p className="text-xs text-blue-900">
                              We've sent a 6-digit code to <strong>{formData.email}</strong>
                            </p>
                          </div>
                          <input
                            type="text"
                            name="otp"
                            value={formData.otp}
                            onChange={handleOtpChange}
                            maxLength="6"
                            placeholder="000000"
                            className="w-full text-center text-2xl tracking-widest font-bold py-3 border-2 border-gray-200 rounded-lg focus:border-blue-600 focus:outline-none transition-all bg-gray-50 focus:bg-white"
                          />
                          <button
                            className={`w-full py-3 rounded-lg font-semibold transition-all duration-300 text-sm ${
                              formData.otp
                                ? "bg-blue-600 text-white hover:shadow-lg"
                                : "bg-gray-200 text-gray-400 cursor-not-allowed"
                            }`}
                            disabled={!formData.otp}
                            onClick={verifyOTPRegistration}
                          >
                            Verify & Complete
                          </button>
                          <button
                            onClick={handleResendOTP}
                            className="text-blue-600 hover:underline text-xs font-medium"
                          >
                            Didn't receive the code? Resend
                          </button>
                        </motion.div>
                      )}
                      {/* Social Login for Registration - Reduced */}
                      <AnimatePresence mode="wait">
                        {!formFieldsVisible.otp && (
                          <motion.div
                            key="social-login"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="my-6"
                          >
                            {/* OR Divider */}
                            <div className="flex items-center my-4">
                              <div className="flex-grow border-t border-gray-300"></div>
                              <p className="text-center text-gray-500 text-xs uppercase tracking-wider px-3">
                                OR
                              </p>
                              <div className="flex-grow border-t border-gray-300"></div>
                            </div>
                            <div className="flex justify-center">
                              <GoogleLoginComponent />
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
              {/* Footer Link - Reduced */}
              <div className="mt-6 text-center">
                <p className="text-gray-600 text-xs">
                  {isLogin ? "Don't have an account? " : "Already have an account? "}
                  <button
                    onClick={() => {
                      if (isLogin) {
                        setIsLogin(false);
                        resetRegistrationForm();
                      } else {
                        setIsLogin(true);
                        resetLoginForm();
                      }
                    }}
                    className="text-blue-600 font-semibold hover:underline text-xs"
                  >
                    {isLogin ? "Sign Up" : "Sign In"}
                  </button>
                </p>
              </div>
            </div>
            {/* Trust Indicators - Reduced/Hidden in modal for space */}
            {!isModal && (
              <div className="mt-4 flex items-center justify-center space-x-4 text-xs text-gray-500">
                <div className="flex items-center">
                  <IoCheckmarkCircle className="text-green-500 mr-1" />
                  Secure
                </div>
                <div className="flex items-center">
                  <IoCheckmarkCircle className="text-green-500 mr-1" />
                  Encrypted
                </div>
                <div className="flex items-center">
                  <IoCheckmarkCircle className="text-green-500 mr-1" />
                  Private
                </div>
              </div>
            )}
          </motion.div>
        </div>
      );
    }

    // Full-page layout (original, without left image)
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 lg:p-12">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <div className="flex items-center justify-center space-x-1 mb-4">
            <img
              src={maxtreo}
              alt="Maxtreo Logo"
              className="w-20 h-20 object-contain cursor-pointer"
              onClick={() => navigate("/")}
            />
            <h1 className="text-4xl font-bold text-gray-800">Welcome to Maxtreo</h1>
          </div>

          {/* Tab Switcher */}
          <div className="flex bg-gray-100 rounded-full p-1 mb-8">
            <button
              className={`flex-1 py-3 rounded-full font-semibold transition-all duration-300 ${
                isLogin
                  ? "bg-white text-blue-600 shadow-md"
                  : "text-gray-600 hover:text-gray-800"
              }`}
              onClick={() => {
                setIsLogin(true);
                resetLoginForm();
              }}
            >
              Login
            </button>
            <button
              className={`flex-1 py-3 rounded-full font-semibold transition-all duration-300 ${
                !isLogin
                  ? "bg-white text-blue-600 shadow-md"
                  : "text-gray-600 hover:text-gray-800"
              }`}
              onClick={() => {
                setIsLogin(false);
                resetRegistrationForm();
              }}
            >
              Register
            </button>
          </div>
          {/* Alerts */}
          <AnimatePresence>
            {message && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mb-4 p-4 bg-green-50 border border-green-200 text-green-700 rounded-xl flex items-start"
              >
                <IoCheckmarkCircle className="text-xl mr-2 flex-shrink-0 mt-0.5" />
                <span className="text-sm">{message}</span>
              </motion.div>
            )}
            {errorMessage && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mb-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl flex items-start"
              >
                <IoCloseCircle className="text-xl mr-2 flex-shrink-0 mt-0.5" />
                <span className="text-sm">{errorMessage}</span>
              </motion.div>
            )}
          </AnimatePresence>
          {/* Form Content */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <AnimatePresence mode="wait">
              {isLogin ? (
                <motion.div
                  key="login"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  layout
                  className="w-full"
                >
                  <div>
                    <h2 className="text-3xl font-bold mb-2 text-blue-600">
                      Welcome Back
                    </h2>
                    <p className="text-gray-600 mb-8">Sign in to continue your journey</p>
                    <AnimatePresence mode="wait">
                      {showEmailInput && (
                        <motion.div
                          key="email-input"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                        >
                          <div className="relative mb-6 group">
                            <IoMailOutline className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xl group-focus-within:text-blue-600 transition-colors" />
                            <input
                              type="email"
                              name="email"
                              value={formData.email}
                              onChange={handleChange}
                              placeholder="Email address"
                              className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:border-blue-600 focus:outline-none transition-all bg-gray-50 focus:bg-white"
                            />
                          </div>
                          <button
                            onClick={handleSendOTP}
                            className="w-full py-4 bg-blue-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all duration-300 flex items-center justify-center group"
                          >
                            <span>Generate OTP</span>
                            <IoArrowForwardCircleSharp className="ml-2 text-xl group-hover:translate-x-1 transition-transform" />
                          </button>
                        </motion.div>
                      )}
                      {sentingotp && (
                        <motion.div
                          key="otp-input"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="text-center"
                        >
                          <p className="text-gray-600 mb-6">
                            Enter the verification code sent to your email
                          </p>
                          {/* Use OtpInput from working Login component for login flow */}
                          <OtpInput email={formData.email} onSubmit={verifyLoginOTP} />
                          <button
                            onClick={handleResendOTP}
                            className="mt-4 text-blue-600 hover:underline text-sm"
                          >
                            Resend Code
                          </button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                    <AnimatePresence mode="wait">
                      {!sentingotp && (
                        <motion.div
                          key="social-login"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className="my-6"
                        >
                          {/* OR Divider */}
                          <div className="flex items-center my-6">
                            <div className="flex-grow border-t border-gray-300"></div>
                            <p className="text-center text-gray-500 text-sm uppercase tracking-wider px-4">
                              OR
                            </p>
                            <div className="flex-grow border-t border-gray-300"></div>
                          </div>
                          <div className="flex justify-center">
                            <GoogleLoginComponent />
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="register"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  layout
                  className="w-full"
                >
                  <div>
                    {/* Progress Bar */}
                    <div className="mb-8">
                      <div className="flex justify-between mb-3">
                        {[1, 2, 3, 4].map((step) => (
                          <div
                            key={step}
                            className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all duration-300 ${
                              currentStep >= step
                                ? "bg-blue-600 text-white shadow-lg scale-110"
                                : "bg-gray-200 text-gray-400"
                            }`}
                          >
                            {step}
                          </div>
                        ))}
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                          style={{ width: `${calculateProgress()}%` }}
                        ></div>
                      </div>
                    </div>
                    {/* Step Titles */}
                    <motion.div
                      key={currentStep}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mb-8"
                    >
                      <h2 className="text-2xl font-bold text-blue-600 mb-2">
                        {currentStep === 1 && "Basic Information"}
                        {currentStep === 2 && "Secure Your Account"}
                        {currentStep === 3 && "Terms & Conditions"}
                        {currentStep === 4 && "Verify Your Email"}
                      </h2>
                      <p className="text-gray-600 text-sm">
                        {currentStep === 1 && "Let's get started with your details"}
                        {currentStep === 2 && "Create a strong password"}
                        {currentStep === 3 && "Almost there!"}
                        {currentStep === 4 && "Check your inbox for the code"}
                      </p>
                    </motion.div>
                    {/* Step 1: Basic Info */}
                    {currentField === "email" && formFieldsVisible.email && (
                      <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="space-y-4"
                      >
                        <div className="relative group">
                          <IoPersonOutline className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xl group-focus-within:text-blue-600 transition-colors" />
                          <input
                            type="text"
                            name="first_name"
                            value={formData.first_name}
                            onChange={handleChange}
                            placeholder="Full Name"
                            className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:border-blue-600 focus:outline-none transition-all bg-gray-50 focus:bg-white"
                          />
                        </div>
                        <div className="relative group">
                          <IoMailOutline className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xl group-focus-within:text-blue-600 transition-colors" />
                          <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="Email address"
                            className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:border-blue-600 focus:outline-none transition-all bg-gray-50 focus:bg-white"
                          />
                        </div>
                        <div className="relative group">
                          <IoCallOutline className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xl group-focus-within:text-blue-600 transition-colors" />
                          <input
                            type="tel"
                            name="phone_number"
                            value={formData.phone_number}
                            onChange={handlePhoneChange}
                            placeholder="Phone number"
                            className={`w-full pl-12 pr-4 py-4 border-2 rounded-xl focus:outline-none transition-all bg-gray-50 focus:bg-white ${
                              phoneError
                                ? "border-red-500 focus:border-red-500"
                                : "border-gray-200 focus:border-blue-600"
                            }`}
                          />
                          {phoneError && (
                            <p className="text-red-500 text-xs mt-1 ml-1">{phoneError}</p>
                          )}
                        </div>
                        <button
                          disabled={
                            !(
                              isFieldValid("email") &&
                              isFieldValid("phone_number") &&
                              isFieldValid("first_name") &&
                              isValidPhoneNumber(formData.phone_number)
                            )
                          }
                          className={`w-full py-4 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center group ${
                            isFieldValid("email") &&
                            isFieldValid("phone_number") &&
                            isFieldValid("first_name") &&
                            isValidPhoneNumber(formData.phone_number)
                              ? "bg-blue-600 text-white hover:shadow-lg"
                              : "bg-gray-200 text-gray-400 cursor-not-allowed"
                          }`}
                          onClick={moveToNextField}
                        >
                          <span>Continue</span>
                          <IoArrowForwardCircleSharp className="ml-2 text-xl group-hover:translate-x-1 transition-transform" />
                        </button>
                      </motion.div>
                    )}
                    {/* Step 2: Password */}
                    {currentField === "password" && formFieldsVisible.password && (
                      <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="space-y-4"
                      >
                        <div className="relative group">
                          <IoLockClosedOutline className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xl group-focus-within:text-blue-600 transition-colors" />
                          <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="Create password"
                            className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:border-blue-600 focus:outline-none transition-all bg-gray-50 focus:bg-white"
                          />
                        </div>
                        {showValidation && (
                          <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
                            <p className="text-sm font-semibold mb-3 text-blue-900">
                              Password must contain:
                            </p>
                            <div className="space-y-2">
                              {[
                                { key: "hasMinLength", text: "At least 8 characters" },
                                { key: "hasNumber", text: "At least one number" },
                                { key: "hasSpecialChar", text: "At least one special character" },
                              ].map(({ key, text }) => (
                                <div
                                  key={key}
                                  className={`flex items-center text-sm ${
                                    validationState[key]
                                      ? "text-green-600"
                                      : "text-gray-500"
                                  }`}
                                >
                                  {validationState[key] ? (
                                    <IoCheckmarkCircle className="mr-2 text-lg" />
                                  ) : (
                                    <div className="w-2 h-2 rounded-full bg-gray-300 mr-2"></div>
                                  )}
                                  {text}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                        <div className="relative group">
                          <IoLockClosedOutline className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xl group-focus-within:text-blue-600 transition-colors" />
                          <input
                            type="password"
                            name="cpassword"
                            value={formData.cpassword}
                            onChange={handleChange}
                            placeholder="Confirm password"
                            className={`w-full pl-12 pr-4 py-4 border-2 rounded-xl focus:outline-none transition-all bg-gray-50 focus:bg-white ${
                              formData.cpassword && !validationState.passwordsMatch
                                ? "border-red-500 focus:border-red-500"
                                : "border-gray-200 focus:border-blue-600"
                            }`}
                          />
                          {formData.cpassword && !validationState.passwordsMatch && (
                            <p className="text-red-500 text-xs mt-1">
                              Passwords don't match
                            </p>
                          )}
                        </div>
                        <div className="flex gap-3">
                          <button
                            className="flex-1 py-4 bg-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-300 transition-all flex items-center justify-center"
                            onClick={moveToPreviousField}
                          >
                            <IoArrowBackCircleSharp className="mr-2 text-xl" />
                            Back
                          </button>
                          <button
                            className={`flex-1 py-4 rounded-xl font-semibold transition-all flex items-center justify-center ${
                              isFormValid()
                                ? "bg-blue-600 text-white hover:shadow-lg"
                                : "bg-gray-200 text-gray-400 cursor-not-allowed"
                            }`}
                            onClick={moveToNextField}
                            disabled={!isFormValid()}
                          >
                            Continue
                            <IoArrowForwardCircleSharp className="ml-2 text-xl" />
                          </button>
                        </div>
                      </motion.div>
                    )}
                    {/* Step 3: Terms */}
                    {currentField === "terms" && formFieldsVisible.terms && (
                      <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="space-y-6"
                      >
                        <div className="bg-gray-50 p-6 rounded-xl border-2 border-gray-200">
                          <label className="flex items-start cursor-pointer">
                            <input
                              type="checkbox"
                              checked={agreedToTerms}
                              onChange={() => setAgreedToTerms(!agreedToTerms)}
                              className="mt-1 w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-600"
                            />
                            <span className="ml-3 text-sm text-gray-700 leading-relaxed">
                              I agree that Maxtreo may use and share my email to enable
                              personalized advertising and to send me info about new
                              releases, updates, and events.
                            </span>
                          </label>
                        </div>
                        <div className="flex gap-3">
                          <button
                            className="flex-1 py-4 bg-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-300 transition-all flex items-center justify-center"
                            onClick={moveToPreviousField}
                          >
                            <IoArrowBackCircleSharp className="mr-2 text-xl" />
                            Back
                          </button>
                          <button
                            className={`flex-1 py-4 rounded-xl font-semibold transition-all flex items-center justify-center ${
                              agreedToTerms
                                ? "bg-blue-600 text-white hover:shadow-lg"
                                : "bg-gray-200 text-gray-400 cursor-not-allowed"
                            }`}
                            onClick={handleSubmit}
                            disabled={!agreedToTerms || isLoading}
                          >
                            {isLoading ? (
                              <>
                                <svg
                                  className="animate-spin h-5 w-5 mr-2"
                                  viewBox="0 0 24 24"
                                >
                                  <circle
                                    className="opacity-25"
                                    cx="12"
                                    cy="12"
                                    r="10"
                                    stroke="currentColor"
                                    strokeWidth="4"
                                    fill="none"
                                  />
                                  <path
                                    className="opacity-75"
                                    fill="currentColor"
                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                  />
                                </svg>
                                Processing...
                              </>
                            ) : (
                              <>
                                Create Account
                                <IoArrowForwardCircleSharp className="ml-2 text-xl" />
                              </>
                            )}
                          </button>
                        </div>
                      </motion.div>
                    )}
                    {/* Step 4: OTP for Registration (manual input with digits filter) */}
                    {currentField === "otp" && formFieldsVisible.otp && (
                      <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="text-center space-y-6"
                      >
                        <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
                          <p className="text-sm text-blue-900">
                            We've sent a 6-digit code to <strong>{formData.email}</strong>
                          </p>
                        </div>
                        <input
                          type="text"
                          name="otp"
                          value={formData.otp}
                          onChange={handleOtpChange}
                          maxLength="6"
                          placeholder="000000"
                          className="w-full text-center text-3xl tracking-widest font-bold py-4 border-2 border-gray-200 rounded-xl focus:border-blue-600 focus:outline-none transition-all bg-gray-50 focus:bg-white"
                        />
                        <button
                          className={`w-full py-4 rounded-xl font-semibold transition-all duration-300 ${
                            formData.otp
                              ? "bg-blue-600 text-white hover:shadow-lg"
                              : "bg-gray-200 text-gray-400 cursor-not-allowed"
                          }`}
                          disabled={!formData.otp}
                          onClick={verifyOTPRegistration}
                        >
                          Verify & Complete
                        </button>
                        <button
                          onClick={handleResendOTP}
                          className="text-blue-600 hover:underline text-sm font-medium"
                        >
                          Didn't receive the code? Resend
                        </button>
                      </motion.div>
                    )}
                    {/* Social Login for Registration */}
                    <AnimatePresence mode="wait">
                      {!formFieldsVisible.otp && (
                        <motion.div
                          key="social-login"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className="my-8"
                        >
                          {/* OR Divider */}
                          <div className="flex items-center my-6">
                            <div className="flex-grow border-t border-gray-300"></div>
                            <p className="text-center text-gray-500 text-sm uppercase tracking-wider px-4">
                              OR
                            </p>
                            <div className="flex-grow border-t border-gray-300"></div>
                          </div>
                          <div className="flex justify-center">
                            <GoogleLoginComponent />
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            {/* Footer Link */}
            <div className="mt-8 text-center">
              <p className="text-gray-600 text-sm">
                {isLogin ? "Don't have an account? " : "Already have an account? "}
                <button
                  onClick={() => {
                    if (isLogin) {
                      setIsLogin(false);
                      resetRegistrationForm();
                    } else {
                      setIsLogin(true);
                      resetLoginForm();
                    }
                  }}
                  className="text-blue-600 font-semibold hover:underline"
                >
                  {isLogin ? "Sign Up" : "Sign In"}
                </button>
              </p>
            </div>
          </div>
          {/* Trust Indicators */}
          <div className="mt-6 flex items-center justify-center space-x-6 text-xs text-gray-500">
            <div className="flex items-center">
              <IoCheckmarkCircle className="text-green-500 mr-1" />
              Secure
            </div>
            <div className="flex items-center">
              <IoCheckmarkCircle className="text-green-500 mr-1" />
              Encrypted
            </div>
            <div className="flex items-center">
              <IoCheckmarkCircle className="text-green-500 mr-1" />
              Private
            </div>
          </div>
        </motion.div>
      </div>
    );
  };
  export default ModernLoginForm;