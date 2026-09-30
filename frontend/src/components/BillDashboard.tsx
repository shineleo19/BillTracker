import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../api/client';

export default function BillDashboard({ clubId }: { clubId: number }) {
  const { data: bills, isLoading, isError } = useQuery({
    queryKey: ['bills', clubId],
    queryFn: async () => {
      const response = await apiClient.get(`/bills/club/${clubId}`);
      return response.data;
    },
  });

  if (isLoading) return <p className="text-gray-500 mt-8">Loading team bills...</p>;
  if (isError) return <p className="text-gray-500 mt-8">No bills uploaded yet or backend offline.</p>;

  // Calculate the total expense dynamically
  const totalExpense = bills?.reduce((acc: number, bill: any) => acc + bill.total, 0) || 0;

  return (
    <div className="mt-12 w-full max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-gray-800">Team Expenses Gallery</h2>
        <div className="bg-green-100 text-green-800 px-6 py-3 rounded-lg font-extrabold text-2xl shadow-sm">
          Total: ₹{totalExpense.toFixed(2)}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {bills?.map((bill: any) => (
          <div key={bill.id} className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-100 hover:shadow-lg transition-shadow">
            {/* Image Container */}
            <div className="h-48 w-full bg-gray-50 border-b overflow-hidden relative">
              {bill.bill_image ? (
                <img 
                  src={bill.bill_image} 
                  alt={bill.material_name} 
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="flex items-center justify-center h-full text-gray-400">No Image</div>
              )}
              <div className="absolute top-2 right-2 bg-blue-600 text-white text-xs px-2 py-1 rounded shadow">
                {bill.status}
              </div>
            </div>
            
            {/* Bill Details */}
            <div className="p-4">
              <h3 className="text-xl font-bold text-gray-800 truncate mb-1">{bill.material_name}</h3>
              <p className="text-sm text-gray-600 mb-3">Vendor: {bill.vendor}</p>
              
              <div className="space-y-1 mb-4 text-sm text-gray-500">
                <p>Date: {bill.purchase_date}</p>
                <p>Inv: #{bill.invoice_number}</p>
              </div>

              <div className="flex justify-between items-end mt-4 pt-4 border-t border-gray-100">
                <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">{bill.category}</span>
                <span className="font-black text-lg text-gray-900">₹{bill.total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}