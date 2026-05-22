import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Save, ArrowLeft, UploadCloud, X, Loader2 } from 'lucide-react';
import { useVendorProducts, useCreateVendorProduct, useUpdateVendorProduct, useDeleteProductMedia } from '@/modules/store/hooks/useVendorProducts';
import { useVendorCategories } from '@/modules/store/hooks/useVendorCategories';
import { useVendorAuthStore } from '@/modules/auth/hooks/useVendorAuthStore';
import { Button } from '@/shared/ui/Button';
import { Input, Select, Textarea } from '@/shared/ui/Input';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { ROUTES } from '@/core/constants';
import clsx from 'clsx';
import { compressImage } from '@/shared/utils/imageCompressor';

interface ProductForm {
  name: string;
  description?: string;
  price: number;
  price_before?: number;
  stock: number;
  category_id?: string;
  slug?: string;
}

const ProductFormPage: React.FC = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const { storeSlug } = useVendorAuthStore();
  const vendorSlug = storeSlug || 'Yallamatgar';
  
  const isEdit = !!productId;
  
  const { data: products = [], isLoading: productsLoading } = useVendorProducts(vendorSlug);
  const { data: categories = [] } = useVendorCategories(vendorSlug);
  const createProduct = useCreateVendorProduct(vendorSlug);
  const updateProduct = useUpdateVendorProduct(vendorSlug);
  const deleteMedia = useDeleteProductMedia(vendorSlug);

  const productToEdit = isEdit ? products.find(p => p.id === productId) : null;

  const [images, setImages] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [existingMedia, setExistingMedia] = useState<Array<{ id: string; url: string }>>([]);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<ProductForm>();

  useEffect(() => {
    if (isEdit && productToEdit) {
      reset({
        name: productToEdit.name,
        description: productToEdit.description || '',
        price: productToEdit.price,
        price_before: productToEdit.price_before,
        stock: productToEdit.stock,
        category_id: productToEdit.category_id || productToEdit.category?.id || '',
        slug: productToEdit.slug,
      });
      if (productToEdit.images && productToEdit.images.length > 0) {
        setExistingMedia(productToEdit.images.map((img) => ({ id: String(img.id), url: img.url })));
      } else if (productToEdit.media) {
        setExistingMedia(productToEdit.media);
      } else if (productToEdit.image) {
        setExistingMedia([{ id: 'main', url: productToEdit.image }]);
      }
    }
  }, [isEdit, productToEdit, reset]);

  const categoryOptions = [
    { label: '— Select Category —', value: '' },
    ...categories.map((c) => ({ label: c.name, value: c.id })),
  ];

  const [compressing, setCompressing] = useState(false);

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    setCompressing(true);
    const toastId = toast.loading('Optimizing image files for faster upload...');
    
    try {
      const newFiles = Array.from(files);
      const compressedFiles: File[] = [];
      
      for (const file of newFiles) {
        // Compress images to a standard web-friendly size (e.g. 1200x1200px max, 75% quality)
        const compressed = await compressImage(file, 1200, 1200, 0.75);
        compressedFiles.push(compressed);
      }
      
      setImages(prev => [...prev, ...compressedFiles]);
      
      const newPreviews = compressedFiles.map(file => URL.createObjectURL(file));
      setPreviews(prev => [...prev, ...newPreviews]);
      
      toast.success('Images optimized and ready!', { id: toastId });
    } catch (err) {
      toast.error('Failed to optimize some images.', { id: toastId });
    } finally {
      setCompressing(false);
    }
  };

  const removeNewImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
    setPreviews(prev => prev.filter((_, i) => i !== index));
  };

  const removeExistingMedia = async (mediaId: string) => {
    try {
      await deleteMedia.mutateAsync(mediaId);
      setExistingMedia(prev => prev.filter(m => m.id !== mediaId));
    } catch {
      // toast already handled in hook
    }
  };

  const onSubmit = async (data: ProductForm) => {
    if (!isEdit && images.length === 0) {
      toast.error('Please upload at least one product image.');
      return;
    }

    const payload = {
      name: data.name,
      description: data.description,
      price: Number(data.price),
      price_before: data.price_before ? Number(data.price_before) : undefined,
      stock: Number(data.stock),
      category_id: data.category_id || undefined,
      slug: data.slug || data.name.toLowerCase().replace(/\s+/g, '-'),
      images: images.length > 0 ? images : undefined,
    };

    try {
      if (isEdit && productId) {
        await updateProduct.mutateAsync({ id: productId, payload });
        toast.success('Product updated successfully!');
      } else {
        await createProduct.mutateAsync(payload);
      }
      navigate(ROUTES.DASHBOARD_PRODUCTS);
    } catch (err) {
      // hook handles toast
    }
  };

  const isSaving = createProduct.isPending || updateProduct.isPending;

  if (isEdit && productsLoading) {
    return <div className="flex h-64 items-center justify-center"><Loader2 className="animate-spin text-brand-500" size={32} /></div>;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in pb-12">
      <div className="flex items-center gap-4">
        <button 
          onClick={() => navigate(ROUTES.DASHBOARD_PRODUCTS)}
          className="p-2 rounded-full hover:bg-surface-hover text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-white">{isEdit ? 'Edit Product' : 'Create New Product'}</h1>
          <p className="text-slate-400 text-sm mt-1">Fill in the details to list your product.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        
        {/* Images Section */}
        <div className="card space-y-4">
          <h2 className="text-lg font-semibold text-white">Product Images</h2>
          <p className="text-sm text-slate-400">Upload at least one image. High-quality images increase sales.</p>
          
          <div className="flex flex-wrap gap-4">
            {/* Existing Images */}
            {existingMedia.map((m) => (
              <div key={m.id} className="relative group w-32 h-32 rounded-xl overflow-hidden border border-surface-border bg-surface-hover">
                <img src={m.url} alt="product" className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => removeExistingMedia(m.id)}
                  className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  disabled={deleteMedia.isPending}
                >
                  <X size={24} className="text-red-400 mb-1" />
                  <span className="text-xs font-medium text-white">Delete</span>
                </button>
              </div>
            ))}

            {/* New Images Previews */}
            {previews.map((src, idx) => (
              <div key={idx} className="relative group w-32 h-32 rounded-xl overflow-hidden border border-brand-500/50 bg-surface-hover">
                <img src={src} alt="preview" className="w-full h-full object-cover opacity-80" />
                <button
                  type="button"
                  onClick={() => removeNewImage(idx)}
                  className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X size={14} />
                </button>
                <div className="absolute bottom-0 left-0 right-0 bg-brand-500 text-center py-1 text-[10px] font-bold text-white">
                  NEW
                </div>
              </div>
            ))}

            {/* Upload Button */}
            <label className={clsx(
              "w-32 h-32 rounded-xl border-2 border-dashed border-surface-border flex flex-col items-center justify-center bg-surface/50 transition-colors group",
              compressing ? "cursor-not-allowed opacity-55" : "hover:border-brand-500 hover:bg-surface cursor-pointer"
            )}>
              <UploadCloud size={28} className={clsx("text-slate-400 mb-2 transition-colors", !compressing && "group-hover:text-brand-400")} />
              <span className={clsx("text-xs font-medium text-slate-400", !compressing && "group-hover:text-brand-300")}>
                {compressing ? 'Optimizing...' : 'Upload Image'}
              </span>
              <input type="file" multiple accept="image/*" className="hidden" onChange={handleImageChange} disabled={compressing} />
            </label>
          </div>
        </div>

        {/* Basic Details */}
        <div className="card space-y-4">
          <h2 className="text-lg font-semibold text-white">Basic Details</h2>
          
          <Input
            label="Product Name *"
            placeholder="e.g. iPhone 15 Pro"
            {...register('name', { required: true })}
            error={errors.name ? 'Product name is required' : undefined}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Price *"
              type="number"
              step="0.01"
              placeholder="e.g. 55000"
              {...register('price', { required: true, min: 0 })}
              error={errors.price ? 'Valid price is required' : undefined}
            />
            <Input
              label="Price Before Discount (Optional)"
              type="number"
              step="0.01"
              placeholder="e.g. 62000"
              {...register('price_before')}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Stock Quantity *"
              type="number"
              placeholder="e.g. 10"
              {...register('stock', { required: true, min: 0 })}
              error={errors.stock ? 'Stock is required' : undefined}
            />
            <Select
              label="Category"
              {...register('category_id')}
              options={categoryOptions}
            />
          </div>

          <Textarea
            label="Description"
            placeholder="Describe your product features, material, and dimensions..."
            rows={5}
            {...register('description')}
          />
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-surface-border">
          <Button variant="secondary" type="button" onClick={() => navigate(ROUTES.DASHBOARD_PRODUCTS)} disabled={isSaving || compressing}>
            Cancel
          </Button>
          <Button type="submit" loading={isSaving || compressing} icon={!(isSaving || compressing) && <Save size={18} />} className={clsx((isSaving || compressing) && 'opacity-80')}>
            {compressing ? 'Optimizing Images...' : isSaving ? 'Saving Product...' : isEdit ? 'Save Changes' : 'Create Product'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ProductFormPage;
