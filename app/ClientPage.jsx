'use client';
import { useEffect, useRef, useState } from 'react';

export default function ClientPage() {
  const navRef = useRef(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);

  const cekPanah = () => {
    if (!navRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = navRef.current;
    setShowLeftArrow(scrollLeft > 5);
    setShowRightArrow(scrollWidth - clientWidth - scrollLeft > 5);
  };

  useEffect(() => {
    cekPanah();
    window.addEventListener('resize', cekPanah);
    return () => window.removeEventListener('resize', cekPanah);
  }, []);

  const scrollNav = (jarak) => {
    if (navRef.current) {
      navRef.current.scrollBy({ left: jarak, behavior: 'smooth' });
    }
  };

  return (
    <div style={{ overflowX: 'hidden', width: '100vw', maxWidth: '100%' }}>
      {/* HEADER */}
      <header className="header-container glass">
        <div className="nav-brand">
          <img src="/gambar/logo SMP1.jpg" alt="Logo SMPN 1 Damai" style={{ width: '35px', height: '35px', objectFit: 'cover', borderRadius: '50%' }} />
          <img src="/gambar/Logo Perpustakaan SMPN 1 Damai.png" alt="Logo Perpus" style={{ width: '35px', height: '35px', objectFit: 'cover', borderRadius: '50%' }} />
          <div className="title">Perpus SMPN 1 Damai</div>
        </div>
        <div className="nav-wrapper">
          {showLeftArrow && (
            <button className="nav-arrow left" onClick={() => scrollNav(-100)} style={{ display: 'flex' }}>
              <i className="fa-solid fa-chevron-left"></i>
            </button>
          )}
          <nav>
            <ul ref={navRef} onScroll={cekPanah}>
              <li><a href="https://smpn1damai.web.id" style={{ color: '#0ea5e9' }}><i className="fa-solid fa-globe"></i> Web Utama</a></li>
              <li><a href="#profil">Profil</a></li>
              <li><a href="#info">Tata Tertib</a></li>
              <li><a href="#berita">Berita</a></li>
              <li><a href="#struktur">Struktur</a></li>
              <li><a href="#denah">Denah</a></li>
              <li><a href="#galeri">Galeri</a></li>
              <li><a href="#katalog">Katalog</a></li>
            </ul>
          </nav>
          {showRightArrow && (
            <button className="nav-arrow right" onClick={() => scrollNav(100)} style={{ display: 'flex' }}>
              <i className="fa-solid fa-chevron-right"></i>
            </button>
          )}
        </div>
      </header>

      {/* HERO */}
      <header className="hero">
        <div className="hero-logos" style={{ display: 'flex', justifyContent: 'center', gap: '15px' }}>
          <img src="/gambar/logo SMP1.jpg" alt="Logo SMPN 1 Damai" style={{ width: '90px', height: '90px', objectFit: 'contain', borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.6)', padding: '5px' }} />
          <img src="/gambar/Logo Perpustakaan SMPN 1 Damai.png" alt="Logo Perpustakaan" style={{ width: '90px', height: '90px', objectFit: 'contain', borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.6)', padding: '5px' }} />
        </div>
        <div className="npp-badge">NPP: 6407081D0000001</div>
        <h1 style={{ fontSize: '2.5rem', margin: '10px 0' }}>Semangat Pagi</h1>
        <h2 style={{ fontSize: '1.2rem', marginBottom: '15px' }}>(Prestasi Anak Negeri)</h2>
        <p>Ekosistem pintar perpustakaan SMPN 1 Damai untuk mendukung generasi pembelajar yang unggul dan berliterasi tinggi.</p>
      </header>

      <div className="container" style={{ overflowX: 'hidden' }}>
        
        {/* PROFIL & VISI MISI */}
        <section id="profil" className="section-card glass">
          <h2 className="section-title">Profil & Visi Misi</h2>
          <p style={{ marginBottom: '2rem' }}>
            Perpustakaan <strong>Semangat Pagi</strong> hadir sebagai pusat sumber belajar modern. Kami memadukan kenyamanan ruang literasi fisik dengan kecepatan akses teknologi informasi untuk memastikan siswa memiliki akses tanpa batas ke jendela dunia.
          </p>
          <div className="grid-2">
            <div className="box-kaca">
              <h3>🎯 Visi</h3>
              <p style={{ fontStyle: 'italic', lineHeight: '1.8' }}>"Menjadikan perpustakaan sebagai jantung pendidikan yang mencetak generasi literat, unggul, dan berwawasan global."</p>
            </div>
            <div className="box-kaca">
              <h3>🚀 Misi</h3>
              <ul className="list-rapi">
                <li>Menyediakan bahan bacaan berkualitas.</li>
                <li>Mengintegrasikan layanan E-Katalog.</li>
                <li>Menyelenggarakan program literasi interaktif.</li>
              </ul>
            </div>
          </div>
        </section>

        {/* INFO & TATA TERTIB */}
        <section id="info" className="section-card glass">
          <h2 className="section-title">Informasi & Tata Tertib</h2>
          <div className="grid-2">
            <div className="box-kaca">
              <h3>⏰ Jam Operasional</h3>
              <p>Buka setiap hari sekolah dengan jadwal layanan:</p>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#2563eb', marginTop: '0.5rem' }}>
                07.30 - 14.00 WITA
              </div>
            </div>
            <div className="box-kaca">
              <h3>📖 Aturan Peminjaman</h3>
              <ul className="list-rapi">
                <li>Maksimal meminjam <strong>2 buku</strong>.</li>
                <li>Batas waktu pinjam <strong>7 hari</strong> (bisa diperpanjang).</li>
                <li>Keterlambatan/Kerusakan dikenakan sanksi ganti rugi.</li>
              </ul>
            </div>
            <div className="box-kaca" style={{ gridColumn: '1 / -1' }}>
              <h3>⚠️ Etika Perpustakaan</h3>
              <ul className="list-rapi">
                <li>Wajib masuk dengan tertib & tenang.</li>
                <li>Menjaga kebersihan dan kerapian.</li>
                <li>Dilarang makan/minum di area perpustakaan.</li>
                <li>Dilarang berbicara dengan suara keras.</li>
              </ul>
            </div>
          </div>
        </section>

        {/* BERITA TERBARU */}
        <section id="berita" className="section-card glass">
          <h2 className="section-title">Berita & Info Terbaru</h2>
          <div className="news-grid">
            <div className="news-card">
              <img src="/gambar/WhatsApp Image 2026-05-30 at 10.32.43 AM.jpeg" alt="Berita 1" className="news-img" style={{ width: '100%', height: '200px', objectFit: 'cover' }} />
              <div className="news-content">
                <div className="news-date">02 Juli 2026</div>
                <h3 className="news-title" style={{ fontSize: '1.1rem' }}>Kunjungan Asesor Akreditasi ke Perpustakaan</h3>
                <p className="news-snippet">Hari ini perpustakaan Semangat Pagi kedatangan tim asesor untuk menilai kelengkapan literasi...</p>
                <a href="/berita/kunjungan-asesor" className="btn-baca">Baca Selengkapnya</a>
              </div>
            </div>

            <div className="news-card">
              <img src="/gambar/WhatsApp Image 2026-05-30 at 10.34.53 AM.jpeg" alt="Berita 2" className="news-img" style={{ width: '100%', height: '200px', objectFit: 'cover' }} />
              <div className="news-content">
                <div className="news-date">28 Juni 2026</div>
                <h3 className="news-title" style={{ fontSize: '1.1rem' }}>Penambahan Koleksi E-Book Baru</h3>
                <p className="news-snippet">Kini siswa dapat mengakses ratusan e-book baru langsung dari sistem katalog Google Drive perpustakaan...</p>
                <a href="/berita/koleksi-ebook-baru" className="btn-baca">Baca Selengkapnya</a>
              </div>
            </div>
          </div>
        </section>

        {/* STRUKTUR ORGANISASI - DIKUNCI BIAR GAK KELUAR JALUR */}
        <section id="struktur" className="section-card glass" style={{ overflowX: 'hidden' }}>
          <h2 className="section-title">Struktur Organisasi</h2>
          <p style={{ marginBottom: '20px' }}>Susunan kepengurusan Perpustakaan Semangat Pagi SMPN 1 Damai:</p>
          
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px', width: '100%' }}>
            
            {/* Kepsek */}
            <div style={{ textAlign: 'center', background: 'rgba(255,255,255,0.4)', padding: '15px', borderRadius: '20px', width: '100%', maxWidth: '250px' }}>
              <img src="/gambar/Sri Wahyuningsih.jpeg" alt="Kepala Sekolah" style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '50%', border: '3px solid white', margin: '0 auto', display: 'block', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }} />
              <div style={{ fontWeight: '800', marginTop: '10px', color: '#0f172a' }}>Sri Wahyuningsih, S.Pd</div>
              <div style={{ fontSize: '0.8rem', fontWeight: 'bold', color: '#0f172a', background: 'white', padding: '3px 10px', borderRadius: '10px', display: 'inline-block', marginTop: '5px' }}>Kepala Sekolah</div>
            </div>
            
            {/* Garis */}
            <div style={{ width: '3px', height: '20px', background: 'white' }}></div>

            {/* Kepala Perpus */}
            <div style={{ textAlign: 'center', background: 'rgba(255,255,255,0.4)', padding: '15px', borderRadius: '20px', width: '100%', maxWidth: '250px' }}>
              <img src="/gambar/Mina Sari.jpeg" alt="Kepala Perpustakaan" style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '50%', border: '3px solid white', margin: '0 auto', display: 'block', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }} />
              <div style={{ fontWeight: '800', marginTop: '10px', color: '#0f172a' }}>Mina Sari</div>
              <div style={{ fontSize: '0.8rem', fontWeight: 'bold', color: '#0f172a', background: 'white', padding: '3px 10px', borderRadius: '10px', display: 'inline-block', marginTop: '5px' }}>Kepala Perpustakaan</div>
            </div>

            {/* Garis */}
            <div style={{ width: '3px', height: '20px', background: 'white' }}></div>

            {/* Dua Layanan (Dibikin turun ke bawah aja buat HP biar ga tenis) */}
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

        {/* DENAH - DIKUNCI SCROLL KHUSUS KOTAK INI AJA */}
        <section id="denah" className="section-card glass">
          <h2 className="section-title">Denah Ruangan</h2>
          <p style={{ marginBottom: '2rem' }}>Tata letak fasilitas dan area koleksi perpustakaan Semangat Pagi:</p>
          
          <div style={{ overflowX: 'auto', width: '100%', paddingBottom: '15px', WebkitOverflowScrolling: 'touch', background: 'rgba(255,255,255,0.2)', borderRadius: '20px' }}>
            <div className="denah-map" style={{ minWidth: '700px', padding: '15px' }}>
              <div className="ruang-glass area-pintu"><div className="icon">🚪</div>Pintu Masuk & Loker</div>
              <div className="ruang-glass area-petugas"><div className="icon">👨‍💼</div>Meja Petugas</div>
              <div className="ruang-glass area-pohon"><div className="icon">🌳</div>Pohon Literasi</div>
              <div className="ruang-glass area-koran"><div className="icon">📰</div>Rak Koran/Majalah</div>
              <div className="ruang-glass area-komputer"><div className="icon">💻</div>Ruang & Meja Komputer</div>
              <div className="ruang-glass area-lesehan"><div className="icon">🛋️</div>Ruang Baca Lesehan</div>
              <div className="ruang-glass area-rak1"><div className="icon">📚</div>Rak Buku (Kiri)</div>
              <div className="ruang-glass area-rak2"><div className="icon">📚</div>Rak Buku (Kanan)</div>
              <div className="ruang-glass area-introvert"><div className="icon">🤫</div>Ruang Baca Introvert</div>
              <div className="ruang-glass area-rak-v"><div className="icon">📖</div>Rak Vertikal Tengah</div>
              <div className="ruang-glass area-kelompok"><div className="icon">👥</div>Ruang Belajar Kelompok</div>
              <div className="ruang-glass area-rak-b"><div className="icon">📚</div>Koleksi Utama (Belakang)</div>
            </div>
          </div>
        </section>

        {/* GALERI - DIKUNCI PAKE GRID 2 KOLOM RAPI */}
        <section id="galeri" className="section-card glass">
          <h2 className="section-title">Galeri Kegiatan</h2>
          <p style={{ marginBottom: '15px' }}>Dokumentasi aktivitas, penataan perpustakaan, digitalisasi katalog, serta kreativitas siswa/siswi SMPN 1 Damai.</p>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '10px' }}>
            <img src="/gambar/WhatsApp Image 2026-05-30 at 10.32.43 AM.jpeg" alt="Kegiatan 1" style={{ width: '100%', height: '140px', objectFit: 'cover', borderRadius: '12px', border: '2px solid white' }} />
            <img src="/gambar/WhatsApp Image 2026-05-30 at 10.32.44 AM.jpeg" alt="Kegiatan 2" style={{ width: '100%', height: '140px', objectFit: 'cover', borderRadius: '12px', border: '2px solid white' }} />
            <img src="/gambar/WhatsApp Image 2026-05-30 at 10.32.45 AM.jpeg" alt="Kegiatan 3" style={{ width: '100%', height: '140px', objectFit: 'cover', borderRadius: '12px', border: '2px solid white' }} />
            <img src="/gambar/WhatsApp Image 2026-05-30 at 10.34.53 AM.jpeg" alt="Kegiatan 4" style={{ width: '100%', height: '140px', objectFit: 'cover', borderRadius: '12px', border: '2px solid white' }} />
            <img src="/gambar/WhatsApp Image 2026-05-30 at 10.34.55 AM.jpeg" alt="Kegiatan 6" style={{ width: '100%', height: '140px', objectFit: 'cover', borderRadius: '12px', border: '2px solid white' }} />
            <img src="/gambar/WhatsApp Image 2026-05-30 at 10.42.19 AM.jpeg" alt="Kegiatan 10" style={{ width: '100%', height: '140px', objectFit: 'cover', borderRadius: '12px', border: '2px solid white' }} />
          </div>
        </section>

        {/* KATALOG - DIKUNCI FLEX COLUMN BIAR TOMBOLNYA GAK TELANJANG */}
        <section id="katalog" className="dashboard-section glass">
          <h2 style={{ fontSize: '2rem', marginBottom: '1rem', color: '#0f172a', letterSpacing: '-1px' }}>E-Katalog Digital</h2>
          <p style={{ maxWidth: '600px', margin: '0 auto', color: '#1e293b', fontSize: '1rem', fontWeight: 500 }}>Akses ratusan modul pembelajaran, buku literatur, dan arsip digital melalui layanan terpadu kami.</p>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', alignItems: 'center', marginTop: '25px', width: '100%' }}>
            
            <a href="https://linktr.ee/BacaKuy" target="_blank" rel="noopener noreferrer" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', width: '100%', maxWidth: '300px', padding: '16px', background: '#0ea5e9', color: 'white', borderRadius: '50px', textDecoration: 'none', fontWeight: 'bold', border: '2px solid #38bdf8', boxShadow: '0 5px 15px rgba(14, 165, 233, 0.3)' }}>
              📚 E-Book SIBI (Nasional)
            </a>
            
            <a href="https://bit.ly/KumpulanEbookSMPN1Damai" target="_blank" rel="noopener noreferrer" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', width: '100%', maxWidth: '300px', padding: '16px', background: '#10b981', color: 'white', borderRadius: '50px', textDecoration: 'none', fontWeight: 'bold', border: '2px solid #34d399', boxShadow: '0 5px 15px rgba(16, 185, 129, 0.3)' }}>
              📁 E-Book SMPN 1 Damai
            </a>

          </div>
        </section>

      </div>

      <footer className="glass" style={{ textAlign: 'center', padding: '1.5rem', margin: '2rem auto', width: '90%', maxWidth: '600px', borderRadius: '30px', fontSize: '0.9rem', fontWeight: 600, color: '#334155' }}>
        &copy; 2026 | Admin Web: Nur Alfi Syahri, S.P.
      </footer>
    </div>
  );
}
