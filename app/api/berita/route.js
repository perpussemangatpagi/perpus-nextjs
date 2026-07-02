import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
    const GITHUB_REPO = "perpussemangatpagi/perpus-nextjs";
    
    // Pakai token biar limit API Github lu gede (gak gampang error)
    const headers = GITHUB_TOKEN ? { 'Authorization': `Bearer ${GITHUB_TOKEN}` } : {};
    
    // Ambil daftar file di folder berita
    const res = await fetch(`https://api.github.com/repos/${GITHUB_REPO}/contents/berita`, { 
      headers,
      next: { revalidate: 30 } // Cache 30 detik
    });
    
    if (!res.ok) return NextResponse.json([]);
    
    const files = await res.json();
    const mdFiles = files.filter(f => f.name.endsWith('.md'));
    
    let beritaList = [];
    
    // Looping buka isi file satu-satu
    for (let file of mdFiles) {
      const fileRes = await fetch(file.download_url);
      const content = await fileRes.text();
      
      // Belah isi file (Pisahin metadata judul/tanggal dan isi teksnya)
      const match = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
      if (match) {
        const fm = match[1];
        const isi = match[2].trim();
        
        let judul = '', tanggal = '', thumbnail = '';
        fm.split('\n').forEach(line => {
          if (line.startsWith('judul:')) judul = line.replace('judul:', '').replace(/"/g, '').trim();
          if (line.startsWith('tanggal:')) tanggal = line.replace('tanggal:', '').replace(/"/g, '').trim();
          if (line.startsWith('thumbnail:')) thumbnail = line.replace('thumbnail:', '').replace(/"/g, '').trim();
        });
        
        beritaList.push({ 
          id: file.name.replace('.md', ''), 
          judul, 
          tanggal, 
          // Kalau nggak ada foto, kasih foto logo sekolah sebagai default
          thumbnail: thumbnail || '/gambar/logo SMP1.jpg', 
          snippet: isi.substring(0, 120) + '...', // Potong teks buat ditaruh di depan
          timestamp: new Date(tanggal).getTime() 
        });
      }
    }
    
    // Urutin berita dari yang paling baru ke yang paling lama
    beritaList.sort((a, b) => b.timestamp - a.timestamp);
    
    return NextResponse.json(beritaList);
  } catch (error) {
    return NextResponse.json([]);
  }
}
