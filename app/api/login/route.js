import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const body = await request.json();
    const { username, password } = body;

    // Ambil Username & Password dari brankas rahasia Vercel
    const validUser = process.env.ADMIN_USER;
    const validPass = process.env.ADMIN_PASS;

    if (!validUser || !validPass) {
      return NextResponse.json({ error: "Setingan ADMIN_USER atau ADMIN_PASS di Vercel belum dipasang bre!" }, { status: 500 });
    }

    // Cocokin inputan dengan data di Vercel
    if (username === validUser && password === validPass) {
      return NextResponse.json({
        success: true,
        user: { name: 'Mina Sari', role: 'Kepala Perpustakaan' } // Data paten untuk Mina Sari
      }, { status: 200 });
    } else {
      return NextResponse.json({ error: "Username atau Password salah bre! Hayo ngaku siapa lu?" }, { status: 401 });
    }

  } catch (error) {
    return NextResponse.json({ error: "Server login nge-blank." }, { status: 500 });
  }
}
