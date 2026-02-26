import { useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function TermsAndConditions() {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="min-h-screen bg-[#f4f6f9] py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto bg-white p-8 md:p-12 rounded-2xl shadow-sm border border-border/50">

                <div className="mb-8 border-b border-border/50 pb-6">
                    <Link to="/" className="inline-flex items-center text-sm font-medium text-emerald-brand hover:text-emerald-700 mb-6 transition-colors">
                        <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        Back to Home
                    </Link>
                    <h1 className="text-3xl md:text-4xl font-display font-bold text-charcoal tracking-tight mb-2">Terms and Conditions</h1>
                    <p className="text-sm text-charcoal/50">Last Updated: February 26, 2026</p>
                </div>

                <div className="prose prose-sm md:prose-base prose-emerald max-w-none text-charcoal/80 space-y-6">

                    <p className="font-semibold text-charcoal">
                        PLEASE READ THESE TERMS AND CONDITIONS CAREFULLY. BY ACCESSING OR USING THIS WEBSITE AND ANY SERVICES OFFERED BY STEADY GAINS ("WE", "US", "OUR"), YOU AGREE TO BE BOUND BY THESE TERMS AND CONDITIONS AND ALL TERMS INCORPORATED BY REFERENCE. IF YOU DO NOT AGREE TO ALL OF THESE TERMS, DO NOT ACCESS OR USE THIS WEBSITE OR OUR SERVICES.
                    </p>

                    <section>
                        <h2 className="text-xl font-bold text-charcoal mt-8 mb-3">1. Agreement to Terms</h2>
                        <p>
                            These Terms and Conditions constitute a legally binding agreement made between you, whether personally or on behalf of an entity ("you") and Steady Gains, concerning your access to and use of the website as well as any other media form, media channel, mobile website or mobile application related, linked, or otherwise connected thereto (collectively, the "Site"). You agree that by accessing the Site, you have read, understood, and agreed to be bound by all of these Terms and Conditions. IF YOU DO NOT AGREE WITH ALL OF THESE TERMS AND CONDITIONS, THEN YOU ARE EXPRESSLY PROHIBITED FROM USING THE SITE AND YOU MUST DISCONTINUE USE IMMEDIATELY.
                        </p>
                        <p className="mt-2">
                            Supplemental terms and conditions or documents that may be posted on the Site from time to time are hereby expressly incorporated herein by reference. We reserve the right, in our sole discretion, to make changes or modifications to these Terms and Conditions at any time and for any reason. We will alert you about any changes by updating the "Last updated" date of these Terms and Conditions, and you waive any right to receive specific notice of each such change.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-charcoal mt-8 mb-3">2. Risk Disclosure & Investment Liability</h2>
                        <p>
                            <strong>Acknowledge of Risk:</strong> You explicitly acknowledge and agree that investments carry inherent risks, including but not limited to market volatility, economic factors, political instability, and the potential loss of your entire principal investment.
                        </p>
                        <p className="mt-2">
                            <strong>No Guarantee of Returns:</strong> Any "Target ROI", "Expected Returns", or "Historical Performance" metrics displayed on the Site are forward-looking statements or historical data and DO NOT constitute a promise, guarantee, or absolute prediction of future earnings. Actual returns may vary significantly. Steady Gains operates purely as an investment facilitator and accepts ZERO LIABILITY for financial losses incurred as a result of utilizing our plans, strategies, or recommendations.
                        </p>
                        <p className="mt-2">
                            <strong>Independent Financial Advice:</strong> The content provided on this Site is for informational purposes only and does not constitute financial, legal, or tax advice. You are strongly advised to seek independent financial counsel from a certified professional before committing any capital to our investment plans.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-charcoal mt-8 mb-3">3. Account Registration & Security</h2>
                        <p>
                            You may be required to register with the Site to access our investment services. You agree to keep your password confidential and will be responsible for all use of your account and password. We reserve the right to remove, reclaim, or change a username you select if we determine, in our sole discretion, that such username is inappropriate, obscene, or otherwise objectionable.
                        </p>
                        <p className="mt-2">
                            You must provide accurate, current, and complete information during the registration process and keep your account information up-to-date. If you provide any information that is untrue, inaccurate, not current, or incomplete, we have the right to suspend or terminate your account and refuse any and all current or future use of the Site (or any portion thereof) without refund of pending investments, subject to internal review.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-charcoal mt-8 mb-3">4. Investment Subscriptions & Modifications</h2>
                        <p>
                            <strong>Plan Enrollment:</strong> By subscribing to an investment plan, you authorize Steady Gains to allocate deposited capital into aggregated funds managed under the designated Risk Strategy (Low, Medium, High). Minimum deposit amounts apply and are strictly enforced.
                        </p>
                        <p className="mt-2">
                            <strong>Lock-In Periods:</strong> Certain investment plans may mandate fixed lock-in durations (e.g., 6 months, 12 months). Premature withdrawal requests submitted prior to the conclusion of the lock-in period may be subject to severe early termination penalties, forfeiture of accumulated ROI, or outright denial, at the sole discretion of Steady Gains administration.
                        </p>
                        <p className="mt-2">
                            <strong>Modification Requests:</strong> Requests to alter existing active plans (including increasing investment capital or altering risk strategies) are placed in a queue. These modifications do NOT take effect immediately. They are subject to Administrator review and approval. If an administrator does not manually approve the request, it will automatically execute at the dawn of the next defined billing/payout cycle. Administrators retain the unwavering right to reject any modification request without prior explanation.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-charcoal mt-8 mb-3">5. Anti-Money Laundering (AML) & KYC Compliance</h2>
                        <p>
                            As a financial entity, Steady Gains strictly adheres to local and international Anti-Money Laundering (AML) and Counter-Terrorism Financing (CTF) regulations. We maintain the right to enforce Know Your Customer (KYC) protocols at any time. This may require you to submit government-issued identification, proof of residency, and statements verifying financial origin.
                        </p>
                        <p className="mt-2">
                            Failure to comply with KYC requests within forty-eight (48) hours will result in immediate account freezing. Any suspicion of illicit financial structuring, money laundering, or fraudulent deposits will result in the immediate reporting of your account and identity to relevant federal authorities and the permanent forfeiture of all capital held within the platform.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-charcoal mt-8 mb-3">6. Platform Modifications & Interruptions</h2>
                        <p>
                            We cannot guarantee the Site will be available at all times. We may experience hardware, software, server, or other problems, or need to perform maintenance related to the Site, resulting in interruptions, delays, or errors. We reserve the right to change, revise, update, suspend, discontinue, or otherwise modify the Site at any time or for any reason without notice to you.
                        </p>
                        <p className="mt-2">
                            You agree that we have no liability whatsoever for any loss, damage, or inconvenience caused by your inability to access or use the Site during any downtime or discontinuance of the Site. Nothing in these Terms and Conditions will be construed to obligate us to maintain and support the Site or to supply any corrections, updates, or releases in connection therewith.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-charcoal mt-8 mb-3">7. Limitation of Liability</h2>
                        <p>
                            IN NO EVENT WILL WE OR OUR DIRECTORS, EMPLOYEES, OR AGENTS BE LIABLE TO YOU OR ANY THIRD PARTY FOR ANY DIRECT, INDIRECT, CONSEQUENTIAL, EXEMPLARY, INCIDENTAL, SPECIAL, OR PUNITIVE DAMAGES, INCLUDING LOST PROFIT, LOST REVENUE, LOSS OF DATA, OR OTHER DAMAGES ARISING FROM YOUR USE OF THE SITE, EVEN IF WE HAVE BEEN ADVISED OF THE POSSIBILITY OF SUCH DAMAGES. NOTWITHSTANDING ANYTHING TO THE CONTRARY CONTAINED HEREIN, OUR LIABILITY TO YOU FOR ANY CAUSE WHATSOEVER AND REGARDLESS OF THE FORM OF THE ACTION, WILL AT ALL TIMES BE LIMITED TO THE AMOUNT PAID, IF ANY, BY YOU TO US DURING THE ONE (1) MONTH PERIOD PRIOR TO ANY CAUSE OF ACTION ARISING. CERTAIN US STATE LAWS AND INTERNATIONAL LAWS DO NOT ALLOW LIMITATIONS ON IMPLIED WARRANTIES OR THE EXCLUSION OR LIMITATION OF CERTAIN DAMAGES.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-charcoal mt-8 mb-3">8. Contact Us</h2>
                        <p>
                            In order to resolve a complaint regarding the Site or to receive further information regarding use of the Site, please contact us at: legal@steadygains.com.
                        </p>
                        <div className="mt-12 p-6 bg-charcoal/5 rounded-xl text-center">
                            <p className="font-semibold text-charcoal">End of Term & Condition Agreement</p>
                            <p className="text-xs text-charcoal/50 mt-1">Document Control Ref: SG-TC-2026-v1.4</p>
                        </div>
                    </section>

                </div>
            </div>
        </div>
    );
}
