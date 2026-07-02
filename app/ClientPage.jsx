'use client';
import { useEffect, useRef, useState } from 'react';

export default function ClientPage() {
  const navRef = useRef(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);

  // STATE SEARCH NAVBAR (KONTEN WEB)
  const [searchWebQuery, setSearchWebQuery] = useState('');
  const [showWebResults, setShowWebResults] = useState(false);

  // STATE SEARCH E-KATALOG (KHUSUS E-BOOK)
  const [searchKatalogQuery, setSearchKatalogQuery] = useState('');
  const [showKatalogResults, setShowKatalogResults] = useState(false);

  // DATABASE BUKU
  const [dbBuku, setDbBuku] = useState([]);
  const [randomBuku, setRandomBuku] = useState([]); 
  const [isFetching, setIsFetching] = useState(true);

  // DATABASE KONTEN WEB
  const databaseWeb = [
    { judul: 'E-Katalog Perpustakaan', deskripsi: 'Akses ratusan modul pembelajaran, buku literatur, novel, dan kumpulan ebook internal sekolah.', link: '#katalog', icon: '📚' },
    { judul: 'Profil & Visi Misi', deskripsi: 'Semangat Pagi (Prestasi Anak Negeri). Menjadikan perpustakaan sebagai jantung pendidikan yang mencetak generasi literat, unggul, dan berwawasan global.', link: '#profil', icon: '🎯' },
    { judul: 'Jam Operasional & Aturan', deskripsi: 'Buka setiap hari sekolah 07.30 - 14.00 WITA. Maksimal pinjam 2 buku selama 7 hari.', link: '#info', icon: '⏰' },
    { judul: 'Etika Perpustakaan', deskripsi: 'Wajib tertib & tenang. Dilarang makan/minum, dilarang berbicara dengan suara keras.', link: '#info', icon: '⚠️' },
    { judul: 'Kunjungan Asesor Akreditasi', deskripsi: 'Berita: Hari ini perpustakaan Semangat Pagi kedatangan tim asesor untuk menilai kelengkapan literasi...', link: '/berita/kunjungan-asesor', icon: '📰' },
    { judul: 'Penambahan Koleksi E-Book', deskripsi: 'Berita: Kini siswa dapat mengakses ratusan e-book baru langsung dari sistem katalog...', link: '/berita/koleksi-ebook-baru', icon: '📰' },
    { judul: 'Struktur Organisasi', deskripsi: 'Pengurus: Sri Wahyuningsih, S.Pd (Kepala Sekolah), Mina Sari (Kepala Perpustakaan), Meltiana (Layanan Pembaca), Nur Alfi Syahri, S.P. (Layanan Teknis TIK).', link: '#struktur', icon: '👥' },
    { judul: 'Denah Ruangan', deskripsi: 'Pintu Masuk, Loker, Meja Petugas, Pohon Literasi, Rak Koran, Ruang Komputer, Ruang Lesehan, Rak Buku, Ruang Introvert, Belajar Kelompok.', link: '#denah', icon: '🗺️' },
    { judul: 'Kontak Kami', deskripsi: 'Email: smpn1damai@gmail.com dan Instagram: @smpn1damai', link: '#kontak', icon: '📞' }
  ];

  const cekPanah = () => {
    if (!navRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = navRef.current;
    setShowLeftArrow(scrollLeft > 5);
    setShowRightArrow(scrollWidth - clientWidth - scrollLeft > 5);
  };

  useEffect(() => {
    const fetchDataDrive = async () => {
      try {
        // ⚠️ JANGAN LUPA PASTE URL GOOGLE SCRIPT LU DI BAWAH SINI!
        const API_URL = "https://script.google.com/macros/s/AKfycbzFJTPSxbPY2dDC09KPDjuk38UdD9rMQzw00rpyKtqI406PnHuyDnZixEecaXLbQbC9eA/exec";
        const response = await fetch(API_URL);
        const data = await response.json();
        
        setDbBuku(data);
        
        // Ngacak buku
        const acakData = [...data].sort(() => 0.5 - Math.random());
        setRandomBuku(acakData.slice(0, 10)); 

      } catch (error) {
        console.error("Gagal memuat database perpustakaan dari Drive.");
      }
      setIsFetching(false);
    };

    fetchDataDrive();
    
    cekPanah();
    window.addEventListener('resize', cekPanah);
    return () => window.removeEventListener('resize', cekPanah);
  }, []);

  const scrollNav = (jarak) => {
    if (navRef.current) {
      navRef.current.scrollBy({ left: jarak, behavior: 'smooth' });
    }
  };

  // LOGIKA PENCARIAN
  const hasilCariWeb = databaseWeb.filter(item => 
    item.judul.toLowerCase().includes(searchWebQuery.toLowerCase()) ||
    item.deskripsi.toLowerCase().includes(searchWebQuery.toLowerCase())
  );
  
  const hasilCariKatalog = dbBuku.filter(buku => 
    buku.judul.toLowerCase().includes(searchKatalogQuery.toLowerCase())
  );

  const ruangBaseStyle = {
    padding: '10px',
    borderRadius: '16px',
    border: '1px solid rgba(255,255,255,0.5)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    fontWeight: '700',
    fontSize: '0.8rem',
    color: '#0f172a',
    backdropFilter: 'blur(8px)'
  };

  return (
    <div style={{ width: '100vw', maxWidth: '100%' }}>
      
      {/* NAVBAR */}
      <header className="header-container glass" style={{ position: 'sticky', top: '15px', zIndex: 999, display: 'flex', flexDirection: 'column', gap: '10px', padding: '12px 15px', borderRadius: '20px' }}>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', gap: '10px' }}>
          <div className="nav-brand" style={{ width: 'auto', margin: 0, justifyContent: 'flex-start', gap: '8px' }}>
            <img src="/gambar/Logo Perpustakaan SMPN 1 Damai.png" alt="Logo Perpus" style={{ width: '35px', height: '35px', objectFit: 'cover', borderRadius: '50%' }} />
            <div className="title" style={{ fontSize: '0.95rem' }}>Perpus SMPN 1 Damai</div>
          </div>

          {/* SEARCH ATAS (KONTEN WEB) */}
          <div style={{ position: 'relative', flex: 1, maxWidth: '220px' }}>
            <i className="fa-solid fa-magnifying-glass" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#0ea5e9', fontSize: '0.8rem' }}></i>
            <input 
              type="text" 
              placeholder="Cari info web..." 
              value={searchWebQuery}
              onChange={(e) => setSearchWebQuery(e.target.value)}
              onFocus={() => setShowWebResults(true)}
              onBlur={() => setTimeout(() => setShowWebResults(false), 200)} 
              style={{ 
                width: '100%', padding: '8px 15px 8px 32px', borderRadius: '20px', 
                border: '1px solid rgba(255, 255, 255, 0.8)', background: 'rgba(255, 255, 255, 0.6)', 
                outline: 'none', color: '#0f172a', fontWeight: '600', fontSize: '0.85rem',
                boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.02)', transition: 'all 0.3s ease'
              }} 
            />

            {/* DROPDOWN HASIL KONTEN WEB */}
            {showWebResults && (
              <div onMouseDown={(e) => e.preventDefault()} style={{ position: 'absolute', top: '110%', right: 0, width: '260px', background: '#ffffff', borderRadius: '16px', padding: '10px', boxShadow: '0 10px 40px rgba(0,0,0,0.25)', maxHeight: '350px', overflowY: 'auto', border: '2px solid #e2e8f0', zIndex: 9999 }}>
                {searchWebQuery === '' ? (
                  <div style={{ textAlign: 'center', padding: '15px', color: '#64748b', fontSize: '0.8rem', fontStyle: 'italic' }}>Ketik nama, berita, atau info...</div>
                ) : hasilCariWeb.length > 0 ? (
                  hasilCariWeb.map((item, index) => (
                    <a key={index} href={item.link} onClick={() => setShowWebResults(false)} style={{ display: 'flex', gap: '12px', alignItems: 'center', padding: '12px 10px', textDecoration: 'none', color: '#0f172a', borderBottom: '1px solid #e2e8f0', borderRadius: '10px', transition: 'background 0.2s' }} onMouseOver={(e) => e.currentTarget.style.background = '#f1f5f9'} onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}>
                      <span style={{ fontSize: '1.5rem' }}>{item.icon}</span>
                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <span style={{ fontSize: '0.85rem', fontWeight: '800' }}>{item.judul}</span>
                        <span style={{ fontSize: '0.7rem', color: '#64748b', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', marginTop: '2px' }}>{item.deskripsi}</span>
                      </div>
                    </a>
                  ))
                ) : (
                  <div style={{ textAlign: 'center', padding: '15px', color: '#64748b', fontSize: '0.85rem', fontWeight: 'bold' }}>Info tidak ditemukan bre 😢</div>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="nav-wrapper" style={{ width: '100%', maxWidth: '100%', justifyContent: 'flex-start', padding: 0 }}>
          {showLeftArrow && (
            <button className="nav-arrow left" onClick={() => scrollNav(-100)} style={{ display: 'flex', width: '28px', height: '28px' }}>
              <i className="fa-solid fa-chevron-left" style={{ fontSize: '0.8rem' }}></i>
            </button>
          )}
          <nav>
            {/* Navigasi menu */}
            <ul ref={navRef} onScroll={cekPanah} style={{ padding: '0 40px 0 30px', gap: '1rem' }}>
              <li><a href="https://smpn1damai.web.id" style={{ color: '#0ea5e9' }}><i className="fa-solid fa-globe"></i> Web Utama</a></li>
              <li><a href="#katalog">Katalog</a></li>
              <li><a href="#profil">Profil</a></li>
              <li><a href="#info">Tata Tertib</a></li>
              <li><a href="#berita">Berita</a></li>
              <li><a href="#struktur">Struktur</a></li>
              <li><a href="#denah">Denah</a></li>
              <li><a href="#kontak">Kontak</a></li>
            </ul>
          </nav>
          {showRightArrow && (
            <button className="nav-arrow right" onClick={() => scrollNav(100)} style={{ display: 'flex', width: '28px', height: '28px' }}>
              <i className="fa-solid fa-chevron-right" style={{ fontSize: '0.8rem' }}></i>
            </button>
          )}
        </div>
      </header>

      {/* HERO SECTION */}
      <header className="hero">
        <div className="hero-logos" style={{ display: 'flex', justifyContent: 'center', gap: '15px' }}>
          <img src="/gambar/logo SMP1.jpg" alt="Logo SMPN 1 Damai" style={{ width: '90px', height: '90px', objectFit: 'contain', borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.6)', padding: '5px' }} />
          <img src="/gambar/Logo Perpustakaan SMPN 1 Damai.png" alt="Logo Perpustakaan" style={{ width: '90px', height: '90px', objectFit: 'contain', borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.6)', padding: '5px' }} />
        </div>
        <div className="npp-badge">NPP: 6407081D0000001</div>
        <h1 style={{ fontSize: '2.5rem', margin: '10px 0' }}>Semangat Pagi</h1>
        <h2 style={{ fontSize: '1.2rem', marginBottom: '15px' }}>(Prestasi Anak Negeri)</h2>
        <p style={{ textAlign: 'center' }}>Ekosistem pintar perpustakaan SMPN 1 Damai untuk mendukung generasi pembelajar yang unggul dan berliterasi tinggi.</p>
      </header>

      <div className="container" style={{ overflowX: 'hidden' }}>
        
        {/* SECTION 1: E-KATALOG */}
        <section id="katalog" className="section-card glass">
          <h2 className="section-title">E-Katalog</h2>
          <p style={{ maxWidth: '600px', margin: '0 auto 20px', color: '#1e293b', fontSize: '1rem', fontWeight: 500, textAlign: 'justify' }}>
            Akses ratusan modul pembelajaran, buku literatur, dan arsip digital melalui layanan terpadu kami.
          </p>

          {/* SEARCH BAR KHUSUS E-BOOK */}
          <div style={{ position: 'relative', width: '100%', maxWidth: '400px', margin: '0 auto 25px' }}>
            <i className="fa-solid fa-book-open" style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)', color: '#0ea5e9' }}></i>
            <input 
              type="text" 
              placeholder="Cari E-Book di sini..." 
              value={searchKatalogQuery}
              onChange={(e) => setSearchKatalogQuery(e.target.value)}
              onFocus={() => setShowKatalogResults(true)}
              onBlur={() => setTimeout(() => setShowKatalogResults(false), 200)}
              style={{ 
                width: '100%', padding: '12px 20px 12px 45px', borderRadius: '25px', 
                border: '2px solid rgba(255, 255, 255, 0.8)', background: 'rgba(255, 255, 255, 0.7)', 
                outline: 'none', color: '#0f172a', fontWeight: '600', fontSize: '0.95rem',
                boxShadow: '0 4px 15px rgba(0,0,0,0.05)'
              }} 
            />

            {/* DROPDOWN HASIL E-BOOK */}
            {showKatalogResults && (
              <div onMouseDown={(e) => e.preventDefault()} style={{ position: 'absolute', top: '110%', left: 0, width: '100%', background: '#ffffff', borderRadius: '16px', padding: '10px', boxShadow: '0 10px 40px rgba(0,0,0,0.25)', maxHeight: '350px', overflowY: 'auto', border: '2px solid #e2e8f0', zIndex: 999 }}>
                {isFetching ? (
                  <div style={{ textAlign: 'center', padding: '20px', color: '#64748b', fontSize: '0.85rem', fontWeight: 'bold' }}>
                    <i className="fa-solid fa-spinner fa-spin" style={{ marginBottom: '8px', fontSize: '1.2rem', color: '#0ea5e9' }}></i>
                    <br />Mensinkronkan ke Rak Google Drive...
                  </div>
                ) : searchKatalogQuery === '' ? (
                  <div style={{ textAlign: 'center', padding: '15px', color: '#64748b', fontSize: '0.8rem', fontStyle: 'italic' }}>Ketik judul buku yang dicari...</div>
                ) : hasilCariKatalog.length > 0 ? (
                  hasilCariKatalog.map((buku, index) => (
                    <a key={index} href={buku.link} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', gap: '12px', alignItems: 'center', padding: '10px', textDecoration: 'none', color: '#0f172a', borderBottom: '1px solid #e2e8f0', borderRadius: '10px', transition: 'background 0.2s', textAlign: 'left' }} onMouseOver={(e) => e.currentTarget.style.background = '#f1f5f9'} onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}>
                      <img src={`https://drive.google.com/thumbnail?id=${buku.id}&sz=w100`} alt="cover" style={{ width: '45px', height: '60px', objectFit: 'cover', borderRadius: '6px', backgroundColor: '#e2e8f0', border: '1px solid #cbd5e1', flexShrink: 0 }} />
                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <span style={{ fontSize: '0.85rem', fontWeight: '800', lineHeight: '1.3', marginBottom: '3px' }}>{buku.judul}</span>
                        <span style={{ fontSize: '0.65rem', color: 'white', background: buku.kategori.includes('Novel') ? '#ec4899' : '#0ea5e9', padding: '3px 8px', borderRadius: '10px', width: 'fit-content', fontWeight: 'bold' }}>{buku.kategori}</span>
                      </div>
                    </a>
                  ))
                ) : (
                  <div style={{ textAlign: 'center', padding: '20px', color: '#64748b', fontSize: '0.85rem', fontWeight: 'bold' }}>Yah, bukunya nggak ketemu bre 😢</div>
                )}
              </div>
            )}
          </div>

          {/* PAJANGAN THUMBNAIL */}
          <div style={{ display: 'flex', gap: '15px', overflowX: 'auto', padding: '10px 5px 20px', width: '100%', WebkitOverflowScrolling: 'touch' }}>
            {isFetching ? (
              <div style={{ margin: '0 auto', textAlign: 'center', color: '#64748b', fontWeight: 'bold', fontSize: '0.9rem' }}>
                <i className="fa-solid fa-spinner fa-spin" style={{ color: '#0ea5e9', marginRight: '5px' }}></i> Menyusun buku di rak...
              </div>
            ) : randomBuku.length > 0 ? (
              randomBuku.map((buku, index) => (
                <a key={index} href={buku.link} target="_blank" rel="noopener noreferrer" style={{ flex: '0 0 auto', width: '100px', textDecoration: 'none', textAlign: 'center' }}>
                  <img src={`https://drive.google.com/thumbnail?id=${buku.id}&sz=w200`} alt="cover" style={{ width: '100px', height: '140px', objectFit: 'cover', borderRadius: '8px', boxShadow: '0 8px 20px rgba(0,0,0,0.15)', border: '2px solid white', backgroundColor: '#e2e8f0' }} />
                  <div style={{ fontSize: '0.75rem', fontWeight: '700', color: '#0f172a', marginTop: '8px', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', lineHeight: '1.2' }}>
                    {buku.judul}
                  </div>
                </a>
              ))
            ) : (
              <div style={{ margin: '0 auto', color: '#64748b', fontSize: '0.85rem', fontStyle: 'italic' }}>Tidak ada buku di rak.</div>
            )}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', alignItems: 'center', marginTop: '20px', width: '100%' }}>
            <a href="https://linktr.ee/BacaKuy" target="_blank" rel="noopener noreferrer" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', width: '100%', maxWidth: '300px', padding: '14px', background: '#0ea5e9', color: 'white', borderRadius: '50px', textDecoration: 'none', fontWeight: 'bold', border: '2px solid #38bdf8', boxShadow: '0 5px 15px rgba(14, 165, 233, 0.2)' }}>
              📚 E-Book SIBI (Nasional)
            </a>
          </div>
        </section>

        {/* SECTION 2: PROFIL & VISI MISI */}
        <section id="profil" className="section-card glass">
          <h2 className="section-title">Profil & Visi Misi</h2>
          <p style={{ marginBottom: '2rem', textAlign: 'justify' }}>
            Perpustakaan <strong>Semangat Pagi</strong> hadir sebagai pusat sumber belajar modern. Kami memadukan kenyamanan ruang literasi fisik dengan kecepatan akses teknologi informasi untuk memastikan siswa memiliki akses tanpa batas ke jendela dunia.
          </p>
          <div className="grid-2">
            <div className="box-kaca">
              <h3>🎯 Visi</h3>
              <p style={{ fontStyle: 'italic', lineHeight: '1.8', textAlign: 'justify' }}>"Menjadikan perpustakaan sebagai jantung pendidikan yang mencetak generasi literat, unggul, dan berwawasan global."</p>
            </div>
            <div className="box-kaca">
              <h3>🚀 Misi</h3>
              <ul className="list-rapi" style={{ paddingLeft: '1.5rem', textAlign: 'justify' }}>
                <li>Menyediakan bahan bacaan berkualitas.</li>
                <li>Mengintegrasikan layanan E-Katalog.</li>
                <li>Menyelenggarakan program literasi interaktif.</li>
              </ul>
            </div>
          </div>
        </section>

        {/* SECTION 3: INFO & TATA TERTIB */}
        <section id="info" className="section-card glass">
          <h2 className="section-title">Informasi & Tata Tertib</h2>
          <div className="grid-2">
            <div className="box-kaca">
              <h3>⏰ Jam Operasional</h3>
              <p style={{ textAlign: 'justify' }}>Buka setiap hari sekolah dengan jadwal layanan:</p>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#2563eb', marginTop: '0.5rem', textAlign: 'center' }}>
                07.30 - 14.00 WITA
              </div>
            </div>
            <div className="box-kaca">
              <h3>📖 Aturan Peminjaman</h3>
              <ul className="list-rapi" style={{ paddingLeft: '1.5rem', textAlign: 'justify' }}>
                <li>Maksimal meminjam <strong>2 buku</strong>.</li>
                <li>Batas waktu pinjam <strong>7 hari</strong> (bisa diperpanjang).</li>
                <li>Keterlambatan/Kerusakan dikenakan sanksi ganti rugi.</li>
              </ul>
            </div>
            <div className="box-kaca" style={{ gridColumn: '1 / -1' }}>
              <h3>⚠️ Etika Perpustakaan</h3>
              <ul className="list-rapi" style={{ paddingLeft: '1.5rem', textAlign: 'justify' }}>
                <li>Wajib masuk dengan tertib & tenang.</li>
                <li>Menjaga kebersihan dan kerapian.</li>
                <li>Dilarang makan/minum di area perpustakaan.</li>
                <li>Dilarang berbicara dengan suara keras.</li>
              </ul>
            </div>
          </div>
        </section>

        {/* SECTION 4: BERITA TERBARU */}
        <section id="berita" className="section-card glass">
          <h2 className="section-title">Berita & Info Terbaru</h2>
          <div className="news-grid">
            <div className="news-card">
              <img src="/gambar/WhatsApp Image 2026-05-30 at 10.32.43 AM.jpeg" alt="Berita 1" className="news-img" style={{ width: '100%', height: '200px', objectFit: 'cover' }} />
              <div className="news-content">
                <div className="news-date">02 Juli 2026</div>
                <h3 className="news-title" style={{ fontSize: '1.1rem', textAlign: 'left' }}>Kunjungan Asesor Akreditasi ke Perpustakaan</h3>
                <p className="news-snippet" style={{ textAlign: 'justify' }}>Hari ini perpustakaan Semangat Pagi kedatangan tim asesor untuk menilai kelengkapan literasi...</p>
                <a href="/berita/kunjungan-asesor" className="btn-baca">Baca Selengkapnya</a>
              </div>
            </div>

            <div className="news-card">
              <img src="/gambar/WhatsApp Image 2026-05-30 at 10.34.53 AM.jpeg" alt="Berita 2" className="news-img" style={{ width: '100%', height: '200px', objectFit: 'cover' }} />
              <div className="news-content">
                <div className="news-date">28 Juni 2026</div>
                <h3 className="news-title" style={{ fontSize: '1.1rem', textAlign: 'left' }}>Penambahan Koleksi E-Book Baru</h3>
                <p className="news-snippet" style={{ textAlign: 'justify' }}>Kini siswa dapat mengakses ratusan e-book baru langsung dari sistem katalog Google Drive perpustakaan...</p>
                <a href="/berita/koleksi-ebook-baru" className="btn-baca">Baca Selengkapnya</a>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 5: STRUKTUR ORGANISASI */}
        <section id="struktur" className="section-card glass" style={{ overflowX: 'hidden' }}>
          <h2 className="section-title">Struktur Organisasi</h2>
          <p style={{ marginBottom: '20px', textAlign: 'justify' }}>Susunan kepengurusan Perpustakaan Semangat Pagi SMPN 1 Damai:</p>
          
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px', width: '100%' }}>
            
            <div style={{ textAlign: 'center', background: 'rgba(255,255,255,0.4)', padding: '15px', borderRadius: '20px', width: '100%', maxWidth: '250px' }}>
              <img src="/gambar/Sri Wahyuningsih.jpeg" alt="Kepala Sekolah" style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '50%', border: '3px solid white', margin: '0 auto', display: 'block', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }} />
              <div style={{ fontWeight: '800', marginTop: '10px', color: '#0f172a' }}>Sri Wahyuningsih, S.Pd</div>
              <div style={{ fontSize: '0.8rem', fontWeight: 'bold', color: '#0f172a', background: 'white', padding: '3px 10px', borderRadius: '10px', display: 'inline-block', marginTop: '5px' }}>Kepala Sekolah</div>
            </div>
            
            <div style={{ width: '3px', height: '20px', background: 'white' }}></div>

            <div style={{ textAlign: 'center', background: 'rgba(255,255,255,0.4)', padding: '15px', borderRadius: '20px', width: '100%', maxWidth: '250px' }}>
              <img src="/gambar/Mina Sari.jpeg" alt="Kepala Perpustakaan" style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '50%', border: '3px solid white', margin: '0 auto', display: 'block', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }} />
              <div style={{ fontWeight: '800', marginTop: '10px', color: '#0f172a' }}>Mina Sari</div>
              <div style={{ fontSize: '0.8rem', fontWeight: 'bold', color: '#0f172a', background: 'white', padding: '3px 10px', borderRadius: '10px', display: 'inline-block', marginTop: '5px' }}>Kepala Perpustakaan</div>
            </div>

            <div style={{ width: '3px', height: '20px', background: 'white' }}></div>

            <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: '15px', width: '100%' }}>
              <div style={{ textAlign: 'center', background: 'rgba(255,255,255,0.4)', padding: '15px', borderRadius: '20px', flex: '1', minWidth: '130px', maxWidth: '250px' }}>
                <img src="/gambar/Meltiana.jpeg" alt="Layanan Pembaca" style={{ width: '70px', height: '70px', objectFit: 'cover', borderRadius: '50%', border: '3px solid white', margin: '0 auto', display: 'block', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }} />
                <div style={{ fontWeight: '800', marginTop: '10px', fontSize: '0.9rem', color: '#0f172a' }}>Meltiana</div>
                <div style={{ fontSize: '0.7rem', fontWeight: 'bold', color: '#0f172a', background: 'white', padding: '3px 8px', borderRadius: '10px', display: 'inline-block', marginTop: '5px' }}>Layanan Pembaca</div>
              </div>

              <div style={{ textAlign: 'center', background: 'rgba(255,255,255,0.4)', padding: '15px', borderRadius: '20px', flex: '1', minWidth: '130px', maxWidth: '250px' }}>
                <img src="/gambar/Nur Alfi Syahri.jpg" alt="Layanan Teknis TIK" style={{ width: '70px', height: '70px', objectFit: 'cover', borderRadius: '50%', border: '3px solid white', margin: '0 auto', display: 'block', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }} />
                <div style={{ fontWeight: '800', marginTop: '10px', fontSize: '0.9rem', color: '#0f172a' }}>Nur Alfi Syahri, S.P.</div>
                <div style={{ fontSize: '0.7rem', fontWeight: 'bold', color: '#0f172a', background: 'white', padding: '3px 8px', borderRadius: '10px', display: 'inline-block', marginTop: '5px' }}>Layanan Teknis</div>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 6: DENAH RUANGAN */}
        <section id="denah" className="section-card glass">
          <h2 className="section-title">Denah Ruangan</h2>
          <p style={{ marginBottom: '2rem', textAlign: 'justify' }}>Tata letak fasilitas dan area koleksi perpustakaan Semangat Pagi:</p>
          
          <div style={{ overflowX: 'auto', width: '100%', paddingBottom: '15px', WebkitOverflowScrolling: 'touch', background: 'rgba(255,255,255,0.15)', borderRadius: '24px', padding: '15px' }}>
            <div style={{ 
              display: 'grid', 
              gridTemplateAreas: `
                "pintu petugas pohon koran"
                "komputer lesehan lesehan lesehan"
                "rak1 rak1 rak2 rak2"
                "introvert rak_v rak_v kelompok"
                "rak_b rak_b rak_b rak_b"
              `,
              gridTemplateColumns: '1.2fr 1fr 1fr 1.2fr',
              gridAutoRows: 'minmax(85px, auto)',
              gap: '12px',
              minWidth: '700px'
            }}>
              <div style={{ ...ruangBaseStyle, gridArea: 'pintu', background: 'rgba(255,255,255,0.8)', border: '2px solid white' }}><div style={{ fontSize: '1.6rem', marginBottom: '4px' }}>🚪</div>Pintu Masuk & Loker</div>
              <div style={{ ...ruangBaseStyle, gridArea: 'petugas', background: 'rgba(14, 165, 233, 0.3)' }}><div style={{ fontSize: '1.6rem', marginBottom: '4px' }}>👨‍💼</div>Meja Petugas</div>
              <div style={{ ...ruangBaseStyle, gridArea: 'pohon', background: 'rgba(251, 146, 60, 0.3)' }}><div style={{ fontSize: '1.6rem', marginBottom: '4px' }}>🌳</div>Pohon Literasi</div>
              <div style={{ ...ruangBaseStyle, gridArea: 'koran', background: 'rgba(244, 114, 182, 0.3)' }}><div style={{ fontSize: '1.6rem', marginBottom: '4px' }}>📰</div>Rak Koran/Majalah</div>
              <div style={{ ...ruangBaseStyle, gridArea: 'komputer', background: 'rgba(52, 211, 153, 0.25)' }}><div style={{ fontSize: '1.6rem', marginBottom: '4px' }}>💻</div>Ruang Komputer</div>
              <div style={{ ...ruangBaseStyle, gridArea: 'lesehan', background: 'rgba(167, 139, 250, 0.25)' }}><div style={{ fontSize: '1.6rem', marginBottom: '4px' }}>🛋️</div>Ruang Baca Lesehan</div>
              <div style={{ ...ruangBaseStyle, gridArea: 'rak1', background: 'rgba(99, 102, 241, 0.3)' }}><div style={{ fontSize: '1.6rem', marginBottom: '4px' }}>📚</div>Rak Buku (Kiri)</div>
              <div style={{ ...ruangBaseStyle, gridArea: 'rak2', background: 'rgba(99, 102, 241, 0.3)' }}><div style={{ fontSize: '1.6rem', marginBottom: '4px' }}>📚</div>Rak Buku (Kanan)</div>
              <div style={{ ...ruangBaseStyle, gridArea: 'introvert', background: 'rgba(241, 245, 249, 0.5)' }}><div style={{ fontSize: '1.6rem', marginBottom: '4px' }}>🤫</div>Ruang Baca Introvert</div>
              <div style={{ ...ruangBaseStyle, gridArea: 'rak_v', background: 'rgba(99, 102, 241, 0.3)' }}><div style={{ fontSize: '1.6rem', marginBottom: '4px' }}>📖</div>Rak Vertikal Tengah</div>
              <div style={{ ...ruangBaseStyle, gridArea: 'kelompok', background: 'rgba(253, 224, 71, 0.3)' }}><div style={{ fontSize: '1.6rem', marginBottom: '4px' }}>👥</div>Belajar Kelompok</div>
              <div style={{ ...ruangBaseStyle, gridArea: 'rak_b', background: 'rgba(99, 102, 241, 0.35)' }}><div style={{ fontSize: '1.6rem', marginBottom: '4px' }}>📚</div>Koleksi Utama (Belakang)</div>
            </div>
          </div>
        </section>

        {/* SECTION 7: KONTAK */}
        <section id="kontak" className="section-card glass" style={{ textAlign: 'center', padding: '2rem 1.5rem' }}>
          <h2 className="section-title">Kontak</h2>
          <p style={{ color: '#1e293b', fontWeight: '500', marginBottom: '20px' }}>Punya pertanyaan atau masukan seputar layanan perpustakaan Semangat Pagi? Silakan hubungi kami:</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', alignItems: 'center', justifyContent: 'center' }}>
            <a href="mailto:smpn1damai@gmail.com" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none', color: '#0f172a', fontWeight: '700', fontSize: '1rem', transition: 'color 0.2s' }} onMouseOver={(e) => e.target.style.color = '#0ea5e9'} onMouseOut={(e) => e.target.style.color = '#0f172a'}>
              <i className="fa-solid fa-envelope" style={{ color: '#0ea5e9', fontSize: '1.2rem' }}></i> smpn1damai@gmail.com
            </a>
            <a href="https://instagram.com/smpn1damai" target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none', color: '#0f172a', fontWeight: '700', fontSize: '1rem', transition: 'color 0.2s' }} onMouseOver={(e) => e.target.style.color = '#ec4899'} onMouseOut={(e) => e.target.style.color = '#0f172a'}>
              <i className="fa-brands fa-instagram" style={{ color: '#ec4899', fontSize: '1.2rem' }}></i> @smpn1damai
            </a>
          </div>
        </section>

      </div>

      {/* FOOTER */}
      <footer style={{ textAlign: 'center', padding: '20px', marginTop: '1rem', fontSize: '0.9rem', fontWeight: 600, color: '#64748b' }}>
        &copy; 2026 | Admin Web: Nur Alfi Syahri, S.P.
      </footer>
    </div>
  );
}
