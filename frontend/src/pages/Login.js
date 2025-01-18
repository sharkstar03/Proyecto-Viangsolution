import React from 'react';

const Login = () => {
  return (
    <div className="login-container">
      <h1 className="text-center text-2xl font-bold">Login</h1>
      <form className="login-form" action="/" method="POST">
        <div className="form-group">
          <label htmlFor="username" className="block text-sm font-medium">Username</label>
          <input
            type="text"
            id="username"
            name="username"
            className="block w-full p-2 border border-gray-300 rounded-md"
            placeholder="Enter your username"
          />
        </div>
        <div className="form-group mt-4">
          <label htmlFor="password" className="block text-sm font-medium">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            className="block w-full p-2 border border-gray-300 rounded-md"
            placeholder="Enter your password"
          />
        </div>
        <button
          type="submit"
          className="mt-6 w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600"
        >
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;
