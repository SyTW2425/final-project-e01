import React from 'react';

const redirectToLogin = () : boolean => {
  window.location.href = '/login';
  return true;
}

let HomePage : React.FC = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      { !localStorage.getItem('token') && redirectToLogin() }
      <h1 className="text-4xl font-bold text-gray-700">Home Page</h1>
    </div>
  );
}

export default HomePage;