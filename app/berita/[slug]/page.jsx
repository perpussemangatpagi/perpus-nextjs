import '../../globals.css';
import Link from 'next/link';

// Halaman ini bakal nangkep link apapun setelah /berita/
export default function DetailBerita({ params }) {
  // params.slug bakal berisi judul dari link URL
  const slug = params.slug;

  return (
    <div className="container" style={{ paddingTop: '50px' }}>
      
      {/* Tombol Kembali */}
      <Link href="/" style={{ display: 'inline-block', marginBottom: '20px', color: '#0ea5e9', fontWeight: 'bold', textDecoration: 'none' }}>
        <i className="fa-solid fa-arrow-left"></i> Kembali ke Perpus
      </Link>

      <div className="glass-card" style={{ background: 'rgba(255, 255, 255, 0.9)', padding: '30px', borderRadius: '24px' }}>
        {/* Nanti data aslinya di-fetch dari Github API lu */}
        <h1 style={{ fontSize: '2.5rem', marginBottom: '10px', color: '#0f172a' }}>
          Halaman Berita: {slug.replace(/-/g, ' ').toUpperCase()}
        </h1>
        
        <p style={{ color: '#64748b', fontWeight: 'bold', marginBottom: '20px' }}>
          02 Juli 2026 | Perpustakaan Semangat Pagi
        </p>
        
        <img 
          src="/gambar/WhatsApp Image 2026-05-30 at 10.32.43 AM.jpeg" 
          alt="Foto Berita" 
          style={{ width: '100%', maxHeight: '400px', objectFit: 'cover', borderRadius: '16px', marginBottom: '20px' }} 
        />
        
        <div style={{ lineHeight: '1.8', color: '#334155', fontSize: '1.1rem' }}>
          <p>Ini adalah isi detail dari berita. Nanti saat lu udah sambungin API Github Markdown lu, teks aslinya bakal muncul di sini.</p>
          <p>Karena lu udah bikin ini di <strong>app/berita/[slug]/page.jsx</strong>, link halaman ini sekarang bisa di-copy dan di-share ke grup WA atau sosmed sekolah. Keren kan?</p>
        </div>
      </div>
    </div>
  );
}
