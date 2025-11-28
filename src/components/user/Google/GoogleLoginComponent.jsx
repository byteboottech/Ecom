import React from "react";
import { useState } from 'react';
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
// import { jwtDecode } from "jwt-decode";
// import axios from "axios";
import { googleAuth, getUserInfo } from "../../../Services/userApi";
import { useAuth } from "../../../Context/UserContext";
import { useNavigate } from "react-router-dom";
const GoogleLoginComponent = ({ onLoginSuccess }) => {
  const { setToken } = useAuth();
  const navigate = useNavigate();
  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState(''); // 'error' or 'success'
  
  // Handle Google login
  const handleGoogleLogin = async (credentialResponse) => {
    try {
      // Clear any previous alert messages
      setAlertMessage('');
      
      // credentialResponse.credential is the JWT token
      const token = credentialResponse.credential;
      const response = await googleAuth(token);
      console.log("response of google login:", response);
      
      // Handle the response from your backend
      const data = response.data;
      
      // Store tokens
      localStorage.setItem("refresh", data.refresh);
      setToken(data.access);
      
      // Show success message
      setAlertType('success');
      setAlertMessage('Login successful!');
      
      // If there's a callback function, call it
      if (onLoginSuccess) {
        onLoginSuccess(data);
      }

      // NEW: Fetch user info to get role (since googleAuth may not include it)
      try {
        const userInfoResponse = await getUserInfo(data.access); // Pass access token to getUserInfo
        const userData = userInfoResponse.data;
        console.log("User info from getUserInfo:", userData);
        
        // Check role for admin redirect
        const userRole = userData.role?.toLowerCase().trim();
        setTimeout(() => { // Brief delay for UX
          if (userRole === "admin") {
            navigate("/admin/dashboard");
          } else {
            navigate("/");
          }
        }, 1000);
      } catch (userInfoError) {
        console.error("Error fetching user info:", userInfoError);
        // Fallback: Redirect to home if user info fetch fails
        setTimeout(() => {
          navigate("/");
        }, 1000);
      }
      
    } catch (error) {
      console.error("Error during Google authentication:", error);
      
      // Handle specific error cases
      if (error.response?.data?.is_active === false) {
        setAlertType('error');
        setAlertMessage("This account is inactive. Please contact administrator.");
      } else {
        setAlertType('error');
        setAlertMessage(error.response?.data?.error || "Authentication failed. This account is inactive. Please contact administrator.");
      }
    }
  };

  return (
    <div className="flex flex-col">
      {/* Alert message */}
      {alertMessage && (
        <div 
          className={`mb-4 p-3 rounded text-center ${
            alertType === 'error' 
              ? 'bg-red-100 text-red-700 border border-red-400' 
              : 'bg-green-100 text-green-700 border border-green-400'
          }`}
        >
          {alertMessage}
        </div>
      )}
      
      <GoogleOAuthProvider clientId="752728323430-85geretfsn5f7ino654hcqolnrm955c3.apps.googleusercontent.com">
        <div className="flex justify-center">
          <GoogleLogin
            onSuccess={handleGoogleLogin}
            onError={() => {
              setAlertType('error');
              setAlertMessage("Google login failed. Please try again.");
            }}
            useOneTap
            shape="rectangular"
            text="continue_with"
            theme="filled_blue"
            size="large"
            width="100%"
          />
        </div>
      </GoogleOAuthProvider>
    </div>
  );
};

export default GoogleLoginComponent;