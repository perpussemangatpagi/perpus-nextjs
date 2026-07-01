'use client'; 
import '../../globals.css';
import Link from 'next/link';

export default function DetailBerita({ params }) {
  const slug = params.slug;

  // Fungsi untuk Tombol Bagikan/Share
  const handleShare = async () => {
    const shareData = {
      title: `Info Perpus: ${slug.replace(/-/g, ' ').toUpperCase()}`,
      text: 'Cek info terbaru dari Perpustakaan Semangat Pagi SMPN 1 Damai!',
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.error('Batal share:', err);
      }
    } else {
      // Fallback kalau dibuka di PC atau browser yang gak support
      navigator.clipboard.writeText(window.location.href);
      alert('Link berita berhasil disalin! Silakan paste ke WA/Sosmed.');
    }
  };

  return (
    <div className="container" style={{ paddingTop: '50px' }}>
      
      {/* Tombol Kembali & Bagikan */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
        <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: '#0ea5e9', fontWeight: 'bold', textDecoration: 'none', background: 'white', padding: '8px 16px', borderRadius: '20px', boxShadow: '0 4px 10px rgba(0,0,0,0.05)' }}>
          <i className="fa-solid fa-arrow-left"></i> Kembali
        </Link>
        
        <button onClick={handleShare} style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: '#10b981', color: 'white', border: 'none', fontWeight: 'bold', padding: '8px 16px', borderRadius: '20px', cursor: 'pointer', boxShadow: '0 4px 10px rgba(16, 185, 129, 0.2)' }}>
          <i className="fa-solid fa-share-nodes"></i> Bagikan Info
        </button>
      </div>

      <div className="glass-card" style={{ background: 'rgba(255, 255, 255, 0.95)', padding: '30px', borderRadius: '24px', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}>
        
        <h1 style={{ fontSize: '2.2rem', marginBottom: '10px', color: '#0f172a', lineHeight: '1.2' }}>
          {slug.replace(/-/g, ' ').toUpperCase()}
        </h1>
        
        <p style={{ color: '#64748b', fontWeight: 'bold', marginBottom: '20px', borderBottom: '2px solid #e2e8f0', paddingBottom: '15px' }}>
          📅 02 Juli 2026 | 📍 Perpustakaan Semangat Pagi
        </p>
        
        <img 
          src="/gambar/WhatsApp Image 2026-05-30 at 10.32.43 AM.jpeg" 
          alt="Foto Berita" 
          style={{ width: '100%', maxHeight: '400px', objectFit: 'contain', borderRadius: '16px', marginBottom: '20px', backgroundColor: '#f8fafc' }} 
        />
        
        <div style={{ lineHeight: '1.8', color: '#334155', fontSize: '1.1rem' }}>
          <p>Ini adalah isi detail dari berita. Saat ini masih tampilan statis sebelum disambung dengan database file .md dari GitHub.</p>
          <br/>
          <p>Kini lu udah punya tombol <strong>Bagikan Info</strong> di pojok kanan atas. Coba aja tes klik kalau udah jadi, dijamin smooth ala aplikasi bawaan HP!</p>
        </div>
      </div>
    </div>
  );
}
