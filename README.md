# Finansial Report Dashboard

Dashboard pencatatan keuangan pribadi berbahasa Indonesia, dibuat sebagai website statis agar mudah dipublikasikan lewat GitHub Pages.

## Fitur
- Dashboard ringkasan pengeluaran, sisa anggaran, rata-rata harian, dan target tabungan.
- Grafik kategori (donut) dan grafik pengeluaran per hari.
- Kalender transaksi.
- Tambah transaksi dengan kategori, nominal, keterangan, dan pilihan file bukti (nama file ditampilkan).
- Pencarian transaksi.
- Simpan otomatis di `localStorage` browser.
- Backup dan restore JSON.
- Ekspor transaksi CSV (bisa dibuka dengan Excel).
- Cetak / simpan PDF melalui dialog Print browser.
- Mode terang dan gelap, tampilan responsif desktop dan ponsel.

## Cara upload ke GitHub
1. Ekstrak ZIP ini.
2. Buat repository baru di https://github.com/new.
3. Upload `index.html` dan `README.md` ke root repository.
4. Buka **Settings → Pages**.
5. Pada **Build and deployment**, pilih **Deploy from a branch**.
6. Pilih branch `main`, folder `/ (root)`, lalu klik **Save**.
7. Tunggu proses selesai, lalu buka URL GitHub Pages yang ditampilkan.

## Catatan
- Tidak perlu Node.js atau proses build. Cukup `index.html`.
- Chart.js dan font Inter dimuat dari CDN, jadi koneksi internet diperlukan saat membuka dashboard.
- Data disimpan di browser/perangkat yang digunakan. Data tidak otomatis tersinkron ke perangkat lain atau server.
- Upload bukti transaksi pada versi ini hanya menampilkan nama file yang dipilih; file gambar belum disimpan ke cloud.
- Data awal hanya contoh dan bisa dihapus/diubah melalui backup JSON atau transaksi baru.
