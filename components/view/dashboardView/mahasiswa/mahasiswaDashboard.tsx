"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { auth, db } from "../../../../lib/firebaseConfig";
import { onAuthStateChanged, signOut } from "firebase/auth";
import {
  doc,
  getDoc,
  collection,
  getDocs,
  deleteDoc,
} from "firebase/firestore";

// Tipe data untuk Materi dan ZoomLink
interface Materi {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  lecturer: string;
  videoLink: string;
}

interface ZoomLink {
  id: string;
  zoomlink: string;
  title: string;
  description: string;
}

export default function MahasiswaDashboard() {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [loading, setLoading] = useState(true);
  const [materiList, setMateriList] = useState<Materi[]>([]);
  const [zoomLinks, setZoomLinks] = useState<ZoomLink[]>([]);
  const router = useRouter();

  const handleLogout = async () => {
    await signOut(auth);
    router.push("/auth/login");
  };

  const truncateDescription = (description: string, charLimit: number = 20) =>
    description.length > charLimit
      ? `${description.substring(0, charLimit)}...`
      : description;

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        router.push("/auth/login");
        return;
      }

      try {
        const userRef = doc(db, "users", user.uid);
        const userDoc = await getDoc(userRef);

        if (userDoc.exists() && userDoc.data()?.role === "mahasiswa") {
          setIsAuthorized(true);

          const materiSnapshot = await getDocs(collection(db, "materials"));
          setMateriList(
            materiSnapshot.docs.map(
              (doc) => ({ id: doc.id, ...doc.data() } as Materi)
            )
          );

          const zoomSnapshot = await getDocs(collection(db, "ZoomLink"));
          setZoomLinks(
            zoomSnapshot.docs.map(
              (doc) => ({ id: doc.id, ...doc.data() } as ZoomLink)
            )
          );
        } else {
          router.push("/auth/login");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        router.push("/auth/login");
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [router]);

  const handleDeleteMateri = async (id: string) => {
    try {
      await deleteDoc(doc(db, "materials", id));
      setMateriList((prev) => prev.filter((materi) => materi.id !== id));
    } catch (error) {
      console.error("Error deleting materi:", error);
    }
  };

  const handleDeleteZoomLink = async (id: string) => {
    try {
      await deleteDoc(doc(db, "ZoomLink", id));
      setZoomLinks((prev) => prev.filter((link) => link.id !== id));
    } catch (error) {
      console.error("Error deleting Zoom link:", error);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (!isAuthorized) return <p>You are not authorized to view this page.</p>;

  return (
    <div className="md:pt-24 bg-blue-100 pt-24 px-12 py-12 min-h-screen flex flex-col items-center justify-center">
      <h1 className="text-4xl font-bold">Dashboard Siswa/Siswi</h1>
      <p className="mt-4">Selamat datang di halaman dashboard Siswa/Siswi.</p>
      <button
        onClick={handleLogout}
        className="mt-4 bg-red-500 text-white px-4 py-2 rounded-md"
      >
        Logout
      </button>

      <div className="mt-8 w-full max-w-4xl space-y-6">
        <h2 className="text-2xl font-semibold">Daftar Materi Baru-Baru Ini</h2>
        <p>Total Materi: {materiList.length}</p>
        <div className="overflow-x-auto flex space-x-6">
          {materiList.map((materi) => (
            <div
              key={materi.id}
              className="p-6 bg-white rounded-lg shadow-md min-w-[300px]"
            >
              <img
                src={materi.imageUrl}
                alt={materi.title}
                className="w-full h-48 object-cover rounded-lg"
              />
              <h3 className="mt-4 text-xl font-semibold">{materi.title}</h3>
              <p className="mt-2 text-gray-700">
                {truncateDescription(materi.description)}
              </p>
              <p className="mt-2 text-gray-500">
                Dibuat Oleh: {materi.lecturer}
              </p>
              <a
                href={materi.videoLink}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-block text-blue-500 hover:underline"
              >
                Tonton Video Pembelajaran
              </a>
            </div>
          ))}
        </div>

        <h2 className="text-2xl font-semibold">Zoom Link Baru-baru ini</h2>
        <p>Total Zoom Links: {zoomLinks.length}</p>
        <div className="overflow-x-auto flex space-x-6">
          {zoomLinks.map((zoomLink) => (
            <div
              key={zoomLink.id}
              className="p-4 bg-white rounded-lg shadow-md min-w-[300px]"
            >
              <h3 className="text-xl font-semibold">{zoomLink.title}</h3>
              <p className="mt-2 text-gray-700">{zoomLink.description}</p>
              <a
                href={zoomLink.zoomlink}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:underline"
              >
                {zoomLink.zoomlink}
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
