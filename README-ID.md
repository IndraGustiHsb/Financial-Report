# Financial Report — Android + Website

Paket Android berbasis Capacitor dari dashboard Financial Report. Fitur dashboard dan aturan Tutup Buku Bulanan + Carry Forward tetap menggunakan implementasi HTML yang disertakan. Tampilan mobile memakai navigasi bawah, safe-area Android, ukuran kontrol sentuh yang lebih nyaman, dan layout responsif.

## Isi paket
- `index.html` — dashboard lengkap termasuk tutup buku dan carry forward.
- `firebase-sync.js` dan `firebase-config.js` — login dan sinkronisasi Firestore.
- `firestore.rules` — aturan akses privat per akun.
- `capacitor.config.json` — identitas aplikasi Android.
- `.github/workflows/android-build.yml` — build APK otomatis melalui GitHub Actions.

## 1. Konfigurasi Firebase (agar web dan Android sinkron)
1. Buka Firebase Console → Project settings → Your apps → Web app.
2. Salin konfigurasi Web App.
3. Isi nilai pada `firebase-config.js` (apiKey, authDomain, projectId, storageBucket, messagingSenderId, appId). Ganti semua nilai `GANTI_...`.
4. Aktifkan Authentication → Email/Password.
5. Buat Firestore Database dan terapkan `firestore.rules`.
6. Gunakan akun email yang sama di website dan Android.

Tanpa konfigurasi Firebase, dashboard tetap bisa digunakan secara lokal pada perangkat, tetapi data tidak otomatis tersinkron antar perangkat.

## 2. Build APK otomatis tanpa Android Studio di PC
1. Buat/siapkan repository GitHub milikmu.
2. Ekstrak ZIP ini dan upload seluruh isi folder ke root repository (termasuk folder `.github`).
3. Upload seluruh file proyek. Workflow akan menjalankan `npm install` secara otomatis.
4. Push/commit ke branch `main`.
5. GitHub → tab Actions → pilih **Build Financial Report Android APK** → **Run workflow**.
6. Setelah selesai, buka hasil workflow dan unduh artifact `Financial-Report-Android-APK`.
7. Ekstrak artifact, lalu instal `app-debug.apk` di Android. Jika diminta, izinkan instalasi dari sumber tersebut.

## 3. Build lokal (opsional)
Memerlukan Node.js LTS, Java 17, Android SDK dan Android Studio:

```bash
npm install
npm run build
npx cap add android
npx cap sync android
npx cap open android
```

Di Android Studio pilih Build → Build Bundle(s) / APK(s) → Build APK(s).

## Catatan penting
- APK debug ditujukan untuk uji pribadi. Distribusi Play Store memerlukan signing release dan proses publikasi tersendiri.
- Build APK tidak berarti aplikasi sudah tersambung ke Firebase. Konfigurasi Firebase harus diisi terlebih dahulu.
- Tutup buku adalah tindakan final untuk periode yang dipilih. Pastikan semua transaksi bulan itu sudah benar sebelum menutup buku.
- Sebelum mengganti dashboard yang sudah dipakai, backup data dan uji di akun/perangkat percobaan terlebih dahulu.
