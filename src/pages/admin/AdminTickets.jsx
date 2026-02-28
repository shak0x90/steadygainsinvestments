import { useState, useEffect } from 'react';
import api from '@/utils/api';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import toast from 'react-hot-toast';

export default function AdminTickets() {
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState('OPEN');
    const [selectedTicket, setSelectedTicket] = useState(null);
    const [replyText, setReplyText] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const fetchTickets = async () => {
        setLoading(true);
        try {
            const data = await api.getAllTickets(statusFilter);
            setTickets(data);
        } catch (err) {
            toast.error('Failed to load tickets');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTickets();
        setSelectedTicket(null);
    }, [statusFilter]);

    const handleReply = async (resolve = true) => {
        if (!replyText) return toast.error('Reply cannot be empty');
        setIsSubmitting(true);
        try {
            const status = resolve ? 'RESOLVED' : 'OPEN';
            const updated = await api.replyTicket(selectedTicket.id, {
                adminReply: replyText,
                status,
            });
            toast.success(resolve ? 'Reply sent & marked resolved' : 'Reply sent');
            setSelectedTicket(updated);
            fetchTickets(); // Refresh list to move it if filter changed
        } catch (err) {
            toast.error(err.message || 'Failed to reply');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleStatusChange = async (newStatus) => {
        try {
            const updated = await api.replyTicket(selectedTicket.id, { status: newStatus });
            toast.success(`Status changed to ${newStatus}`);
            setSelectedTicket(updated);
            fetchTickets();
        } catch (err) {
            toast.error('Failed to change status');
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="font-display text-2xl font-bold text-charcoal">Support Tickets</h1>
                    <p className="text-sm text-charcoal/50 mt-1">Manage and resolve user support requests.</p>
                </div>
                <div className="flex gap-2 bg-white p-1 rounded-xl border border-border/50">
                    {['ALL', 'OPEN', 'RESOLVED'].map((s) => (
                        <button
                            key={s}
                            onClick={() => setStatusFilter(s)}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${statusFilter === s
                                ? 'bg-emerald-brand text-white shadow-sm'
                                : 'text-charcoal/60 hover:text-charcoal hover:bg-cream'
                                }`}
                        >
                            {s}
                        </button>
                    ))}
                </div>
            </div>

            <div className="grid lg:grid-cols-[1fr_400px] gap-6">
                {/* Tickets List */}
                <div className="bg-white rounded-xl border border-border/50 shadow-sm overflow-hidden flex flex-col h-[calc(100vh-220px)]">
                    {loading ? (
                        <div className="flex-1 flex items-center justify-center">
                            <div className="animate-spin w-8 h-8 border-4 border-emerald-brand border-t-transparent rounded-full" />
                        </div>
                    ) : tickets.length === 0 ? (
                        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-charcoal/50">
                            <svg className="w-16 h-16 text-charcoal/20 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                            </svg>
                            <p className="text-lg font-medium text-charcoal mb-2">No {statusFilter === 'ALL' ? '' : statusFilter.toLowerCase()} tickets found.</p>
                            <p className="text-sm">You're all caught up!</p>
                        </div>
                    ) : (
                        <div className="overflow-y-auto divide-y divide-border/30">
                            {tickets.map(ticket => (
                                <button
                                    key={ticket.id}
                                    onClick={() => {
                                        setSelectedTicket(ticket);
                                        setReplyText(ticket.adminReply || '');
                                    }}
                                    className={`w-full text-left p-5 hover:bg-cream/50 transition-colors flex flex-col gap-2 ${selectedTicket?.id === ticket.id ? 'bg-cream/50 border-l-4 border-emerald-brand' : 'border-l-4 border-transparent'
                                        }`}
                                >
                                    <div className="flex items-start justify-between w-full">
                                        <div className="flex items-center gap-2">
                                            <span className={`w-2.5 h-2.5 rounded-full ${ticket.status === 'OPEN' ? 'bg-amber-500' : 'bg-emerald-500'}`} />
                                            <span className="font-semibold text-charcoal truncate pr-4">{ticket.subject}</span>
                                        </div>
                                        <span className="text-xs text-charcoal/40 whitespace-nowrap">
                                            {new Date(ticket.createdAt).toLocaleDateString()}
                                        </span>
                                    </div>
                                    <p className="text-sm text-charcoal/60 truncate pr-4 pl-4.5">{ticket.message}</p>
                                    <div className="pl-4.5 flex items-center gap-2 text-xs text-charcoal/50">
                                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                                        </svg>
                                        <span>{ticket.user?.name} ({ticket.user?.email})</span>
                                        {ticket.attachment && (
                                            <span className="ml-2 flex items-center gap-1 text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">
                                                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M18.375 12.739l-7.693 7.693a4.5 4.5 0 01-6.364-6.364l10.94-10.94A3 3 0 1119.5 7.372L8.552 18.32m.009-.01l-.01.01m5.699-9.941l-7.81 7.81a1.5 1.5 0 002.112 2.13" /></svg>
                                                Attachment
                                            </span>
                                        )}
                                    </div>
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Ticket Detail Panel */}
                <div className="bg-white rounded-xl border border-border/50 shadow-sm p-6 flex flex-col h-[calc(100vh-220px)] overflow-y-auto">
                    {selectedTicket ? (
                        <div className="space-y-6">
                            <div>
                                <div className="flex items-start justify-between mb-2">
                                    <h2 className="font-bold text-lg text-charcoal break-words">{selectedTicket.subject}</h2>
                                    <div className="flex flex-col items-end gap-1">
                                        <span className={`px-2 py-1 rounded text-xs font-bold leading-none ${selectedTicket.status === 'OPEN' ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'}`}>
                                            {selectedTicket.status}
                                        </span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 text-xs text-charcoal/60 mb-4 border-b border-border/50 pb-4">
                                    <span>From: {selectedTicket.user?.name}</span>
                                    <span>•</span>
                                    <span>{new Date(selectedTicket.createdAt).toLocaleString()}</span>
                                </div>
                                <p className="text-sm text-charcoal/80 whitespace-pre-wrap">{selectedTicket.message}</p>
                            </div>

                            {selectedTicket.attachment && (
                                <div>
                                    <p className="text-xs font-semibold uppercase tracking-wider text-charcoal/50 mb-2">Attached Image</p>
                                    <a href={import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL.replace('/api', '') + selectedTicket.attachment : selectedTicket.attachment} target="_blank" rel="noreferrer">
                                        <img src={import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL.replace('/api', '') + selectedTicket.attachment : selectedTicket.attachment} alt="User upload" className="w-full max-h-48 object-cover rounded-lg border border-border/50 shadow-sm hover:opacity-90 transition-opacity" />
                                    </a>
                                </div>
                            )}

                            <div className="pt-4 border-t border-border/50">
                                <h3 className="text-sm font-semibold text-charcoal mb-3">Admin Reply</h3>
                                <Textarea
                                    value={replyText}
                                    onChange={(e) => setReplyText(e.target.value)}
                                    placeholder="Type your response to the user..."
                                    className="min-h-[120px] mb-3"
                                />
                                <div className="flex gap-2">
                                    {selectedTicket.status === 'OPEN' ? (
                                        <div className="flex flex-1 gap-2">
                                            <Button
                                                onClick={() => handleReply(false)}
                                                disabled={isSubmitting}
                                                className="flex-1 bg-charcoal hover:bg-charcoal/90 text-white"
                                            >
                                                {isSubmitting ? 'Sending...' : 'Send Reply (Keep Open)'}
                                            </Button>
                                            <Button
                                                onClick={() => handleReply(true)}
                                                disabled={isSubmitting}
                                                className="flex-1 bg-emerald-brand hover:bg-emerald-dark text-white"
                                            >
                                                {isSubmitting ? 'Sending...' : 'Send & Resolve'}
                                            </Button>
                                        </div>
                                    ) : (
                                        <div className="flex flex-1 gap-2">
                                            <Button
                                                onClick={handleReply}
                                                disabled={isSubmitting}
                                                className="flex-1 bg-charcoal hover:bg-charcoal/90 text-white"
                                            >
                                                Update Reply
                                            </Button>
                                            <Button
                                                onClick={() => handleStatusChange('OPEN')}
                                                variant="outline"
                                                className="flex-1 text-amber-600 border-amber-200 hover:bg-amber-50"
                                            >
                                                Reopen Ticket
                                            </Button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="flex-1 flex flex-col items-center justify-center text-center text-charcoal/40">
                            <svg className="w-12 h-12 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.042 21.672L13.684 16.6m0 0l-2.51 2.225.569-9.47 5.227 7.917-3.286-.672zM12 2.25V4.5m5.834.166l-1.591 1.591M20.25 10.5H18M7.757 14.743l-1.59 1.59M6 10.5H3.75m4.007-4.243l-1.59-1.59" />
                            </svg>
                            <p className="text-sm">Select a ticket from the list to view details and reply.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
