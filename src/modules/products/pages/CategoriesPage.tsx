import React, { useState, useRef } from 'react';
import { Plus, Trash2, Pencil, Tag, Search, Image as ImageIcon, Eye, X, UploadCloud } from 'lucide-react';
import { Table, Column } from '@/shared/components/Table';
import { Button } from '@/shared/ui/Button';
import { Input } from '@/shared/ui/Input';
import { Modal } from '@/shared/components/Modal';
import { EmptyState } from '@/shared/ui/Feedback';
import { useVendorAuthStore } from '@/modules/auth/hooks/useVendorAuthStore';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import {
  useVendorCategories,
  useCreateVendorCategory,
  useUpdateVendorCategory,
  useDeleteVendorCategory,
} from '@/modules/store/hooks/useVendorCategories';
import type { VendorCategory } from '@/modules/store/services/vendorCategoriesService';

import { compressImage } from '@/shared/utils/imageCompressor';

interface CategoryForm {
  name: string;
  slug: string;
  description?: string;
}

/** Auto-generate a URL-friendly slug from a name string */
const toSlug = (name: string) =>
  name.trim().toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');

/* ─── Image Upload Field Component ─────────────────────────────────────────── */
interface ImageUploadFieldProps {
  label: string;
  required?: boolean;
  existingUrl?: string;
  onFileChange: (file: File | null) => void;
  error?: boolean;
}

const ImageUploadField: React.FC<ImageUploadFieldProps> = ({
  label,
  required,
  existingUrl,
  onFileChange,
  error,
}) => {
  const [preview, setPreview] = useState<string | null>(null);
  const [compressing, setCompressing] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    if (file) {
      setCompressing(true);
      const toastId = toast.loading('Optimizing category image...');
      try {
        const compressed = await compressImage(file, 1024, 1024, 0.75);
        setPreview(URL.createObjectURL(compressed));
        onFileChange(compressed);
        toast.success('Category image optimized!', { id: toastId });
      } catch (err) {
        toast.error('Failed to optimize category image.', { id: toastId });
        setPreview(URL.createObjectURL(file));
        onFileChange(file);
      } finally {
        setCompressing(false);
      }
    } else {
      setPreview(null);
      onFileChange(null);
    }
  };

  const clearImage = () => {
    setPreview(null);
    onFileChange(null);
    if (inputRef.current) inputRef.current.value = '';
  };

  const displaySrc = preview || existingUrl || null;

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-slate-300">
        {label} {required && <span className="text-red-400">*</span>}
      </label>

      {displaySrc ? (
        /* Preview / existing image */
        <div className="relative w-full h-44 rounded-xl overflow-hidden border border-surface-border group">
          <img src={displaySrc} alt="preview" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
            <label className="cursor-pointer bg-white/20 hover:bg-white/30 text-white text-xs font-semibold px-3 py-2 rounded-lg flex items-center gap-1.5 transition-colors">
              <UploadCloud size={14} />
              Change
              <input
                ref={inputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleChange}
              />
            </label>
            {preview && (
              <button
                type="button"
                onClick={clearImage}
                className="bg-red-500/80 hover:bg-red-500 text-white text-xs font-semibold px-3 py-2 rounded-lg flex items-center gap-1.5 transition-colors"
              >
                <X size={14} />
                Remove
              </button>
            )}
          </div>
        </div>
      ) : (
        /* Empty upload area */
        <label className="flex flex-col items-center justify-center w-full h-36 border-2 border-dashed border-surface-border rounded-xl cursor-pointer hover:border-brand-500 bg-surface hover:bg-surface-hover transition-all group">
          <UploadCloud size={28} className="text-slate-500 group-hover:text-brand-400 mb-2 transition-colors" />
          <span className="text-xs text-slate-400 group-hover:text-brand-300 font-medium">
            Click to upload image
          </span>
          <span className="text-[11px] text-slate-500 mt-1">PNG, JPG, WEBP up to 5MB</span>
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleChange}
          />
        </label>
      )}

      {error && <p className="text-xs text-red-400">Image is required</p>}
    </div>
  );
};

/* ─── View Category Modal ────────────────────────────────────────────────────── */
interface ViewCategoryModalProps {
  category: VendorCategory | null;
  onClose: () => void;
  onEdit: (c: VendorCategory) => void;
}

