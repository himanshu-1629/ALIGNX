import { useRef, useEffect } from 'react';
import { Compass, Sparkles, Layers, ArrowRight } from 'lucide-react';

export interface SectionData {
  image: string;
  badge?: string;
  title: string;
  subtitle: string;
  metricLabel?: string;
  metricValue?: string;
  insight?: string;
  ctaText?: string;
  ctaTarget?: string;
}

export const SECTIONS: SectionData[] = [
  {
    image: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1920&q=80",
    badge: "01 • BEYOND TEST SCORES",
    title: "Shattering the 1D Score Trap",
    subtitle: "Standardized exams measure test-taking, not real ability. ALIGNX maps your true multidimensional intelligence.",
    metricLabel: "TRADITIONAL FIT",
    metricValue: "18% RETENTION",
    insight: "82% of graduates work in fields misaligned with their innate problem-solving style.",
    ctaText: "TRY REFRACTION ENGINE",
    ctaTarget: "tool-refraction"
  },
  {
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1920&q=80",
    badge: "02 • FAMILY REALITY",
    title: "Grounding Passion in Budget",
    subtitle: "No guesswork. Balance your personal ambition with family tuition comfort, relocation limits, and clear ROI.",
    metricLabel: "FAMILY CONSENSUS",
    metricValue: "96% ALIGNED",
    insight: "Transparent tradeoffs eliminate generational conflict before college admissions begin.",
    ctaText: "EXPLORE WHAT-IF SIMULATOR",
    ctaTarget: "tool-whatif"
  },
  {
    image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1920&q=80",
    badge: "03 • LIVE MARKET SIGNALS",
    title: "Live Tech & Career Corridors",
    subtitle: "Real-time demand signals and salary trends from Bangalore, Hyderabad, London, and Silicon Valley.",
    metricLabel: "MARKET TELEMETRY",
    metricValue: "14 HUBS LIVE",
    insight: "Live salary dispersion and emerging skill demands updated continuously.",
    ctaText: "VIEW OPPORTUNITY MAP",
    ctaTarget: "tool-map"
  }
];

export const ParallaxSection = ({
  image,
  badge,
  title,
  subtitle,
  metricLabel,
  metricValue,
  insight,
  ctaText,
  ctaTarget,
  index = 0
}: SectionData & { index?: number }) => {
  const ref = useRef<HTMLElement | null>(null);
  const bgRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!ref.current || !bgRef.current) return;
      const rect = ref.current.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      
      // Calculate how far the section is through the viewport (-1 to 1)
      if (rect.top < viewportHeight && rect.bottom > 0) {
        const offset = (rect.top - viewportHeight / 2) * 0.18;
        bgRef.current.style.transform = `translate3d(0, ${offset}px, 0)`;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (targetId?: string) => {
    if (!targetId) return;
    const el = document.getElementById(targetId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section ref={ref} className="parallax-section" id={`parallax-scene-0${index + 1}`}>
      <div ref={bgRef} className="parallax-bg">
        <img src={image} alt={title} loading="lazy" />
      </div>
      <div className="parallax-overlay" />
      
      <div className="parallax-content scroll-reveal">
        {badge && (
          <div className="parallax-badge">
            <Sparkles size={12} color="var(--accent)" />
            <span>{badge}</span>
          </div>
        )}

        <h2 className="parallax-title">{title}</h2>
        <p className="parallax-subtitle">{subtitle}</p>

        {metricLabel && (
          <div className="parallax-meta-grid">
            <div className="parallax-meta-item">
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem', color: 'var(--text-muted)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '4px' }}>
                {metricLabel}
              </div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', fontWeight: 700, color: 'var(--accent)' }}>
                {metricValue}
              </div>
            </div>

            {insight && (
              <div className="parallax-meta-item" style={{ gridColumn: 'span 2' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                  <Layers size={13} color="var(--accent)" />
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem', color: 'var(--text-muted)', letterSpacing: '0.12em' }}>
                    DECISION INTELLIGENCE NOTE
                  </span>
                </div>
                <div style={{ fontFamily: 'var(--font-body)', fontSize: '0.84rem', color: 'var(--text-secondary)', lineHeight: 1.45 }}>
                  {insight}
                </div>
              </div>
            )}
          </div>
        )}

        {ctaText && ctaTarget && (
          <div style={{ marginTop: '28px' }}>
            <button
              onClick={() => scrollToSection(ctaTarget)}
              className="btn-alignx-roll btn-alignx-roll-primary"
            >
              <span className="roll-track">
                <span className="roll-item">{ctaText}</span>
                <span className="roll-item">{ctaText}</span>
              </span>
              <ArrowRight size={14} />
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default function Parallax() {
  return (
    <div className="parallax-page" id="career-parallax-narrative">
      {/* Narrative Section Header */}
      <div
        style={{
          padding: '60px 24px 30px',
          textAlign: 'center',
          backgroundColor: 'var(--bg-deep)',
          borderBottom: '1px solid var(--border-hairline)'
        }}
        className="scroll-reveal"
      >
        <div className="titanium-badge" style={{ marginBottom: '16px' }}>
          <Compass size={12} color="var(--accent)" />
          <span>CINEMATIC PARALLAX ODYSSEY</span>
        </div>
        <h2
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(2rem, 4vw, 3.2rem)',
            fontWeight: 700,
            letterSpacing: '-0.035em',
            color: 'var(--text-primary)',
            marginBottom: '10px'
          }}
        >
          From Confusion to Conviction
        </h2>
        <p
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: '1.05rem',
            color: 'var(--text-secondary)',
            maxWidth: '560px',
            margin: '0 auto',
            lineHeight: 1.5
          }}
        >
          Three foundational realities behind career decisions that actually work.
        </p>
      </div>

      {SECTIONS.map((section, i) => (
        <ParallaxSection key={i} index={i} {...section} />
      ))}
    </div>
  );
}
