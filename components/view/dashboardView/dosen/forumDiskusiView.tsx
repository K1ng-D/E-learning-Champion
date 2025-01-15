"use client";
import { useState, useEffect } from "react";
import { db } from "../../../../lib/firebaseConfig";
import { collection, getDocs, addDoc } from "firebase/firestore";

// Definisikan tipe untuk ZoomLink
interface LinkZoom {
  id: string;
  title: string;
  description: string;
  zoomlink: string;
}

export default function Diskusi() {
  const [messages, setMessages] = useState<LinkZoom[]>([]);
  const [newMessage, setNewMessage] = useState({
    title: "",
    description: "",
    zoomlink: "",
  });

  // Ambil data ZoomLink dari Firestore
  useEffect(() => {
    const fetchMessages = async () => {
      const querySnapshot = await getDocs(collection(db, "ZoomLink"));
      const messagesList: LinkZoom[] = [];
      querySnapshot.forEach((doc) => {
        messagesList.push({
          id: doc.id,
          title: doc.data().title,
          description: doc.data().description,
          zoomlink: doc.data().zoomlink,
        });
      });
      setMessages(messagesList);
    };
    fetchMessages();
  }, []);

  // Kirim data ZoomLink baru ke Firestore
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      newMessage.title.trim() &&
      newMessage.description.trim() &&
      newMessage.zoomlink.trim()
    ) {
      await addDoc(collection(db, "ZoomLink"), newMessage);
      setNewMessage({ title: "", description: "", zoomlink: "" });
    }
  };

  return (
    <div className="container pt-16 md:pl-[270px] mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Halaman Diskusi</h1>

      {/* Form untuk menambahkan ZoomLink baru */}
      <form onSubmit={handleSubmit} className="flex flex-col space-y-2">
        <input
          type="text"
          value={newMessage.title}
          onChange={(e) =>
            setNewMessage({ ...newMessage, title: e.target.value })
          }
          placeholder="Judul Zoom Meeting"
          className="border p-2 rounded-md"
        />
        <input
          type="text"
          value={newMessage.description}
          onChange={(e) =>
            setNewMessage({ ...newMessage, description: e.target.value })
          }
          placeholder="Deskripsi Zoom Meeting"
          className="border p-2 rounded-md"
        />
        <input
          type="text"
          value={newMessage.zoomlink}
          onChange={(e) =>
            setNewMessage({ ...newMessage, zoomlink: e.target.value })
          }
          placeholder="Link Zoom Meeting"
          className="border p-2 rounded-md"
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded-md"
        >
          Kirim
        </button>
      </form>
    </div>
  );
}
