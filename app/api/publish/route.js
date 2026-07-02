import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const body = await request.json();
    const { judul, tanggal, isi } = body;

    // 1. Panggil Token PAT Rahasia dari Brankas Vercel
    const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
    
    // 2. Repo udah gue tulis paten sesuai perintah lu bre!
    const GITHUB_REPO = "perpussemangatpagi/perpus-nextjs";

    if (!GITHUB_TOKEN) {
      return NextResponse.json({ error: "Token PAT Github belum dipasang di Vercel!" }, { status: 500 });
    }

    // 3. Ubah Judul jadi nama file (Contoh: "Buku Baru" -> "buku-baru.md")
    const slug = judul.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    const fileName = `berita/${slug}.md`; // Menyimpan file ke dalam folder 'berita' di repo lu

    // 4. Format isi file Markdown (.md)
    const fileContent = `---
judul: "${judul}"
tanggal: "${tanggal}"
---

${isi}
`;

    // 5. Ubah ke format Base64 (Syarat mutlak API Github)
    const encodedContent = Buffer.from(fileContent).toString('base64');

    // 6. Nembak (Upload) langsung ke Github lu
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

    return NextResponse.json({ message: "Berita sukses diterbitkan ke Github!" }, { status: 200 });

  } catch (error) {
    return NextResponse.json({ error: "Server API nge-blank bre." }, { status: 500 });
  }
}
