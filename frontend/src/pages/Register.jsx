// src/pages/Register.jsx
import RegisterForm from '../components/auth/RegisterForm';

const Register = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-md mx-auto py-12">
        <RegisterForm />
      </div>
    </div>
  );
};

export default Register;