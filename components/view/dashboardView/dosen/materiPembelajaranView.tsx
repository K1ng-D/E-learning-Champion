"use client";
import { useState } from "react";
import { getFirestore, collection, addDoc } from "firebase/firestore";
import { app } from "../../../../lib/firebaseConfig";

const db = getFirestore(app);

const UploadMaterial = () => {
  const [title, setTitle] = useState("");
  const [lecturer, setLecturer] = useState("");
  const [description, setDescription] = useState("");
  const [videoLink, setVideoLink] = useState("");
  const [image, setImage] = useState<File | null>(null);

  // Fungsi upload gambar ke Cloudinary
  const handleImageUpload = async () => {
    if (!image) {
      alert("Gambar belum dipilih!");
      return "";
    }
    const formData = new FormData();
    formData.append("file", image);
    formData.append(
      "upload_preset",
      process.env.NEXT_PUBLIC_CLOUDINARY_PRESET!
    );

    try {
      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (!res.ok) {
        throw new Error("Gagal mengunggah ke Cloudinary");
      }

      const data = await res.json();
      if (!data.secure_url) {
        throw new Error("URL gambar tidak ditemukan");
      }
      return data.secure_url;
    } catch (error) {
      console.error("Error uploading to Cloudinary:", error);
      alert("Gagal mengunggah gambar.");
      return "";
    }
  };

  // Fungsi untuk mengunggah data ke Firestore
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const imageUrl = await handleImageUpload();

      if (!imageUrl) {
        alert("Upload gambar gagal, coba lagi.");
        return;
      }

      await addDoc(collection(db, "materials"), {
        title,
        lecturer,
        description,
        videoLink,
        imageUrl,
        createdAt: new Date().toISOString(),
      });

      alert("Materi berhasil diunggah!");
      // Reset form
      setTitle("");
      setLecturer("");
      setDescription("");
      setVideoLink("");
      setImage(null);
    } catch (error) {
      console.error("Error submitting data:", error);
      alert("Gagal mengunggah materi.");
    }
  };

  return (
    <div className="p-8 pt-16 md:pl-[270px] w-full h-screen mx-auto bg-white shadow-lg rounded-lg">
      <h1 className="text-2xl font-bold mb-4">Unggah Materi Pembelajaran</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Input Judul */}
        <input
          type="text"
          placeholder="Judul Materi"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-2 border rounded-lg"
          required
        />
        {/* Input Nama Dosen */}
        <input
          type="text"
          placeholder="Nama Dosen"
          value={lecturer}
          onChange={(e) => setLecturer(e.target.value)}
          className="w-full p-2 border rounded-lg"
          required
        />
        {/* Input Deskripsi */}
        <textarea
          placeholder="Deskripsi"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full p-2 border rounded-lg"
          required
        />
        {/* Input Link Video */}
        <input
          type="url"
          placeholder="Link Video Pembelajaran"
          value={videoLink}
          onChange={(e) => setVideoLink(e.target.value)}
          className="w-full p-2 border rounded-lg"
          required
        />
        {/* Input Upload Gambar */}
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImage(e.target.files?.[0] || null)}
          className="w-full p-2 border rounded-lg"
          required
        />
        {/* Tombol Submit */}
        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-700"
        >
          Unggah Materi
        </button>
      </form>
    </div>
  );
};

export default UploadMaterial;
