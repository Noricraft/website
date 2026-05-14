export default function ContactPage() {
  return (
    <main id="contact">
      <section aria-labelledby="contact-title">
        <h1 id="contact-title">Contact</h1>
        <p>
          Tell us about your current setup and what you want to improve with
          Notion templates or AI automations.
        </p>
      </section>

      <section aria-labelledby="contact-next-title">
        <h2 id="contact-next-title">Coming next</h2>
        <p>
          Calendar booking options, service intake flow, and faster onboarding
          for new projects.
        </p>
      </section>

      <section aria-labelledby="contact-form-title">
        <h2 id="contact-form-title">Send a quick request</h2>
        <form method="post" action="#">
          <p>
            <label htmlFor="name">Name</label>
            <br />
            <input
              id="name"
              name="name"
              type="text"
              autoComplete="name"
              placeholder="Your name"
            />
          </p>

          <p>
            <label htmlFor="email">Email</label>
            <br />
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              placeholder="you@company.com"
            />
          </p>

          <p>
            <label htmlFor="message">Message</label>
            <br />
            <textarea
              id="message"
              name="message"
              rows={5}
              placeholder="Briefly describe your goals."
            />
          </p>

          <button type="submit">Submit</button>
        </form>
      </section>
    </main>
  );
}

