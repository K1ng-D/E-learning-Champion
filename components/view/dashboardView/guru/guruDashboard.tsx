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

export default function GuruDashboard() {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [loading, setLoading] = useState(true);
  const [materiList, setMateriList] = useState<Materi[]>([]);
  const [zoomLinks, setZoomLinks] = useState<ZoomLink[]>([]);
  const router = useRouter();

  const handleLogout = async () => {
    await signOut(auth);
    router.push("/auth/login");
  };

  const truncateDescription = (description: string, charLimit: number = 20) => {
    return description.length > charLimit
      ? `${description.substring(0, charLimit)}...`
      : description;
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        router.push("/auth/login");
        return;
      }

      try {
        const userRef = doc(db, "users", user.uid);
        const userDoc = await getDoc(userRef);

        if (userDoc.exists() && userDoc.data()?.role === "guru") {
          setIsAuthorized(true);

          const materiSnapshot = await getDocs(collection(db, "materials"));
          const materiListData: Materi[] = materiSnapshot.docs.map(
            (doc) => ({ id: doc.id, ...doc.data() } as Materi)
          );
          setMateriList(materiListData);

          const zoomSnapshot = await getDocs(collection(db, "ZoomLink"));
          const zoomLinksData: ZoomLink[] = zoomSnapshot.docs.map(
            (doc) => ({ id: doc.id, ...doc.data() } as ZoomLink)
          );
          setZoomLinks(zoomLinksData);
        } else {
          router.push("/auth/login");
          return;
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        router.push("/auth/login");
        return;
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [router]);

  const handleDeleteMateri = async (id: string) => {
    try {
      await deleteDoc(doc(db, "materials", id));
      setMateriList(materiList.filter((materi) => materi.id !== id));
    } catch (error) {
      console.error("Error deleting materi:", error);
    }
  };

  const handleDeleteZoomLink = async (id: string) => {
    try {
      await deleteDoc(doc(db, "ZoomLink", id));
      setZoomLinks(zoomLinks.filter((link) => link.id !== id));
    } catch (error) {
      console.error("Error deleting Zoom link:", error);
    }
  };

  const handleEditMateri = (materi: Materi) => {
    console.log("Edit materi", materi);
  };

  const handleEditZoomLink = (zoomLink: ZoomLink) => {
    console.log("Edit Zoom link", zoomLink);
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!isAuthorized) {
    return <p>You are not authorized to view this page.</p>;
  }

  return (
    <div className="md:pl-[270px]  px-12 py-12 min-h-screen flex flex-col items-center justify-center  ">
      <button
        onClick={handleLogout}
        className="absolute top-4 right-4 bg-red-500 text-white px-4 py-2 rounded-md"
      >
        Logout
      </button>
      <h1 className="text-4xl font-bold">Dashboard Guru</h1>
      <p className="mt-4">Selamat datang di halaman dashboard guru.</p>

      <div className="mt-8 w-full max-w-4xl space-y-6">
        <h2 className="text-2xl font-semibold">Daftar Materi</h2>
        <p>Total Materi: {materiList.length}</p>
        <div className="overflow-x-auto">
          <div className="flex space-x-6">
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
                  {truncateDescription(materi.description, 20)}
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
                <div className="mt-4 flex space-x-2">
                  <button
                    onClick={() => handleDeleteMateri(materi.id)}
                    className="bg-red-500 text-white px-4 py-2 rounded-md"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <h2 className="text-2xl font-semibold">Zoom Link yang Terbuat</h2>
        <p>Total Zoom Links: {zoomLinks.length}</p>
        <div className="overflow-x-auto">
          <div className="flex space-x-6">
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
                <div className="mt-4 flex space-x-2">
                  <button
                    onClick={() => handleDeleteZoomLink(zoomLink.id)}
                    className="bg-red-500 text-white px-4 py-2 rounded-md"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
