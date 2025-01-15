"use client";
import { useEffect, useState } from "react";
import { db } from "../../../../lib/firebaseConfig";
import { collection, getDocs } from "firebase/firestore";
import Link from "next/link";

// Definisikan tipe untuk materi
interface Materi {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  lecturer: string;
  videoLink: string;
}

export default function MaterialView() {
  const [loading, setLoading] = useState(true);
  const [materiList, setMateriList] = useState<Materi[]>([]);

  const truncateDescription = (description: string, charLimit: number = 20) =>
    description.length > charLimit
      ? `${description.substring(0, charLimit)}...`
      : description;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const materiSnapshot = await getDocs(collection(db, "materials"));
        const materiListData: Materi[] = [];
        materiSnapshot.forEach((doc) => {
          materiListData.push({ id: doc.id, ...doc.data() } as Materi);
        });
        setMateriList(materiListData);
      } catch (error) {
        console.error("Error fetching materi data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="py-24 min-h-screen flex flex-col items-center justify-center bg-blue-100 text-blue-900">
      <h1 className="text-4xl font-bold mb-6">Materi</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-6xl px-4">
        {materiList.map((materi) => (
          <Link
            key={materi.id}
            href={`/dashboard/mahasiswa/materi/${materi.id}`}
          >
            <div className="p-6 bg-white rounded-lg shadow-md min-w-[300px] cursor-pointer hover:shadow-lg transition-shadow duration-300 h-full">
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
          </Link>
        ))}
      </div>
    </div>
  );
}
