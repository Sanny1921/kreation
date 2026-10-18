import { useRef } from 'react';
import useStack from '../lib/useStack.js';
import { Link } from '../lib/router.jsx';
import { waLink } from '../lib/perf.js';
import { PROJECTS, SERVICES, STEPS } from '../lib/data.js';
import KPoster from '../components/Hero3D.jsx';
import Reveal from '../components/Reveal.jsx';
import Card3D from '../components/Card3D.jsx';
import Img from '../components/Img.jsx';
import ErrorBoundary from '../components/ErrorBoundary.jsx';

export default function Home() {
  const featured = PROJECTS.slice(0, 3);
  const svcRef = useRef(null);
  const wrkRef = useRef(null);
  useStack(svcRef);
  useStack(wrkRef);
  return (
    <>
      <section className="hero wrap">
        <div className="kslot" data-kslot>
          <KPoster />
        </div>
        <div className="hero-copy">
          <p className="eyebrow">Web &middot; Ads &middot; Video</p>
          <h1>
            Websites with a <span className="sil">sharper edge.</span>
          </h1>
          <p className="lead">
            KREATION is a small web development agency in Patna. We build fast, mobile-first sites for businesses, and back them with ads and video editing.
          </p>
          <div className="btn-row">
            <Link to="/work" className="btn btn-solid">
              See our work
            </Link>
            <a className="btn" href={waLink('Hi KREATION, I would like to talk about a website.')} target="_blank" rel="noopener noreferrer">
              Chat on WhatsApp
            </a>
          </div>
        </div>
        <ul className="chips" aria-label="What to expect">
          <li>Mobile-first</li>
          <li>Light on slow networks</li>
          <li>Preview before launch</li>
        </ul>
      </section>

      <ErrorBoundary>
        <section className="sec wrap">
          <Reveal>
            <p className="eyebrow">What we do</p>
            <h2>One small team. Three things done well.</h2>
          </Reveal>
          <div className="stack-list svc-stack" ref={svcRef}>
            {SERVICES.map((s, i) => (
              <div className="stk" key={s.id} style={{ '--i': i }}><div className="stk-in"><Reveal>
                <Card3D as={Link} to="/services" className="card svc-card">
                  <span className="num">{s.n}</span>
                  <h3>{s.title}</h3>
                  <p className="muted">{s.lead}</p>
                  <span className="more">Details &rarr;</span>
                </Card3D>
              </Reveal></div></div>
            ))}
          </div>
        </section>
      </ErrorBoundary>

      <ErrorBoundary>
        <section className="sec wrap">
          <Reveal>
            <p className="eyebrow">Selected work</p>
            <h2>Built, live, and open on your phone right now.</h2>
          </Reveal>
          <div className="stack-list work-stack" ref={wrkRef}>
            {featured.map((p, i) => (
              <div className="stk" key={p.id} style={{ '--i': i }}><div className="stk-in"><Reveal>
                <Card3D as="a" href={p.url} target="_blank" rel="noopener noreferrer" className="card proj" aria-label={`${p.title}, opens the live site`}>
                  <Img src={p.img} alt={`${p.title} on a phone`} width={520} height={1126} className="shot" />
                  <div className="proj-b">
                    <span className="tag">{p.label}</span>
                    <h3>{p.title}</h3>
                    <span className="more">View live &#8599;</span>
                  </div>
                </Card3D>
              </Reveal></div></div>
            ))}
          </div>
          <Reveal className="center">
            <Link to="/work" className="btn">
              All projects
            </Link>
          </Reveal>
        </section>
      </ErrorBoundary>

      <ErrorBoundary>
        <section className="sec wrap">
          <Reveal>
            <p className="eyebrow">How we work</p>
            <h2>Simple, and you see it before anyone else does.</h2>
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
      </ErrorBoundary>

      <section className="sec wrap">
        <Reveal className="cta">
          <h2>Need a better website for your business?</h2>
          <p className="muted">Tell us what you sell. We will reply on WhatsApp.</p>
          <div className="btn-row center">
            <a className="btn btn-solid" href={waLink('Hi KREATION, I would like to talk about a website.')} target="_blank" rel="noopener noreferrer">
              Message on WhatsApp
            </a>
            <Link to="/contact" className="btn">
              Other ways to reach us
            </Link>
          </div>
        </Reveal>
      </section>
    </>
  );
}
