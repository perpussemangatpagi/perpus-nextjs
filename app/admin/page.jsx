const handlePublish = async (e) => {
    e.preventDefault();
    
    // Alert biar user tau lagi proses (loading ala kadarnya dulu)
    alert("Sedang ngirim naskah ke GitHub... Tunggu popup sukses ya bre!");

    try {
      const response = await fetch('/api/publish', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          judul: judul,     // Pastikan nama state judul lu sama
          tanggal: tanggal, // Pastikan nama state tanggal lu sama
          isi: isi          // Pastikan nama state isi berita lu sama
        }),
      });

      const data = await response.json();

      if (response.ok) {
        alert("🔥 SIKATT! " + data.message);
        // Kosongin form kalau udah sukses
        setJudul('');
        setIsi('');
      } else {
        alert("Waduh error: " + data.error);
        console.error(data.detail);
      }
    } catch (error) {
      alert("Gagal konek ke API bre! Cek koneksi.");
    }
  };
