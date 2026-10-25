import StackList from '../components/StackList.jsx';
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
        <Reveal className="team">
          <Card3D className="card team-card">
            <Img src="/img/sunny4-420.webp" wideSrc="/img/sunny4-720.webp" alt="Sunny Tiwari" width={420} height={546} className="shot team-photo" />
            <div className="team-b">
              <h3>Sunny Tiwari</h3>
              <p className="role">Web Developer & Designer</p>
            </div>
          </Card3D>
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
    </>
  );
}
