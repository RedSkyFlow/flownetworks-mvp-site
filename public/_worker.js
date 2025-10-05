export default {
  async fetch(request, env, ctx) {
    // --- THIS LINE WAS MISSING ---
    const url = new URL(request.url);

    if (url.pathname === '/api/contact' && request.method === 'POST') {
      try {
        const formData = await request.formData();
        const body = Object.fromEntries(formData);

        // --- Cloudflare Turnstile Verification ---
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
          // Log the specific error for debugging if available
          console.error("Turnstile verification failed:", turnstileOutcome['error-codes'] || 'No error codes');
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
          subject: `New Inquiry via '${body.cta_source}' from ${body.full_name}`,
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
          text_part: `
            You have a new inquiry from the website:\n
            Source CTA: ${body.cta_source || 'Not provided'}\n
            Full Name: ${body.full_name || 'Not provided'}\n
            Business Name: ${body.business_name || 'Not provided'}\n
            Email: ${body.email || 'Not provided'}\n
            City: ${body.city || 'Not provided'}\n
            Comment:\n${body.comment || 'Not provided'}
          `
        };

        const mailrelay_request = new Request(`https://${env.MAILRELAY_HOST}/api/v1/send_emails`, {
          method: 'POST',
          headers: {
            'x-auth-token': env.MAILRELAY_API_KEY,
            'content-type': 'application/json',
          },
          body: JSON.stringify(mailrelay_payload),
        });

        const response = await fetch(mailrelay_request);

        if (!response.ok) {
          const errorData = await response.json();
          console.error(`Mailrelay API Error: ${response.status}`, errorData);
          return new Response('There was an issue sending your message. Please try again later.', { status: 500 });
        }

        const thankYouUrl = new URL('/thank-you.html', request.url).toString();
        return Response.redirect(thankYouUrl, 302);

      } catch (e) {
        console.error('Cloudflare Worker Error:', e.message);
        return new Response('An unexpected server error occurred.', { status: 500 });
      }
    }

    // For all other requests (like loading the homepage), serve the static assets.
    return env.ASSETS.fetch(request);
  },
};