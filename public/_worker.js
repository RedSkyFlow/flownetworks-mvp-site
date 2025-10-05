// public/_worker.js (CORRECTED AND FINALIZED by Cody)

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    if (url.pathname === '/api/contact' && request.method === 'POST') {
      try {
        const formData = await request.formData();
        const body = Object.fromEntries(formData);

        // --- FIX: Reordered payload to match MailRelay's exact specification ---
        // The API requires the 'from' object to be declared before the 'to' object.
        const mailrelay_payload = {
          from: {
            name: body.name || 'Flow Networks Website', // Use sender's name or a default
            email: env.FROM_EMAIL_ADDRESS, // Your sending email from Cloudflare secrets
          },
          to: [
            {
              email: env.TO_EMAIL_ADDRESS, // Your destination email from Cloudflare secrets
              name: 'Flow Networks Admin'
            }
          ],
          subject: `New Contact Form Submission from ${body.name || 'flownetworks.ai'}`,
          html_part: `
            <p>You have a new message:</p>
            <ul>
              <li><strong>Name:</strong> ${body.name || 'Not provided'}</li>
              <li><strong>Email:</strong> ${body.email || 'Not provided'}</li>
              <li><strong>Venue Type:</strong> ${body["venue-type"] || 'Not provided'}</li>
            </ul>
            <p><strong>Message:</strong></p>
            <p>${body.message || 'Not provided'}</p>
          `,
          text_part: `
            You have a new message:\n
            Name: ${body.name || 'Not provided'}\n
            Email: ${body.email || 'Not provided'}\n
            Venue Type: ${body["venue-type"] || 'Not provided'}\n
            Message:\n${body.message || 'Not provided'}
          `
        };
        // --- END FIX ---

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
        console.error('Cloudflare Worker Error:', e);
        return new Response('An unexpected server error occurred.', { status: 500 });
      }
    }

    return env.ASSETS.fetch(request);
  },
};