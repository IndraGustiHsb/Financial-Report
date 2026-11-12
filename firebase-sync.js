import { initializeApp } from "firebase/app";

import {
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut
} from "firebase/auth";

import {
  getFirestore,
  doc,
  onSnapshot,
  setDoc,
  serverTimestamp
} from "firebase/firestore";

import { firebaseConfig } from "./firebase-config.js";

const $ = (id) => document.getElementById(id);

const status = (message, error = false) => {
  const el = $("cloudStatus");

  if (el) {
    el.textContent = message;
    el.style.color = error ? "#ff5470" : "#19e08a";
  }
};

const required = [
  "loginPanel",
  "accountPanel",
  "cloudStatus",
  "email",
  "password",
  "loginBtn",
  "registerBtn",
  "logoutBtn"
];

if (required.some(id => !$(id))) {
  console.error("Elemen login Firebase tidak lengkap.");
  status("Panel login belum lengkap.", true);
} else {
  try {
    const app = initializeApp(firebaseConfig);
    const auth = getAuth(app);
    const db = getFirestore(app);

    let stopCloud = null;
    let saveTimer = null;
    let applyingRemote = false;
    let firstSnapshot = true;

    async function saveCloud() {
      const user = auth.currentUser;

      if (
        !user ||
        applyingRemote ||
        typeof window.dashboardGetState !== "function"
      ) {
        return;
      }

      try {
        const state = window.dashboardGetState();

        await setDoc(
          doc(db, "users", user.uid, "private", "finance"),
          {
            ...state,
            updatedAt: serverTimestamp()
          }
        );

        status(
          "Tersinkronisasi · " +
          new Date().toLocaleTimeString("id-ID")
        );
      } catch (error) {
        console.error("Firebase save error:", error);
        status("Gagal menyimpan: " + error.message, true);
      }
    }

    window.dashboardCloudSave = () => {
      clearTimeout(saveTimer);
      saveTimer = setTimeout(saveCloud, 700);
    };

    onAuthStateChanged(auth, user => {
      if (stopCloud) {
        stopCloud();
        stopCloud = null;
      }

      $("loginPanel").hidden = !!user;
      $("accountPanel").hidden = !user;

      if (!user) {
        status("Belum login · data hanya di perangkat ini");
        return;
      }

      $("accountEmail").textContent =
        user.email || "Akun pribadi";

      status("Menghubungkan database...");

      firstSnapshot = true;

      const ref = doc(
        db,
        "users",
        user.uid,
        "private",
        "finance"
      );

      stopCloud = onSnapshot(
        ref,
        async snapshot => {
          try {
            if (snapshot.exists()) {
              const cloud = snapshot.data();

              if (
                typeof window.dashboardApplyCloudState === "function"
              ) {
                applyingRemote = true;

                window.dashboardApplyCloudState(cloud);

                applyingRemote = false;
              }

              status("Online · sinkronisasi aktif");

            } else if (firstSnapshot) {
              await saveCloud();

              status("Data lokal disalin ke cloud");
            }

            firstSnapshot = false;

          } catch (error) {
            applyingRemote = false;
            console.error(error);
            status("Gagal membaca data: " + error.message, true);
          }
        },
        error => {
          applyingRemote = false;
          console.error("Firestore error:", error);
          status("Koneksi cloud gagal: " + error.message, true);
        }
      );
    });

    $("loginBtn").onclick = async () => {
      const email = $("email").value.trim();
      const password = $("password").value;

      if (!email || !password) {
        status("Masukkan email dan password.", true);
        return;
      }

      try {
        status("Sedang login...");

        await signInWithEmailAndPassword(
          auth,
          email,
          password
        );

      } catch (error) {
        console.error(error);
        status("Login gagal: " + error.message, true);
      }
    };

    $("registerBtn").onclick = async () => {
      const email = $("email").value.trim();
      const password = $("password").value;

      if (!email || !password) {
        status("Masukkan email dan password.", true);
        return;
      }

      if (password.length < 6) {
        status("Password minimal 6 karakter.", true);
        return;
      }

      try {
        status("Mendaftarkan akun...");

        await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );

      } catch (error) {
        console.error(error);
        status("Pendaftaran gagal: " + error.message, true);
      }
    };

    $("logoutBtn").onclick = async () => {
      try {
        await signOut(auth);
        status("Anda sudah keluar.");
      } catch (error) {
        console.error(error);
        status("Gagal keluar: " + error.message, true);
      }
    };

    status("Firebase siap · silakan login atau daftar");

  } catch (error) {
    console.error("Firebase initialization error:", error);
    status("Firebase gagal dimulai: " + error.message, true);
  }
}