import { useEffect, useState } from 'react';
import api from '@/utils/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

const SECTIONS = [
    {
        id: 'hero',
        label: 'Hero Section',
        fields: [
            { key: 'hero_tagline', label: 'Tagline', type: 'input' },
            { key: 'hero_title', label: 'Main Headline', type: 'input' },
            { key: 'hero_subtitle', label: 'Subtitle Text', type: 'textarea' },
        ],
    },
    {
        id: 'stats',
        label: 'Stats Bar',
        fields: [
            { key: 'stat_investors', label: 'Investors Count', type: 'input' },
            { key: 'stat_min_investment', label: 'Min Investment', type: 'input' },
            { key: 'stat_satisfaction', label: 'Satisfaction Rate', type: 'input' },
        ],
    },
    {
        id: 'about',
        label: 'About Section',
        fields: [
            { key: 'about_title', label: 'Section Title', type: 'input' },
            { key: 'about_text_1', label: 'Paragraph 1', type: 'textarea' },
            { key: 'about_text_2', label: 'Paragraph 2', type: 'textarea' },
        ],
    },
    {
        id: 'footer',
        label: 'Footer',
        fields: [
            { key: 'footer_tagline', label: 'Footer Tagline', type: 'textarea' },
        ],
    },
];

export default function AdminContent() {
    const [content, setContent] = useState({});
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);

    useEffect(() => {
        api.getContent().then((data) => {
            // Flatten grouped data
            const flat = {};
            Object.values(data).forEach((section) => {
                Object.entries(section).forEach(([k, v]) => { flat[k] = v; });
            });
            setContent(flat);
        }).catch(console.error).finally(() => setLoading(false));
    }, []);

    const handleChange = (key, value) => {
        setContent({ ...content, [key]: value });
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            const items = [];
            SECTIONS.forEach((section) => {
                section.fields.forEach((field) => {
                    items.push({ key: field.key, value: content[field.key] || '', section: section.id });
                });
            });
            await api.updateContent(items);
            setSaved(true);
            setTimeout(() => setSaved(false), 2000);
        } catch (err) {
            alert(err.message);
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="flex justify-center py-20"><div className="animate-spin w-8 h-8 border-3 border-amber-500 border-t-transparent rounded-full" /></div>;

    return (
        <div className="space-y-6 max-w-3xl">
            <div className="flex items-center justify-between">
                <h1 className="font-display text-2xl font-bold text-charcoal">Site Content</h1>
                <div className="flex items-center gap-3">
                    {saved && <span className="text-sm text-emerald-brand font-medium">✓ Saved!</span>}
                    <Button onClick={handleSave} disabled={saving} className="bg-amber-500 hover:bg-amber-600 text-white rounded-lg">
                        {saving ? 'Saving...' : 'Save All Changes'}
                    </Button>
                </div>
            </div>

            {SECTIONS.map((section) => (
                <div key={section.id} className="bg-white rounded-xl p-6 border border-border/50">
                    <h3 className="font-display font-semibold text-charcoal mb-4 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-amber-500" />
                        {section.label}
                    </h3>
                    <div className="space-y-4">
                        {section.fields.map((field) => (
                            <div key={field.key}>
                                <label className="text-xs text-charcoal/50 mb-1.5 block tracking-wider uppercase">{field.label}</label>
                                {field.type === 'textarea' ? (
                                    <Textarea
                                        value={content[field.key] || ''}
                                        onChange={(e) => handleChange(field.key, e.target.value)}
                                        className="rounded-lg bg-gray-50 border-border/50"
                                        rows={3}
                                    />
                                ) : (
                                    <Input
                                        value={content[field.key] || ''}
                                        onChange={(e) => handleChange(field.key, e.target.value)}
                                        className="rounded-lg bg-gray-50 border-border/50"
                                    />
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
}
