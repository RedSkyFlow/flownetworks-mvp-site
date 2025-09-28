// public/_worker.js (FINAL PRODUCTION VERSION - Aligned with Official API Docs)

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

        // --- FIX START ---
        // The entire payload is now structured to match the official Mailrelay API documentation exactly.
        const mailrelay_payload = {
          to: [{ email: env.TO_EMAIL_ADDRESS }],
          from: {
            name: body.Name || 'Flow Networks Website',
            email: env.FROM_EMAIL_ADDRESS,
          },
          subject: `New Contact Form Submission from ${body.Name || 'flownetworks.ai'}`,
          text_part: `You have a new message:\n\nName: ${body.Name}\nEmail: ${body.Email}\nVenue Type: ${body["Venue Type"]}\n\nMessage:\n${body.Message}`,
        };
        // --- FIX END ---

        const mailrelay_request = new Request(`https://${env.MAILRELAY_HOST}/api/v1/send_emails`, {
          method: 'POST',
          headers: {
            'X-Auth-Token': env.MAILRELAY_API_KEY,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(mailrelay_payload),
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