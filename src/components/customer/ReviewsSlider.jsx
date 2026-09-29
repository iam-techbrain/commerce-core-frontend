import React, { useState, useEffect, useRef } from 'react';

const REVIEWS = [
  {
    id: 1,
    name: 'Pawan Kumar',
    date: '9 August 2025',
    rating: 5,
    sport: 'Badminton Enthusiast',
    product: 'Yonex Nanoflare 800 Pro',
    comment: 'Best sports showroom in Patna! Got 100% genuine Yonex Nanoflare 800 with precision computerized stringing done at 27 lbs. The smash feedback is incredible and the staff badminton expertise is unmatched. Highly recommended!',
    initials: 'PK',
    avatarBg: '#11362B'
  },
  {
    id: 2,
    name: 'Rishabh Siddharth',
    date: '8 August 2025',
    rating: 5,
    sport: 'Club Cricket Batsman',
    product: 'SS Ton Reserve English Willow Bat',
    comment: 'The balance, punch, and pickup on this SS English willow bat is phenomenal. Exactly 8 straight grains as shown. Super fast shipping, oiled and safely packed. Truly Bihar’s pride for sports equipment since 1948!',
    initials: 'RS',
    avatarBg: '#D49B3A'
  },
  {
    id: 3,
    name: 'Lateshwar Raman',
    date: '8 August 2025',
    rating: 5,
    sport: 'Tennis Player',
    product: 'Head Speed MP Tennis Racquet',
    comment: 'Visited their Boring Road flagship store. Mr. Chhabra is so humble and gave brilliant advice for arm comfort. Verified the authentic holographic serial code on Head’s official portal right there. 10/10 experience!',
    initials: 'LR',
    avatarBg: '#1B4D3E'
  },
  {
    id: 4,
    name: 'Sunita Singh',
    date: '8 August 2025',
    rating: 5,
    sport: 'Badminton Parent',
    product: 'Yonex Power Cushion Non-Marking Shoes',
    comment: 'Ordered court shoes for my son’s district tournament. Delivery reached Patna within 24 hours, fit was true to size, and the ankle cushion grip on synthetic courts is world-class. Outstanding customer service!',
    initials: 'SS',
    avatarBg: '#976a16'
  },
  {
    id: 5,
    name: 'Dipak Kumar',
    date: '8 August 2025',
    rating: 5,
    sport: 'Cricket Academy Coach',
    product: 'SG Club Leather Balls & Batting Gear',
    comment: 'Purchased cricket equipment for our training academy. 100% genuine leather balls with deep seam durability, and prices are much more competitive than other portals. Trustworthy store with genuine warranty.',
    initials: 'DK',
    avatarBg: '#235E4B'
  },
  {
    id: 6,
    name: 'Chitra Kumari',
    date: '7 August 2025',
    rating: 5,
    sport: 'University Badminton Player',
    product: 'Li-Ning Windstorm 72 Racquet',
    comment: 'Super lightweight racquet with lightning fast swing recovery! The packaging was spotless and safe. Their WhatsApp helpline answered all my string gauge queries in under 5 minutes. Very happy!',
    initials: 'CK',
    avatarBg: '#C28929'
  },
  {
    id: 7,
    name: 'Arsh Siddique',
    date: '7 August 2025',
    rating: 5,
    sport: 'Football Striker',
    product: 'Nike Phantom GX Football Studs',
    comment: 'Stud traction on grass turf is top-tier! Extremely difficult to find 100% original football boots in Bihar, but Chhabra Sports delivered genuine original pair with official manufacturer invoice. 5 stars all the way!',
    initials: 'AS',
    avatarBg: '#0E2820'
  },
  {
    id: 8,
    name: 'Subodh Vikash',
    date: '3 August 2025',
    rating: 5,
    sport: 'Basketball & Fitness',
    product: 'Cosco Tournament Pro Basketball',
    comment: 'Superb leatherette grip and consistent bounce retention. We have been purchasing sporting goods from Chhabra Sports for years. Their 75+ years legacy in Bihar is well deserved and proven!',
    initials: 'SV',
    avatarBg: '#7A540D'
  },
  {
    id: 9,
    name: 'Neel Patel Kumar',
    date: '3 August 2025',
    rating: 5,
    sport: 'Tournament Player',
    product: 'Victor Thruster K Racquet & BG65Ti Stringing',
    comment: 'Custom strung with BG65Ti at 26.5 lbs. Tension calibration on their electronic machine is dead accurate with high ping sound. Genuine Victor barcode verified. Will buy all my gear here!',
    initials: 'NK',
    avatarBg: '#154134'
  },
  {
    id: 10,
    name: 'Dev Patel Raj',
    date: '31 July 2025',
    rating: 5,
    sport: 'Football Athlete',
    product: 'Nivia Storm Match Football & Training Kit',
    comment: 'Excellent official match ball and seamless online ordering. Instant UPI payment, fast tracking link, and arrived in pristine condition before matchday. Top-notch authentic sports merchant!',
    initials: 'DR',
    avatarBg: '#A07022'
  }
];

