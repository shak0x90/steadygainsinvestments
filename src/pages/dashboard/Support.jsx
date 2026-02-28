import { useState, useEffect } from 'react';
import api from '@/utils/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import toast from 'react-hot-toast';

export default function Support() {
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isCreateOpen, setIsCreateOpen] = useState(false);

    // Form state
    const [subject, setSubject] = useState('');
    const [message, setMessage] = useState('');
    const [attachment, setAttachment] = useState(null);
    const [submitting, setSubmitting] = useState(false);

    const fetchTickets = async () => {
        try {
            const data = await api.getMyTickets();
            setTickets(data);
        } catch (err) {
            toast.error('Failed to load tickets');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTickets();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!subject || !message) return toast.error('Subject and message are required');

        setSubmitting(true);
        try {
            let attachmentUrl = null;
            if (attachment) {
                const uploadRes = await api.uploadFile(attachment);
                attachmentUrl = uploadRes.url;
            }

            await api.createTicket({ subject, message, attachment: attachmentUrl });
            toast.success('Ticket created successfully');
            setIsCreateOpen(false);
            setSubject('');
            setMessage('');
            setAttachment(null);
            fetchTickets();
        } catch (err) {
            toast.error(err.message || 'Failed to create ticket');
        } finally {
            setSubmitting(false);
        }
    };

    const getStatusStyle = (status) => {
        switch (status) {
            case 'OPEN': return 'bg-amber-100 text-amber-800';
            case 'IN_PROGRESS': return 'bg-blue-100 text-blue-800';
            case 'RESOLVED': return 'bg-emerald-100 text-emerald-800';
            case 'CLOSED': return 'bg-gray-100 text-gray-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    if (loading) {
        return <div className="flex justify-center py-20"><div className="animate-spin w-8 h-8 border-4 border-emerald-brand border-t-transparent rounded-full" /></div>;
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="font-display text-2xl font-bold text-charcoal">Support Tickets</h1>
                    <p className="text-sm text-charcoal/50 mt-1">Need help? Open a ticket and our team will assist you.</p>
                </div>
                <Button onClick={() => setIsCreateOpen(true)} className="bg-emerald-brand hover:bg-emerald-dark text-white rounded-lg">
                    + New Ticket
                </Button>
            </div>

            {/* Ticket List */}
            {tickets.length === 0 ? (
                <div className="text-center py-16 bg-white rounded-xl border border-border/50">
                    <svg className="w-12 h-12 text-charcoal/20 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                    </svg>
                    <h3 className="text-lg font-medium text-charcoal mb-2">No tickets yet</h3>
                    <p className="text-charcoal/50 mb-6">If you have any questions or issues, let us know.</p>
                    <Button onClick={() => setIsCreateOpen(true)} variant="outline">
                        Create your first ticket
                    </Button>
                </div>
            ) : (
                <div className="space-y-4">
                    {tickets.map(ticket => (
                        <div key={ticket.id} className="bg-white rounded-xl p-6 border border-border/50 shadow-sm flex flex-col gap-4">
                            <div className="flex items-start justify-between gap-4">
                                <div className="space-y-1 mt-1">
                                    <h3 className="font-semibold text-charcoal">{ticket.subject}</h3>
                                    <p className="text-xs text-charcoal/50">
                                        Submitted on {new Date(ticket.createdAt).toLocaleDateString()}
                                    </p>
                                </div>
                                <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold tracking-wider uppercase ${getStatusStyle(ticket.status)}`}>
                                    {ticket.status.replace('_', ' ')}
                                </span>
                            </div>

                            <p className="text-sm text-charcoal/80 bg-gray-50 p-3 rounded-lg border border-border/30">
                                {ticket.message}
                            </p>

                            {ticket.attachment && (
                                <div>
                                    <p className="text-xs text-charcoal/50 mb-1">Attachment:</p>
                                    <img src={import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL.replace('/api', '') + ticket.attachment : ticket.attachment} alt="Attachment" className="max-w-[200px] rounded-lg border border-border/50" />
                                </div>
                            )}

                            {ticket.adminReply && (
                                <div className="mt-2 bg-emerald-50/50 p-4 rounded-lg border border-emerald-brand/20">
                                    <div className="flex items-center gap-2 mb-2">
                                        <div className="w-5 h-5 rounded-full bg-emerald-brand flex items-center justify-center">
                                            <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                                            </svg>
                                        </div>
                                        <span className="text-sm font-semibold text-emerald-brand">Admin Reply</span>
                                    </div>
                                    <p className="text-sm text-charcoal/80">{ticket.adminReply}</p>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {/* Create Ticket Modal */}
            {isCreateOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal/40 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl animate-fade-in-up">
                        <div className="px-6 py-4 border-b border-border/50 flex items-center justify-between bg-cream/30">
                            <h3 className="font-display font-semibold text-lg text-charcoal">Create Support Ticket</h3>
                            <button onClick={() => setIsCreateOpen(false)} className="text-charcoal/40 hover:text-charcoal p-1">
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        <div className="p-6">
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="text-xs text-charcoal/50 mb-1.5 block tracking-wider uppercase">Subject</label>
                                    <Input
                                        value={subject}
                                        onChange={(e) => setSubject(e.target.value)}
                                        placeholder="Briefly describe the issue..."
                                        className="rounded-lg"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="text-xs text-charcoal/50 mb-1.5 block tracking-wider uppercase">Message</label>
                                    <Textarea
                                        value={message}
                                        onChange={(e) => setMessage(e.target.value)}
                                        placeholder="Provide more details about your request..."
                                        className="rounded-lg min-h-[120px]"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="text-xs text-charcoal/50 mb-1.5 block tracking-wider uppercase">Attachment (Photo)</label>
                                    <Input
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => setAttachment(e.target.files[0])}
                                        className="rounded-lg file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100"
                                    />
                                    <p className="text-[10px] text-charcoal/40 mt-1">Optional. Max size: 5MB.</p>
                                </div>
                                <div className="pt-4 flex gap-3">
                                    <Button type="button" variant="outline" onClick={() => setIsCreateOpen(false)} className="flex-1 rounded-xl">
                                        Cancel
                                    </Button>
                                    <Button type="submit" disabled={submitting} className="flex-1 bg-emerald-brand hover:bg-emerald-dark text-white rounded-xl">
                                        {submitting ? 'Submitting...' : 'Submit Ticket'}
                                    </Button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
