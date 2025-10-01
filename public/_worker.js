// public/_worker.js (CORRECTED AND OPTIMIZED by Cody)

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    // Ensure we only process POST requests to our contact API endpoint
    if (url.pathname === '/api/contact' && request.method === 'POST') {
      
      try {
        const formData = await request.formData();
        const body = Object.fromEntries(formData);

        // --- FIX: Re-architected the payload for Mailrelay API ---
        // This structure now precisely matches the official Mailrelay documentation.
        const mailrelay_payload = {
          to: [
            {
              email: env.TO_EMAIL_ADDRESS, // Your destination email from Cloudflare secrets
              name: 'Flow Networks Admin'
            }
          ],
          from: {
            name: body.name || 'Flow Networks Website', // Use sender's name or a default
            email: env.FROM_EMAIL_ADDRESS, // Your sending email from Cloudflare secrets
          },
          subject: `New Contact Form Submission from ${body.name || 'flownetworks.ai'}`,
          // Providing both HTML and text parts for maximum email client compatibility.
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

        // Construct the request to the official Mailrelay API endpoint
        const mailrelay_request = new Request(`https://${env.MAILRELAY_HOST}/api/v1/send_emails`, {
          method: 'POST',
          headers: {
            'x-auth-token': env.MAILRELAY_API_KEY, // Using the correct header name
            'content-type': 'application/json',
          },
          body: JSON.stringify(mailrelay_payload),
        });

        const response = await fetch(mailrelay_request);

        // Robust error handling
        if (!response.ok) {
          const errorData = await response.json();
          // Log the specific error for our own debugging
          console.error(`Mailrelay API Error: ${response.status}`, errorData);
          // Return a generic but helpful error to the user
          return new Response('There was an issue sending your message. Please try again later.', { status: 500 });
        }

        // On success, redirect to our thank-you page
        const thankYouUrl = new URL('/thank-you.html', request.url).toString();
        return Response.redirect(thankYouUrl, 302);

      } catch (e) {
        console.error('Cloudflare Worker Error:', e);
        return new Response('An unexpected server error occurred.', { status: 500 });
      }
    }

    // For any other request, serve the static assets from the Pages deployment.
    return env.ASSETS.fetch(request);
  },
};
