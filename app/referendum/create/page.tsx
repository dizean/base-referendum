"use client";

import { useState } from "react";
import { useAccount } from "wagmi";

export default function CreateReferendum() {
  const { isConnected, address } = useAccount();
  const [question, setQuestion] = useState("");
  const [link, setLink] = useState("");
  const [deadline, setDeadline] = useState("");
  const [loading, setLoading] = useState(false);

  if (!isConnected) return <p>Please connect your wallet first.</p>;

  const handleCreate = async () => {
    if (!question || !link || !deadline) {
      alert("Please enter a question, link, and deadline");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/referendum", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question,
          link,
          options: ["Yes", "No"], 
          deadline: new Date(deadline).toISOString(), 
          owner: address,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        alert("Error creating referendum: " + err.error);
        return;
      }

      const data = await res.json();
      console.log("Created referendum:", data);
      setQuestion("");
      setLink("");
      setDeadline("");
      alert("Referendum created successfully!");
    } catch (err) {
      console.error("Create failed:", err);
      alert("Failed to create referendum.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto bg-white shadow rounded-lg space-y-4">
      <h2 className="text-xl font-semibold text-blue-800">Create Referendum</h2>
      <input
        type="text"
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        placeholder="Enter referendum question"
        className="w-full p-2 border rounded text-black"
      />
      <input
        type="text"
        value={link}
        onChange={(e) => setLink(e.target.value)}
        placeholder="Enter link for more info"
        className="w-full p-2 border rounded text-black"
      />
      <label className="block text-gray-700">Deadline</label>
      <input
        type="datetime-local"
        value={deadline}
        onChange={(e) => setDeadline(e.target.value)}
        className="w-full p-2 border rounded text-black"
      />
      <button
        onClick={handleCreate}
        disabled={loading}
        className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        {loading ? "Creating..." : "Create Referendum"}
      </button>
    </div>
  );
}
