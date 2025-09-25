// public/_worker.js

// This function will be the entry point for all requests to your site.
export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    // Check if the request is for our API endpoint
    if (url.pathname === '/api/contact') {
      // This is a form submission, handle it.

      if (request.method !== 'POST') {
        return new Response('Method Not Allowed', { status: 405 });
      }

      try {
        const formData = await request.formData();
        const body = Object.fromEntries(formData);

        const send_request = new Request('https://api.sendgrid.com/v3/mail/send', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${env.SENDGRID_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            personalizations: [{ to: [{ email: env.TO_EMAIL_ADDRESS }] }],
            from: { email: env.FROM_EMAIL_ADDRESS },
            subject: `New Contact Form Submission from ${body.Name || 'flownetworks.ai'}`,
            content: [{
              type: 'text/plain',
              value: `You have a new message:\n\nName: ${body.Name}\nEmail: ${body.Email}\nVenue Type: ${body["Venue Type"]}\nMessage:\n${body.Message}`,
            }],
          }),
        });

        const resp = await fetch(send_request);
        if (!resp.ok) {
          console.error(`SendGrid error: ${resp.status}`, await resp.text());
          return new Response('Error sending message.', { status: 500 });
        }

        // Redirect to the thank you page on success
        return Response.redirect(new URL('/thank-you.html', request.url).toString(), 302);

      } catch (e) {
        console.error('Worker Error:', e);
        return new Response('An unexpected error occurred.', { status: 500 });
      }
    }

    // If it's not an API request, pass it to the Pages static assets to handle.
    // This is what serves your index.html, images, etc.
    return env.ASSETS.fetch(request);
  },
};