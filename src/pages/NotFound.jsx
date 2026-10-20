import { Link } from '../lib/router.jsx';

export default function NotFound() {
  return (
    <section className="pagehead wrap">
      <p className="eyebrow">404</p>
      <h1>This page is not here.</h1>
      <p className="lead">The link may be old or mistyped. Everything on the site is one tap away.</p>
      <div className="btn-row">
        <Link to="/" className="btn btn-solid">
          Back to home
        </Link>
        <Link to="/work" className="btn">
          See our work
        </Link>
        <Link to="/contact" className="btn">
          Contact us
        </Link>
      </div>
    </section>
  );
}
