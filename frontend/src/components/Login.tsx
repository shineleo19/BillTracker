import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { apiClient } from '../api/client';

interface LoginFormInputs {
  email: string;
  password: string;
}

export default function Login({ onLoginSuccess }: { onLoginSuccess: () => void }) {
  const { register, handleSubmit } = useForm<LoginFormInputs>();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const onSubmit = async (data: LoginFormInputs) => {
    try {
      setLoading(true);
      setError('');
      const response = await apiClient.post('/login', data);
      
      // Save JWT token and user metadata locally
      localStorage.setItem('token', response.data.access_token);
      localStorage.setItem('role', response.data.role);
      localStorage.setItem('club_id', response.data.club_id);
      localStorage.setItem('name', response.data.name);

      alert(`Welcome back, ${response.data.name}!`);
      onLoginSuccess();
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 max-w-md mx-auto mt-12">
      <div className="mb-6">
        <h2 className="text-2xl font-black text-slate-900">Team Portal Login</h2>
        <p className="text-sm text-slate-500 mt-1">Sign in with your role credentials to manage team expenses.</p>
      </div>

      {error && (
        <div className="mb-4 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm font-medium">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
          <input 
            type="email" 
            {...register('email', { required: true })} 
            placeholder="captain@bajateam.com" 
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-slate-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 sm:text-sm bg-white"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
          <input 
            type="password" 
            {...register('password', { required: true })} 
            placeholder="••••••••" 
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-slate-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 sm:text-sm bg-white"
          />
        </div>

        <button 
          type="submit" 
          disabled={loading}
          className="w-full bg-blue-600 text-white font-bold py-2.5 px-4 rounded-md hover:bg-blue-700 disabled:bg-slate-400 transition-colors shadow-sm mt-2"
        >
          {loading ? 'Authenticating...' : 'Sign In'}
        </button>
      </form>
    </div>
  );
}