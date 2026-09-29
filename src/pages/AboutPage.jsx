import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  ShieldCheck,
  Award,
  Heart,
  Sparkles,
  MapPin,
  Phone,
  Clock,
  ArrowRight,
  ChevronRight,
  Home,
  CheckCircle2,
  Users,
  Trophy,
  History,
  Target
} from 'lucide-react';
import ReviewsSlider from '../components/customer/ReviewsSlider';

const AboutPage = () => {
  const navigate = useNavigate();

  return (
    <div style={{ background: 'var(--parchment, #F8F6F0)', minHeight: '100vh', color: 'var(--ink, #141916)' }}>
      {/* 1. BREADCRUMB BAR */}
      <div
        style={{
          background: 'var(--white, #ffffff)',
          borderBottom: '1px solid var(--line, #DBD5C5)',
          padding: '12px 0',
          fontSize: '13px'
        }}
      >
        <div className="wrap" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--ink-soft, #454D47)' }}>
          <NavLink to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: 'var(--ink-soft, #454D47)', textDecoration: 'none' }}>
            <Home size={14} />
            <span>Home</span>
          </NavLink>
          <ChevronRight size={13} style={{ opacity: 0.6 }} />
          <span style={{ color: 'var(--pitch, #11362B)', fontWeight: 700 }}>About Us</span>
        </div>
      </div>

      {/* 2. HERO BANNER */}
      <section
        style={{
          background: 'linear-gradient(135deg, var(--pitch-dark, #0A241C) 0%, var(--pitch, #11362B) 100%)',
          color: 'var(--parchment, #F8F6F0)',
          padding: '54px 0 64px',
          borderBottom: '4px solid var(--gold, #D49B3A)',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <div className="wrap" style={{ position: 'relative', zIndex: 2 }}>
          <div style={{ maxWidth: '820px', margin: '0 auto', textAlign: 'center' }}>
            <span
              style={{
                color: 'var(--gold, #D49B3A)',
                background: 'rgba(212, 155, 58, 0.15)',
                padding: '6px 18px',
                borderRadius: '30px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '12px',
                fontWeight: 800,
                letterSpacing: '1.5px',
                textTransform: 'uppercase',
                marginBottom: '16px',
                border: '1px solid rgba(212, 155, 58, 0.35)'
              }}
            >
              <Trophy size={14} />
              <span>ESTD. 1948 • BIHAR'S PREMIER SPORTS INSTITUTION</span>
            </span>

            <h1
              style={{
                fontFamily: 'Outfit, sans-serif',
                fontSize: 'clamp(2.2rem, 4.5vw, 3.4rem)',
                fontWeight: 900,
                color: '#ffffff',
                lineHeight: 1.15,
                marginBottom: '18px',
                letterSpacing: '-0.5px'
              }}
            >
              Chhabra Sports Agencies — <span style={{ color: 'var(--gold, #D49B3A)' }}>Legacy & Vision</span>
            </h1>

            <p
              style={{
                fontSize: '16px',
                color: 'var(--parchment-dim, #EFEADA)',
                lineHeight: 1.65,
                margin: '0 auto',
                maxWidth: '680px'
              }}
            >
              For over seven decades, empowering athletes from Patna to the global arena with 100% genuine equipment, professional guidance, and unbroken trust.
            </p>
          </div>
        </div>
      </section>

      {/* 3. FOUNDER QUOTE & HIGHLIGHTS SECTION */}
      <section style={{ padding: '70px 0 60px', background: '#ffffff', borderBottom: '1px solid var(--line, #DBD5C5)' }}>
        <div className="wrap">
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '48px',
              alignItems: 'center'
            }}
          >
            {/* Left: Rahul Chhabra Quote Card */}
            <div
              style={{
                background: 'var(--parchment, #F8F6F0)',
                padding: '36px 32px',
                borderRadius: '16px',
                border: '1px solid var(--line, #DBD5C5)',
                boxShadow: '0 8px 24px rgba(17, 54, 43, 0.05)',
                position: 'relative'
              }}
            >
              {/* Header with Portrait & Signature */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '18px', marginBottom: '22px' }}>
                <img
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&q=80&auto=format&fit=crop"
                  alt="Rahul Chhabra"
                  style={{
                    width: '68px',
                    height: '68px',
                    borderRadius: '50%',
                    objectFit: 'cover',
                    border: '3px solid var(--gold, #D49B3A)',
                    boxShadow: '0 4px 14px rgba(0,0,0,0.15)'
                  }}
                />
                <div>
                  <div style={{ fontSize: '12px', color: 'var(--ink-soft, #454D47)', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 600 }}>
                    By <strong style={{ color: 'var(--pitch, #11362B)', fontSize: '15px', fontWeight: 800 }}>Rahul Chhabra</strong>
                  </div>
                  {/* Handwritten Signature representation */}
                  <div
                    style={{
                      fontFamily: '"Caveat", "Brush Script MT", cursive',
                      fontSize: '28px',
                      color: 'var(--pitch, #11362B)',
                      lineHeight: '1',
                      marginTop: '4px',
                      fontWeight: 700,
                      letterSpacing: '1px'
                    }}
                  >
                    Rahul Chhabra
                  </div>
                </div>
              </div>

              {/* Quote Text */}
              <blockquote
                style={{
                  fontFamily: 'Outfit, sans-serif',
                  fontSize: 'clamp(20px, 2.2vw, 26px)',
                  fontWeight: 800,
                  lineHeight: '1.4',
                  color: 'var(--pitch, #11362B)',
                  fontStyle: 'normal',
                  margin: 0,
                  position: 'relative'
                }}
              >
                “The right sports equipment is more than just gear — It's your shield, strength, and strategy on the field.”
              </blockquote>
            </div>

            {/* Right: Highlights Cards */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
              {/* Card 1: Happy Athletes */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '18px',
                  background: 'var(--white, #ffffff)',
                  padding: '24px 26px',
                  borderRadius: '16px',
                  boxShadow: '0 4px 20px rgba(17, 54, 43, 0.06)',
                  border: '1px solid var(--line, #DBD5C5)',
                  transition: 'transform 0.2s ease, box-shadow 0.2s ease'
                }}
              >
                <div
                  style={{
                    width: '56px',
                    height: '56px',
                    borderRadius: '50%',
                    background: 'rgba(212, 155, 58, 0.15)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    border: '1.5px solid rgba(212, 155, 58, 0.4)'
                  }}
                >
                  <Heart size={26} color="var(--gold, #D49B3A)" fill="var(--gold, #D49B3A)" />
                </div>
                <div>
                  <h3 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '20px', fontWeight: 800, color: 'var(--pitch, #11362B)', marginBottom: '6px' }}>
                    Happy Athletes
                  </h3>
                  <p style={{ fontSize: '14.5px', color: 'var(--ink-soft, #454D47)', lineHeight: '1.55', margin: 0 }}>
                    The joy of the game begins with the right gear — trusted by thousands of aspiring champions and veteran players across generations.
                  </p>
                </div>
              </div>

              {/* Card 2: Top-Tier Brands */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '18px',
                  background: 'var(--white, #ffffff)',
                  padding: '24px 26px',
                  borderRadius: '16px',
                  boxShadow: '0 4px 20px rgba(17, 54, 43, 0.06)',
                  border: '1px solid var(--line, #DBD5C5)',
                  transition: 'transform 0.2s ease, box-shadow 0.2s ease'
                }}
              >
                <div
                  style={{
                    width: '56px',
                    height: '56px',
                    borderRadius: '50%',
                    background: 'rgba(17, 54, 43, 0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    border: '1.5px solid rgba(17, 54, 43, 0.25)'
                  }}
                >
                  <Award size={26} color="var(--pitch, #11362B)" />
                </div>
                <div>
                  <h3 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '20px', fontWeight: 800, color: 'var(--pitch, #11362B)', marginBottom: '6px' }}>
                    Top-Tier Brands
                  </h3>
                  <p style={{ fontSize: '14.5px', color: 'var(--ink-soft, #454D47)', lineHeight: '1.55', margin: 0 }}>
                    Only the best make the cut — trusted names, pro-level performance, verified authenticity codes, and genuine gear you can count on.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. OUR LEGACY SECTION */}
      <section style={{ padding: '85px 0', background: 'var(--parchment, #F8F6F0)', borderBottom: '1px solid var(--line, #DBD5C5)' }}>
        <div className="wrap">
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
              gap: '56px',
              alignItems: 'center'
            }}
          >
            {/* Left: Two Tall Photography Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div
                style={{
                  borderRadius: '14px',
                  overflow: 'hidden',
                  height: '440px',
                  boxShadow: '0 12px 30px rgba(0,0,0,0.1)',
                  border: '3px solid #ffffff'
                }}
              >
                <img
                  src="https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=700&q=80&auto=format&fit=crop"
                  alt="Cricket Match Action on Turf"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>

              <div
                style={{
                  borderRadius: '14px',
                  overflow: 'hidden',
                  height: '440px',
                  boxShadow: '0 12px 30px rgba(0,0,0,0.1)',
                  border: '3px solid #ffffff'
                }}
              >
                <img
                  src="https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=700&q=80&auto=format&fit=crop"
                  alt="Young Football Athlete with Ball"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>
            </div>

            {/* Right: The Legacy Narrative */}
            <div>
              <span
                style={{
                  fontSize: '12px',
                  fontWeight: 800,
                  letterSpacing: '2px',
                  textTransform: 'uppercase',
                  color: 'var(--gold, #D49B3A)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  marginBottom: '10px'
                }}
              >
                <History size={16} />
                <span>ROOTED IN HISTORY</span>
              </span>

              <h2
                style={{
                  fontFamily: 'Outfit, sans-serif',
                  fontSize: 'clamp(32px, 3.8vw, 44px)',
                  fontWeight: 900,
                  color: 'var(--pitch, #11362B)',
                  marginBottom: '22px',
                  letterSpacing: '-0.5px'
                }}
              >
                Our Legacy
              </h2>

              <div
                style={{
                  fontSize: '15.5px',
                  lineHeight: '1.8',
                  color: 'var(--ink-soft, #454D47)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '16px'
                }}
              >
                <p>
                  <strong style={{ color: 'var(--pitch, #11362B)' }}>CHHABRA SPORTS AGENCIES</strong> is a family-owned sports goods retail business with one of the biggest portfolios of authentic brands to offer. With its inception in <strong style={{ color: 'var(--gold-dark, #A07022)' }}>1948</strong>, Chhabra Sports was one of the initial pioneers to enter the organized sports retail business in Patna, Bihar.
                </p>
                <p>
                  The business was founded by <strong style={{ color: 'var(--pitch, #11362B)' }}>late Mr. C.D Chhabra</strong> who moved to India during partition from Sialkot (now Pakistan), which was then the renowned sports manufacturing hub of undivided India.
                </p>
                <p>
                  Carrying forward this profound heritage and blessing, <strong style={{ color: 'var(--pitch, #11362B)' }}>Mr. Jogesh Chhabra</strong> and his sons <strong style={{ color: 'var(--pitch, #11362B)' }}>Mr. Rahul Chhabra</strong> and <strong style={{ color: 'var(--pitch, #11362B)' }}>Harsh Chhabra</strong> have taken the enterprise forward into the modern digital era — breaking geographical barriers and catering globally to sports enthusiasts, academies, and professional tournament players through our online platform.
                </p>
              </div>

              {/* Legacy Stats Quick Bar */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(3, 1fr)',
                  gap: '14px',
                  marginTop: '28px',
                  paddingTop: '20px',
                  borderTop: '1px solid var(--line, #DBD5C5)'
                }}
              >
                <div>
                  <div style={{ fontFamily: 'Outfit, sans-serif', fontSize: '26px', fontWeight: 900, color: 'var(--pitch, #11362B)' }}>1948</div>
                  <div style={{ fontSize: '12px', color: 'var(--ink-soft, #454D47)', fontWeight: 600 }}>Founded in Patna</div>
                </div>
                <div>
                  <div style={{ fontFamily: 'Outfit, sans-serif', fontSize: '26px', fontWeight: 900, color: 'var(--gold, #D49B3A)' }}>75+</div>
                  <div style={{ fontSize: '12px', color: 'var(--ink-soft, #454D47)', fontWeight: 600 }}>Years of Heritage</div>
                </div>
                <div>
                  <div style={{ fontFamily: 'Outfit, sans-serif', fontSize: '26px', fontWeight: 900, color: 'var(--pitch, #11362B)' }}>100%</div>
                  <div style={{ fontSize: '12px', color: 'var(--ink-soft, #454D47)', fontWeight: 600 }}>Genuine Warranty</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. CORE VALUES SECTION */}
      <section style={{ padding: '85px 0 95px', background: '#ffffff', borderBottom: '1px solid var(--line, #DBD5C5)' }}>
        <div className="wrap">
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
              gap: '56px',
              alignItems: 'center'
            }}
          >
            {/* Left: Core Values Principles List */}
            <div>
              <span
                style={{
                  fontSize: '12px',
                  fontWeight: 800,
                  letterSpacing: '2px',
                  textTransform: 'uppercase',
                  color: 'var(--gold, #D49B3A)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  marginBottom: '10px'
                }}
              >
                <Target size={16} />
                <span>WHAT WE STAND FOR</span>
              </span>

              <h2
                style={{
                  fontFamily: 'Outfit, sans-serif',
                  fontSize: 'clamp(32px, 3.8vw, 42px)',
                  fontWeight: 900,
                  color: 'var(--pitch, #11362B)',
                  marginBottom: '16px',
                  letterSpacing: '-0.5px'
                }}
              >
                Core Values
              </h2>

              <p style={{ fontSize: '15.5px', color: 'var(--ink-soft, #454D47)', marginBottom: '24px', fontWeight: 600 }}>
                Chhabra Sports Agencies is built on four founding principles:
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '36px' }}>
                {/* Value 1 */}
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
                  <div
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      background: 'var(--pitch, #11362B)',
                      color: '#ffffff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 800,
                      fontSize: '14px',
                      flexShrink: 0
                    }}
                  >
                    1
                  </div>
                  <div style={{ fontSize: '15px', color: 'var(--ink, #141916)', lineHeight: '1.6' }}>
                    <strong style={{ color: 'var(--pitch, #11362B)' }}>Personalized experience to clients:</strong> Expert racquet stringing tension advice, bat selection based on playing style, and tailored guidance.
                  </div>
                </div>

                {/* Value 2 */}
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
                  <div
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      background: 'var(--pitch, #11362B)',
                      color: '#ffffff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 800,
                      fontSize: '14px',
                      flexShrink: 0
                    }}
                  >
                    2
                  </div>
                  <div style={{ fontSize: '15px', color: 'var(--ink, #141916)', lineHeight: '1.6' }}>
                    <strong style={{ color: 'var(--pitch, #11362B)' }}>Building and retaining a strong, loyal workforce</strong> who have dedicated their expertise and played a crucial role in our decades of retail success.
                  </div>
                </div>

                {/* Value 3 */}
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
                  <div
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      background: 'var(--pitch, #11362B)',
                      color: '#ffffff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 800,
                      fontSize: '14px',
                      flexShrink: 0
                    }}
                  >
                    3
                  </div>
                  <div style={{ fontSize: '15px', color: 'var(--ink, #141916)', lineHeight: '1.6' }}>
                    <strong style={{ color: 'var(--pitch, #11362B)' }}>Maintaining trust and long-term relationships</strong> with customers, sports academies, clubs, and educational institutions.
                  </div>
                </div>

                {/* Value 4 */}
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
                  <div
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      background: 'var(--pitch, #11362B)',
                      color: '#ffffff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 800,
                      fontSize: '14px',
                      flexShrink: 0
                    }}
                  >
                    4
                  </div>
                  <div style={{ fontSize: '15px', color: 'var(--ink, #141916)', lineHeight: '1.6' }}>
                    <strong style={{ color: 'var(--pitch, #11362B)' }}>A strong after-sales support</strong> with whatever maximum assistance, racquet care, and warranty servicing we can provide.
                  </div>
                </div>
              </div>

              {/* View More Products Button */}
              <button
                onClick={() => navigate('/products')}
                style={{
                  background: 'var(--pitch, #11362B)',
                  color: '#ffffff',
                  border: 'none',
                  padding: '14px 34px',
                  fontSize: '13px',
                  fontWeight: 800,
                  letterSpacing: '1.5px',
                  textTransform: 'uppercase',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '10px',
                  boxShadow: '0 6px 20px rgba(17, 54, 43, 0.25)',
                  transition: 'transform 0.2s, background 0.2s'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.background = 'var(--pitch-light, #1B4D3E)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.background = 'var(--pitch, #11362B)';
                }}
              >
                <span>VIEW MORE</span>
                <ArrowRight size={16} />
              </button>
            </div>

            {/* Right: Gear Showcase Image */}
            <div
              style={{
                borderRadius: '16px',
                overflow: 'hidden',
                boxShadow: '0 16px 36px rgba(0,0,0,0.12)',
                height: '480px',
                border: '4px solid #ffffff'
              }}
            >
              <img
                src="https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?w=800&q=80&auto=format&fit=crop"
                alt="Chhabra Sports Premium Equipment Assortment"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* 6. VERIFIED PLAYER REVIEWS SLIDER */}
      <ReviewsSlider />

      {/* 7. PHYSICAL STORE & HELPLINE SECTION */}
      <section style={{ padding: '70px 0 80px', background: 'var(--parchment, #F8F6F0)' }}>
        <div className="wrap">
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '24px'
            }}
          >
            {/* Store 1 */}
            <div
              style={{
                background: 'var(--white, #ffffff)',
                border: '1px solid var(--line, #DBD5C5)',
                borderRadius: '14px',
                padding: '30px 24px',
                boxShadow: '0 4px 16px rgba(17, 54, 43, 0.04)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px' }}>
                <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: 'rgba(17, 54, 43, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <MapPin size={22} color="var(--pitch, #11362B)" />
                </div>
                <h4 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '1.15rem', fontWeight: 800, margin: 0, color: 'var(--pitch, #11362B)' }}>
                  Flagship Store
                </h4>
              </div>
              <p style={{ color: 'var(--ink-soft, #454D47)', fontSize: '14.5px', lineHeight: 1.6, margin: '0 0 10px 0' }}>
                <strong>L. B. Shop No. 10, Boring Road,</strong><br />
                Patna, Bihar – 800001, India
              </p>
              <a
                href="https://maps.google.com/?q=Chhabra+Sports+Boring+Road+Patna"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  color: 'var(--pitch, #11362B)',
                  fontWeight: 700,
                  fontSize: '13px',
                  textDecoration: 'underline'
                }}
              >
                Open in Google Maps →
              </a>
            </div>

            {/* Store 2 */}
            <div
              style={{
                background: 'var(--white, #ffffff)',
                border: '1px solid var(--line, #DBD5C5)',
                borderRadius: '14px',
                padding: '30px 24px',
                boxShadow: '0 4px 16px rgba(17, 54, 43, 0.04)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px' }}>
                <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: 'rgba(37, 211, 102, 0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Phone size={22} color="#25D366" />
                </div>
                <h4 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '1.15rem', fontWeight: 800, margin: 0, color: 'var(--pitch, #11362B)' }}>
                  WhatsApp & Helpline
                </h4>
              </div>
              <p style={{ color: 'var(--ink-soft, #454D47)', fontSize: '14.5px', lineHeight: 1.6, margin: 0 }}>
                <strong>Support / WhatsApp:</strong>{' '}
                <a href="https://wa.me/917277252440" target="_blank" rel="noopener noreferrer" style={{ color: '#25D366', fontWeight: 700, textDecoration: 'none' }}>
                  +91-72772-52440
                </a>
                <br />
                <strong>Email:</strong> chhabrasportspatna@outlook.com
              </p>
            </div>

            {/* Store 3 */}
            <div
              style={{
                background: 'var(--white, #ffffff)',
                border: '1px solid var(--line, #DBD5C5)',
                borderRadius: '14px',
                padding: '30px 24px',
                boxShadow: '0 4px 16px rgba(17, 54, 43, 0.04)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px' }}>
                <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: 'rgba(212, 155, 58, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Clock size={22} color="var(--gold, #D49B3A)" />
                </div>
                <h4 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '1.15rem', fontWeight: 800, margin: 0, color: 'var(--pitch, #11362B)' }}>
                  Store Timings
                </h4>
              </div>
              <p style={{ color: 'var(--ink-soft, #454D47)', fontSize: '14.5px', lineHeight: 1.6, margin: 0 }}>
                <strong>Monday - Saturday:</strong> 10:00 AM – 8:30 PM<br />
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
