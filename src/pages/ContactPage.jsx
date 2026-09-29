import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Send,
  CheckCircle2,
  HelpCircle,
  MessageSquare,
  Award,
  Zap,
  ShieldCheck,
  ChevronDown
} from 'lucide-react';

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    category: 'General Inquiry',
    subject: '',
    message: ''
  });

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    // Simulate smooth API request delay
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
      setFormData({
        name: '',
        email: '',
        phone: '',
        category: 'General Inquiry',
        subject: '',
        message: ''
      });
    }, 1200);
  };

  const faqs = [
    {
      q: 'Are all products sold on Chhabra Sports 100% genuine?',
      a: 'Yes, absolutely. We are authorized dealers for Yonex, Li-Ning, Victor, Babolat, Head, Cosco, and SG. Every product comes with standard manufacturer warranty and authenticity verification codes.'
    },
    {
      q: 'Do you offer custom racquet stringing?',
      a: 'Yes! We have professional electronic gutting machines and experienced stringers. You can select your preferred string type (e.g. Yonex BG65, BG80, Nanogy 95) and tension (lbs) when ordering or contacting us.'
    },
    {
      q: 'What are the delivery timelines across India?',
      a: 'Express Pan-India shipping typically takes 2 to 5 business days depending on your location. Metro cities receive orders within 48-72 hours.'
    },
    {
      q: 'How can I track my order?',
      a: 'Once your order is dispatched, you will receive an SMS and email with a live tracking link. You can also view status updates under your Profile > My Orders section.'
    },
    {
      q: 'Can I visit your physical store in Patna?',
      a: 'We warmly welcome you! Visit us at L. B. Shop No. 10, Boring Road, Patna, Bihar – 800001. We are open Monday to Saturday from 10:00 AM to 8:30 PM.'
    }
  ];

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  return (
    <div className="contact-page court-pattern" style={{ paddingBottom: '80px' }}>
      
      {/* HERO BANNER SECTION */}
      <section
        style={{
          background: 'linear-gradient(135deg, var(--pitch-dark) 0%, var(--pitch) 100%)',
          color: 'var(--parchment)',
          padding: '64px 0 72px',
          borderBottom: '4px solid var(--gold)',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <div className="wrap" style={{ position: 'relative', zIndex: 2 }}>
          <div style={{ maxWidth: '780px', margin: '0 auto', textAlign: 'center' }}>
            <span
              className="eyebrow"
              style={{
                color: 'var(--gold)',
                background: 'rgba(212, 155, 58, 0.12)',
                padding: '6px 16px',
                borderRadius: '20px',
                display: 'inline-block',
                marginBottom: '16px',
                border: '1px solid rgba(212, 155, 58, 0.3)'
              }}
            >
              🤝 WE ARE HERE TO HELP
            </span>
            <h1
              className="display"
              style={{
                fontSize: 'clamp(2.2rem, 5vw, 3.4rem)',
                fontWeight: 900,
                color: 'var(--white)',
                lineHeight: 1.15,
                marginBottom: '18px'
              }}
            >
              Get in Touch with Our <span style={{ color: 'var(--gold-light)' }}>Racquet Experts</span>
            </h1>
            <p
              style={{
                fontSize: '16px',
                color: 'var(--parchment-dim)',
                lineHeight: 1.6,
                margin: '0 auto'
              }}
            >
              Have a question about string tension, racquet selection, bulk orders, or order status? 
              Our experienced sports specialists in Patna are ready to serve you.
            </p>
          </div>
        </div>
      </section>

      {/* QUICK CONTACT INFO CARDS GRID */}
      <div className="wrap" style={{ marginTop: '-36px', position: 'relative', zIndex: 10 }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '20px'
          }}
        >
          {/* Card 1: Phone */}
          <div
            style={{
              background: 'var(--white)',
              border: '1px solid var(--line)',
              borderRadius: 'var(--radius-lg)',
              padding: '24px',
              boxShadow: 'var(--shadow-md)',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
              transition: 'transform 0.2s ease, box-shadow 0.2s ease'
            }}
          >
            <div
              style={{
                width: '48px',
                height: '48px',
                borderRadius: '12px',
                background: 'rgba(212, 155, 58, 0.15)',
                color: 'var(--gold-dark)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Phone size={24} />
            </div>
            <div>
              <h3 style={{ fontSize: '16px', fontWeight: 800, color: 'var(--pitch)', marginBottom: '4px' }}>
                Helpline & WhatsApp
              </h3>
              <p style={{ fontSize: '13px', color: 'var(--ink-soft)', marginBottom: '8px' }}>
                Direct phone & instant WhatsApp assistance.
              </p>
              <a
                href="tel:+917277252440"
                style={{
                  fontSize: '15px',
                  fontWeight: 800,
                  color: 'var(--gold-dark)',
                  display: 'inline-block'
                }}
              >
                +91 72772 52440
              </a>
            </div>
          </div>

          {/* Card 2: Email */}
          <div
            style={{
              background: 'var(--white)',
              border: '1px solid var(--line)',
              borderRadius: 'var(--radius-lg)',
              padding: '24px',
              boxShadow: 'var(--shadow-md)',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px'
            }}
          >
            <div
              style={{
                width: '48px',
                height: '48px',
                borderRadius: '12px',
                background: 'rgba(17, 54, 43, 0.1)',
                color: 'var(--pitch)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Mail size={24} />
            </div>
            <div>
              <h3 style={{ fontSize: '16px', fontWeight: 800, color: 'var(--pitch)', marginBottom: '4px' }}>
                Email Support
              </h3>
              <p style={{ fontSize: '13px', color: 'var(--ink-soft)', marginBottom: '8px' }}>
                Send us inquiries anytime; we reply within 24 hours.
              </p>
              <a
                href="mailto:chhabrasportspatna@outlook.com"
                style={{
                  fontSize: '13.5px',
                  fontWeight: 700,
                  color: 'var(--pitch)',
                  wordBreak: 'break-all'
                }}
              >
                chhabrasportspatna@outlook.com
              </a>
            </div>
          </div>

          {/* Card 3: Store Location */}
          <div
            style={{
              background: 'var(--white)',
              border: '1px solid var(--line)',
              borderRadius: 'var(--radius-lg)',
              padding: '24px',
              boxShadow: 'var(--shadow-md)',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px'
            }}
          >
            <div
              style={{
                width: '48px',
                height: '48px',
                borderRadius: '12px',
                background: 'rgba(109, 30, 42, 0.1)',
                color: 'var(--oxblood)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <MapPin size={24} />
            </div>
            <div>
              <h3 style={{ fontSize: '16px', fontWeight: 800, color: 'var(--pitch)', marginBottom: '4px' }}>
                Flagship Store
              </h3>
              <p style={{ fontSize: '13px', color: 'var(--ink-soft)' }}>
                L. B. Shop No. 10, Boring Road, Patna, Bihar – 800001
              </p>
            </div>
          </div>

          {/* Card 4: Store Hours */}
          <div
            style={{
              background: 'var(--white)',
              border: '1px solid var(--line)',
              borderRadius: 'var(--radius-lg)',
              padding: '24px',
              boxShadow: 'var(--shadow-md)',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px'
            }}
          >
            <div
              style={{
                width: '48px',
                height: '48px',
                borderRadius: '12px',
                background: 'rgba(35, 101, 81, 0.15)',
                color: 'var(--pitch-accent)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Clock size={24} />
            </div>
            <div>
              <h3 style={{ fontSize: '16px', fontWeight: 800, color: 'var(--pitch)', marginBottom: '4px' }}>
                Working Hours
              </h3>
              <p style={{ fontSize: '13px', color: 'var(--ink-soft)' }}>
                Mon - Sat: <strong>10:00 AM - 8:30 PM</strong>
                <br />
                Sunday: Closed (Online Orders Active)
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* MAIN SECTION: CONTACT FORM & MAP CONTAINER */}
      <div className="wrap" style={{ marginTop: '56px' }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
            gap: '40px',
            alignItems: 'start'
          }}
        >
          {/* CONTACT FORM CONTAINER */}
          <div
            style={{
              background: 'var(--white)',
              border: '1px solid var(--line)',
              borderRadius: 'var(--radius-lg)',
              padding: '36px',
              boxShadow: 'var(--shadow-md)'
            }}
          >
            <div style={{ marginBottom: '28px' }}>
              <span className="eyebrow">SEND A MESSAGE</span>
              <h2
                className="display"
                style={{ fontSize: '24px', fontWeight: 800, color: 'var(--pitch)', marginTop: '4px' }}
              >
                Send Us a Quick Message
              </h2>
              <p style={{ fontSize: '14px', color: 'var(--ink-soft)', marginTop: '6px' }}>
                Fill out the form below and our equipment experts will get back to you promptly.
              </p>
            </div>

            {submitted ? (
              <div
                style={{
                  background: 'rgba(35, 101, 81, 0.08)',
                  border: '1px solid var(--pitch-accent)',
                  borderRadius: 'var(--radius)',
                  padding: '32px 24px',
                  textAlign: 'center'
                }}
              >
                <CheckCircle2 size={54} color="var(--pitch-accent)" style={{ margin: '0 auto 16px' }} />
                <h3 style={{ fontSize: '20px', fontWeight: 800, color: 'var(--pitch)' }}>
                  Message Sent Successfully!
                </h3>
                <p style={{ fontSize: '14px', color: 'var(--ink-soft)', marginTop: '8px', lineHeight: 1.6 }}>
                  Thank you for reaching out to Chhabra Sports. Our representative will contact you via phone or email shortly.
                </p>
                <button
                  className="btn btn-gold"
                  style={{ marginTop: '20px', padding: '10px 24px' }}
                  onClick={() => setSubmitted(false)}
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div className="form-group">
                    <label htmlFor="name">Your Name *</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      required
                      placeholder="e.g. Rahul Sharma"
                      className="form-control"
                      value={formData.name}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="phone">Phone Number *</label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      required
                      placeholder="+91 98765 43210"
                      className="form-control"
                      value={formData.phone}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="email">Email Address *</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    placeholder="name@example.com"
                    className="form-control"
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="category">Inquiry Topic</label>
                  <select
                    id="category"
                    name="category"
                    className="form-control"
                    value={formData.category}
                    onChange={handleChange}
                  >
                    <option value="General Inquiry">General Inquiry</option>
                    <option value="Racquet Selection & Customization">Racquet Selection & Customization</option>
                    <option value="Order Status & Shipping">Order Status & Shipping</option>
                    <option value="Gutting & Stringing Consultation">Gutting & Stringing Consultation</option>
                    <option value="Wholesale / Institutional Supplies">Wholesale & Institutional Supplies</option>
                    <option value="Warranty & Returns">Warranty & Returns</option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="company">Company / Organization (Optional)</label>
                  <input
                    type="text"
                    id="company"
                    name="company"
                    placeholder="e.g. Sports Academy, School, or Organization Name"
                    className="form-control"
                    value={formData.company || ''}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="message">Your Message (Optional)</label>
                  <textarea
                    id="message"
                    name="message"
                    rows={5}
                    placeholder="Provide details about your query or requirement..."
                    className="form-control"
                    value={formData.message}
                    onChange={handleChange}
                    style={{ resize: 'vertical' }}
                  ></textarea>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="btn btn-gold"
                  style={{
                    width: '100%',
                    padding: '14px',
                    fontSize: '14px',
                    fontWeight: 800,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '10px'
                  }}
                >
                  {loading ? (
                    <span>Sending Message...</span>
                  ) : (
                    <>
                      <Send size={16} />
                      <span>Submit Inquiry</span>
                    </>
                  )}
                </button>
              </form>
            )}
          </div>

          {/* RIGHT SIDE: MAP & STORE HIGHLIGHTS */}
          <div style={{ display: 'flex', flexContent: 'column', flexDirection: 'column', gap: '24px' }}>
            
            {/* Store Map Container */}
            <div
              style={{
                background: 'var(--white)',
                border: '1px solid var(--line)',
                borderRadius: 'var(--radius-lg)',
                overflow: 'hidden',
                boxShadow: 'var(--shadow-md)'
              }}
            >
              <div style={{ padding: '20px 24px', background: 'var(--pitch-dark)', color: 'var(--parchment)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <MapPin size={20} color="var(--gold)" />
                  <div>
                    <h3 style={{ fontSize: '16px', fontWeight: 800, margin: 0, color: 'var(--white)' }}>
                      Visit Patna Showroom
                    </h3>
                    <p style={{ fontSize: '12px', color: 'var(--parchment-dim)', margin: 0 }}>
                      L. B. Shop No. 10, Boring Road, Patna, Bihar – 800001
                    </p>
                  </div>
                </div>
              </div>

              {/* Google Maps Embed iframe */}
              <div style={{ width: '100%', height: '280px', background: '#e5e3df', position: 'relative' }}>
                <iframe
                  loading="lazy"
                  src="https://maps.google.com/maps?q=chhabra%20sports%2C%20patna&amp;t=m&amp;z=12&amp;output=embed&amp;iwloc=near"
                  title="chhabra sports, patna"
                  aria-label="chhabra sports, patna"
                  width="100%"
                  height="100%"
                  frameBorder="0"
                  style={{ border: 0 }}
                ></iframe>
              </div>

              <div style={{ padding: '16px 24px', background: 'var(--parchment-dim)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--ink)' }}>
                  Need Directions?
                </span>
                <a
                  href="https://maps.google.com/?q=Chhabra+Sports+Boring+Road+Patna"
                  target="_blank"
                  rel="noreferrer"
                  className="btn btn-outline"
                  style={{ padding: '6px 14px', fontSize: '12px' }}
                >
                  Open in Google Maps
                </a>
              </div>
            </div>

            {/* Store Highlights Box */}
            <div
              style={{
                background: 'linear-gradient(135deg, var(--pitch) 0%, var(--pitch-dark) 100%)',
                color: 'var(--parchment)',
                borderRadius: 'var(--radius-lg)',
                padding: '28px',
                boxShadow: 'var(--shadow-md)',
                border: '1px solid rgba(212, 155, 58, 0.3)'
              }}
            >
              <h3
                className="display"
                style={{ fontSize: '18px', fontWeight: 800, color: 'var(--gold-light)', marginBottom: '16px' }}
              >
                Why Athletes Trust Chhabra Sports
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                  <ShieldCheck size={20} color="var(--gold)" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <div>
                    <h4 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--white)' }}>
                      100% Genuine Guarantee
                    </h4>
                    <p style={{ fontSize: '12.5px', color: 'var(--parchment-dim)', margin: 0 }}>
                      Every racquet & shoe comes directly from official brand importers.
                    </p>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                  <Zap size={20} color="var(--gold)" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <div>
                    <h4 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--white)' }}>
                      Pro Stringing Studio
                    </h4>
                    <p style={{ fontSize: '12.5px', color: 'var(--parchment-dim)', margin: 0 }}>
                      Electronic tensioning machines for precise string placement up to 35 lbs.
                    </p>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                  <Award size={20} color="var(--gold)" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <div>
                    <h4 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--white)' }}>
                      25+ Years Legacy
                    </h4>
                    <p style={{ fontSize: '12.5px', color: 'var(--parchment-dim)', margin: 0 }}>
                      Serving state & national level players across India since 1998.
                    </p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* FAQ ACCORDION SECTION */}
      <div className="wrap" style={{ marginTop: '72px' }}>
        <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto 36px' }}>
          <span className="eyebrow">FREQUENTLY ASKED QUESTIONS</span>
          <h2 className="display" style={{ fontSize: '28px', fontWeight: 800, color: 'var(--pitch)', marginTop: '4px' }}>
            Got Questions? We Have Answers
          </h2>
          <p style={{ fontSize: '14px', color: 'var(--ink-soft)' }}>
            Find quick answers to common queries regarding ordering, stringing, and genuine warranty.
          </p>
        </div>

        <div style={{ maxWidth: '840px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {faqs.map((faq, index) => {
            const isOpen = openFaq === index;
            return (
              <div
                key={index}
                style={{
                  background: 'var(--white)',
                  border: '1px solid var(--line)',
                  borderRadius: 'var(--radius)',
                  overflow: 'hidden',
                  transition: 'border-color 0.2s'
                }}
              >
                <button
                  onClick={() => toggleFaq(index)}
                  style={{
                    width: '100%',
                    padding: '18px 24px',
                    background: 'none',
                    border: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    textAlign: 'left',
                    cursor: 'pointer',
                    gap: '16px'
                  }}
                >
                  <span style={{ fontSize: '15px', fontWeight: 700, color: 'var(--pitch)' }}>
                    {faq.q}
                  </span>
                  <ChevronDown
                    size={18}
                    color="var(--gold-dark)"
                    style={{
                      transform: isOpen ? 'rotate(180deg)' : 'none',
                      transition: 'transform 0.2s ease',
                      flexShrink: 0
                    }}
                  />
                </button>

                {isOpen && (
                  <div
                    style={{
                      padding: '0 24px 20px',
                      fontSize: '14px',
                      color: 'var(--ink-soft)',
                      lineHeight: 1.6,
                      borderTop: '1px solid var(--line-dark)'
                    }}
                  >
                    <p style={{ marginTop: '12px' }}>{faq.a}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};

export default ContactPage;
