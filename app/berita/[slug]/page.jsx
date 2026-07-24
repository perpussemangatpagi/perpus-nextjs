import Link from 'next/link';
import DetailBeritaClient from './DetailBeritaClient'; // Kita pisahkan komponen Client-nya

async function getBeritaData(slug) {
  try {
    const res = await fetch(`https://raw.githubusercontent.com/perpussemangatpagi/perpus-nextjs/main/berita/${slug}.md`, { cache: 'no-store' });
    if (!res.ok) return null;
    const content = await res.text();
    
    const match = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
    if (!match) return null;

    const fm = match[1];
    const isi = match[2].trim();
    let judul = '', tanggal = '', penulis = '', thumbnail = '', images = [];

    fm.split('\n').forEach(line => {
      if (line.startsWith('judul:')) judul = line.replace('judul:', '').replace(/"/g, '').trim();
      if (line.startsWith('tanggal:')) tanggal = line.replace('tanggal:', '').replace(/"/g, '').trim();
      if (line.startsWith('penulis:')) penulis = line.replace('penulis:', '').replace(/"/g, '').trim();
      if (line.startsWith('thumbnail:')) thumbnail = line.replace('thumbnail:', '').replace(/"/g, '').trim();
      if (line.startsWith('images:')) { 
        try { images = JSON.parse(line.replace('images:', '').trim()); } catch(e){} 
      }
    });

    return { judul, tanggal, penulis, thumbnail, images, isi };
  } catch (e) {
    return null;
  }
}

// FUNGSI UNTUK OPEN GRAPH / THUMBNAIL SHARE SOSMED
export async function generateMetadata({ params }) {
  const berita = await getBeritaData(params.slug);
  const baseUrl = "https://perpus.smpn1damai.web.id"; // Sesuaikan domain publik web kamu

  if (!berita) {
    return {
      title: 'Berita Tidak Ditemukan - Perpus SMPN 1 Damai',
    };
  }

  const imageUrl = berita.thumbnail 
    ? (berita.thumbnail.startsWith('http') ? berita.thumbnail : `${baseUrl}${berita.thumbnail}`)
    : `${baseUrl}/gambar/logo SMP1.jpg`;

  return {
    title: `${berita.judul} - Perpus SMPN 1 Damai`,
    description: berita.isi.substring(0, 150) + '...',
    openGraph: {
      title: berita.judul,
      description: berita.isi.substring(0, 150) + '...',
      images: [{ url: imageUrl }],
    },
    twitter: {
      card: 'summary_large_image',
      title: berita.judul,
      description: berita.isi.substring(0, 150) + '...',
      images: [imageUrl],
    },
  };
}

export default async function DetailBeritaPage({ params }) {
  const berita = await getBeritaData(params.slug);
  return <DetailBeritaClient berita={berita} slug={params.slug} />;
}
