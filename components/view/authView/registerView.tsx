"use client";
import { useState } from "react";
import { auth, db } from "../../../lib/firebaseConfig";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";

export default function RegisterView() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("siswa");
  const [name, setName] = useState(""); // Tambahkan state untuk nama

  const handleRegister = async () => {
    try {
      // Membuat akun pengguna baru
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      // Menyimpan data pengguna ke Firestore dengan nama, email, dan role
      await setDoc(doc(db, "users", userCredential.user.uid), {
        name,
        email,
        role,
      });

      // Redirect ke halaman login setelah berhasil mendaftar
      window.location.href = "/auth/login";
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center p-6">
      <div className="max-w-sm w-full bg-white p-8 rounded-lg shadow-lg">
        <h2 className="text-3xl font-semibold text-center text-gray-800 mb-6">
          Register
        </h2>

        <div className="space-y-4">
          {/* Input untuk Nama */}
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)} // Menangani perubahan nama
            placeholder="Nama"
            className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />

          {/* Input untuk Email */}
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />

          {/* Input untuk Password */}
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />

          {/* Dropdown untuk Role */}
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="siswa">Siswa</option>
          </select>

          {/* Tombol Register */}
          <button
            onClick={handleRegister}
            className="w-full py-3 bg-indigo-500 text-white rounded-lg font-semibold hover:bg-indigo-600 transition duration-200"
          >
            Register
          </button>
        </div>

        <div className="mt-4 text-center">
          <span className="text-sm text-gray-500">
            Sudah punya akun?{" "}
            <a
              href="/auth/login"
              className="text-indigo-500 hover:text-indigo-600"
            >
              Login di sini
            </a>
          </span>
        </div>
      </div>
    </div>
  );
}
