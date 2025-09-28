// public/_worker.js (FINAL PRODUCTION VERSION - Corrected API v1 Endpoint)

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    if (url.pathname === '/api/contact') {
      if (request.method !== 'POST') {
        return new Response('Method Not Allowed', { status: 405 });
      }

      try {
        const formData = await request.formData();
        const body = Object.fromEntries(formData);

        const fromName = body.Name || 'Flow Networks Website';
        const fromEmail = env.FROM_EMAIL_ADDRESS;
        const fromString = `"${fromName}" <${fromEmail}>`;

        // --- FIX START ---
        // The correct Mailrelay API endpoint is /api/v1/send as per the documentation.
        const mailrelay_request = new Request(`https://${env.MAILRELAY_HOST}/api/v1/send`, {
        // --- FIX END ---
          method: 'POST',
          headers: {
            'X-Auth-Token': env.MAILRELAY_API_KEY,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            to: [env.TO_EMAIL_ADDRESS],
            from: fromString,
            subject: `New Contact Form Submission from ${body.Name || 'flownetworks.ai'}`,
            text: `You have a new message:\n\nName: ${body.Name}\nEmail: ${body.Email}\nVenue Type: ${body["Venue Type"]}\n\nMessage:\n${body.Message}`,
            reply_to: {
              name: body.Name || 'Form Submission',
              email: body.Email,
            }
          }),
        });

        const resp = await fetch(mailrelay_request);
        if (!resp.ok) {
          const errorData = await resp.json();
          console.error(`Mailrelay error: ${resp.status}`, errorData);
          return new Response(errorData.error || 'Error sending message.', { status: 500 });
        }

        // Redirect to the thank you page on success
        return Response.redirect(new URL('/thank-you.html', request.url).toString(), 302);

      } catch (e) {
        console.error('Worker Error:', e);
        return new Response('An unexpected error occurred.', { status: 500 });
      }
    }

    // Pass all other requests to the Pages static assets
    return env.ASSETS.fetch(request);
  },
};