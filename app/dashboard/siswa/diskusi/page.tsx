"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { auth, db } from "../../../../lib/firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";
import { collection, doc, getDoc, getDocs } from "firebase/firestore";

// Definisikan tipe untuk ZoomLink
interface ZoomLink {
  id: string;
  title: string;
  description: string;
  zoomlink: string;
}

export default function Diskusi() {
  const [loading, setLoading] = useState(true);
  const [zoomLinks, setZoomLinks] = useState<ZoomLink[]>([]);
  const [isSiswa, setIsSiswa] = useState(false); // Cek jika user adalah siswa
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        router.push("/auth/login");
        return;
      }

      try {
        const userRef = doc(db, "users", user.uid);
        const userDoc = await getDoc(userRef);

        if (userDoc.exists() && userDoc.data()?.role === "siswa") {
          setIsSiswa(true);

          const zoomLinksSnapshot = await getDocs(collection(db, "ZoomLink"));
          const zoomLinksData: ZoomLink[] = [];
          zoomLinksSnapshot.forEach((doc) => {
            zoomLinksData.push({ id: doc.id, ...doc.data() } as ZoomLink);
          });
          setZoomLinks(zoomLinksData);
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

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!isSiswa) {
    return <p>You are not authorized to view this page.</p>;
  }

  return (
    <div className="md:pt-24 pt-24 min-h-screen bg-blue-100 text-blue-900 flex flex-col items-center">
      <h1 className="text-4xl text-center font-bold mb-6">
        Diskusi dan Zoom Links
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-6xl px-4">
        {zoomLinks.map((zoomLink) => (
          <div key={zoomLink.id} className="p-6 bg-white rounded-lg shadow-md">
            <h3 className="text-xl font-semibold">{zoomLink.title}</h3>
            <p className="mt-2 text-gray-700">{zoomLink.description}</p>
            <a
              href={zoomLink.zoomlink}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-block text-blue-500 hover:underline"
            >
              Join Zoom Meeting
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}