const ViewCategoryModal: React.FC<ViewCategoryModalProps> = ({ category, onClose, onEdit }) => {
  if (!category) return null;
  return (
    <Modal
      isOpen={!!category}
      onClose={onClose}
      title="Category Details"
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>Close</Button>
          <Button icon={<Pencil size={14} />} onClick={() => { onClose(); onEdit(category); }}>
            Edit
          </Button>
        </>
      }
    >
      <div className="space-y-5">
        {category.image ? (
          <div className="w-full h-52 rounded-xl overflow-hidden border border-surface-border">
            <img src={category.image} alt={category.name} className="w-full h-full object-cover" />
          </div>
        ) : (
          <div className="w-full h-52 rounded-xl bg-surface border border-dashed border-surface-border flex flex-col items-center justify-center text-slate-500">
            <ImageIcon size={32} className="mb-2 opacity-40" />
            <span className="text-sm">No image</span>
          </div>
        )}
        <div className="space-y-3">
          <div>
            <p className="text-xs font-medium text-slate-400 mb-1">Name</p>
            <p className="text-white font-semibold">{category.name}</p>
          </div>
          <div>
            <p className="text-xs font-medium text-slate-400 mb-1">Slug</p>
            <p className="text-slate-300 text-sm font-mono">/{category.slug}</p>
          </div>
          {category.description && (
            <div>
              <p className="text-xs font-medium text-slate-400 mb-1">Description</p>
              <p className="text-slate-300 text-sm">{category.description}</p>
            </div>
          )}
          {category.created_at && (
            <div>
              <p className="text-xs font-medium text-slate-400 mb-1">Created</p>
              <p className="text-slate-300 text-sm">{new Date(category.created_at).toLocaleString()}</p>
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
};

/* ─── Main Page ──────────────────────────────────────────────────────────────── */
const CategoriesPage: React.FC = () => {
  const { storeSlug } = useVendorAuthStore();
  const vendorSlug = storeSlug || 'Yallamatgar';
  const { data: categories = [], isLoading } = useVendorCategories(vendorSlug);
  const createCategory = useCreateVendorCategory(vendorSlug);
  const updateCategory = useUpdateVendorCategory(vendorSlug);
  const deleteCategory = useDeleteVendorCategory(vendorSlug);

  const [search, setSearch] = useState('');
  const [addOpen, setAddOpen] = useState(false);
  const [editCategory, setEditCategory] = useState<VendorCategory | null>(null);
  const [viewCategory, setViewCategory] = useState<VendorCategory | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<VendorCategory | null>(null);

  // Separate file state (not in react-hook-form) for previews
  const [addImageFile, setAddImageFile] = useState<File | null>(null);
  const [editImageFile, setEditImageFile] = useState<File | null>(null);
  const [addImageError, setAddImageError] = useState(false);

  const {
    register: registerAdd,
    handleSubmit: handleSubmitAdd,
    reset: resetAdd,
    setValue: setValueAdd,
    formState: { errors: errorsAdd },
  } = useForm<CategoryForm>();

  const {
    register: registerEdit,
    handleSubmit: handleSubmitEdit,
    reset: resetEdit,
    formState: { errors: errorsEdit },
  } = useForm<CategoryForm>();

  const filtered = categories.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  const closeAdd = () => {
    setAddOpen(false);
    resetAdd();
    setAddImageFile(null);
    setAddImageError(false);
  };

  const onAddSubmit = async (data: CategoryForm) => {
    if (!addImageFile) {
      setAddImageError(true);
      toast.error('Please upload a category image.');
      return;
    }
    setAddImageError(false);
    await createCategory.mutateAsync({
      name: data.name,
      slug: data.slug || toSlug(data.name),
      description: data.description,
      image: addImageFile,
    });
    closeAdd();
  };

  const onEditSubmit = async (data: CategoryForm) => {
    if (!editCategory) return;
    await updateCategory.mutateAsync({
      id: editCategory.id,
      payload: {
        name: data.name,
        slug: data.slug,
        description: data.description,
        image: editImageFile ?? undefined,
      },
    });
    setEditCategory(null);
    setEditImageFile(null);
  };

  const openEdit = (c: VendorCategory) => {
    resetEdit({ name: c.name, slug: c.slug, description: c.description || '' });
    setEditImageFile(null);
    setEditCategory(c);
  };

  const columns: Column<VendorCategory>[] = [
    {
      key: 'name',
      header: 'Category',
      sortable: true,
      render: (c) => (
        <div className="flex items-center gap-3">
          {c.image ? (
            <img src={c.image} alt={c.name} className="w-10 h-10 rounded-lg object-cover bg-surface-hover" />
          ) : (
            <div className="w-10 h-10 rounded-lg bg-brand-600/20 flex items-center justify-center">
              <Tag size={18} className="text-brand-400" />
            </div>
          )}
          <div>
            <p className="font-medium text-white text-sm">{c.name}</p>
            <p className="text-xs text-slate-500">/{c.slug}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'description',
      header: 'Description',
      render: (c) => (
        <span className="text-slate-400 text-sm line-clamp-1">
          {c.description || '—'}
        </span>
      ),
    },
    {
      key: 'created_at',
      header: 'Created',
      sortable: true,
      render: (c) => (
        <span className="text-slate-400 text-sm">
          {c.created_at ? new Date(c.created_at).toLocaleDateString() : '—'}
        </span>
      ),
    },
    {
      key: 'actions' as keyof VendorCategory,
      header: '',
      render: (c) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => setViewCategory(c)}
            className="p-1.5 text-slate-400 hover:text-blue-400 transition-colors"
            title="View category"
          >
            <Eye size={15} />
          </button>
          <button
            onClick={() => openEdit(c)}
            className="p-1.5 text-slate-400 hover:text-brand-400 transition-colors"
            title="Edit category"
          >
            <Pencil size={15} />
          </button>
          <button
            onClick={() => setDeleteConfirm(c)}
            className="p-1.5 text-slate-400 hover:text-red-400 transition-colors"
            title="Delete category"
          >
            <Trash2 size={15} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Categories</h1>
          <p className="text-slate-400 text-sm mt-1">
            Organize your products into categories.
          </p>
        </div>
        <Button icon={<Plus size={16} />} onClick={() => setAddOpen(true)}>
          New Category
        </Button>
      </div>

      <div className="flex items-center gap-3">
        <div className="flex-1 max-w-sm">
          <Input
            placeholder="Search categories..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            icon={<Search size={16} />}
          />
        </div>
      </div>

      {!isLoading && filtered.length === 0 ? (
        <EmptyState
          title="No categories yet"
          description="Create your first category to organize your products."
          icon={<Tag size={24} />}
          action={
            <Button icon={<Plus size={16} />} onClick={() => setAddOpen(true)}>
              New Category
            </Button>
          }
        />
      ) : (
        <Table
          data={filtered}
          columns={columns}
          loading={isLoading}
          emptyMessage="No categories found."
        />
      )}

      {/* View Category Modal */}
      <ViewCategoryModal
        category={viewCategory}
        onClose={() => setViewCategory(null)}
        onEdit={openEdit}
      />

      {/* Add Category Modal */}
      <Modal
        isOpen={addOpen}
        onClose={closeAdd}
        title="Add New Category"
        footer={
          <>
            <Button variant="secondary" onClick={closeAdd}>Cancel</Button>
            <Button onClick={handleSubmitAdd(onAddSubmit)} loading={createCategory.isPending}>
              Create Category
            </Button>
          </>
        }
      >
        <form className="space-y-4" onSubmit={handleSubmitAdd(onAddSubmit)}>
          <ImageUploadField
            label="Category Image"
            required
            onFileChange={(f) => { setAddImageFile(f); if (f) setAddImageError(false); }}
            error={addImageError}
          />
          <Input
            label="Category Name *"
            placeholder="Electronics"
            {...registerAdd('name', { required: true })}
            error={errorsAdd.name ? 'Name is required' : undefined}
            onChange={(e) => setValueAdd('slug', toSlug(e.target.value))}
          />
          <Input
            label="Slug *"
            placeholder="electronics"
            hint="Auto-generated from name, or enter custom slug"
            {...registerAdd('slug', { required: true })}
            error={errorsAdd.slug ? 'Slug is required' : undefined}
          />
          <Input
            label="Description (optional)"
            placeholder="Brief description of this category"
            {...registerAdd('description')}
          />
        </form>
      </Modal>

      {/* Edit Category Modal */}
      <Modal
        isOpen={!!editCategory}
        onClose={() => { setEditCategory(null); setEditImageFile(null); }}
        title="Edit Category"
        footer={
          <>
            <Button variant="secondary" onClick={() => { setEditCategory(null); setEditImageFile(null); }}>
              Cancel
            </Button>
            <Button onClick={handleSubmitEdit(onEditSubmit)} loading={updateCategory.isPending}>
              Save Changes
            </Button>
          </>
        }
      >
        <form className="space-y-4" onSubmit={handleSubmitEdit(onEditSubmit)}>
          <ImageUploadField
            label="Category Image"
            existingUrl={editCategory?.image}
            onFileChange={setEditImageFile}
          />
          <Input
            label="Category Name *"
            placeholder="Electronics"
            {...registerEdit('name', { required: true })}
            error={errorsEdit.name ? 'Name is required' : undefined}
          />
          <Input
            label="Slug *"
            placeholder="electronics"
            {...registerEdit('slug', { required: true })}
            error={errorsEdit.slug ? 'Slug is required' : undefined}
          />
          <Input
            label="Description (optional)"
            placeholder="Brief description of this category"
            {...registerEdit('description')}
          />
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={!!deleteConfirm}
        onClose={() => setDeleteConfirm(null)}
        title="Delete Category"
        footer={
          <>
            <Button variant="secondary" onClick={() => setDeleteConfirm(null)}>Cancel</Button>
            <Button
              variant="danger"
              onClick={async () => {
                if (deleteConfirm) {
                  await deleteCategory.mutateAsync(deleteConfirm.id);
                  setDeleteConfirm(null);
                }
              }}
              loading={deleteCategory.isPending}
            >
              Delete
            </Button>
          </>
        }
      >
        <p className="text-slate-300">
          Are you sure you want to delete the category{' '}
          <span className="text-white font-semibold">"{deleteConfirm?.name}"</span>?
          Products in this category may be affected.
        </p>
      </Modal>
    </div>
  );
};

export default CategoriesPage;
