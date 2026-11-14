import Link from "next/link";

const steps = [
  ["01", "Tell us what’s wrong", "Choose your device and describe the issue in a few clicks."],
  ["02", "Pick a time that works", "Select a convenient date and repair drop-off time."],
  ["03", "Track your repair", "See every update from booking to ready for pickup."],
];

export default function HomePage() {
  return (
    <div className="home-page">
      <section className="hero wrap">
        <div className="hero-copy">
          <span className="eyebrow"><span className="eyebrow-dot" /> YOUR PHONE, BACK IN ACTION</span>
          <h1>Broken phone?<br /><span>We’ve got you.</span></h1>
          <p className="hero-intro">Expert repairs, honest updates, and zero guesswork. Book a repair in minutes and get back to what matters.</p>
          <div className="hero-actions">
            <Link className="button button-primary" href="/client/book">Book a repair <span>↗</span></Link>
            <Link className="button button-quiet" href="/client/dashboard">Track a repair <span>→</span></Link>
          </div>
          <div className="hero-proof"><div className="avatar-stack"><span>J</span><span>M</span><span>A</span><span>+</span></div><div><strong>4.9 out of 5</strong><small>from 2,400+ happy customers</small></div></div>
        </div>
        <div className="hero-visual">
          <div className="hero-orbit orbit-one" /><div className="hero-orbit orbit-two" />
          <div className="phone-card"><div className="phone-camera" /><div className="phone-screen"><div className="phone-topline"><span>FIXMATE</span><span>•••</span></div><div className="phone-spark">✳</div><div className="screen-label">GOOD AS<br />NEW.</div><div className="screen-caption">Care that keeps you connected.</div><div className="screen-button">REPAIR COMPLETE <span>✓</span></div></div></div>
          <div className="float-card float-top"><span className="float-icon mint">✓</span><div><strong>Repair complete</strong><small>Ready for pickup</small></div></div>
          <div className="float-card float-bottom"><span className="float-icon peach">⌁</span><div><strong>Free diagnostics</strong><small>Know before we fix</small></div></div>
          <div className="hero-sticker">✦<br /><small>LOCAL<br />EXPERTS</small></div>
        </div>
      </section>
      <section className="trust-strip"><div className="wrap trust-inner"><span>REPAIRS YOU CAN FEEL GOOD ABOUT</span><div><b>◈</b> Certified technicians</div><div><b>◉</b> 90-day warranty</div><div><b>↗</b> No surprise fees</div></div></section>
      <section className="steps-section wrap"><div className="section-heading"><div><span className="eyebrow">A BETTER WAY TO REPAIR</span><h2>From cracked to <em>connected.</em></h2></div><p>We make the frustrating part feel simple. Here’s how FixMate gets your device back on track.</p></div><div className="steps-grid">{steps.map(([number, title, description]) => <article className="step-card" key={number}><span className="step-number">{number}</span><span className="step-arrow">↗</span><h3>{title}</h3><p>{description}</p></article>)}</div></section>
      <section className="bottom-cta wrap"><div><span className="eyebrow">READY WHEN YOU ARE</span><h2>Let’s fix that.</h2></div><Link className="button button-light" href="/client/book">Start a booking <span>↗</span></Link></section>
      <footer className="site-footer wrap"><span>© 2026 FIXMATE</span><span>Repairs made refreshingly simple.</span><Link href="/admin/dashboard">Admin demo →</Link></footer>
    </div>
  );
}
