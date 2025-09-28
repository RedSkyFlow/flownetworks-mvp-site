// public/_worker.js (DIAGNOSTIC VERSION - CORRECTED SYNTAX)

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    // Check if the request is for our API endpoint
    if (url.pathname === '/api/contact') {
      
      // This is our test. We will try to read the MAILRELAY_HOST variable
      // and return it directly to the browser.
      const hostValue = env.MAILRELAY_HOST;

      // Return a plain text response showing the value.
      return new Response(`Host: ${hostValue}`, {
        headers: { 'Content-Type': 'text/plain' },
      });
    }

    // Pass all other requests to the Pages static assets
    return env.ASSETS.fetch(request);
  },
};