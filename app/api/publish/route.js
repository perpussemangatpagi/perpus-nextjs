import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const body = await request.json();
    const { judul, tanggal, isi } = body;

    // 1. Panggil Kunci Rahasia dari Brankas Vercel
    const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
    const GITHUB_REPO = perpussemangatpagi/perpus-nextjs; // Contoh: NurAlfi/perpus-web

    if (!GITHUB_TOKEN || !GITHUB_REPO) {
      return NextResponse.json({ error: "Kunci Token atau Repo belum dipasang di Vercel bre!" }, { status: 500 });
    }

    // 2. Bikin nama file dari Judul Berita (Slugify)
    // Contoh: "Kunjungan Asesor 2026" jadi "kunjungan-asesor-2026.md"
    const slug = judul.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    const fileName = `berita/${slug}.md`; // Disimpan di dalam folder 'berita' di GitHub

    // 3. Bikin format isi file .md nya
    const fileContent = `---
judul: "${judul}"
tanggal: "${tanggal}"
---

${isi}
`;

    // 4. GitHub API mewajibkan teks diubah ke format Base64
    const encodedContent = Buffer.from(fileContent).toString('base64');

    // 5. Nembak (Upload) ke GitHub
    const githubUrl = `https://api.github.com/repos/${GITHUB_REPO}/contents/${fileName}`;

    const githubResponse = await fetch(githubUrl, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${GITHUB_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: `CMS: Publish berita baru -> ${judul}`,
        content: encodedContent,
      }),
    });

    if (!githubResponse.ok) {
      const errData = await githubResponse.json();
      return NextResponse.json({ error: "Gagal ngirim ke GitHub bre!", detail: errData }, { status: 500 });
    }

    // Kalau sukses
    return NextResponse.json({ message: "Sikatt! Berita berhasil dikirim ke GitHub dan sedang di-build Vercel." }, { status: 200 });

  } catch (error) {
    return NextResponse.json({ error: "Server Vercel nge-blank bre." }, { status: 500 });
  }
}
