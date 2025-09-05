"use client"
import BouncingLoader from "@/components/BouncingLoader/BouncingLoader";
import Navbar from "@/components/Navbar/Navbar"
import { useEffect, useState } from "react"

type Contact = {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  message: string;
  createdAt: string;
};

const Page = () => {

  const [reviews, setReviews] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchContacts = async () => {
        try {
        const res = await fetch("/api/contact");

        if (!res.ok) {
            throw new Error("Failed to fetch contacts");
        }

        const data: Contact[] = await res.json();
        setReviews(data);
        } catch (err: unknown) {
        if (err instanceof Error) {
            setError(err.message);
            console.error(err.message);
        } else {
            setError("An unknown error occurred");
            console.error("Unknown error occurred");
        }
        } finally {
        setLoading(false);
        }
    };
    fetchContacts();
}, []);

  function formatDateTime(isoString: string): string {
    const date = new Date(isoString);

    return date.toLocaleString("en-US", {
        year: "numeric",
        month: "short",   // "Sep"
        day: "numeric",   // 4
        hour: "numeric",  // 2
        minute: "2-digit", // 05
        hour12: true,     // 12-hour clock with AM/PM
    });
  }

  function truncateText(text: string, maxLength: number) {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength) + "...";
  }

  if (error) return <p>Error: {error}</p>;

  return (
    <div>
        <div className="overflow-hidden">
            <Navbar/>
        </div>
        <div>
            <h1 className="w-full text-center text-main font-bold text-4xl my-5">Reviews</h1>
            <div className="w-full p-4">
                {loading ? (
                    <div className="transform -translate-y-90 -translate-x-10">
                        <BouncingLoader/> 
                    </div>
                )
                : (
                    reviews.length > 0 ? (<div>
                        {reviews.map((review)=>(
                            <a key={review.id} href={`/dashboard/reviews/${review.id}`}>
                                <div className="w-full p-3 border-2 border-white rounded-2xl mb-2 hover:bg-white/10 transition-all duration-75">
                                    <div className="flex text-white gap-1">
                                        <span>
                                            {review.firstName}
                                        </span>
                                        <span>
                                            {review.lastName}
                                        </span>
                                    </div>
                                    <p className="text-gray-400">
                                        {truncateText(review.message, 50)}
                                    </p>
                                    <div className="flex justify-between">
                                        <p className="text-white/50">From : {review.email}</p>
                                        <p className="text-white/80">{formatDateTime(review.createdAt)}</p>
                                    </div>
                                </div>
                            </a>
                        ))}
                    </div>) : (<h1 className="text-white">No Reviews...</h1>)
                )}
            </div>
        </div>
    </div>
  )
}

export default Page;