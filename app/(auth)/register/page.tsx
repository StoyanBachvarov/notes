import { RegisterForm } from "./RegisterForm";

export default function RegisterPage() {
  return (
    <div className="max-w-md mx-auto mt-16 bg-white p-8 rounded-lg shadow-sm border border-gray-200">
      <h1 className="text-3xl font-bold text-gray-900 mb-6 text-center">Register</h1>
      <RegisterForm />
    </div>
  );
}