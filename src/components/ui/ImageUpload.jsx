import { useState, useRef } from 'react';
import api from '@/utils/api';
import toast from 'react-hot-toast';

export default function ImageUpload({ value, onChange, placeholder }) {
    const [uploading, setUploading] = useState(false);
    const fileInputRef = useRef(null);

    const handleFileChange = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        try {
            const res = await api.uploadFile(file);
            onChange(res.url); // update the parent state with the URL
            toast.success('Image uploaded successfully');
        } catch (err) {
            toast.error(err.message || 'Image upload failed');
        } finally {
            setUploading(false);
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    };

    return (
        <div className="space-y-3">
            <div className="flex gap-2">
                <input
                    type="text"
                    value={value || ''}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder={placeholder || 'Upload an image or paste URL...'}
                    className="flex-1 rounded-lg border border-border/50 bg-gray-50 px-3 py-2 text-sm text-charcoal shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-emerald-brand disabled:cursor-not-allowed disabled:opacity-50"
                    disabled={uploading}
                />
                <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploading}
                    className="bg-emerald-brand hover:bg-emerald-dark text-white px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap disabled:opacity-50"
                >
                    {uploading ? 'Uploading...' : 'Upload File'}
                </button>
            </div>
            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
                className="hidden"
            />
            {value && (
                <div className="rounded-lg overflow-hidden border border-border/30 bg-gray-100 max-w-sm">
                    <img
                        src={import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL.replace('/api', '') + value : value}
                        alt="Preview"
                        className="w-full h-32 object-cover"
                        onError={(e) => { e.target.style.display = 'none'; }}
                    />
                </div>
            )}
        </div>
    );
}
