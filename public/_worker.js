export default {
    async fetch(request, env, ctx) {
        // ... (existing code to handle URL and method checks) ...

        if (url.pathname === '/api/contact' && request.method === 'POST') {
            try {
                const formData = await request.formData();
                const body = Object.fromEntries(formData);

                // --- NEW: Cloudflare Turnstile Verification ---
                const turnstileToken = formData.get('cf-turnstile-response');
                const ip = request.headers.get('CF-Connecting-IP');

                let turnstileFormData = new FormData();
                turnstileFormData.append('secret', env.TURNSTILE_SECRET_KEY);
                turnstileFormData.append('response', turnstileToken);
                turnstileFormData.append('remoteip', ip);

                const turnstileResult = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
                    body: turnstileFormData,
                    method: 'POST',
                });

                const turnstileOutcome = await turnstileResult.json();
                if (!turnstileOutcome.success) {
                    return new Response('CAPTCHA verification failed. Please try again.', { status: 403 });
                }
                // --- END: Turnstile Verification ---

                const mailrelay_payload = {
                    from: {
                        name: body.full_name || 'Flow Networks Website',
                        email: env.FROM_EMAIL_ADDRESS,
                    },
                    to: [{
                        email: env.TO_EMAIL_ADDRESS,
                        name: 'Flow Networks Admin'
                    }],
                    // --- NEW: Dynamic subject line ---
                    subject: `New Inquiry via '${body.cta_source}' from ${body.full_name}`,
                    
                    // --- NEW: Updated email body with new fields ---
                    html_part: `
                        <p>You have a new inquiry from the website:</p>
                        <ul>
                            <li><strong>Source CTA:</strong> ${body.cta_source || 'Not provided'}</li>
                            <li><strong>Full Name:</strong> ${body.full_name || 'Not provided'}</li>
                            <li><strong>Business Name:</strong> ${body.business_name || 'Not provided'}</li>
                            <li><strong>Email:</strong> ${body.email || 'Not provided'}</li>
                            <li><strong>City:</strong> ${body.city || 'Not provided'}</li>
                        </ul>
                        <p><strong>Comment:</strong></p>
                        <p>${body.comment || 'Not provided'}</p>
                    `,
                    text_part: `...` // (You can create a matching text part)
                };
                
                // ... (rest of the MailRelay fetch request and response handling is the same) ...

            } catch (e) {
                console.error('Cloudflare Worker Error:', e);
                return new Response('An unexpected server error occurred.', { status: 500 });
            }
        }
        return env.ASSETS.fetch(request);
    },
};