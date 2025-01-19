// src/pages/Login.jsx
import LoginForm from '../components/auth/LoginForm';

const Login = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-md mx-auto py-12">
        <LoginForm />
      </div>
    </div>
  );
};

export default Login;