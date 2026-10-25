import { useEffect, useState } from 'react';
import StackList from '../components/StackList.jsx';
import { Link } from '../lib/router.jsx';
import { waLink } from '../lib/perf.js';
import { PROJECTS, SERVICES, STEPS } from '../lib/data.js';
import KPoster from '../components/Hero3D.jsx';
import Reveal from '../components/Reveal.jsx';
import PhotoStack from '../components/PhotoStack.jsx';
import Lanyard from '../components/Lanyard.jsx';
import Card3D from '../components/Card3D.jsx';
import Img from '../components/Img.jsx';
import ErrorBoundary from '../components/ErrorBoundary.jsx';

const TEAM = [{ id: 'sunny', name: 'Sunny Tiwari', role: 'Web Developer & Designer', src: '/img/sunny5-720.webp', srcSet: '/img/sunny5-420.webp 420w, /img/sunny5-720.webp 720w, /img/sunny5-1080.webp 1080w', sizes: 'min(320px, 78vw)', width: 720, height: 936 }];

export default function Home() {
  const [detailsOpen, setDetailsOpen] = useState(false);
  useEffect(() => {
    ['/img/sunny-badge3-front.jpg', '/img/sunny-badge2-back.jpg', '/img/lanyard-k.png'].forEach((src) => { const im = new Image(); im.src = src; });
  }, []);
  const featured = PROJECTS.slice(0, 3);
  return (
    <>
      <section className="hero wrap">
        <div className="kslot" data-kslot>
          <KPoster />
        </div>
        <div className="hero-copy">
          <p className="eyebrow">Web development</p>
          <h1>
            Websites with a <span className="sil">sharper edge.</span>
          </h1>
          <p className="lead">
            KREATION is a web development agency in India. We build fast, mobile-first websites and web apps for businesses.
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
      </section>

      <ErrorBoundary>
        <section className="sec wrap">
          <Reveal>
            <p className="eyebrow">What we do</p>
            <h2>One team. Websites that work.</h2>
          </Reveal>
          <StackList className="stack-list svc-stack">
            {SERVICES.map((s) => (
              <Reveal key={s.id}>
                <Card3D as={Link} to={`/services#${s.id}`} className="card svc-card">
                  <span className="num">{s.n}</span>
                  <h3>{s.title}</h3>
                  <p className="muted">{s.lead}</p>
                  <span className="more">Read more &rarr;</span>
                </Card3D>
              </Reveal>
            ))}
          </StackList>
        </section>
      </ErrorBoundary>

      <ErrorBoundary>
        <section className="sec wrap">
          <Reveal>
            <p className="eyebrow">Selected work</p>
            <h2>Built, live, and open on your phone right now.</h2>
          </Reveal>
          <StackList className="stack-list work-stack">
            {featured.map((p) => (
              <Reveal key={p.id}>
                <Card3D as="a" href={p.url} target="_blank" rel="noopener noreferrer" className="card proj" aria-label={`${p.title}, opens the live site`}>
                  <Img src={p.img} wideSrc={p.imgWide} alt={`${p.title} homepage`} width={1170} height={804} className="shot" />
                  <div className="proj-b">
                    <span className="tag">{p.label}</span>
                    <h3>{p.title}</h3>
                    <span className="more">View live &#8599;</span>
                  </div>
                </Card3D>
              </Reveal>
            ))}
          </StackList>
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
        <Reveal>
          <p className="eyebrow">Our team</p>
          <h2>Meet the team.</h2>
        </Reveal>
        <Reveal className="teamc">
          <PhotoStack members={TEAM} />
          <div className="btn-row center">
            <button type="button" className="btn" onClick={() => setDetailsOpen(true)}>View details</button>
          </div>
        </Reveal>
      </section>

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
      {detailsOpen && (
        <div className="td-overlay" role="dialog" aria-modal="true" aria-label="Sunny Tiwari details" onClick={() => setDetailsOpen(false)}>
          <div className="td-card" onClick={(e) => e.stopPropagation()}>
            <button type="button" className="td-x" onClick={() => setDetailsOpen(false)} aria-label="Close">&times;</button>
            <div className="td-lanyard">
              <Lanyard frontImage="/img/sunny-badge3-front.jpg" backImage="/img/sunny-badge2-back.jpg" cardColor="#0b0c10" strapColor="#1a1c22" strapImage="/img/lanyard-k.png" intro={false} finish="matte" breeze={0.15} size={0.48} strapLength={0.4} />
            </div>
            <p className="td-desc">Designs and builds fast, mobile-first websites and web apps. Works from India.</p>
          </div>
        </div>
      )}
    </>
  );
}
