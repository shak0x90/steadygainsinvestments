import { useEffect, useState } from 'react';
import api from '@/utils/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import ImageUpload from '@/components/ui/ImageUpload';
import toast from 'react-hot-toast';

const TEXT_SECTIONS = [
    {
        id: 'hero', label: 'Hero Section', icon: '🏠',
        fields: [
            { key: 'hero_tagline', label: 'Tagline', type: 'input' },
            { key: 'hero_title', label: 'Main Headline', type: 'input' },
            { key: 'hero_subtitle', label: 'Subtitle Text', type: 'textarea' },
        ],
    },
    {
        id: 'stats', label: 'Stats Bar', icon: '📊',
        fields: [
            { key: 'stat_investors', label: 'Investors Count', type: 'input' },
            { key: 'stat_min_investment', label: 'Min Investment', type: 'input' },
            { key: 'stat_satisfaction', label: 'Satisfaction Rate', type: 'input' },
        ],
    },
    {
        id: 'about', label: 'About Section', icon: '📖',
        fields: [
            { key: 'about_title', label: 'Section Title', type: 'input' },
            { key: 'about_text_1', label: 'Paragraph 1', type: 'textarea' },
            { key: 'about_text_2', label: 'Paragraph 2', type: 'textarea' },
        ],
    },
    {
        id: 'contact', label: 'Contact Information', icon: '📞',
        fields: [
            { key: 'contact_email', label: 'Email Address', type: 'input' },
            { key: 'contact_phone', label: 'Phone Number', type: 'input' },
            { key: 'contact_address', label: 'Office Address', type: 'input' },
            { key: 'contact_subtitle', label: 'Contact Subtitle', type: 'textarea' },
            { key: 'social_linkedin', label: 'LinkedIn URL', type: 'input', placeholder: 'https://linkedin.com/...' },
            { key: 'social_twitter', label: 'Twitter URL', type: 'input', placeholder: 'https://twitter.com/...' },
        ],
    },
    {
        id: 'images', label: 'Landing Page Images', icon: '🖼️',
        fields: [
            { key: 'hero_image', label: 'Hero Image', type: 'image', placeholder: 'https://...' },
            { key: 'about_image_1', label: 'About — Main Image', type: 'image', placeholder: 'https://...' },
            { key: 'about_image_2', label: 'About — Secondary Image', type: 'image', placeholder: 'https://...' },
        ],
    },
    {
        id: 'footer', label: 'Footer', icon: '🔻',
        fields: [
            { key: 'footer_tagline', label: 'Footer Tagline', type: 'textarea' },
        ],
    },
];