const ReviewsSlider = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [cardsPerView, setCardsPerView] = useState(3);
  const sliderRef = useRef(null);

  // Responsive items per view
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 680) {
        setCardsPerView(1);
      } else if (window.innerWidth < 1024) {
        setCardsPerView(2);
      } else {
        setCardsPerView(3);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const maxIndex = Math.max(0, REVIEWS.length - cardsPerView);

  // Auto-play interval
  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
    }, 4500);
    return () => clearInterval(timer);
  }, [isPaused, maxIndex]);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev <= 0 ? maxIndex : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
  };

  return (
    <section
      className="reviews-slider-section"
      style={{
        padding: '70px 0 80px',
        background: 'linear-gradient(180deg, #F8F6F0 0%, #FFFFFF 100%)',
        borderTop: '1px solid var(--line, #DBD5C5)',
        borderBottom: '1px solid var(--line, #DBD5C5)',
        position: 'relative',
        overflow: 'hidden'
      }}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="wrap">
        {/* Section Header */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'flex-end',
            justifyContent: 'space-between',
            gap: '20px',
            marginBottom: '40px'
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '5px',
                  background: 'rgba(212, 155, 58, 0.15)',
                  color: 'var(--gold-dark, #A07022)',
                  fontSize: '11px',
                  fontWeight: 800,
                  letterSpacing: '1px',
                  textTransform: 'uppercase',
                  padding: '4px 10px',
                  borderRadius: '20px'
                }}
              >
                ★ 5.0 Google Verified Ratings
              </span>
              <span
                style={{
                  fontSize: '12px',
                  color: 'var(--ink-soft, #454D47)',
                  fontWeight: 600
                }}
              >
                100% Genuine Player Testimonials
              </span>
            </div>
            <h2
              style={{
                fontFamily: 'Outfit, sans-serif',
                fontSize: 'clamp(1.75rem, 3vw, 2.35rem)',
                fontWeight: 900,
                color: 'var(--pitch, #11362B)',
                margin: 0,
                letterSpacing: '-0.5px'
              }}
            >
              Words from Champions & Athletes
            </h2>
            <p
              style={{
                margin: '8px 0 0 0',
                color: 'var(--ink-soft, #454D47)',
                fontSize: '14.5px',
                maxWidth: '600px'
              }}
            >
              Trusted by national champions, academy coaches, and sports enthusiasts in Bihar & all over India since 1948.
            </p>
          </div>

          {/* Navigation Arrows */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <button
              onClick={handlePrev}
              aria-label="Previous Review"
              title="Previous"
              style={{
                width: '44px',
                height: '44px',
                borderRadius: '50%',
                border: '1.5px solid var(--pitch, #11362B)',
                background: 'var(--white, #ffffff)',
                color: 'var(--pitch, #11362B)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                fontSize: '18px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'var(--pitch, #11362B)';
                e.currentTarget.style.color = '#ffffff';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'var(--white, #ffffff)';
                e.currentTarget.style.color = 'var(--pitch, #11362B)';
              }}
            >
              ←
            </button>
            <button
              onClick={handleNext}
              aria-label="Next Review"
              title="Next"
              style={{
                width: '44px',
                height: '44px',
                borderRadius: '50%',
                border: '1.5px solid var(--pitch, #11362B)',
                background: 'var(--pitch, #11362B)',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                fontSize: '18px',
                boxShadow: '0 2px 8px rgba(17,54,43,0.2)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'var(--gold, #D49B3A)';
                e.currentTarget.style.borderColor = 'var(--gold, #D49B3A)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'var(--pitch, #11362B)';
                e.currentTarget.style.borderColor = 'var(--pitch, #11362B)';
              }}
            >
              →
            </button>
          </div>
        </div>

        {/* Carousel Viewport */}
        <div
          ref={sliderRef}
          style={{
            overflow: 'hidden',
            position: 'relative',
            padding: '8px 2px 16px'
          }}
        >
          <div
            style={{
              display: 'flex',
              transition: 'transform 0.5s cubic-bezier(0.25, 1, 0.5, 1)',
              transform: `translateX(-${currentIndex * (100 / cardsPerView)}%)`,
              gap: '24px'
            }}
          >
            {REVIEWS.map((rev) => (
              <div
                key={rev.id}
                style={{
                  flex: `0 0 calc(${100 / cardsPerView}% - ${(24 * (cardsPerView - 1)) / cardsPerView}px)`,
                  minWidth: `calc(${100 / cardsPerView}% - ${(24 * (cardsPerView - 1)) / cardsPerView}px)`,
                  background: 'var(--white, #ffffff)',
                  border: '1px solid var(--line, #DBD5C5)',
                  borderRadius: '16px',
                  padding: '28px 26px',
                  boxShadow: '0 6px 20px rgba(17, 54, 43, 0.05)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  position: 'relative',
                  transition: 'transform 0.25s ease, box-shadow 0.25s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.boxShadow = '0 12px 28px rgba(17, 54, 43, 0.12)';
                  e.currentTarget.style.borderColor = 'var(--gold, #D49B3A)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 6px 20px rgba(17, 54, 43, 0.05)';
                  e.currentTarget.style.borderColor = 'var(--line, #DBD5C5)';
                }}
              >
                {/* Top Badge: 5 Stars & Google Verified */}
                <div>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginBottom: '16px'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                      {[...Array(rev.rating)].map((_, i) => (
                        <span key={i} style={{ color: '#F59E0B', fontSize: '18px', lineHeight: 1 }}>
                          ★
                        </span>
                      ))}
                    </div>
                    <span
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px',
                        fontSize: '11px',
                        fontWeight: 700,
                        color: '#059669',
                        background: 'rgba(16, 185, 129, 0.1)',
                        padding: '3px 8px',
                        borderRadius: '12px'
                      }}
                    >
                      ✓ Verified Review
                    </span>
                  </div>

                  {/* Review Text */}
                  <p
                    style={{
                      fontSize: '14.5px',
                      lineHeight: '1.65',
                      color: 'var(--ink, #141916)',
                      fontStyle: 'normal',
                      margin: '0 0 20px 0',
                      fontWeight: 500
                    }}
                  >
                    "{rev.comment}"
                  </p>
                </div>

                {/* Footer: User Profile, Date, Product */}
                <div
                  style={{
                    borderTop: '1px solid var(--line, #DBD5C5)',
                    paddingTop: '16px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px'
                  }}
                >
                  <div
                    style={{
                      width: '42px',
                      height: '42px',
                      borderRadius: '50%',
                      background: rev.avatarBg,
                      color: '#ffffff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 800,
                      fontSize: '14px',
                      letterSpacing: '0.5px',
                      flexShrink: 0
                    }}
                  >
                    {rev.initials}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: '8px'
                      }}
                    >
                      <h4
                        style={{
                          margin: 0,
                          fontSize: '14.5px',
                          fontWeight: 800,
                          color: 'var(--pitch, #11362B)',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis'
                        }}
                      >
                        {rev.name}
                      </h4>
                      <span
                        style={{
                          fontSize: '11px',
                          color: 'var(--ink-soft, #454D47)',
                          whiteSpace: 'nowrap'
                        }}
                      >
                        {rev.date}
                      </span>
                    </div>
                    <div
                      style={{
                        fontSize: '12px',
                        color: 'var(--gold-dark, #A07022)',
                        fontWeight: 600,
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        marginTop: '2px'
                      }}
                    >
                      {rev.product}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pagination Dots */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            marginTop: '28px'
          }}
        >
          {Array.from({ length: maxIndex + 1 }).map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              aria-label={`Go to slide ${idx + 1}`}
              style={{
                width: currentIndex === idx ? '28px' : '8px',
                height: '8px',
                borderRadius: '4px',
                background: currentIndex === idx ? 'var(--pitch, #11362B)' : 'var(--line, #DBD5C5)',
                border: 'none',
                padding: 0,
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ReviewsSlider;
