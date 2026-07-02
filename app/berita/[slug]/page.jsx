'use client'; 
import '../../globals.css';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function DetailBerita({ params }) {
  const slug = params.slug;
  const [berita, setBerita] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDetailBerita = async () => {
      try {
        // Karena repo lu Public, kita bisa tembak langsung jalur raw-nya (Gak bakal kena limit API)
        const res = await fetch(`https://raw.githubusercontent.com/perpussemangatpagi/perpus-nextjs/main/berita/${slug}.md`, { cache: 'no-store' });
        
        if (!res.ok) {
          setBerita({ error: true });
          setIsLoading(false);
          return;
        }

        const content = await res.text();
        
        // Belah isi file (Pisahin metadata judul/tanggal dan isi teksnya)
        const match = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
        if (match) {
          const fm = match[1];
          const isi = match[2].trim();
          
          let judul = '', tanggal = '', thumbnail = '', images = [];
          fm.split('\n').forEach(line => {
            if (line.startsWith('judul:')) judul = line.replace('judul:', '').replace(/"/g, '').trim();
            if (line.startsWith('tanggal:')) tanggal = line.replace('tanggal:', '').replace(/"/g, '').trim();
            if (line.startsWith('thumbnail:')) thumbnail = line.replace('thumbnail:', '').replace(/"/g, '').trim();
            if (line.startsWith('images:')) {
               const arrStr = line.replace('images:', '').trim();
               try { images = JSON.parse(arrStr); } catch(e){}
            }
          });

          setBerita({ judul, tanggal, thumbnail, images, isi });
        }
      } catch (error) {
        setBerita({ error: true });
      }
      setIsLoading(false);
    };

    fetchDetailBerita();
  }, [slug]);

  // Fungsi untuk Tombol Bagikan/Share
  const handleShare = async () => {
    const shareData = {
      title: `Info Perpus: ${berita?.judul || slug}`,
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
      navigator.clipboard.writeText(window.location.href);
      alert('Link berita berhasil disalin! Silakan paste ke WA/Sosmed.');
    }
  };

  return (
    <div className="container" style={{ paddingTop: '50px', minHeight: '100vh' }}>
      
      {/* Tombol Kembali & Bagikan */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
        <Link href="/#berita" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: '#0ea5e9', fontWeight: 'bold', textDecoration: 'none', background: 'white', padding: '8px 16px', borderRadius: '20px', boxShadow: '0 4px 10px rgba(0,0,0,0.05)' }}>
          <i className="fa-solid fa-arrow-left"></i> Kembali
        </Link>
        
        <button onClick={handleShare} style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: '#10b981', color: 'white', border: 'none', fontWeight: 'bold', padding: '8px 16px', borderRadius: '20px', cursor: 'pointer', boxShadow: '0 4px 10px rgba(16, 185, 129, 0.2)' }}>
          <i className="fa-solid fa-share-nodes"></i> Bagikan Info
        </button>
      </div>

      <div className="glass-card" style={{ background: 'rgba(255, 255, 255, 0.95)', padding: '30px', borderRadius: '24px', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}>
        
        {isLoading ? (
          <div style={{ textAlign: 'center', padding: '50px 0', color: '#64748b' }}>
            <i className="fa-solid fa-spinner fa-spin" style={{ fontSize: '2rem', color: '#0ea5e9', marginBottom: '10px' }}></i>
            <p>Membuka lembaran koran...</p>
          </div>
        ) : berita?.error ? (
          <div style={{ textAlign: 'center', padding: '50px 0', color: '#ef4444' }}>
            <i className="fa-solid fa-triangle-exclamation" style={{ fontSize: '3rem', marginBottom: '10px' }}></i>
            <h2>Berita Tidak Ditemukan!</h2>
            <p>Kayaknya beritanya udah dihapus atau salah link bre.</p>
          </div>
        ) : (
          <>
            <h1 style={{ fontSize: '2.2rem', marginBottom: '10px', color: '#0f172a', lineHeight: '1.2' }}>
              {berita.judul}
            </h1>
            
            <p style={{ color: '#64748b', fontWeight: 'bold', marginBottom: '20px', borderBottom: '2px solid #e2e8f0', paddingBottom: '15px' }}>
              📅 {berita.tanggal} | 📍 Perpustakaan Semangat Pagi
            </p>
            
            {/* Foto Utama (Thumbnail) */}
            {berita.thumbnail && (
              <img 
                src={berita.thumbnail} 
                alt="Foto Berita" 
                style={{ width: '100%', maxHeight: '400px', objectFit: 'cover', borderRadius: '16px', marginBottom: '25px', backgroundColor: '#f8fafc', boxShadow: '0 4px 15px rgba(0,0,0,0.1)' }} 
              />
            )}
            
            {/* Teks Berita (whiteSpace: pre-wrap bikin enter/paragraf dari form nggak hancur) */}
            <div style={{ lineHeight: '1.8', color: '#334155', fontSize: '1.1rem', whiteSpace: 'pre-wrap', textAlign: 'justify' }}>
              {berita.isi}
            </div>

            {/* Galeri Foto Tambahan (Kalau upload foto lebih dari 1) */}
            {berita.images && berita.images.length > 1 && (
              <div style={{ marginTop: '40px', paddingTop: '20px', borderTop: '2px dashed #e2e8f0' }}>
                <h3 style={{ color: '#0f172a', marginBottom: '15px' }}>📸 Foto Lainnya</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '15px' }}>
                  {berita.images.slice(1).map((imgUrl, idx) => (
                    <img key={idx} src={imgUrl} alt={`Foto tambahan ${idx + 1}`} style={{ width: '100%', height: '150px', objectFit: 'cover', borderRadius: '12px', border: '1px solid #cbd5e1' }} />
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
