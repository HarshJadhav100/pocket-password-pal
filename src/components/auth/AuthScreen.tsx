
import { useState } from "react";
import SignInForm from "./SignInForm";
import SignUpForm from "./SignUpForm";
import { motion } from "framer-motion";

const AuthScreen = () => {
  const [isSignIn, setIsSignIn] = useState(true);

  const toggleForm = () => {
    setIsSignIn(!isSignIn);
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center p-4 bg-gradient-to-br from-brand-50 to-brand-100">
      <div className="w-full max-w-md mx-auto mb-8">
        <motion.div 
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <h1 className="text-4xl font-bold text-brand-800 mb-2">
            Pocket Password Pal
          </h1>
          <p className="text-brand-600">Your secure password manager</p>
        </motion.div>
      </div>
      
      <motion.div
        key={isSignIn ? "signin" : "signup"}
        initial={{ opacity: 0, x: isSignIn ? -20 : 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: isSignIn ? 20 : -20 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-md"
      >
        {isSignIn ? (
          <SignInForm onSwitch={toggleForm} />
        ) : (
          <SignUpForm onSwitch={toggleForm} />
        )}
      </motion.div>
    </div>
  );
};

export default AuthScreen;
