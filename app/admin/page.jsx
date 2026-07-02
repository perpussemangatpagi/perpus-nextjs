'use client';
import { useEffect, useState } from 'react';

export default function AdminPage() {
  const [isAuthChecking, setIsAuthChecking] = useState(true);
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [inputUser, setInputUser] = useState('');
  const [inputPass, setInputPass] = useState('');
  const [isLoginLoading, setIsLoginLoading] = useState(false);

  const [view, setView] = useState('list');
  const [beritaList, setBeritaList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingText, setLoadingText] = useState('');

  const [judul, setJudul] = useState('');
  const [tanggal, setTanggal] = useState('');
  const [isi, setIsi] = useState('');
  const [fileImages, setFileImages] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [editSha, setEditSha] = useState('');
  const [editFilename, setEditFilename] = useState('');

  useEffect(() => {
    const savedUser = localStorage.getItem('perpus_user');
    if (savedUser) setLoggedInUser(JSON.parse(savedUser));
    setIsAuthChecking(false);
  }, []);

  useEffect(() => {
    if (loggedInUser && view === 'list') loadBerita();
  }, [loggedInUser, view]);

  // LOGIN AMAN VIA API
  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoginLoading(true);

    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: inputUser, password: inputPass })
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem('perpus_user', JSON.stringify(data.user));
        setLoggedInUser(data.user);
      } else {
        alert(data.error);
      }
    } catch (error) {
      alert("Gagal nyambung ke server Login bre.");
    }
    setIsLoginLoading(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('perpus_user');
    setLoggedInUser(null);
    setInputUser('');
    setInputPass('');
    setView('list');
  };

  const loadBerita = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/publish', { method: 'POST', body: JSON.stringify({ action: 'list' }) });
      const data = await res.json();
      setBeritaList(data.data || []);
    } catch (e) {
      alert("Gagal memuat daftar berita.");
    }
    setIsLoading(false);
  };

  const handleDelete = async (item) => {
    if (!confirm(`Yakin mau hanguskan berita: ${item.name.replace('.md', '')}?`)) return;
    setIsLoading(true);
    try {
      await fetch('/api/publish', { method: 'POST', body: JSON.stringify({ action: 'delete', filename: item.name, sha: item.sha }) });
      loadBerita();
    } catch (e) {
      alert("Gagal menghapus berita.");
    }
    setIsLoading(false);
  };

  const handleEdit = async (item) => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/publish', { method: 'POST', body: JSON.stringify({ action: 'get', filename: item.name }) });
      const data = await res.json();
      setEditSha(data.sha);
      setEditFilename(item.name);

      const match = data.content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
      if (match) {
        const fm = match[1];
        setIsi(match[2].trim());
        let jdl = '', tgl = '', imgs = [];
        fm.split('\n').forEach(line => {
          if (line.startsWith('judul:')) jdl = line.replace('judul:', '').replace(/"/g, '').trim();
          if (line.startsWith('tanggal:')) tgl = line.replace('tanggal:', '').replace(/"/g, '').trim();
          if (line.startsWith('images:')) { try { imgs = JSON.parse(line.replace('images:', '').trim()); } catch(e){} }
        });
        setJudul(jdl); setTanggal(tgl); setExistingImages(imgs);
      } else {
        setIsi(data.content);
      }
      setView('form');
    } catch (e) {
      alert("Gagal ngebaca isi file berita.");
    }
    setIsLoading(false);
  };

  const toBase64 = (file) => new Promise((res, rej) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => res(reader.result.split(',')[1]);
    reader.onerror = rej;
  });

  const handleSave = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      let uploadedUrls = [];
      if (fileImages.length > 0) {
         setLoadingText(`Unggah ${fileImages.length} foto...`);
         for (let i = 0; i < fileImages.length; i++) {
            const b64 = await toBase64(fileImages[i]);
            const res = await fetch('/api/publish', {
               method: 'POST', body: JSON.stringify({ action: 'upload_image', filename: fileImages[i].name, base64: b64 })
            });
            const d = await res.json();
            if(d.url) uploadedUrls.push(d.url);
         }
      }
      const finalImages = [...existingImages, ...uploadedUrls];
      const thumbnail = finalImages.length > 0 ? finalImages[0] : '';
      let filenameToSave = editFilename || `${judul.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')}.md`;

      setLoadingText("Menyimpan naskah...");
      const res = await fetch('/api/publish', {
        method: 'POST',
        body: JSON.stringify({
          action: 'save',
          judul, tanggal, isi, thumbnail, 
          images: finalImages, filename: filenameToSave, sha: editSha,
          penulis: `${loggedInUser.name} | ${loggedInUser.role}`
        })
      });
      if (res.ok) {
        alert("🔥 SIKAT! Berita sukses mendarat di GitHub!");
        resetForm();
      } else {
        alert("Yah gagal nyimpan bre.");
      }
    } catch (e) { alert("Error koneksi API bre."); }
    setLoadingText(''); setIsLoading(false);
  };

  const resetForm = () => {
    setJudul(''); setTanggal(''); setIsi('');
    setFileImages([]); setExistingImages([]);
    setEditSha(''); setEditFilename('');
    setView('list');
  };

  if (isAuthChecking) return <div style={{ minHeight: '100vh', background: '#f8fafc', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>Cek gembok dulu...</div>;

  if (!loggedInUser) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', background: 'linear-gradient(135deg, #e0f2fe, #f3e8ff)' }}>
        <form onSubmit={handleLogin} style={{ background: 'white', padding: '40px', borderRadius: '24px', boxShadow: '0 10px 40px rgba(0,0,0,0.1)', width: '90%', maxWidth: '400px', textAlign: 'center' }}>
          <img src="/gambar/Logo Perpustakaan SMPN 1 Damai.png" alt="Logo" style={{ width: '80px', marginBottom: '20px' }} />
          <h2 style={{ marginBottom: '5px', color: '#0f172a' }}>Login Admin CMS</h2>
          <p style={{ color: '#64748b', marginBottom: '30px', fontSize: '0.9rem' }}>Akses Khusus Kepala Perpustakaan</p>
          <input type="text" placeholder="Username" value={inputUser} onChange={(e) => setInputUser(e.target.value)} required style={{ width: '100%', padding: '12px', marginBottom: '15px', borderRadius: '12px', border: '2px solid #e2e8f0', outline: 'none' }} />
          <input type="password" placeholder="Password" value={inputPass} onChange={(e) => setInputPass(e.target.value)} required style={{ width: '100%', padding: '12px', marginBottom: '25px', borderRadius: '12px', border: '2px solid #e2e8f0', outline: 'none' }} />
          <button type="submit" disabled={isLoginLoading} style={{ width: '100%', padding: '12px', background: isLoginLoading ? '#94a3b8' : '#0ea5e9', color: 'white', fontWeight: 'bold', border: 'none', borderRadius: '50px', cursor: isLoginLoading ? 'not-allowed' : 'pointer', fontSize: '1rem' }}>
            {isLoginLoading ? 'Membuka Brankas...' : 'Masuk Ruang Admin'}
          </button>
        </form>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', padding: '30px 15px', background: 'linear-gradient(135deg, #e0f2fe, #f3e8ff)' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto', background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(10px)', padding: '25px', borderRadius: '24px', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px', borderBottom: '2px solid #e2e8f0', paddingBottom: '15px' }}>
          <div>
            <h2 style={{ color: '#0f172a', margin: 0 }}>Dashboard CMS</h2>
            <p style={{ color: '#0ea5e9', fontSize: '0.85rem', margin: '5px 0 0 0', fontWeight: 'bold' }}>👤 {loggedInUser.name} ({loggedInUser.role})</p>
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            {view === 'list' && <button onClick={() => setView('form')} style={{ background: '#0ea5e9', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '50px', fontWeight: 'bold', cursor: 'pointer' }}>+ Tulis Baru</button>}
            <button onClick={handleLogout} style={{ background: '#ef4444', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '50px', fontWeight: 'bold', cursor: 'pointer' }}><i className="fa-solid fa-right-from-bracket"></i></button>
          </div>
        </div>

        {view === 'list' && (
          <div>
            {isLoading ? <p style={{ textAlign: 'center', fontWeight: 'bold', color: '#64748b' }}>Memuat data dari GitHub...</p> : beritaList.length === 0 ? <p style={{ textAlign: 'center', color: '#64748b' }}>Belum ada berita. Yuk buat baru!</p> : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {beritaList.map((item, idx) => (
                  <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#f8fafc', padding: '15px', borderRadius: '16px', border: '1px solid #cbd5e1' }}>
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

        {view === 'form' && (
          <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div>
              <label style={{ fontWeight: 'bold', color: '#334155', display: 'block', marginBottom: '8px' }}>Judul Berita</label>
              <input type="text" required value={judul} onChange={(e) => setJudul(e.target.value)} style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '2px solid #cbd5e1', outline: 'none' }} />
            </div>
            <div>
              <label style={{ fontWeight: 'bold', color: '#334155', display: 'block', marginBottom: '8px' }}>Tanggal</label>
              <input type="date" required value={tanggal} onChange={(e) => setTanggal(e.target.value)} style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '2px solid #cbd5e1', outline: 'none' }} />
            </div>
            <div>
              <label style={{ fontWeight: 'bold', color: '#334155', display: 'block', marginBottom: '8px' }}>Upload Foto</label>
              <input type="file" multiple accept="image/*" onChange={(e) => setFileImages(Array.from(e.target.files))} style={{ width: '100%', padding: '10px', background: '#f1f5f9', borderRadius: '12px', border: '2px dashed #94a3b8' }} />
              {existingImages.length > 0 && <p style={{ fontSize: '0.8rem', color: '#ec4899', marginTop: '5px' }}>*File ini udah ada {existingImages.length} foto lama.</p>}
            </div>
            <div>
              <label style={{ fontWeight: 'bold', color: '#334155', display: 'block', marginBottom: '8px' }}>Isi Berita</label>
              <textarea required rows="10" value={isi} onChange={(e) => setIsi(e.target.value)} style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '2px solid #cbd5e1', outline: 'none' }}></textarea>
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button type="button" onClick={resetForm} disabled={isLoading} style={{ flex: 1, padding: '15px', background: '#e2e8f0', border: 'none', borderRadius: '50px', cursor: 'pointer', fontWeight: 'bold' }}>Batal</button>
              <button type="submit" disabled={isLoading} style={{ flex: 2, padding: '15px', background: isLoading ? '#94a3b8' : '#10b981', color: 'white', border: 'none', borderRadius: '50px', cursor: 'pointer', fontWeight: 'bold' }}>{isLoading ? (loadingText || 'Menyimpan...') : '🚀 Simpan Berita'}</button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
