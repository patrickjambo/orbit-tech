'use client';

import { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Plus, Trash2, Image as ImageIcon, Save } from 'lucide-react';
import { useRouter } from 'next/navigation';

const productSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters").max(200),
  category: z.string().min(1, "Please select a category"),
  brand: z.string().min(1, "Brand is required"),
  sku: z.string().optional(),
  description: z.string().min(10, "Description is required"),
  price_rwf: z.coerce.number().min(0, "Price must be positive"),
  price_usd: z.coerce.number().optional(),
  stock_quantity: z.coerce.number().min(0, "Stock quantity must be zero or more").default(1),
  featured: z.boolean().default(false),
  specifications: z.array(z.object({ key: z.string(), value: z.string() })).optional(),
});

type ProductFormValues = z.infer<typeof productSchema>;

export default function ProductForm({ initialData }: { initialData?: Record<string, unknown> }) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [existingImages, setExistingImages] = useState<string[]>(initialData?.images && Array.isArray(initialData.images) ? (initialData.images as string[]) : []);
  const [removeImages, setRemoveImages] = useState<string[]>([]);
  
  // Transform object spec into array for form editing
  const defaultSpecs = initialData?.specifications && typeof initialData.specifications === 'object'
    ? Object.entries(initialData.specifications).map(([key, value]) => ({ key, value: String(value) }))
    : [{ key: '', value: '' }];

  const { register, control, handleSubmit, formState: { errors } } = useForm<ProductFormValues>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(productSchema) as any,
    defaultValues: initialData ? {
      name: String(initialData.name || ''),
      category: String(initialData.category || ''),
      brand: String(initialData.brand || ''),
      sku: initialData.sku ? String(initialData.sku) : undefined,
      description: String(initialData.description || ''),
      price_rwf: Number(initialData.price_rwf || 0),
      price_usd: initialData.price_usd ? Number(initialData.price_usd) : undefined,
      stock_quantity: initialData.stock_quantity ? Number(initialData.stock_quantity) : (initialData.in_stock ? 1 : 0),
      featured: Boolean(initialData.featured ?? false),
      specifications: defaultSpecs
    } : {
      stock_quantity: 1,
      featured: false,
      specifications: [{ key: '', value: '' }]
    }
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "specifications"
  });

  const onSubmit = async (data: ProductFormValues) => {
    setIsSubmitting(true);
    try {
      // prepare image payloads (convert selectedFiles to base64 data urls)
      const imagesPayload: string[] = [];
      // include any new previews (they already are data urls)
      imagesPayload.push(...previewUrls);

      // if editing (has id), call PATCH endpoint
      const isEdit = !!(initialData && 'id' in initialData && initialData.id);
      const url = isEdit ? `/api/admin/products/${String(initialData.id)}` : '/api/admin/products';
      const method = isEdit ? 'PATCH' : 'POST';

      const bodyToSend: Record<string, unknown> = {
        ...data,
        images: imagesPayload,
      };
      if (isEdit) bodyToSend.removeImages = removeImages;

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bodyToSend),
      });
      
      if (!response.ok) {
        throw new Error('Failed to save product');
      }
      
      alert("Product saved successfully!");
      router.push('/admin/products');
      router.refresh();
    } catch (error) {
      console.error(error);
      alert("An error occurred while saving the product.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // file input helpers
  const onFilesSelected = (files: FileList | null) => {
    if (!files) return;
    const arr = Array.from(files);
    setSelectedFiles((s) => s.concat(arr));
    // create previews
    arr.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setPreviewUrls((p) => p.concat(result));
      };
      reader.readAsDataURL(file);
    });
  };

  const removeExistingImage = (url: string) => {
    setExistingImages((prev) => prev.filter((u) => u !== url));
    setRemoveImages((r) => r.concat(url));
  };

  const removePreview = (idx: number) => {
    setPreviewUrls((p) => p.filter((_, i) => i !== idx));
    setSelectedFiles((s) => s.filter((_, i) => i !== idx));
  };

  const categories = [
    { id: 'computers', name: 'Computers & Main Devices' },
    { id: 'displays', name: 'Display & Output' },
    { id: 'networking', name: 'Networking Devices' },
    { id: 'security', name: 'Security & Surveillance' },
    { id: 'storage', name: 'Storage Devices' },
    { id: 'accessories', name: 'Accessories' }
  ];

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left Column - Main Details */}
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Product Name *</label>
            <input 
              {...register('name')}
              className="w-full px-4 py-2.5 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="e.g. Dell XPS 15 9530"
            />
            {errors.name && <p className="text-error text-sm mt-1">{errors.name.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Category *</label>
              <select 
                {...register('category')}
                className="w-full px-4 py-2.5 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary bg-white"
              >
                <option value="">Select a category</option>
                {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
              </select>
              {errors.category && <p className="text-error text-sm mt-1">{errors.category.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Brand *</label>
              <input 
                {...register('brand')}
                className="w-full px-4 py-2.5 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="e.g. Dell"
              />
              {errors.brand && <p className="text-error text-sm mt-1">{errors.brand.message}</p>}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Price (RWF) *</label>
              <input 
                type="number"
                {...register('price_rwf')}
                className="w-full px-4 py-2.5 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="e.g. 1500000"
              />
              {errors.price_rwf && <p className="text-error text-sm mt-1">{errors.price_rwf.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Price (USD)</label>
              <input 
                type="number"
                {...register('price_usd')}
                className="w-full px-4 py-2.5 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="e.g. 1200"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">SKU / Model No.</label>
            <input 
              {...register('sku')}
              className="w-full px-4 py-2.5 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="e.g. DXPS-15-9530"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Description *</label>
            <textarea 
              {...register('description')}
              rows={5}
              className="w-full px-4 py-2.5 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary resize-none"
              placeholder="Full product description..."
            />
            {errors.description && <p className="text-error text-sm mt-1">{errors.description.message}</p>}
          </div>
          
          <div className="flex gap-8 p-4 bg-gray-50 rounded-lg border border-gray-200 mt-4">
            <div className="flex items-center gap-3">
              <label className="text-sm font-medium text-slate-700">Stock Quantity</label>
              <input 
                type="number" 
                {...register('stock_quantity')} 
                className="w-24 px-3 py-1.5 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary" 
              />
              {errors.stock_quantity && <p className="text-error text-xs">{errors.stock_quantity.message}</p>}
            </div>
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" {...register('featured')} className="w-5 h-5 text-primary rounded" />
              <span className="font-medium text-slate-700">Featured on Homepage</span>
            </label>
          </div>
        </div>

        {/* Right Column - Images & Specs */}
        <div className="space-y-8">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center gap-2">
              <ImageIcon size={18} /> Product Images
            </label>
            <div
              className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer"
              onClick={() => document.getElementById('product-images-input')?.click()}
            >
              <Plus className="w-8 h-8 text-slate-400 mx-auto mb-2" />
              <p className="text-sm text-slate-500 font-medium">Click to upload images</p>
              <p className="text-xs text-slate-400 mt-1">Supports JPG, PNG (Max 5MB)</p>
              <input
                id="product-images-input"
                type="file"
                accept="image/*"
                multiple
                onChange={(e) => onFilesSelected(e.target.files)}
                className="hidden"
              />
            </div>
            <p className="text-xs text-amber-600 mt-2 italic">Note: Cloudinary uploading will be enabled once API keys are active.</p>

            {/* Thumbnails: existing uploaded images (from DB) */}
            {existingImages.length > 0 && (
              <div className="mt-4 grid grid-cols-4 gap-3">
                {existingImages.map((url) => (
                  <div key={url} className="relative border rounded overflow-hidden">
                    <img src={url} alt="existing" className="w-full h-24 object-cover" />
                    <button
                      type="button"
                      onClick={() => removeExistingImage(url)}
                      className="absolute top-1 right-1 bg-white/80 p-1 rounded-full text-sm text-error"
                      title="Remove"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Thumbnails: previews for newly selected files */}
            {previewUrls.length > 0 && (
              <div className="mt-4 grid grid-cols-4 gap-3">
                {previewUrls.map((p, idx) => (
                  <div key={p + idx} className="relative border rounded overflow-hidden">
                    <img src={p} alt={`preview-${idx}`} className="w-full h-24 object-cover" />
                    <button
                      type="button"
                      onClick={() => removePreview(idx)}
                      className="absolute top-1 right-1 bg-white/80 p-1 rounded-full text-sm text-error"
                      title="Remove"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div>
             <div className="flex justify-between items-center mb-2">
               <label className="block text-sm font-medium text-slate-700">Specifications (Key-Value)</label>
             </div>
             <div className="space-y-3">
               {fields.map((field, index) => (
                 <div key={field.id} className="flex gap-3">
                   <input
                     {...register(`specifications.${index}.key` as const)}
                     placeholder="e.g. RAM"
                     className="w-[40%] px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                   />
                   <input
                     {...register(`specifications.${index}.value` as const)}
                     placeholder="e.g. 16GB DDR5"
                     className="flex-1 px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                   />
                   <button 
                     type="button" 
                     onClick={() => remove(index)}
                     className="p-2 text-slate-400 hover:text-error transition-colors"
                   >
                     <Trash2 size={18} />
                   </button>
                 </div>
               ))}
               <button
                 type="button"
                 onClick={() => append({ key: '', value: '' })}
                 className="flex items-center gap-2 text-sm font-medium text-primary hover:text-accent transition-colors"
               >
                 <Plus size={16} /> Add Specification
               </button>
             </div>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-100 pt-8 flex justify-end gap-4">
        <button 
          type="button"
          onClick={() => router.push('/admin/products')}
          className="px-6 py-2.5 rounded-md border border-gray-300 text-slate-700 font-medium hover:bg-gray-50 transition-colors"
        >
          Cancel
        </button>
        <button 
          type="submit"
          disabled={isSubmitting}
          className={`flex items-center gap-2 px-8 py-2.5 rounded-md bg-primary text-white font-medium transition-all ${isSubmitting ? 'opacity-70 cursor-not-allowed' : 'hover:bg-opacity-90 hover:shadow-md'}`}
        >
          <Save size={18} /> {isSubmitting ? 'Saving...' : 'Save Product'}
        </button>
      </div>
    </form>
  );
}
