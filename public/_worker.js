// public/_worker.js (Updated with Enhanced Error Diagnostics)

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

        const mailrelay_request = new Request(`https://${env.MAILRELAY_HOST}/api/v2/send`, {
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

        // --- ENHANCED ERROR HANDLING START ---
        // If the response from Mailrelay is not successful...
        if (!resp.ok) {
          // Get the raw text of the error response, as it might not be JSON.
          const errorText = await resp.text();
          console.error(`Mailrelay API Error: ${resp.status} ${resp.statusText}`, errorText);
          
          // Return the ACTUAL error message directly to the browser for debugging.
          // This will show us exactly what Mailrelay is complaining about.
          return new Response(
            `Mailrelay API failed with status ${resp.status}:\n\n${errorText}`, 
            { 
              status: 502, // 502 Bad Gateway is an appropriate error here
              headers: { 'Content-Type': 'text/plain' }
            }
          );
        }
        // --- ENHANCED ERROR HANDLING END ---

        // If successful, redirect to the thank you page.
        return Response.redirect(new URL('/thank-you.html', request.url).toString(), 302);

      } catch (e) {
        console.error('Worker Error:', e);
        return new Response('An unexpected error occurred.', { status: 500 });
      }
    }

    // Pass all other requests to the Pages static assets.
    return env.ASSETS.fetch(request);
  },
};