"use client"

import Navbar from "@/components/Navbar/Navbar";
import { error } from "console";
import { Calendar } from "lucide-react";
import { use, useEffect, useState } from "react"

type Params = {id : string};

type Contact = {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  message: string;
  createdAt: string;
};

const Page = ({params} : {params : Promise<Params>}) => {
  const param = use(params);
  const id = param.id;

  const [contact , setContact] = useState<Contact>({
    id : 0,
    firstName : '',
    lastName : '',
    email : "",
    message : '',
    createdAt : "2025-09-04T14:06:24.170Z",
  });
  const [loading , setLoading] = useState(true);

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

  useEffect(() => {
    async function fetchContact() {
      try {
        const res = await fetch(`/api/contact/${id}`);
        if (!res.ok) throw new Error("Failed to fetch video");
        const data = await res.json();
        setContact(data.contact);
      } catch (err: any) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    }
    fetchContact();
  }, []);

  return (
    <div>
        <div className="overflow-hidden">
            <Navbar/>
        </div>
        <div className="w-screen p-5 my-10 ">
          <div className="flex gap-5">
            <p className="text-gray-300">From  : {contact.email}</p>
            <div className="flex gap-1 items-center">
              <Calendar className="text-gray-300 scale-70"/>
              <p className="text-gray-300">{formatDateTime(contact.createdAt)}</p>
            </div>
          </div>

          <div className="flex gap-2 my-3 text-white text-4xl">
            By ,
            <h1>{contact.firstName}</h1>
            <h1>{contact.lastName}</h1>
          </div>

          <p className="text-white">
            <span className="text-gray-300">Message :</span> {contact.message}
          </p>
            
        </div>
    </div>
  )
}

export default Page;