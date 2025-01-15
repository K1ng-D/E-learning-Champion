"use client";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebaseConfig";
import { FaUser } from "react-icons/fa";

const formatDate = (dateString: string) => {
  const options: Intl.DateTimeFormatOptions = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  return new Date(dateString).toLocaleDateString("id-ID", options);
};

const NewsDetail = () => {
  const pathname = usePathname();
  const id = pathname ? pathname.split("/").pop() : null;
  const [news, setNews] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "materials"));
        const newsData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        const foundNews = newsData.find((news) => news.id === id);
        if (foundNews) {
          setNews(foundNews);
        } else {
          console.error("No such document!");
        }
      } catch (error) {
        console.error("Error fetching news:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchNews();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-screen-xl px-6 sm:px-8 lg:px-16 mx-auto my-16">
        <p>Loading...</p>
      </div>
    );
  }

  if (!news) {
    return <div>News not found</div>;
  }

  return (
    <div className="pt-16 bg-blue-100 max-w-screen-xl px-6 h-full sm:px-8 lg:px-16 mx-auto my-16">
      <div className="max-w-2xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div className="flex w-full sm:items-center gap-x-5 sm:gap-x-3">
            <div className="shrink-0">
              <FaUser className="size-12 rounded-full text-gray-800" />
            </div>
            <div className="grow">
              <div className="flex justify-between items-center gap-x-2">
                <div>
                  <span className="font-medium text-gray-800">
                    {news.lecturer}
                  </span>
                  <ul className="text-xs text-gray-500">
                    <li className="inline-block relative pe-6 last:pe-0 last-of-type:before:hidden before:absolute before:top-1/2 before:end-2 before:-translate-y-1/2 before:size-1 before:bg-gray-300 before:rounded-full">
                      {formatDate(news.createdAt)}
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-5 md:space-y-8">
          <div className="space-y-3">
            <h2 className="text-2xl font-medium md:text-3xl text-center lg:text-left">
              {news.title}
            </h2>
          </div>
          <figure>
            <img
              className="w-full object-cover rounded-xl"
              src={news.imageUrl}
              alt="Blog Image"
            />
          </figure>
          <p className="text-lg text-gray-800 break-words whitespace-pre-line">
            {news.description}
          </p>
        </div>
        <a
          href={news.videoLink}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 inline-block text-blue-500 hover:underline"
        >
          Tonton Video Pembelajaran
        </a>
      </div>
    </div>
  );
};

export default NewsDetail;
