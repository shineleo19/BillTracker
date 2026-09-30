import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../api/client';
import axios from 'axios';

// Your live Cloudinary credentials are injected here
const CLOUDINARY_URL = 'https://api.cloudinary.com/v1_1/dulyreh32/image/upload';
const UPLOAD_PRESET = 'billtracker_preset';

export default function BillUploadForm() {
  const { register, handleSubmit, reset } = useForm();
  const [uploading, setUploading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (newBill: any) => apiClient.post('/bills/', newBill),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bills'] });
      reset();
      setImageFile(null);
      alert('Bill uploaded successfully!');
    },
  });

  const onSubmit = async (data: any) => {
    if (!imageFile) {
      alert('Please select a bill image first.');
      return;
    }

    try {
      setUploading(true);
      
      const formData = new FormData();
      formData.append('file', imageFile);
      formData.append('upload_preset', UPLOAD_PRESET);

      const cloudinaryRes = await axios.post(CLOUDINARY_URL, formData);
      const imageUrl = cloudinaryRes.data.secure_url;

      const billPayload = {
        club_id: 1, 
        uploaded_by: 1, 
        material_name: data.material_name,
        vendor: data.vendor,
        invoice_number: data.invoice_number,
        quantity: parseInt(data.quantity),
        price: parseFloat(data.price),
        gst: parseFloat(data.gst),
        total: (parseFloat(data.price) * parseInt(data.quantity)) + parseFloat(data.gst),
        purchase_date: data.purchase_date,
        category: data.category,
        project_phase: data.project_phase,
        bill_image: imageUrl, 
        description: data.description || "No description",
      };

      mutation.mutate(billPayload);
    } catch (error) {
      console.error('Upload failed:', error);
      alert('Failed to upload bill.');
    } finally {
      setUploading(false);
    }
  };

  // Shared professional input styling
  const inputStyle = "mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 sm:text-sm bg-white";
  const labelStyle = "block text-sm font-medium text-gray-700";

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
        <h2 className="text-lg font-bold text-gray-900">Upload New Expense Bill</h2>
        <p className="text-sm text-gray-500">Enter the purchase details and attach the official invoice.</p>
      </div>
      
      <form onSubmit={handleSubmit(onSubmit)} className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className={labelStyle}>Material Name</label>
            <input {...register('material_name', { required: true })} placeholder="e.g., Brake Calipers" className={inputStyle} />
          </div>
          <div>
            <label className={labelStyle}>Vendor</label>
            <input {...register('vendor', { required: true })} placeholder="e.g., Brembo" className={inputStyle} />
          </div>
          <div>
            <label className={labelStyle}>Invoice Number</label>
            <input {...register('invoice_number', { required: true })} placeholder="INV-2026-001" className={inputStyle} />
          </div>
          <div>
            <label className={labelStyle}>Category</label>
            <select {...register('category', { required: true })} className={inputStyle}>
              <option value="Mechanical">Mechanical</option>
              <option value="Electrical">Electrical</option>
              <option value="Electronics">Electronics</option>
              <option value="Raw Materials">Raw Materials</option>
              <option value="Transportation">Transportation</option>
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelStyle}>Quantity</label>
              <input type="number" {...register('quantity', { required: true })} placeholder="0" className={inputStyle} />
            </div>
            <div>
              <label className={labelStyle}>Base Price (₹)</label>
              <input type="number" step="0.01" {...register('price', { required: true })} placeholder="0.00" className={inputStyle} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelStyle}>GST (₹)</label>
              <input type="number" step="0.01" {...register('gst', { required: true })} placeholder="0.00" className={inputStyle} />
            </div>
            <div>
              <label className={labelStyle}>Purchase Date</label>
              <input type="date" {...register('purchase_date', { required: true })} className={inputStyle} />
            </div>
          </div>
          <div className="md:col-span-2">
            <label className={labelStyle}>Project Phase</label>
            <input {...register('project_phase', { required: true })} placeholder="e.g., Prototype Testing" className={inputStyle} />
          </div>
        </div>

        <div className="mb-6 p-4 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50 text-center">
          <label className="block text-sm font-semibold text-gray-700 mb-2">Upload Invoice Image (Max 10MB)</label>
          <input 
            type="file" 
            accept="image/jpeg, image/png, application/pdf" 
            onChange={(e) => setImageFile(e.target.files ? e.target.files[0] : null)}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700 cursor-pointer mx-auto"
          />
        </div>

        <button 
          type="submit" 
          disabled={uploading}
          className="w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-md hover:bg-blue-700 disabled:bg-gray-400 transition-colors shadow-sm"
        >
          {uploading ? 'Uploading & Processing...' : 'Submit Expense Report'}
        </button>
      </form>
    </div>
  );
}