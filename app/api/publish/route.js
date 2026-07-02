import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const body = await request.json();
    const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
    const GITHUB_REPO = "perpussemangatpagi/perpus-nextjs";

    if (!GITHUB_TOKEN) return NextResponse.json({ error: "Token Vercel Kosong!" }, { status: 500 });

    const headers = {
      'Authorization': `Bearer ${GITHUB_TOKEN}`,
      'Content-Type': 'application/json',
    };

    // 1. FUNGSI READ (LIST BERITA)
    if (body.action === 'list') {
      const res = await fetch(`https://api.github.com/repos/${GITHUB_REPO}/contents/berita`, { headers });
      if (res.status === 404) return NextResponse.json({ data: [] });
      const data = await res.json();
      return NextResponse.json({ data: data.filter(f => f.name.endsWith('.md')) });
    }

    // 2. FUNGSI GET SATU BERITA (UNTUK DI-EDIT)
    if (body.action === 'get') {
      const res = await fetch(`https://api.github.com/repos/${GITHUB_REPO}/contents/berita/${body.filename}`, { headers });
      const data = await res.json();
      const content = Buffer.from(data.content, 'base64').toString('utf8');
      return NextResponse.json({ content, sha: data.sha });
    }

    // 3. FUNGSI DELETE (HAPUS BERITA)
    if (body.action === 'delete') {
      await fetch(`https://api.github.com/repos/${GITHUB_REPO}/contents/berita/${body.filename}`, {
        method: 'DELETE',
        headers,
        body: JSON.stringify({ message: `CMS Delete: Hapus ${body.filename}`, sha: body.sha })
      });
      return NextResponse.json({ message: "Berhasil dihapus!" });
    }

    // 4. FUNGSI UPLOAD BANYAK GAMBAR
    if (body.action === 'upload_image') {
      // Bersihin nama file dari spasi biar linknya gak rusak
      const cleanName = body.filename.replace(/\s+/g, '-').toLowerCase();
      const imgPath = `public/uploads/${Date.now()}-${cleanName}`;
      
      const res = await fetch(`https://api.github.com/repos/${GITHUB_REPO}/contents/${imgPath}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify({
          message: `CMS: Upload Gambar ${cleanName}`,
          content: body.base64
        })
      });
      
      if (!res.ok) throw new Error("Gagal upload gambar ke Github");
      
      // Balikin link gambar biar disimpen ke dalam Markdown
      return NextResponse.json({ url: `/${imgPath.replace('public/', '')}` });
    }

    // 5. FUNGSI CREATE & UPDATE (SIMPAN BERITA)
    if (body.action === 'save') {
      // Susun format Markdown
      const fileContent = `---
judul: "${body.judul}"
tanggal: "${body.tanggal}"
thumbnail: "${body.thumbnail}"
images: ${JSON.stringify(body.images || [])}
---

${body.isi}`;

      const encoded = Buffer.from(fileContent).toString('base64');
      const payload = {
        message: `CMS: ${body.sha ? 'Update' : 'Publish'} Berita -> ${body.judul}`,
        content: encoded,
      };
      
      // Kalau edit, GitHub minta "sha" (KTP file) lama biar ditimpa
      if (body.sha) payload.sha = body.sha; 

      const res = await fetch(`https://api.github.com/repos/${GITHUB_REPO}/contents/berita/${body.filename}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        const err = await res.json();
        return NextResponse.json({ error: "Gagal Simpan", detail: err }, { status: 500 });
      }
      return NextResponse.json({ message: "Berita Sukses Disimpan!" });
    }

  } catch (error) {
    return NextResponse.json({ error: "Server API error" }, { status: 500 });
  }
}
