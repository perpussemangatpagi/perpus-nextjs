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

    // 1. READ LIST BERITA
    if (body.action === 'list') {
      const res = await fetch(`https://api.github.com/repos/${GITHUB_REPO}/contents/berita`, { headers });
      if (res.status === 404) return NextResponse.json({ data: [] });
      const data = await res.json();
      return NextResponse.json({ data: data.filter(f => f.name.endsWith('.md')) });
    }

    // 2. GET SINGLE BERITA
    if (body.action === 'get') {
      const res = await fetch(`https://api.github.com/repos/${GITHUB_REPO}/contents/berita/${body.filename}`, { headers });
      const data = await res.json();
      const content = Buffer.from(data.content, 'base64').toString('utf8');
      return NextResponse.json({ content, sha: data.sha });
    }

    // 3. DELETE BERITA + HAPUS SEMUA GAMBAR TERKAIT (FITUR BARU)
    if (body.action === 'delete') {
      // a. Ambil isi file berita dulu untuk ekstrak daftar gambar
      const getRes = await fetch(`https://api.github.com/repos/${GITHUB_REPO}/contents/berita/${body.filename}`, { headers });
      if (getRes.ok) {
        const getData = await getRes.json();
        const content = Buffer.from(getData.content, 'base64').toString('utf8');
        
        // Cari array gambar di metadata front-matter
        const imagesMatch = content.match(/images:\s*(\[.*?\])/);
        if (imagesMatch) {
          try {
            const imageUrls = JSON.parse(imagesMatch[1]);
            for (const url of imageUrls) {
              // Misal URL: "/uploads/170000000-foto.jpg" -> path: "public/uploads/170000000-foto.jpg"
              const imgPath = `public${url}`;
              
              // Cek SHA gambar di GitHub
              const imgRes = await fetch(`https://api.github.com/repos/${GITHUB_REPO}/contents/${imgPath}`, { headers });
              if (imgRes.ok) {
                const imgData = await imgRes.json();
                // Hapus file gambar dari repository
                await fetch(`https://api.github.com/repos/${GITHUB_REPO}/contents/${imgPath}`, {
                  method: 'DELETE',
                  headers,
                  body: JSON.stringify({
                    message: `CMS Auto Delete Image: Hapus ${imgPath}`,
                    sha: imgData.sha
                  })
                });
              }
            }
          } catch (e) {
            console.error("Gagal parse/hapus gambar terkait:", e);
          }
        }
      }

      // b. Hapus file markdown berita
      await fetch(`https://api.github.com/repos/${GITHUB_REPO}/contents/berita/${body.filename}`, {
        method: 'DELETE',
        headers,
        body: JSON.stringify({ message: `CMS Delete: Hapus ${body.filename}`, sha: body.sha })
      });

      return NextResponse.json({ message: "Berita dan gambar terkait berhasil dihapus!" });
    }

    // 4. UPLOAD GAMBAR
    if (body.action === 'upload_image') {
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
      return NextResponse.json({ url: `/${imgPath.replace('public/', '')}` });
    }

    // 5. SAVE BERITA (SUDAH INCLUDE PENULIS)
    if (body.action === 'save') {
      const fileContent = `---
judul: "${body.judul}"
tanggal: "${body.tanggal}"
penulis: "${body.penulis}"
thumbnail: "${body.thumbnail}"
images: ${JSON.stringify(body.images || [])}
---
${body.isi}`;

      const encoded = Buffer.from(fileContent).toString('base64');
      const payload = {
        message: `CMS: ${body.sha ? 'Update' : 'Publish'} Berita -> ${body.judul}`,
        content: encoded,
      };

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
