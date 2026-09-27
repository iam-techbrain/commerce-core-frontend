import React from 'react';
import { ShieldCheck, Award, Wrench, Truck, Phone, Mail, MapPin, Clock } from 'lucide-react';

const AboutPage = () => {
  return (
    <div>
      {/* 1. HERO HEADER */}
      <section style={{ background: 'var(--pitch)', color: 'var(--parchment)', padding: '70px 0', borderBottom: '1px solid rgba(212, 155, 58, 0.25)' }}>
        <div className="wrap">
          <span className="eyebrow" style={{ color: 'var(--gold-light)' }}>Heritage & Authenticity Since 1998</span>
          <h1 className="display" style={{ fontSize: 'clamp(34px, 4.5vw, 56px)', color: 'var(--white)', margin: '14px 0 18px', lineHeight: 1.1 }}>
            About Chhabra Sports
          </h1>
          <p style={{ maxWidth: '680px', fontSize: '16.5px', color: '#D7E0DA', lineHeight: 1.6 }}>
            Eastern India's most trusted sports and racquet equipment specialist. For over 25 years, we have equipped state champions, academy athletes, and sports enthusiasts with 100% genuine gear.
          </p>
        </div>
      </section>

      {/* 2. OUR STORY & MISSION */}
      <section className="section">
        <div className="wrap">
          <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 0.9fr', gap: '48px', alignItems: 'center' }}>
            <div>
              <span className="eyebrow">Our Story</span>
              <h2 className="display" style={{ fontSize: '32px', color: 'var(--pitch)', margin: '10px 0 20px' }}>
                Dedicated to the Spirit of Every Sport
              </h2>
              <p style={{ color: 'var(--ink-soft)', lineHeight: 1.7, marginBottom: '16px' }}>
                Founded in 1998, Chhabra Sports started as a passionate destination for athletes seeking genuine, performance-tested equipment. Over two decades later, we continue that legacy by maintaining direct partnerships with the world's most prestigious sporting manufacturers including Yonex, Babolat, Head, SS, SG, and Asics.
              </p>
              <p style={{ color: 'var(--ink-soft)', lineHeight: 1.7, marginBottom: '24px' }}>
                Whether you need a custom-strung Yonex Astrox racquet, a hand-knocked Grade 1 English Willow cricket bat, or court-gripping footwear, our in-house certified specialists ensure you get tournament-ready gear tailored to your playing style.
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', paddingTop: '16px', borderTop: '1px solid var(--line)' }}>
                <div>
                  <h3 style={{ fontFamily: 'Space Mono, monospace', fontSize: '28px', color: 'var(--gold-dark)', fontWeight: 800 }}>25+</h3>
                  <p style={{ fontSize: '13px', color: 'var(--ink-soft)', fontWeight: 600 }}>Years of Sporting Excellence</p>
                </div>
                <div>
                  <h3 style={{ fontFamily: 'Space Mono, monospace', fontSize: '28px', color: 'var(--pitch)', fontWeight: 800 }}>500+</h3>
                  <p style={{ fontSize: '13px', color: 'var(--ink-soft)', fontWeight: 600 }}>Academies & Clubs Equipped</p>
                </div>
              </div>
            </div>

            <div>
              <img
                src="https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=800&q=80&auto=format&fit=crop"
                alt="Chhabra Sports Workshop"
                style={{ width: '100%', borderRadius: 'var(--radius)', boxShadow: 'var(--shadow-md)', border: '1px solid var(--line)' }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* 3. CORE COMMITMENTS */}
      <section className="section tight" style={{ background: 'var(--parchment-dim)' }}>
        <div className="wrap">
          <div className="sec-head" style={{ marginBottom: '32px' }}>
            <div>
              <span className="eyebrow">Why Choose Us</span>
              <h2 className="display" style={{ fontSize: '32px' }}>The Chhabra Assurance</h2>
            </div>
          </div>

          <div className="why-grid">
            <div className="why-card">
              <ShieldCheck size={32} color="var(--gold-dark)" style={{ marginBottom: '12px' }} />
              <h4>100% Genuine Guarantee</h4>
              <p>Direct authorized invoices and official verification holographic serial codes on every racquet, bat, and accessory.</p>
            </div>

            <div className="why-card">
              <Wrench size={32} color="var(--pitch)" style={{ marginBottom: '12px' }} />
              <h4>Pro Stringing & Bat Knocking</h4>
              <p>Certified master stringers with digital electronic tensioning (22-30 lbs) and professional linseed oil bat knocking.</p>
            </div>

            <div className="why-card">
              <Truck size={32} color="var(--smash-orange)" style={{ marginBottom: '12px' }} />
              <h4>Express Pan-India Dispatch</h4>
              <p>Free express delivery on orders over ₹2,999 with 24-hour dispatch and realtime SMS tracking updates.</p>
            </div>

            <div className="why-card">
              <Award size={32} color="var(--gold-dark)" style={{ marginBottom: '12px' }} />
              <h4>Player-First Guidance</h4>
              <p>Expert racquet balance matching, grip sizing advice, and gear consultation from seasoned sports specialists.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. CONTACT & STORE LOCATION */}
      <section className="section">
        <div className="wrap">
          <div className="sec-head" style={{ marginBottom: '36px' }}>
            <div>
              <span className="eyebrow">Visit & Connect</span>
              <h2 className="display" style={{ fontSize: '32px' }}>Store & Workshop Details</h2>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }}>
            <div className="profile-card">
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px' }}>
                <MapPin size={24} color="var(--pitch)" />
                <h4 style={{ fontSize: '1.1rem', fontWeight: 800 }}>Flagship Store</h4>
              </div>
              <p style={{ color: 'var(--ink-soft)', fontSize: '0.95rem', lineHeight: 1.6 }}>
                Chhabra Sports Complex<br />
                Opposite Kankarbagh Main Sports Arena<br />
                Patna, Bihar - 800020, India
              </p>
            </div>

            <div className="profile-card">
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px' }}>
                <Phone size={24} color="var(--gold-dark)" />
                <h4 style={{ fontSize: '1.1rem', fontWeight: 800 }}>Helpline & Orders</h4>
              </div>
              <p style={{ color: 'var(--ink-soft)', fontSize: '0.95rem', lineHeight: 1.6 }}>
                <strong>Customer Support:</strong> +91-72772-52440<br />
                <strong>Stringing Booking:</strong> +91-72772-52441<br />
                <strong>Email:</strong> support@chhabrasports.com
              </p>
            </div>

            <div className="profile-card">
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px' }}>
                <Clock size={24} color="var(--smash-orange)" />
                <h4 style={{ fontSize: '1.1rem', fontWeight: 800 }}>Store Timings</h4>
              </div>
              <p style={{ color: 'var(--ink-soft)', fontSize: '0.95rem', lineHeight: 1.6 }}>
                <strong>Monday - Saturday:</strong> 10:00 AM – 9:00 PM<br />
                <strong>Sunday:</strong> 11:00 AM – 7:00 PM<br />
                <em>Online store active 24/7 with Pan-India dispatch</em>
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
