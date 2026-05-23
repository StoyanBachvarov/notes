import { logout } from "../actions";

export default function LogoutPage() {
  return (
    <div className="max-w-md mx-auto mt-16 bg-white p-8 rounded-lg shadow-sm border border-gray-200 text-center">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Log Out</h1>
      <p className="mb-6 text-gray-600">Are you sure you want to log out?</p>
      <form action={logout}>
        <button 
          type="submit" 
          className="bg-red-600 text-white px-6 py-2 rounded-md hover:bg-red-700"
        >
          Confirm Log Out
        </button>
      </form>
    </div>
  );
}