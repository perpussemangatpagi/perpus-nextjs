'use client';
import { useState } from 'react';

export default function AdminPage() {
  const [judul, setJudul] = useState('');
  const [tanggal, setTanggal] = useState('');
  const [isi, setIsi] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handlePublish = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Alert biar user tau lagi proses nembak API
    alert("Sedang ngirim naskah ke GitHub... Tunggu popup sukses ya bre!");

    try {
      const response = await fetch('/api/publish', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ judul, tanggal, isi }),
      });

      const data = await response.json();

      if (response.ok) {
        alert("🔥 SIKATT! " + data.message);
        // Kosongin form kalau udah sukses
        setJudul('');
        setTanggal('');
        setIsi('');
      } else {
        alert("Waduh error: " + data.error);
        console.error(data.detail);
      }
    } catch (error) {
      alert("Gagal konek ke API bre! Cek setingan Token Vercel.");
    }
    
    setIsLoading(false);
  };

  return (
    <div style={{ minHeight: '100vh', padding: '50px 20px', background: 'linear-gradient(135deg, #e0f2fe, #f3e8ff)', fontFamily: 'sans-serif' }}>
      <div style={{ maxWidth: '600px', margin: '0 auto', background: 'rgba(255,255,255,0.8)', backdropFilter: 'blur(10px)', padding: '30px', borderRadius: '24px', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}>
        
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <h2 style={{ color: '#0f172a', margin: 0, fontSize: '1.8rem' }}>Halaman Admin Perpus</h2>
          <p style={{ color: '#64748b', marginTop: '5px' }}>CMS Khusus Admin (Bocil dilarang masuk!)</p>
        </div>

        <form onSubmit={handlePublish} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          <div>
            <label style={{ fontWeight: 'bold', color: '#334155', display: 'block', marginBottom: '8px' }}>Judul Berita</label>
            <input 
              type="text" 
              required 
              placeholder="Contoh: Kunjungan Asesor 2026"
              value={judul} 
              onChange={(e) => setJudul(e.target.value)} 
              style={{ width: '100%', padding: '12px 15px', borderRadius: '12px', border: '2px solid #cbd5e1', outline: 'none', fontSize: '1rem', background: 'white' }} 
            />
          </div>

          <div>
            <label style={{ fontWeight: 'bold', color: '#334155', display: 'block', marginBottom: '8px' }}>Tanggal</label>
            <input 
              type="date" 
              required 
              value={tanggal} 
              onChange={(e) => setTanggal(e.target.value)} 
              style={{ width: '100%', padding: '12px 15px', borderRadius: '12px', border: '2px solid #cbd5e1', outline: 'none', fontSize: '1rem', background: 'white' }} 
            />
          </div>

          <div>
            <label style={{ fontWeight: 'bold', color: '#334155', display: 'block', marginBottom: '8px' }}>Isi Berita</label>
            <textarea 
              required 
              rows="8" 
              placeholder="Ketik isi berita lengkap di sini bre..."
              value={isi} 
              onChange={(e) => setIsi(e.target.value)} 
              style={{ width: '100%', padding: '12px 15px', borderRadius: '12px', border: '2px solid #cbd5e1', outline: 'none', fontSize: '1rem', background: 'white', resize: 'vertical' }}
            ></textarea>
          </div>

          <button 
            type="submit" 
            disabled={isLoading}
            style={{ 
              marginTop: '10px', padding: '15px', background: isLoading ? '#94a3b8' : '#0ea5e9', 
              color: 'white', border: 'none', borderRadius: '50px', cursor: isLoading ? 'not-allowed' : 'pointer', 
              fontWeight: 'bold', fontSize: '1.1rem', boxShadow: '0 4px 15px rgba(14, 165, 233, 0.3)', transition: 'background 0.3s' 
            }}
          >
            {isLoading ? 'Sedang Nulis ke GitHub...' : 'Terbitkan Berita 🚀'}
          </button>

        </form>
      </div>
    </div>
  );
}
