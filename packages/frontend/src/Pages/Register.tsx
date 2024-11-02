import React from "react";
import RegisterForm from "../Components/Forms/RegisterForm";

const RegisterPage : React.FC = () => {
  return (
      <>
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <RegisterForm />
      </div>
      </>
  );
}

export default RegisterPage;