const DEFAULT_TEAM = [
    { name: 'Alexander Reed', title: 'Founder & CEO', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80', bio: 'Started Steady Gains to make investing accessible for everyone.' },
    { name: 'Sophia Chen', title: 'Head of Investments', image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&q=80', bio: '15 years making smart investment decisions for everyday people.' },
    { name: 'Marcus Johnson', title: 'Head of Customer Success', image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&q=80', bio: 'Obsessed with making sure every investor feels supported.' },
    { name: 'Elena Vasquez', title: 'Head of Education', image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&q=80', bio: 'Helps new investors understand their journey, step by step.' },
];

export default function AdminContent() {
    const [content, setContent] = useState({});
    const [team, setTeam] = useState(DEFAULT_TEAM);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [activeTab, setActiveTab] = useState('text');

    useEffect(() => {
        api.getContent().then((data) => {
            const flat = {};
            Object.values(data).forEach((section) => {
                Object.entries(section).forEach(([k, v]) => { flat[k] = v; });
            });
            setContent(flat);
            // Load team from stored JSON
            if (flat.team_members) {
                try { setTeam(JSON.parse(flat.team_members)); } catch { }
            }
        }).catch(console.error).finally(() => setLoading(false));
    }, []);

    const handleChange = (key, value) => {
        setContent(prev => ({ ...prev, [key]: value }));
    };

    // ── Team CRUD ──
    const updateTeamMember = (index, field, value) => {
        setTeam(prev => {
            const updated = [...prev];
            updated[index] = { ...updated[index], [field]: value };
            return updated;
        });
    };

    const addTeamMember = () => {
        setTeam(prev => [...prev, { name: '', title: '', image: '', bio: '' }]);
    };

    const removeTeamMember = (index) => {
        if (team.length <= 1) return toast.error('Must have at least one team member');
        setTeam(prev => prev.filter((_, i) => i !== index));
    };

    // ── Save All ──
    const handleSave = async () => {
        setSaving(true);
        try {
            const items = [];
            // Text content
            TEXT_SECTIONS.forEach((section) => {
                section.fields.forEach((field) => {
                    items.push({ key: field.key, value: content[field.key] || '', section: section.id });
                });
            });
            // Team members as JSON
            items.push({ key: 'team_members', value: JSON.stringify(team), section: 'team' });
            await api.updateContent(items);
            toast.success('All changes saved!');
        } catch (err) {
            toast.error(err.message || 'Failed to save');
        } finally {
            setSaving(false);
        }
    };

    if (loading) return (
        <div className="flex justify-center py-20">
            <div className="animate-spin w-8 h-8 border-3 border-amber-500 border-t-transparent rounded-full" />
        </div>
    );

    const tabs = [
        { id: 'text', label: 'Content', icon: '📝' },
        { id: 'team', label: 'Team', icon: '👥' },
    ];

    return (
        <div className="space-y-6 max-w-4xl">
            {/* Header */}
            <div className="flex items-center justify-between flex-wrap gap-4">
                <div>
                    <h1 className="font-display text-2xl font-bold text-charcoal">Site Content Manager</h1>
                    <p className="text-sm text-charcoal/40 mt-1">Manage your landing page content, team, and images</p>
                </div>
                <Button onClick={handleSave} disabled={saving} className="bg-amber-500 hover:bg-amber-600 text-white rounded-lg px-6 shadow-sm shadow-amber-500/20">
                    {saving ? (
                        <span className="flex items-center gap-2">
                            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
                            Saving...
                        </span>
                    ) : 'Save All Changes'}
                </Button>
            </div>

            {/* Tabs */}
            <div className="flex gap-1 bg-gray-100 p-1 rounded-xl">
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${activeTab === tab.id
                            ? 'bg-white text-charcoal shadow-sm'
                            : 'text-charcoal/50 hover:text-charcoal/70'
                            }`}
                    >
                        <span>{tab.icon}</span> {tab.label}
                    </button>
                ))}
            </div>

            {/* ── Content Tab ── */}
            {activeTab === 'text' && (
                <div className="space-y-6">
                    {TEXT_SECTIONS.map((section) => (
                        <div key={section.id} className="bg-white rounded-xl p-6 border border-border/50">
                            <h3 className="font-display font-semibold text-charcoal mb-4 flex items-center gap-2">
                                <span>{section.icon}</span>
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
                                                placeholder={field.placeholder}
                                            />
                                        ) : field.type === 'image' ? (
                                            <ImageUpload
                                                value={content[field.key] || ''}
                                                onChange={(url) => handleChange(field.key, url)}
                                                placeholder={field.placeholder}
                                            />
                                        ) : (
                                            <Input
                                                value={content[field.key] || ''}
                                                onChange={(e) => handleChange(field.key, e.target.value)}
                                                className="rounded-lg bg-gray-50 border-border/50"
                                                placeholder={field.placeholder}
                                            />
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* ── Team Tab ── */}
            {activeTab === 'team' && (
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <p className="text-sm text-charcoal/50">{team.length} team member{team.length > 1 ? 's' : ''}</p>
                        <Button
                            onClick={addTeamMember}
                            variant="outline"
                            className="border-emerald-brand/30 text-emerald-brand hover:bg-emerald-50 rounded-lg text-sm"
                        >
                            + Add Member
                        </Button>
                    </div>

                    {team.map((member, i) => (
                        <div key={i} className="bg-white rounded-xl border border-border/50 overflow-hidden">
                            <div className="px-6 py-4 border-b border-border/30 bg-gray-50/50 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    {member.image ? (
                                        <img
                                            src={import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL.replace('/api', '') + member.image : member.image}
                                            alt={member.name || 'Team member'}
                                            className="w-10 h-10 rounded-lg object-cover"
                                            onError={(e) => { e.target.style.display = 'none'; }}
                                        />
                                    ) : (
                                        <div className="w-10 h-10 rounded-lg bg-emerald-brand/10 flex items-center justify-center text-emerald-brand font-bold">
                                            {(member.name || '?')[0]}
                                        </div>
                                    )}
                                    <div>
                                        <p className="font-semibold text-charcoal text-sm">{member.name || `Member ${i + 1}`}</p>
                                        <p className="text-xs text-charcoal/40">{member.title || 'No title'}</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => removeTeamMember(i)}
                                    className="text-xs text-red-500 hover:text-red-700 font-semibold transition-colors cursor-pointer"
                                >
                                    Remove
                                </button>
                            </div>
                            <div className="p-6 space-y-4">
                                <div className="grid sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-xs text-charcoal/50 mb-1.5 block tracking-wider uppercase">Full Name</label>
                                        <Input
                                            value={member.name}
                                            onChange={(e) => updateTeamMember(i, 'name', e.target.value)}
                                            placeholder="John Doe"
                                            className="rounded-lg bg-gray-50 border-border/50"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-xs text-charcoal/50 mb-1.5 block tracking-wider uppercase">Job Title</label>
                                        <Input
                                            value={member.title}
                                            onChange={(e) => updateTeamMember(i, 'title', e.target.value)}
                                            placeholder="Head of Engineering"
                                            className="rounded-lg bg-gray-50 border-border/50"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="text-xs text-charcoal/50 mb-1.5 block tracking-wider uppercase">Photo</label>
                                    <ImageUpload
                                        value={member.image}
                                        onChange={(url) => updateTeamMember(i, 'image', url)}
                                        placeholder="https://..."
                                    />
                                </div>
                                <div>
                                    <label className="text-xs text-charcoal/50 mb-1.5 block tracking-wider uppercase">Short Bio</label>
                                    <Textarea
                                        value={member.bio}
                                        onChange={(e) => updateTeamMember(i, 'bio', e.target.value)}
                                        placeholder="Brief description about this team member..."
                                        className="rounded-lg bg-gray-50 border-border/50"
                                        rows={2}
                                    />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
