"use client";

import { useActionState } from "react";
import { register } from "../actions";
import Link from "next/link";

export function RegisterForm() {
  const [state, action, isPending] = useActionState(async (prevState: any, formData: FormData) => {
    try {
      await register(formData);
      return { success: true };
    } catch (e: any) {
      if (e.message === 'NEXT_REDIRECT') throw e; // Let Next.js properly handle navigation
      return { error: e.message || "An error occurred" };
    }
  }, null);

  return (
    <form action={action} className="space-y-6">
      {state?.error && (
        <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm">
          {state.error}
        </div>
      )}
      
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
          Email address
        </label>
        <input 
          type="email" 
          id="email" 
          name="email" 
          required 
          className="w-full border border-gray-300 rounded-md px-3 py-2"
        />
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
          Password
        </label>
        <input 
          type="password" 
          id="password" 
          name="password" 
          required 
          className="w-full border border-gray-300 rounded-md px-3 py-2"
        />
      </div>

      <button 
        type="submit" 
        disabled={isPending}
        className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
      >
        {isPending ? "Registering..." : "Register"}
      </button>

      <div className="text-center text-sm text-gray-600">
        Already have an account?{" "}
        <Link href="/login" className="text-blue-600 hover:text-blue-800">
          Log In
        </Link>
      </div>
    </form>
  );
}