import { useEffect, useState } from 'react';
import { SERVICES, STEPS } from '../lib/data.js';
import Reveal from '../components/Reveal.jsx';
import { waLink } from '../lib/perf.js';

const FAQ = [
  ['What does it cost?', 'Every project is quoted after a short chat, once we know the scope. Message us what you need.'],
  ['Do you work with small local businesses?', 'Yes. Shops, cafes and institutes are who we build for most.'],
  ['Will it work on my customers\u2019 phones?', 'We design on a phone first and test on small screens and slow connections before launch.'],
  ['Can I see it before it goes live?', 'Always. You get a private preview link and approve the launch.']
];

export default function Services() {
  const [open, setOpen] = useState(() => {
    const h = typeof location !== 'undefined' ? location.hash.slice(1) : '';
    return SERVICES.some((x) => x.id === h) ? h : null;
  });
  const toggle = (id) => setOpen((o) => (o === id ? null : id));
  useEffect(() => {
    const h = location.hash.slice(1);
    if (!h) return;
    const el = document.getElementById(h);
    if (el) setTimeout(() => el.scrollIntoView({ block: 'start' }), 250);
  }, []);
  return (
    <>
      <section className="pagehead wrap">
        <p className="eyebrow">Services</p>
        <h1>Websites and web apps, built properly.</h1>
        <p className="lead">We start with a clear brief and a private preview, then build, test on real phones and launch.</p>
      </section>
      <section className="wrap acc-list">
        {SERVICES.map((s, i) => {
          const isOpen = open === s.id;
          return (
            <Reveal key={s.id} delay={i * 40}>
              <article className={'acc' + (isOpen ? ' open' : '')} id={s.id}>
                <button type="button" className="acc-head" aria-expanded={isOpen} aria-controls={'p-' + s.id} onClick={() => toggle(s.id)}>
                  <span className="num">{s.n}</span>
                  <span className="acc-title">
                    <span className="h3">{s.title}</span>
                    <span className="muted acc-lead">{s.lead}</span>
                  </span>
                  <span className="acc-plus" aria-hidden="true" />
                </button>
                <div className="acc-panel" id={'p-' + s.id} role="region" aria-label={s.title}>
                  <div className="acc-clip">
                    <div className="acc-body">
                      <h4>What we do</h4>
                      <p>{s.what}</p>
                      <h4>How it works</h4>
                      <ol className="acc-steps">
                        {s.steps.map((t) => (
                          <li key={t}>{t}</li>
                        ))}
                      </ol>
                      <h4>What you get</h4>
                      <ul className="ticks">
                        {s.get.map((t) => (
                          <li key={t}>{t}</li>
                        ))}
                      </ul>
                      <h4>Who it suits</h4>
                      <p>{s.suits}</p>
                      <h4>Examples</h4>
                      <p>{s.examples}</p>
                      <a className="btn" href={waLink(`Hi KREATION, I am interested in ${s.title.toLowerCase()}.`)} target="_blank" rel="noopener noreferrer">
                        Ask about this
                      </a>
                    </div>
                  </div>
                </div>
              </article>
            </Reveal>
          );
        })}
      </section>
      <section className="sec wrap">
        <Reveal>
          <p className="eyebrow">How we work</p>
          <h2>Four steps, nothing hidden.</h2>
        </Reveal>
        <ol className="steps">
          {STEPS.map(([t, d], i) => (
            <Reveal as="li" key={t} delay={i * 60}>
              <span className="num">0{i + 1}</span>
              <h3>{t}</h3>
              <p className="muted">{d}</p>
            </Reveal>
          ))}
        </ol>
      </section>
      <section className="sec wrap">
        <Reveal>
          <p className="eyebrow">Questions</p>
          <h2>Quick answers.</h2>
        </Reveal>
        <div className="faq">
          {FAQ.map(([q, a]) => (
            <Reveal key={q}>
              <details>
                <summary>{q}</summary>
                <p className="muted">{a}</p>
              </details>
            </Reveal>
          ))}
        </div>
      </section>
    </>
  );
}
