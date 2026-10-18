import { SERVICES, STEPS } from '../lib/data.js';
import Reveal from '../components/Reveal.jsx';
import Card3D from '../components/Card3D.jsx';
import { waLink } from '../lib/perf.js';

const FAQ = [
  ['What does it cost?', 'Every project is quoted after a short chat, once we know the scope. Message us what you need.'],
  ['Do you work with small local businesses?', 'Yes. Shops, cafes and institutes are who we build for most.'],
  ['Will it work on my customers\u2019 phones?', 'We design on a phone first and test on small screens and slow connections before launch.'],
  ['Can I see it before it goes live?', 'Always. You get a private preview link and approve the launch.']
];

export default function Services() {
  return (
    <>
      <section className="pagehead wrap">
        <p className="eyebrow">Services</p>
        <h1>Web, ads and video. One team.</h1>
        <p className="lead">Start with the website. Add ads and video when you are ready to bring people in.</p>
      </section>
      <section className="wrap svc-list">
        {SERVICES.map((s, i) => (
          <Reveal key={s.id} delay={i * 50}>
            <Card3D className="card svc-big" id={s.id}>
              <span className="num">{s.n}</span>
              <h2 className="h3">{s.title}</h2>
              <p className="muted">{s.lead}</p>
              <ul className="ticks">
                {s.points.map((p) => (
                  <li key={p}>{p}</li>
                ))}
              </ul>
              <a className="btn" href={waLink(`Hi KREATION, I am interested in ${s.title.toLowerCase()}.`)} target="_blank" rel="noopener noreferrer">
                Ask about this
              </a>
            </Card3D>
          </Reveal>
        ))}
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
