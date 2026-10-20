import { Link } from '../lib/router.jsx';
import { EMAIL } from '../lib/perf.js';
import Reveal from '../components/Reveal.jsx';

export default function Privacy() {
  return (
    <>
      <section className="pagehead wrap">
        <p className="eyebrow">Privacy</p>
        <h1>Your information, in plain words.</h1>
        <p className="lead">Short version: this site collects almost nothing, and what you send us stays between us.</p>
      </section>
      <section className="wrap prose">
        <Reveal>
          <h2 className="h3">What this site collects</h2>
          <p className="muted">
            Nothing itself. There are no accounts, no sign-ups and no tracking cookies on this website. Pages and images load from our
            hosting provider (Vercel), which keeps standard server logs to keep the site running.
          </p>
        </Reveal>
        <Reveal>
          <h2 className="h3">The contact form</h2>
          <p className="muted">
            The form on the <Link to="/contact">contact page</Link> does not store or send anything through this site. It opens WhatsApp
            with your message ready, and you press send there. From that point your message lives in WhatsApp, under WhatsApp&apos;s own
            privacy policy. The same applies if you email us instead.
          </p>
        </Reveal>
        <Reveal>
          <h2 className="h3">Visit counting</h2>
          <p className="muted">
            We use Vercel Analytics to count visits and see which pages are read. It is anonymous: no cookies, no names, no following
            you around other websites. It tells us &quot;someone read the work page&quot;, never who.
          </p>
        </Reveal>
        <Reveal>
          <h2 className="h3">What we never do</h2>
          <p className="muted">
            We do not sell or share your details with anyone. We do not run advertising trackers. If you become a client, your project
            files and messages are used only to do your work.
          </p>
        </Reveal>
        <Reveal>
          <h2 className="h3">Questions</h2>
          <p className="muted">
            Write to <a className="brk" href={`mailto:${EMAIL}`}>{EMAIL}</a> and we will answer.
          </p>
          <p className="muted small">Last updated: 20 October 2026.</p>
        </Reveal>
      </section>
    </>
  );
}
