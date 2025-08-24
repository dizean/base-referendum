"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/app/api/client";

type Referendum = {
  id: number;
  question: string;
  link: string;
  owner_wallet: string;
  deadline: string;
};

export default function ReferendumPage() {
  const { link } = useParams();
  const [referendum, setReferendum] = useState<Referendum | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchReferendum() {
      const { data, error } = await supabase
        .from("referendums")
        .select("*")
        .eq("link", link)
        .single();

      if (!error && data) setReferendum(data);
      setLoading(false);
    }
    if (link) fetchReferendum();
  }, [link]);

  if (loading) return <div className="flex h-screen items-center justify-center">Loading...</div>;
  if (!referendum) return <div className="flex h-screen items-center justify-center">Not found</div>;

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
      <div className="bg-white shadow-lg rounded-2xl p-6 w-full max-w-md">
         <h1 className="text-xl text-center mb-4 text-black">View Display if Referendum is Shared.</h1>
        <h1 className="text-2xl font-bold text-center mb-4 text-black">{referendum.question}</h1>
        <p className="text-center text-gray-600 mb-6">
          Deadline: {new Date(referendum.deadline).toLocaleString()}
        </p>

        <form className="flex flex-col gap-4">
          <button
            type="button"
            disabled
            className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            Yes
          </button>
          <button
            type="button"
            disabled
            className="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            No
          </button>
        </form>
      </div>
    </div>
  );
}
