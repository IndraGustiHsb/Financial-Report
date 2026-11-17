# Financial Report — Website + Android

Aplikasi Android menggunakan Capacitor dan dashboard web yang sama. Website yang sudah ada tidak diganti; perubahan Android dan konfigurasi ini dibuat pada branch perbaikan terpisah.

## Firebase yang digunakan

Project: `financial-report-indra`  
Web App: `Financial Report Web`  
Authentication: Email/Password  
Database: Cloud Firestore

Konfigurasi Web App sudah diisi di `firebase-config.js` berdasarkan Firebase Console yang diberikan pemilik project. Jangan menambahkan service-account key atau Firebase Admin credentials ke repository.

Data cloud disimpan per akun pada dokumen:

```
users/{uid}/private/finance
```

Website dan Android harus login menggunakan akun Firebase yang sama agar membaca dokumen yang sama. Setiap perubahan dashboard memicu penyimpanan cloud; listener Firestore menerapkan perubahan cloud ke dashboard lokal.

## Aturan Firestore

Pastikan Firestore Rules membatasi setiap akun ke UID-nya sendiri. Aturan yang sesuai untuk struktur saat ini:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId}/private/{document=**} {
      allow read, write: if request.auth != null
                         && request.auth.uid == userId;
    }
  }
}
```

Jangan menghapus atau mengubah dokumen pengguna yang sudah ada. Uji pertama kali menggunakan akun percobaan atau backup data terlebih dahulu.

## Build APK melalui GitHub Actions

1. Buka repository → tab **Actions**.
2. Pilih **Build Financial Report Android APK**.
3. Klik **Run workflow** pada branch ini atau branch utama setelah perubahan digabung.
4. Tunggu proses selesai, buka workflow run, lalu unduh artifact **Financial-Report-Android-APK**.
5. Ekstrak artifact dan instal `app-debug.apk` di perangkat Android.

Workflow membangun APK debug untuk pengujian. Distribusi Play Store membutuhkan signing release terpisah.

## Build lokal

Memerlukan Node.js, Java 17, Android SDK, dan Android Studio:

```bash
npm install
npm run build
npx cap add android
npx cap sync android
npx cap open android
```

## Catatan

- Application ID tetap `com.indra.financialreport` agar identitas paket Android tidak berubah; nama yang tampil adalah **Financial Report INDRA Gusti HSB**.
- Firebase Web API key adalah identifier aplikasi klien, bukan service-account secret. Terapkan pembatasan API key yang sesuai di Google Cloud.
- APK memerlukan koneksi internet untuk sinkronisasi Firestore.
- Perubahan ini belum mengganti website aktif; tinjau Pull Request sebelum merge.
