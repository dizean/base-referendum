/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import { useAccount, useReadContract, useWriteContract } from "wagmi";
import { referendumAddress, referendumABIConfig } from "./config/referendum";

export default function ReferendumPage() {
  const { address, isConnected } = useAccount();
  const { writeContract } = useWriteContract();

  // Local state
  const [question, setQuestion] = useState("");
  const [referendums, setReferendums] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // Example: fetch referendum list from contract (assuming contract has getReferendums())
  const { data: referendumList, refetch } = useReadContract({
    address: referendumAddress as `0x${string}`,
    abi: referendumABIConfig,
    functionName: "getReferendums", // <- adjust to your contract
  });

  useEffect(() => {
    if (referendumList) {
      setReferendums(referendumList as any[]);
    }
  }, [referendumList]);

  // Create referendum (contract must have createReferendum(string))
  const handleCreate = async () => {
    if (!question) return;
    setLoading(true);
    try {
      await writeContract({
        address: referendumAddress as `0x${string}`,
        abi: referendumABIConfig,
        functionName: "createReferendum", // <- adjust
        args: [question],
      });
      setQuestion("");
      refetch();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Vote referendum (contract must have vote(uint id, bool choice))
  const handleVote = async (id: number, choice: boolean) => {
    try {
      await writeContract({
        address: referendumAddress as `0x${string}`,
        abi: referendumABIConfig,
        functionName: "vote", // <- adjust
        args: [id, choice],
      });
      refetch();
    } catch (err) {
      console.error(err);
    }
  };

  if (!isConnected) {
    return (
      <div className="flex justify-center items-center h-screen text-xl">
        Please connect your wallet first.
      </div>
    );
  }

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">Referendums</h1>

      {/* Create Referendum */}
      <div className="p-4 border rounded-lg shadow">
        <h2 className="text-lg font-semibold mb-2">Create Referendum</h2>
        <input
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Enter referendum question"
          className="w-full p-2 border rounded mb-2 text-black"
        />
        <button
          onClick={handleCreate}
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          {loading ? "Creating..." : "Create"}
        </button>
      </div>

      {/* List of Referendums */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Active Referendums</h2>
        {referendums.length === 0 ? (
          <p>No referendums yet.</p>
        ) : (
          referendums.map((ref: any, idx: number) => (
            <div
              key={idx}
              className="p-4 border rounded-lg shadow flex flex-col gap-2"
            >
              <p className="font-medium">{ref.question}</p>
              <div className="flex gap-2">
                <button
                  onClick={() => handleVote(idx, true)}
                  className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
                >
                  Yes
                </button>
                <button
                  onClick={() => handleVote(idx, false)}
                  className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                >
                  No
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
