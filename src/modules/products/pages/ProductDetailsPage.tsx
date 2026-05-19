import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useVendorProduct } from '@/modules/store/hooks/useVendorProducts';
import { useVendorAuthStore } from '@/modules/auth/hooks/useVendorAuthStore';
import { ROUTES } from '@/core/constants';
import { ArrowLeft, Edit, Tag, Box, Package, Image as ImageIcon, Loader2, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/shared/ui/Button';
import { Badge } from '@/shared/ui/Badge';
import { EmptyState } from '@/shared/ui/Feedback';

const ProductDetailsPage: React.FC = () => {
  const [activeImageIndex, setActiveImageIndex] = React.useState(0);
  const { productId } = useParams<{ productId: string }>();
  const navigate = useNavigate();
  const { storeSlug } = useVendorAuthStore();
  const vendorSlug = storeSlug || 'Yallamatgar';

  const { data: product, isLoading, isError } = useVendorProduct(vendorSlug, productId || '');

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="animate-spin text-brand-500" size={32} />
      </div>
    );
  }

  if (isError || !product) {
    return (
      <div className="pt-10">
        <EmptyState
          icon={<Package size={32} />}
          title="Product not found"
          description="The product you are looking for does not exist or has been deleted."
          action={
            <Button onClick={() => navigate(ROUTES.DASHBOARD_PRODUCTS)}>
              Back to Products
            </Button>
          }
        />
      </div>
    );
  }

  const allImages = product.images && product.images.length > 0 
    ? product.images.map(img => img.url) 
    : product.image 
      ? [product.image] 
      : [];

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-fade-in pb-12">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(ROUTES.DASHBOARD_PRODUCTS)}
            className="p-2 rounded-full hover:bg-surface-hover text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-white">{product.name}</h1>
            <p className="text-sm text-slate-400 mt-1">/{product.slug}</p>
          </div>
        </div>
        <Button
          icon={<Edit size={16} />}
          onClick={() => navigate(`/dashboard/products/${product.id}/edit`)}
        >
          Edit Product
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Images */}
        <div className="lg:col-span-5 space-y-4">
          <div className="card space-y-4">
            <h2 className="text-lg font-semibold text-white flex items-center gap-2">
              <ImageIcon size={18} className="text-brand-400" /> Images
            </h2>
            {allImages.length > 0 ? (
              <div className="space-y-4">
                {/* Main Image with Carousel Controls */}
                <div className="relative aspect-square rounded-xl overflow-hidden bg-surface border border-surface-border group">
                  <img src={allImages[activeImageIndex]} alt={product.name} className="w-full h-full object-cover transition-opacity duration-300" />
                  
                  {allImages.length > 1 && (
                    <>
                      <button 
                        onClick={() => setActiveImageIndex((prev) => (prev === 0 ? allImages.length - 1 : prev - 1))}
                        className="absolute left-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 text-white opacity-0 group-hover:opacity-100 transition-all hover:bg-brand-500 hover:scale-110"
                      >
                        <ChevronLeft size={20} />
                      </button>
                      <button 
                        onClick={() => setActiveImageIndex((prev) => (prev === allImages.length - 1 ? 0 : prev + 1))}
                        className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 text-white opacity-0 group-hover:opacity-100 transition-all hover:bg-brand-500 hover:scale-110"
                      >
                        <ChevronRight size={20} />
                      </button>
                      
                      {/* Image Indicators */}
                      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5">
                        {allImages.map((_, idx) => (
                          <button
                            key={idx}
                            onClick={() => setActiveImageIndex(idx)}
                            className={`h-2 rounded-full transition-all ${idx === activeImageIndex ? 'bg-brand-500 w-6' : 'bg-white/50 hover:bg-white w-2'}`}
                            title={`View image ${idx + 1}`}
                          />
                        ))}
                      </div>
                    </>
                  )}
                </div>
                
                {/* Thumbnails Row */}
                {allImages.length > 1 && (
                  <div className="flex gap-3 overflow-x-auto pb-3 pt-1 scrollbar-thin scrollbar-thumb-surface-border scrollbar-track-transparent">
                    {allImages.map((imgUrl, idx) => (
                      <button 
                        key={idx} 
                        onClick={() => setActiveImageIndex(idx)}
                        className={`flex-shrink-0 w-24 h-24 rounded-xl overflow-hidden border-2 transition-all ${idx === activeImageIndex ? 'border-brand-500 opacity-100 shadow-lg shadow-brand-500/20 scale-[1.02]' : 'border-transparent opacity-60 hover:opacity-100 hover:scale-[1.02]'}`}
                        title={`View image ${idx + 1}`}
                      >
                        <img src={imgUrl} alt={`${product.name} thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="aspect-square rounded-xl bg-surface border border-dashed border-surface-border flex flex-col items-center justify-center text-slate-500">
                <ImageIcon size={32} className="mb-2 opacity-50" />
                <span className="text-sm">No images available</span>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Details */}
        <div className="lg:col-span-7 space-y-4">
          
          <div className="card space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                <Box size={18} className="text-brand-400" /> Product Information
              </h2>
              <Badge variant={product.is_active !== false ? 'green' : 'slate'}>
                {product.is_active !== false ? 'Active' : 'Inactive'}
              </Badge>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-6 pt-4 border-t border-surface-border">
              <div>
                <p className="text-xs font-medium text-slate-400 mb-1">Price</p>
                <div className="flex items-baseline gap-2">
                  <p className="text-xl font-bold text-white">${Number(product.price).toFixed(2)}</p>
                  {product.price_before && (
                    <p className="text-sm font-medium text-slate-500 line-through">
                      ${Number(product.price_before).toFixed(2)}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <p className="text-xs font-medium text-slate-400 mb-1">Stock Level</p>
                <p className={product.stock > 0 ? "text-lg font-semibold text-white" : "text-lg font-semibold text-red-400"}>
                  {product.stock > 0 ? `${product.stock} units` : 'Out of stock'}
                </p>
              </div>

              <div>
                <p className="text-xs font-medium text-slate-400 mb-1">Category</p>
                {product.category ? (
                  <div className="flex items-center gap-2">
                    <Tag size={14} className="text-brand-400" />
                    <span className="text-sm font-medium text-white">{product.category.name}</span>
                  </div>
                ) : (
                  <p className="text-sm text-slate-500">—</p>
                )}
              </div>
            </div>

            <div className="pt-4 border-t border-surface-border">
              <p className="text-xs font-medium text-slate-400 mb-2">Description</p>
              <div className="text-sm text-slate-300 leading-relaxed whitespace-pre-wrap">
                {product.description || <span className="italic opacity-50">No description provided.</span>}
              </div>
            </div>

            <div className="pt-4 border-t border-surface-border flex justify-between text-xs text-slate-500">
              <p>Created: {product.created_at ? new Date(product.created_at).toLocaleString() : '—'}</p>
              <p>Last Updated: {product.updated_at ? new Date(product.updated_at).toLocaleString() : '—'}</p>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};

export default ProductDetailsPage;
