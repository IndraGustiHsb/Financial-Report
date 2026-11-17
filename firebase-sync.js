import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js";
import { getAuth, onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js";
import { getFirestore, doc, onSnapshot, setDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js";
import { firebaseConfig } from "./firebase-config.js";

const $ = (id) => document.getElementById(id);
const status = (message, error=false) => {
  const el = $("cloudStatus");
  if (el) { el.textContent = message; el.style.color = error ? "#ff5470" : "#19e08a"; }
};
const ready = Object.values(firebaseConfig).every(v => v && !String(v).startsWith("GANTI_"));
if (!ready) {
  status("Firebase belum dikonfigurasi. Ikuti README terlebih dahulu.", true);
} else {
  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);
  const db = getFirestore(app);
  let stopCloud = null;
  let saveTimer = null;
  let applyingRemote = false;
  let firstSnapshot = true;

  async function saveCloud() {
    const user = auth.currentUser;
    if (!user || applyingRemote || !window.dashboardGetState) return;
    const state = window.dashboardGetState();
    try {
      await setDoc(doc(db, "users", user.uid, "private", "finance"), {
        ...state,
        updatedAt: serverTimestamp()
      });
      status("Tersinkronisasi · " + new Date().toLocaleTimeString("id-ID"));
    } catch (e) {
      console.error(e); status("Gagal menyimpan cloud: " + e.message, true);
    }
  }

  window.dashboardCloudSave = () => {
    clearTimeout(saveTimer);
    saveTimer = setTimeout(saveCloud, 700);
  };

  onAuthStateChanged(auth, user => {
    if (stopCloud) { stopCloud(); stopCloud = null; }
    $("loginPanel").hidden = !!user;
    $("accountPanel").hidden = !user;
    if (!user) { status("Belum login · data hanya di perangkat ini"); return; }
    $("accountEmail").textContent = user.email || "Akun pribadi";
    status("Menghubungkan database...");
    firstSnapshot = true;
    const ref = doc(db, "users", user.uid, "private", "finance");
    stopCloud = onSnapshot(ref, async snap => {
      if (snap.exists()) {
        const cloud = snap.data();
        if (window.dashboardApplyCloudState) {
          applyingRemote = true;
          window.dashboardApplyCloudState(cloud);
          applyingRemote = false;
        }
        status("Online · sinkronisasi aktif");
      } else if (firstSnapshot) {
        // Migrasi awal: isi cloud dengan data lokal yang sudah ada.
        await saveCloud();
        status("Data lokal disalin ke cloud");
      }
      firstSnapshot = false;
    }, e => { console.error(e); status("Koneksi cloud gagal: " + e.message, true); });
  });

  $("loginBtn").onclick = async () => {
    const email = $("email").value.trim(), password = $("password").value;
    try { await signInWithEmailAndPassword(auth, email, password); }
    catch (e) { status("Login gagal: " + e.message, true); }
  };
  $("registerBtn").onclick = async () => {
    const email = $("email").value.trim(), password = $("password").value;
    if (password.length < 6) { status("Password minimal 6 karakter.", true); return; }
    try { await createUserWithEmailAndPassword(auth, email, password); }
    catch (e) { status("Pendaftaran gagal: " + e.message, true); }
  };
  $("logoutBtn").onclick = () => signOut(auth);
}
