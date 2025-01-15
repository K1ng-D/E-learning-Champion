"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  getFirestore,
  collection,
  addDoc,
  getDoc,
  doc,
} from "firebase/firestore";
import { auth, app } from "../../../../lib/firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";

const db = getFirestore(app);

const UploadMaterial = () => {
  const [title, setTitle] = useState("");
  const [lecturer, setLecturer] = useState("");
  const [description, setDescription] = useState("");
  const [videoLink, setVideoLink] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userRef = collection(db, "users");
        const userDoc = await getDoc(doc(userRef, user.uid));

        if (userDoc.exists() && userDoc.data().role === "guru") {
          setIsAuthorized(true);
        } else {
          alert("Anda tidak memiliki izin untuk mengakses halaman ini.");
          router.push("/auth/login");
        }
      } else {
        router.push("/auth/login");
      }
    });

    return () => unsubscribe();
  }, [router]);

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

      if (!res.ok) throw new Error("Gagal mengunggah ke Cloudinary");
      const data = await res.json();
      return data.secure_url;
    } catch (error) {
      console.error("Error uploading to Cloudinary:", error);
      alert("Gagal mengunggah gambar.");
      return "";
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthorized) return alert("Anda tidak diizinkan mengunggah materi.");

    try {
      const imageUrl = await handleImageUpload();
      if (!imageUrl) return;

      await addDoc(collection(db, "materials"), {
        title,
        lecturer,
        description,
        videoLink,
        imageUrl,
        createdAt: new Date().toISOString(),
      });

      alert("Materi berhasil diunggah!");
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

  if (!isAuthorized) return <p>Loading...</p>;

  return (
    <div className="p-8 pt-16 md:pl-[270px] w-full h-screen mx-auto shadow-lg rounded-lg">
      <h1 className="text-2xl font-bold mb-4">Unggah Materi Pembelajaran</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Judul Materi"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-2 border rounded-lg"
          required
        />
        <input
          type="text"
          placeholder="Nama Guru"
          value={lecturer}
          onChange={(e) => setLecturer(e.target.value)}
          className="w-full p-2 border rounded-lg"
          required
        />
        <textarea
          placeholder="Deskripsi"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full p-2 border rounded-lg"
          required
        />
        <input
          type="url"
          placeholder="Link Video Pembelajaran"
          value={videoLink}
          onChange={(e) => setVideoLink(e.target.value)}
          className="w-full p-2 border rounded-lg"
          required
        />
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImage(e.target.files?.[0] || null)}
          className="w-full p-2 border rounded-lg"
          required
        />
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
