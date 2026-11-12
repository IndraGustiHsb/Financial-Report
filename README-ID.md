# Financial Report Dashboard — Gratis (Website + Android)

Paket ini menggunakan dashboard V2.6 sebagai tampilan, Firebase Authentication + Cloud Firestore untuk akun pribadi dan sinkronisasi dua arah, GitHub Pages untuk website, serta Capacitor untuk Android.

## Penting sebelum digunakan
- Firebase Spark gratis selama penggunaan berada dalam kuota gratis; kuota dan kebijakan dapat berubah.
- Jangan pernah membagikan password atau file konfigurasi privat. `firebase-config.js` berisi konfigurasi web Firebase, bukan password akun.
- Data cloud hanya bisa dibaca/ditulis oleh UID akun yang sedang login, setelah Firestore Rules dipasang.
- Firebase Storage tidak dipakai pada tahap ini. Bukti foto yang disimpan sebagai base64 dalam transaksi dapat membuat dokumen Firestore terlalu besar; gunakan transaksi tanpa foto dulu atau nanti kita migrasikan bukti ke Storage.

## Langkah 1 — Buat proyek Firebase
1. Buka https://console.firebase.google.com/ lalu login dengan akun Google.
2. Klik **Add project**. Nama contoh: `financial-report-indra`.
3. Google Analytics boleh dimatikan agar setup lebih sederhana.
4. Setelah proyek jadi, klik ikon Web `</>` (Add app), beri nama `Financial Report Web`, lalu Register app.
5. Pilih konfigurasi SDK **Config**. Salin nilai `apiKey`, `authDomain`, `projectId`, `storageBucket`, `messagingSenderId`, dan `appId`.
6. Buka `firebase-config.js`, ganti semua teks `GANTI_...` dengan nilai dari Firebase Console. Jangan menambahkan tanda kutip ganda di luar nilai; pertahankan format file.

## Langkah 2 — Aktifkan login email
1. Firebase Console → **Build → Authentication → Get started**.
2. Tab **Sign-in method** → pilih **Email/Password** → Enable → Save.

## Langkah 3 — Buat database dan aturan privat
1. Firebase Console → **Build → Firestore Database → Create database**.
2. Pilih **Production mode** dan lokasi terdekat yang tersedia. Lokasi database tidak dapat diubah setelah dibuat.
3. Setelah database dibuat, buka tab **Rules**.
4. Ganti seluruh aturan dengan isi file `firestore.rules`, lalu klik **Publish**.

## Langkah 4 — Tes website di komputer
1. Install Node.js versi LTS dari https://nodejs.org/.
2. Ekstrak ZIP ini ke folder komputer.
3. Buka terminal/Command Prompt di folder hasil ekstrak.
4. Jalankan:

```bash
npm install
npm run start
```

5. Buka alamat lokal yang muncul (biasanya `http://localhost:5173`).
6. Daftar dengan email dan password milik sendiri. Coba masukkan transaksi.
7. Status panel cloud harus menunjukkan **Online · sinkronisasi aktif**.

## Langkah 5 — Publikasikan website gratis via GitHub Pages
1. Buat akun/login di https://github.com/.
2. Buat repository baru, misalnya `financial-report-dashboard`, set **Private** jika ingin kode tidak publik. (GitHub Pages pada akun gratis umumnya mensyaratkan repository publik; jika repository privat, cek batasan paket akun.)
3. Upload seluruh isi folder proyek ke repository. Jangan upload `node_modules` atau folder `dist`.
4. Di repository, buka **Settings → Pages**.
5. Pilih **GitHub Actions** sebagai deployment source. Untuk build Vite, tambahkan workflow GitHub Actions atau gunakan deployment statis sederhana. Cara paling mudah untuk pemula: nanti ikuti panduan deploy Vite yang disesuaikan dengan nama repository.
6. Setelah publish, buka URL Pages. Login dengan akun yang sama seperti di Android.

## Langkah 6 — Buat aplikasi Android
Persyaratan: komputer Windows/macOS/Linux, Node.js LTS, dan Android Studio.

```bash
npm install
npm run build
npx cap add android
npx cap sync android
npx cap open android
```

Di Android Studio:
1. Tunggu Gradle selesai sync.
2. Jalankan ke perangkat Android dengan USB debugging aktif atau emulator.
3. Untuk APK: **Build → Build Bundle(s) / APK(s) → Build APK(s)**.
4. APK debug dapat dipasang untuk uji pribadi. Distribusi Play Store membutuhkan proses dan biaya akun developer; tidak termasuk target gratis ini.

## Cara kerja sinkronisasi
- Setelah login, aplikasi membaca dokumen `users/{UID}/private/finance`.
- Perubahan lokal disimpan ke cloud setelah jeda singkat.
- Perubahan dari perangkat lain diterima melalui listener Firestore.
- Saat pertama kali login dan dokumen cloud masih kosong, data lokal dashboard disalin ke cloud sebagai migrasi awal.
- Gunakan akun email yang sama di website dan Android.

## Catatan teknis
Ini adalah starter project. Sebelum penggunaan rutin, lakukan pengujian login, migrasi data, edit/hapus transaksi dari dua perangkat, backup, dan pemulihan. Sinkronisasi dasar menggunakan satu dokumen Firestore; untuk penggunaan berat atau lampiran foto besar sebaiknya dipecah menjadi koleksi transaksi.
