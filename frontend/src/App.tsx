import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from './api/client';
import BillUploadForm from './components/BillUploadForm';
import BillDashboard from './components/BillDashboard'; 
import Login from './components/Login';

function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));

  const { data: clubs, isLoading, isError } = useQuery({
    queryKey: ['clubs'],
    queryFn: async () => {
      const response = await apiClient.get('/clubs/');
      return response.data;
    },
    enabled: !!token, // Only fetch data if logged in
  });

  if (!token) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
        <Login onLoginSuccess={() => setToken(localStorage.getItem('token'))} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 font-sans pb-16">
      <nav className="bg-blue-900 text-white shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-blue-600 rounded-lg flex items-center justify-center font-bold text-white">TB</div>
              <span className="font-bold text-xl tracking-tight">TeamBill Tracker</span>
            </div>
            <button 
              onClick={() => { localStorage.clear(); setToken(null); }}
              className="text-sm font-semibold bg-red-600 px-3 py-1.5 rounded-md hover:bg-red-700 transition-colors"
            >
              Sign Out
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-5xl mx-auto py-10 px-4 sm:px-6 lg:px-8 flex flex-col gap-12">
        <section className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex justify-between items-center">
          <div>
            <span className="text-xs font-bold text-blue-600 uppercase tracking-widest bg-blue-50 px-2.5 py-1 rounded-md">Logged-in User</span>
            <h2 className="text-2xl font-black text-slate-900 mt-1">
              {localStorage.getItem('name') || 'Team Member'} <span className="text-slate-400 font-normal text-sm">({localStorage.getItem('role')})</span>
            </h2>
          </div>
        </section>

        <section className="w-full">
          <BillUploadForm />
        </section>

        <div className="relative flex py-2 items-center">
          <div className="flex-grow border-t border-slate-300"></div>
          <span className="flex-shrink mx-4 text-slate-400 text-xs font-bold uppercase tracking-wider">Expense Archive</span>
          <div className="flex-grow border-t border-slate-300"></div>
        </div>

        <section className="w-full">
          <BillDashboard clubId={Number(localStorage.getItem('club_id')) || 1} />
        </section>
      </main>
    </div>
  );
}

export default App;