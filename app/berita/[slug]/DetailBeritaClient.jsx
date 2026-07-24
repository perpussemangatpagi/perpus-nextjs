'use client';

import Link from 'next/link';

export default function DetailBeritaClient({ berita, slug }) {
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
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
        <Link href="/#berita" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: '#0ea5e9', fontWeight: 'bold', textDecoration: 'none', background: 'white', padding: '8px 16px', borderRadius: '20px', boxShadow: '0 4px 10px rgba(0,0,0,0.05)' }}>
          <i className="fa-solid fa-arrow-left"></i> Kembali
        </Link>
        
        <button onClick={handleShare} style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: '#10b981', color: 'white', border: 'none', fontWeight: 'bold', padding: '8px 16px', borderRadius: '20px', cursor: 'pointer', boxShadow: '0 4px 10px rgba(16, 185, 129, 0.2)' }}>
          <i className="fa-solid fa-share-nodes"></i> Bagikan Info
        </button>
      </div>

      <div className="glass-card" style={{ background: 'rgba(255, 255, 255, 0.95)', padding: '30px', borderRadius: '24px', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}>
        {!berita ? (
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
              {berita.tanggal} {berita.penulis ? `| Penulis: ${berita.penulis}` : ''} | Perpustakaan Semangat Pagi
            </p>
            
            {berita.thumbnail && (
              <img 
                src={berita.thumbnail} 
                alt="Foto Berita" 
                style={{ width: '100%', maxHeight: '400px', objectFit: 'cover', borderRadius: '16px', marginBottom: '25px', backgroundColor: '#f8fafc', boxShadow: '0 4px 15px rgba(0,0,0,0.1)' }} 
              />
            )}
            
            <div style={{ lineHeight: '1.8', color: '#334155', fontSize: '1.1rem', whiteSpace: 'pre-wrap', textAlign: 'justify' }}>
              {berita.isi}
            </div>

            {berita.images && berita.images.length > 1 && (
              <div style={{ marginTop: '40px', paddingTop: '20px', borderTop: '2px dashed #e2e8f0' }}>
                <h3 style={{ color: '#0f172a', marginBottom: '15px' }}>Foto Lainnya</h3>
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
