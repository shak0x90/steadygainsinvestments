import { useEffect, useState } from 'react';
import api from '@/utils/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

const emptyPlan = { name: '', minInvestment: 100, expectedRoi: '', duration: '', risk: 'Low', description: '', features: [''], popular: false, color: '#0a7c42' };

export default function AdminPlans() {
    const [plans, setPlans] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState(null); // plan object or 'new'
    const [form, setForm] = useState(emptyPlan);

    useEffect(() => {
        api.getPlans().then(setPlans).catch(console.error).finally(() => setLoading(false));
    }, []);

    const startEdit = (plan) => {
        setEditing(plan.id);
        setForm({ ...plan, features: plan.features || [''] });
    };

    const startNew = () => {
        setEditing('new');
        setForm(emptyPlan);
    };

    const handleSave = async () => {
        try {
            const data = { ...form, minInvestment: parseFloat(form.minInvestment), features: form.features.filter(Boolean) };
            if (editing === 'new') {
                const created = await api.createPlan(data);
                setPlans([...plans, created]);
            } else {
                const updated = await api.updatePlan(editing, data);
                setPlans(plans.map((p) => (p.id === editing ? updated : p)));
            }
            setEditing(null);
        } catch (err) {
            alert(err.message);
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('Deactivate this plan?')) return;
        try {
            await api.deletePlan(id);
            setPlans(plans.filter((p) => p.id !== id));
        } catch (err) {
            alert(err.message);
        }
    };

    if (loading) return <div className="flex justify-center py-20"><div className="animate-spin w-8 h-8 border-3 border-amber-500 border-t-transparent rounded-full" /></div>;

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="font-display text-2xl font-bold text-charcoal">Manage Plans</h1>
                <Button onClick={startNew} className="bg-amber-500 hover:bg-amber-600 text-white rounded-lg">
                    + Add Plan
                </Button>
            </div>

            {/* Edit/Create Form */}
            {editing !== null && (
                <div className="bg-white rounded-xl p-6 border-2 border-amber-300">
                    <h3 className="font-display font-semibold text-charcoal mb-4">
                        {editing === 'new' ? 'Create New Plan' : 'Edit Plan'}
                    </h3>
                    <div className="grid md:grid-cols-2 gap-4">
                        <div>
                            <label className="text-xs text-charcoal/50 mb-1 block uppercase tracking-wider">Name</label>
                            <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="rounded-lg" />
                        </div>
                        <div>
                            <label className="text-xs text-charcoal/50 mb-1 block uppercase tracking-wider">Min Investment ($)</label>
                            <Input type="number" value={form.minInvestment} onChange={(e) => setForm({ ...form, minInvestment: e.target.value })} className="rounded-lg" />
                        </div>
                        <div>
                            <label className="text-xs text-charcoal/50 mb-1 block uppercase tracking-wider">Expected ROI</label>
                            <Input value={form.expectedRoi} onChange={(e) => setForm({ ...form, expectedRoi: e.target.value })} placeholder="e.g. 10-15%" className="rounded-lg" />
                        </div>
                        <div>
                            <label className="text-xs text-charcoal/50 mb-1 block uppercase tracking-wider">Duration</label>
                            <Input value={form.duration} onChange={(e) => setForm({ ...form, duration: e.target.value })} placeholder="e.g. 12 months" className="rounded-lg" />
                        </div>
                        <div>
                            <label className="text-xs text-charcoal/50 mb-1 block uppercase tracking-wider">Risk Level</label>
                            <select value={form.risk} onChange={(e) => setForm({ ...form, risk: e.target.value })} className="w-full px-3 py-2 border rounded-lg text-sm">
                                <option>Low</option>
                                <option>Medium</option>
                                <option>Medium-High</option>
                                <option>High</option>
                            </select>
                        </div>
                        <div>
                            <label className="text-xs text-charcoal/50 mb-1 block uppercase tracking-wider">Color</label>
                            <Input type="color" value={form.color} onChange={(e) => setForm({ ...form, color: e.target.value })} className="rounded-lg h-10" />
                        </div>
                        <div className="md:col-span-2">
                            <label className="text-xs text-charcoal/50 mb-1 block uppercase tracking-wider">Description</label>
                            <Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="rounded-lg" rows={2} />
                        </div>
                        <div className="md:col-span-2">
                            <label className="text-xs text-charcoal/50 mb-1 block uppercase tracking-wider">Features (one per line)</label>
                            <Textarea
                                value={form.features.join('\n')}
                                onChange={(e) => setForm({ ...form, features: e.target.value.split('\n') })}
                                className="rounded-lg" rows={3}
                                placeholder="Feature 1&#10;Feature 2&#10;Feature 3"
                            />
                        </div>
                        <div className="flex items-center gap-2">
                            <input type="checkbox" checked={form.popular} onChange={(e) => setForm({ ...form, popular: e.target.checked })} className="accent-amber-500" />
                            <label className="text-sm text-charcoal">Mark as &quot;Most Popular&quot;</label>
                        </div>
                    </div>
                    <div className="flex gap-3 mt-5">
                        <Button onClick={handleSave} className="bg-emerald-brand hover:bg-emerald-dark text-white rounded-lg">Save Plan</Button>
                        <Button onClick={() => setEditing(null)} variant="outline" className="rounded-lg">Cancel</Button>
                    </div>
                </div>
            )}

            {/* Plans grid */}
            <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-4">
                {plans.map((plan) => (
                    <div key={plan.id} className="bg-white rounded-xl p-5 border border-border/50 relative">
                        {plan.popular && (
                            <div className="absolute -top-2 right-3 bg-amber-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">Popular</div>
                        )}
                        <div className="w-8 h-8 rounded-lg mb-3" style={{ backgroundColor: plan.color + '20', color: plan.color }}>
                            <div className="w-full h-full flex items-center justify-center text-sm font-bold">{plan.name[0]}</div>
                        </div>
                        <h3 className="font-display font-bold text-lg text-charcoal">{plan.name}</h3>
                        <p className="text-charcoal/50 text-xs mb-3">${plan.minInvestment.toLocaleString()} min · {plan.expectedRoi} ROI · {plan.risk}</p>
                        <p className="text-xs text-charcoal/40 mb-4 line-clamp-2">{plan.description}</p>
                        <div className="flex gap-2">
                            <button onClick={() => startEdit(plan)} className="text-xs text-amber-600 hover:text-amber-800 font-medium cursor-pointer">Edit</button>
                            <button onClick={() => handleDelete(plan.id)} className="text-xs text-red-500 hover:text-red-700 font-medium cursor-pointer">Remove</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
