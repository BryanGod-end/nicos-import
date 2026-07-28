import { Link } from 'react-router-dom';

const FEATURED = [
  { slug: 'tecnologia', name: 'Tecnología', video: '/videos/tecnologia.mp4' },
  { slug: 'maquillaje', name: 'Maquillaje', video: '/videos/maquillaje.mp4' },
  { slug: 'hogar', name: 'Hogar', video: '/videos/hogar.mp4' },
  { slug: 'juguetes', name: 'Juguetes', video: '/videos/juguetes.mp4' },
];

export default function Home() {
  return (
    <div>
      <section className="video-hero">
        <div className="video-hero-grid">
          {FEATURED.map((cat) => (
            <Link key={cat.slug} to={`/categoria/${cat.slug}`} className="video-tile">
              <video
                className="video-tile-media"
                src={cat.video}
                autoPlay
                muted
                loop
                playsInline
              />
              <div className="video-tile-overlay" />
              <div className="video-tile-caption">
                <span className="video-tile-name">{cat.name}</span>
                <span className="video-tile-cta">Mostrar más →</span>
              </div>
            </Link>
          ))}
        </div>

        <div className="video-hero-logo">
          <img src="/images/logoNicos.png" alt="Nico's Import" />
        </div>
      </section>


    </div>
  );
}