import { useState } from 'react';
import { EMAIL, waLink } from '../lib/perf.js';
import Reveal from '../components/Reveal.jsx';
import { Link } from '../lib/router.jsx';
import Card3D from '../components/Card3D.jsx';

const NEEDS = ['Website', 'Web app', '3D or motion', 'Not sure yet'];

export default function Contact() {
  const [name, setName] = useState('');
  const [bot, setBot] = useState('');
  const [sent, setSent] = useState(false);
  const [need, setNeed] = useState(NEEDS[0]);
  const [msg, setMsg] = useState('');
  const [copied, setCopied] = useState('');
  const text = `Hi KREATION, I am ${name || 'a new client'}. I need: ${need}.${msg ? ' ' + msg : ''}`;
  const copy = async (v, k) => {
    try {
      await navigator.clipboard.writeText(v);
      setCopied(k);
      setTimeout(() => setCopied(''), 1800);
    } catch {}
  };
  return (
    <>
      <section className="pagehead wrap">
        <p className="eyebrow">Contact</p>
        <h1>Tell us what you need.</h1>
        <p className="lead">The fastest way is WhatsApp. Email works too.</p>
      </section>
      <section className="wrap contact-grid">
        <Reveal>
          <Card3D className="card ct-card">
            <h2 className="h3">WhatsApp</h2>
            <p className="muted">Chat with us directly, usually the fastest reply.</p>
            <a className="btn btn-solid" href={waLink('Hi KREATION, I would like to talk about a project.')} target="_blank" rel="noopener noreferrer">
              Open WhatsApp
            </a>
          </Card3D>
        </Reveal>
        <Reveal delay={60}>
          <Card3D className="card ct-card">
            <h2 className="h3">Email</h2>
            <p className="muted brk">{EMAIL}</p>
            <a className="btn btn-solid" href={`mailto:${EMAIL}?subject=${encodeURIComponent('Project enquiry')}`}>
              Send an email
            </a>
            <button className="btn" onClick={() => copy(EMAIL, 'em')}>
              {copied === 'em' ? 'Copied' : 'Copy address'}
            </button>
          </Card3D>
        </Reveal>
        <Reveal delay={120} className="span2">
          {sent ? (
            <Card3D className="card form thanks" role="status">
              <h2 className="h3">Thank you{name ? `, ${name}` : ''}.</h2>
              <p className="muted">WhatsApp should have opened with your message ready. Press send there, and we reply as soon as we see it.</p>
              <p className="muted">
                Did not open? <a href={waLink(text)} target="_blank" rel="noopener noreferrer">Tap here to try again</a> or email us at{' '}
                <a className="brk" href={`mailto:${EMAIL}`}>{EMAIL}</a>.
              </p>
              <button
                className="btn"
                type="button"
                onClick={() => {
                  setSent(false);
                  setMsg('');
                }}
              >
                Write another message
              </button>
            </Card3D>
          ) : (
          <form
            className="card form"
            onSubmit={(e) => {
              e.preventDefault();
              if (bot) {
                setSent(true);
                return;
              }
              window.open(waLink(text), '_blank', 'noopener');
              setSent(true);
            }}
          >
            <h2 className="h3">Write it once, send on WhatsApp</h2>
            <label className="hp" aria-hidden="true">
              Company
              <input value={bot} onChange={(e) => setBot(e.target.value)} tabIndex={-1} autoComplete="off" />
            </label>
            <label>
              Your name
              <input value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" maxLength={60} placeholder="Your name" />
            </label>
            <label>
              I need
              <select value={need} onChange={(e) => setNeed(e.target.value)}>
                {NEEDS.map((n) => (
                  <option key={n}>{n}</option>
                ))}
              </select>
            </label>
            <label>
              A few words about it
              <textarea value={msg} onChange={(e) => setMsg(e.target.value)} rows={3} maxLength={400} placeholder="What does your business do?" />
            </label>
            <button className="btn btn-solid" type="submit">
              Continue in WhatsApp
            </button>
            <p className="muted small">This opens WhatsApp with your message ready. Nothing is stored on this site.</p>
          </form>
          )}
        </Reveal>
      </section>
      <section className="wrap sec">
        <p className="muted center">
          Quick questions? <Link to="/services#faq">Read the FAQ</Link>.
        </p>
        <p className="muted center">Based in India.</p>
      </section>
    </>
  );
}
