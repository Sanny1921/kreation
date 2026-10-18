import { useRef, useState } from 'react';
import useStack from '../lib/useStack.js';
import { PROJECTS, FILTERS } from '../lib/data.js';
import Reveal from '../components/Reveal.jsx';
import Card3D from '../components/Card3D.jsx';
import Img from '../components/Img.jsx';
import { waLink } from '../lib/perf.js';

export default function Work() {
  const [f, setF] = useState('all');
  const listRef = useRef(null);
  useStack(listRef);
  const list = PROJECTS.filter((p) => f === 'all' || p.kind === f);
  return (
    <>
      <section className="pagehead wrap">
        <p className="eyebrow">Work</p>
        <h1>Projects we built, live today.</h1>
        <p className="lead">Every link opens a working site. Redesign concepts are labelled as concepts.</p>
        <div className="filters" role="tablist" aria-label="Filter projects">
          {FILTERS.map(([k, l]) => (
            <button key={k} role="tab" aria-selected={f === k} className={f === k ? 'on' : ''} onClick={() => setF(k)}>
              {l}
            </button>
          ))}
        </div>
      </section>
      <section className="wrap work-list stack-list" ref={listRef}>
        {list.map((p, i) => (
          <div className="stk" key={p.id} style={{ '--i': i }}><div className="stk-in"><Reveal>
            <Card3D className="card proj-wide">
              <a href={p.url} target="_blank" rel="noopener noreferrer" className="proj-img" aria-label={`Open ${p.title}`}>
                <Img src={p.img} alt={`${p.title} on a phone`} width={520} height={1126} className="shot" />
              </a>
              <div className="proj-b">
                <span className="tag">{p.label}</span>
                <h2 className="h3">{p.title}</h2>
                <p className="muted">{p.blurb}</p>
                <ul className="stack">
                  {p.stack.map((s) => (
                    <li key={s}>{s}</li>
                  ))}
                </ul>
                <a className="btn btn-solid" href={p.url} target="_blank" rel="noopener noreferrer">
                  View live &#8599;
                </a>
              </div>
            </Card3D>
          </Reveal></div></div>
        ))}
        {list.length === 0 && <p className="muted">Nothing here yet.</p>}
      </section>
      <section className="sec wrap">
        <Reveal className="cta">
          <h2>Want yours next?</h2>
          <div className="btn-row center">
            <a className="btn btn-solid" href={waLink('Hi KREATION, I saw your work and would like a website.')} target="_blank" rel="noopener noreferrer">
              Message on WhatsApp
            </a>
            <a className="btn" href="https://github.com/Sanny1921" target="_blank" rel="noopener noreferrer">
              More on GitHub
            </a>
          </div>
        </Reveal>
      </section>
    </>
  );
}
