/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAccount } from "wagmi";
import { supabase } from "../../api/client";

type Referendum = {
  id: string;
  question: string;
  link: string;
  deadline: string;
  owner_wallet: string;
  options: string[];
  votes?: Record<string, number>; 
};

export default function ReferendumList() {
  const { address, isConnected } = useAccount();
  const [referendums, setReferendums] = useState<Referendum[]>([]);
  const [loading, setLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    const fetchMyReferendums = async () => {
      if (!isConnected || !address) return;
      setLoading(true);

      const { data: refs, error } = await supabase
        .from("referendums")
        .select("*")
        .eq("owner_wallet", address)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching referendums:", error);
      } else if (refs) {
        const refsWithVotes = await Promise.all(
          refs.map(async (ref: any) => {
            const { data: votesData } = await supabase
              .from("votes")
              .select("selected_option")
              .eq("referendum_id", ref.id);

            const votesCount: Record<string, number> = {};
            ref.options.forEach((opt: string) => {
              votesCount[opt] = votesData?.filter((v: any) => v.selected_option === opt).length || 0;
            });

            return { ...ref, votes: votesCount };
          })
        );

        setReferendums(refsWithVotes);
      }

      setLoading(false);
    };

    fetchMyReferendums();
  }, [isConnected, address]);

  const handleShare = (link?: string, id?: string) => {
    if (!link) return;
    try {
      const fullUrl = `${window.location.origin}/referendum/view/${link}`;
      navigator.clipboard.writeText(fullUrl);
      setCopiedId(id || null);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      console.error("Failed to copy link:", err);
    }
  };

  if (!isConnected) return <p>Please connect your wallet first.</p>;
  if (loading) return <p className="text-blue-600">Loading referendums...</p>;

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">My Referendums</h1>
      <div className="grid gap-4">
        {referendums.length === 0 ? (
          <p>No referendums created yet.</p>
        ) : (
          referendums.map((ref) => (
            <div
              key={ref.id}
              className="border rounded-lg p-4 shadow-sm bg-white flex flex-col gap-2"
            >
              <h2 className="text-lg font-semibold">{ref.question}</h2>
              <p className="text-sm text-gray-500">
                Deadline: {new Date(ref.deadline).toLocaleString()}
              </p>

              {/* Votes display */}
              {ref.votes && (
                <div className="flex gap-4 text-sm text-gray-700 mt-2">
                  {Object.entries(ref.votes).map(([option, count]) => (
                    <span key={option}>
                      {option}: <strong>{count}</strong>
                    </span>
                  ))}
                </div>
              )}

              <div className="flex gap-2 mt-2">
                <Link
                  href={`/referendum/view/${ref.link}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
                >
                  View
                </Link>

                {ref.link && (
                  <button
                    onClick={() => handleShare(ref.link, ref.id)}
                    className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    {copiedId === ref.id ? "Copied!" : "Share"}
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
