'use client';
import { useEffect, useState } from 'react';

export default function AdminPage() {
  const [view, setView] = useState('list'); // 'list' atau 'form'
  const [beritaList, setBeritaList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingText, setLoadingText] = useState('');

  // === STATE FORM BERITA ===
  const [judul, setJudul] = useState('');
  const [tanggal, setTanggal] = useState('');
  const [isi, setIsi] = useState('');
  const [fileImages, setFileImages] = useState([]); // File foto baru yang di-upload
  const [existingImages, setExistingImages] = useState([]); // Foto lama (saat mode edit)
  const [editSha, setEditSha] = useState(''); // KTP file untuk edit
  const [editFilename, setEditFilename] = useState('');

  // Nembak API pas pertama kali buka halaman Admin
  useEffect(() => {
    if (view === 'list') loadBerita();
  }, [view]);

  // READ: Narik daftar berita
  const loadBerita = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/publish', {
        method: 'POST',
        body: JSON.stringify({ action: 'list' })
      });
      const data = await res.json();
      setBeritaList(data.data || []);
    } catch (e) {
      alert("Gagal memuat daftar berita.");
    }
    setIsLoading(false);
  };

  // DELETE: Hapus berita
  const handleDelete = async (item) => {
    if (!confirm(`Yakin mau hanguskan berita: ${item.name.replace('.md', '')}?`)) return;
    setIsLoading(true);
    try {
      await fetch('/api/publish', {
        method: 'POST',
        body: JSON.stringify({ action: 'delete', filename: item.name, sha: item.sha })
      });
      alert("Berhasil dihapus bre!");
      loadBerita();
    } catch (e) {
      alert("Gagal menghapus berita.");
    }
    setIsLoading(false);
  };

  // UPDATE: Tarik isi berita buat di-edit
  const handleEdit = async (item) => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/publish', {
        method: 'POST',
        body: JSON.stringify({ action: 'get', filename: item.name })
      });
      const data = await res.json();
      setEditSha(data.sha);
      setEditFilename(item.name);

      // Mecah tulisan Markdown biar masuk ke kolom form
      const match = data.content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
      if (match) {
        const fm = match[1];
        setIsi(match[2].trim());

        let jdl = '', tgl = '', imgs = [];
        fm.split('\n').forEach(line => {
          if (line.startsWith('judul:')) jdl = line.replace('judul:', '').replace(/"/g, '').trim();
          if (line.startsWith('tanggal:')) tgl = line.replace('tanggal:', '').replace(/"/g, '').trim();
          if (line.startsWith('images:')) {
             const arrStr = line.replace('images:', '').trim();
             try { imgs = JSON.parse(arrStr); } catch(e){}
          }
        });
        setJudul(jdl);
        setTanggal(tgl);
        setExistingImages(imgs);
      } else {
        setIsi(data.content);
      }
      setView('form');
    } catch (e) {
      alert("Gagal ngebaca isi file berita.");
    }
    setIsLoading(false);
  };

  // Alat bantu ubah foto jadi teks (Base64)
  const toBase64 = (file) => new Promise((res, rej) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => res(reader.result.split(',')[1]);
    reader.onerror = rej;
  });

  // CREATE / UPDATE: Tombol Publish ditekan
  const handleSave = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      let uploadedUrls = [];
      
      // 1. Upload Gambar satu-satu kalau ada
      if (fileImages.length > 0) {
         setLoadingText(`Mengunggah ${fileImages.length} gambar ke GitHub...`);
         for (let i = 0; i < fileImages.length; i++) {
            const b64 = await toBase64(fileImages[i]);
            const res = await fetch('/api/publish', {
               method: 'POST',
               body: JSON.stringify({
                 action: 'upload_image',
                 filename: fileImages[i].name,
                 base64: b64
               })
            });
            const d = await res.json();
            if(d.url) uploadedUrls.push(d.url);
         }
      }

      // 2. Gabung Foto Lama + Baru (Foto Pertama Otomatis Jadi Thumbnail!)
      const finalImages = [...existingImages, ...uploadedUrls];
      const thumbnail = finalImages.length > 0 ? finalImages[0] : '';

      // 3. Nama file berita
      let filenameToSave = editFilename;
      if (!filenameToSave) {
         const slug = judul.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
         filenameToSave = `${slug}.md`;
      }

      // 4. Save Berita
      setLoadingText("Menyimpan teks berita...");
      const res = await fetch('/api/publish', {
        method: 'POST',
        body: JSON.stringify({
          action: 'save',
          judul, tanggal, isi,
          thumbnail, images: finalImages,
          filename: filenameToSave,
          sha: editSha
        })
      });

      if (res.ok) {
        alert("🔥 SIKAT! Berita sukses mendarat di GitHub!");
        resetForm();
      } else {
        alert("Yah gagal nyimpan bre.");
      }

    } catch (e) {
      alert("Error internet atau koneksi API bre.");
    }
    
    setLoadingText('');
    setIsLoading(false);
  };

  // TOMBOL BATAL (Cancel & Kosongin Form)
  const resetForm = () => {
    setJudul(''); setTanggal(''); setIsi('');
    setFileImages([]); setExistingImages([]);
    setEditSha(''); setEditFilename('');
    setView('list');
  };

  // ==========================================
  // TAMPILAN DASHBOARD
  // ==========================================
  return (
    <div style={{ minHeight: '100vh', padding: '30px 15px', background: 'linear-gradient(135deg, #e0f2fe, #f3e8ff)', fontFamily: 'sans-serif' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto', background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(10px)', padding: '25px', borderRadius: '24px', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px', borderBottom: '2px solid #e2e8f0', paddingBottom: '15px' }}>
          <div>
            <h2 style={{ color: '#0f172a', margin: 0 }}>Dashboard CMS</h2>
            <p style={{ color: '#64748b', fontSize: '0.85rem', margin: 0 }}>Kelola Berita SMPN 1 Damai</p>
          </div>
          {view === 'list' && (
            <button onClick={() => setView('form')} style={{ background: '#0ea5e9', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '50px', fontWeight: 'bold', cursor: 'pointer' }}>
              + Tulis Baru
            </button>
          )}
        </div>

        {/* ========================================== */}
        {/* VIEW 1: DAFTAR BERITA (READ & DELETE)      */}
        {/* ========================================== */}
        {view === 'list' && (
          <div>
            {isLoading ? (
              <p style={{ textAlign: 'center', fontWeight: 'bold', color: '#64748b' }}>Memuat data dari GitHub...</p>
            ) : beritaList.length === 0 ? (
              <p style={{ textAlign: 'center', color: '#64748b' }}>Belum ada berita. Yuk buat baru!</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {beritaList.map((item, index) => (
                  <div key={index} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#f8fafc', padding: '15px', borderRadius: '16px', border: '1px solid #cbd5e1' }}>
                    <span style={{ fontWeight: 'bold', color: '#1e293b' }}>{item.name.replace('.md', '').replace(/-/g, ' ')}</span>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button onClick={() => handleEdit(item)} style={{ background: '#f59e0b', color: 'white', border: 'none', padding: '8px 15px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>Edit</button>
                      <button onClick={() => handleDelete(item)} style={{ background: '#ef4444', color: 'white', border: 'none', padding: '8px 15px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>Hapus</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ========================================== */}
        {/* VIEW 2: FORM CREATE & UPDATE               */}
        {/* ========================================== */}
        {view === 'form' && (
          <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            
            <div>
              <label style={{ fontWeight: 'bold', color: '#334155', display: 'block', marginBottom: '8px' }}>Judul Berita</label>
              <input type="text" required placeholder="Contoh: Juara Lomba Cerdas Cermat" value={judul} onChange={(e) => setJudul(e.target.value)} style={{ width: '100%', padding: '12px 15px', borderRadius: '12px', border: '2px solid #cbd5e1', outline: 'none', fontSize: '1rem', background: 'white' }} />
            </div>

            <div>
              <label style={{ fontWeight: 'bold', color: '#334155', display: 'block', marginBottom: '8px' }}>Tanggal</label>
              <input type="date" required value={tanggal} onChange={(e) => setTanggal(e.target.value)} style={{ width: '100%', padding: '12px 15px', borderRadius: '12px', border: '2px solid #cbd5e1', outline: 'none', fontSize: '1rem', background: 'white' }} />
            </div>

            <div>
              <label style={{ fontWeight: 'bold', color: '#334155', display: 'block', marginBottom: '8px' }}>Upload Foto (Bisa pilih lebih dari 1! Foto pertama otomatis jadi Thumbnail)</label>
              <input 
                type="file" 
                multiple 
                accept="image/*" 
                onChange={(e) => setFileImages(Array.from(e.target.files))} 
                style={{ width: '100%', padding: '10px', background: '#f1f5f9', borderRadius: '12px', border: '2px dashed #94a3b8' }} 
              />
              {existingImages.length > 0 && (
                <p style={{ fontSize: '0.8rem', color: '#ec4899', marginTop: '5px' }}>*File ini udah ada {existingImages.length} foto lama.</p>
              )}
            </div>

            <div>
              <label style={{ fontWeight: 'bold', color: '#334155', display: 'block', marginBottom: '8px' }}>Isi Berita</label>
              <textarea required rows="10" placeholder="Ketik narasi beritanya di sini bre..." value={isi} onChange={(e) => setIsi(e.target.value)} style={{ width: '100%', padding: '12px 15px', borderRadius: '12px', border: '2px solid #cbd5e1', outline: 'none', fontSize: '1rem', background: 'white', resize: 'vertical' }}></textarea>
            </div>

            <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
              <button 
                type="button" 
                onClick={resetForm} 
                disabled={isLoading}
                style={{ flex: 1, padding: '15px', background: '#e2e8f0', color: '#475569', border: 'none', borderRadius: '50px', cursor: isLoading ? 'not-allowed' : 'pointer', fontWeight: 'bold', fontSize: '1rem' }}>
                Batal
              </button>
              
              <button 
                type="submit" 
                disabled={isLoading}
                style={{ flex: 2, padding: '15px', background: isLoading ? '#94a3b8' : '#10b981', color: 'white', border: 'none', borderRadius: '50px', cursor: isLoading ? 'not-allowed' : 'pointer', fontWeight: 'bold', fontSize: '1rem', boxShadow: '0 4px 15px rgba(16, 185, 129, 0.3)' }}>
                {isLoading ? (loadingText || 'Menyimpan...') : '🚀 Simpan Berita'}
              </button>
            </div>

          </form>
        )}

      </div>
    </div>
  );
}
