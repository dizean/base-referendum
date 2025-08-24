"use client";
import { useState } from "react";
import Link from "next/link";

export default function ReferendumPageOptions() {
  const [selected, setSelected] = useState<"create" | "view" | "my" | null>(null);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold mb-8">📊 Referendums</h1>

      {/* Selection buttons */}
      <div className="flex gap-6">
        <button
          onClick={() => setSelected("create")}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Create Referendum
        </button>

        <button
          onClick={() => setSelected("view")}
          className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700"
        >
          View Referendums
        </button>

        <button
          onClick={() => setSelected("my")}
          className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
        >
          My Referendums
        </button>
      </div>

      {/* Render selected section */}
      <div className="mt-10 w-full max-w-2xl bg-white shadow-lg rounded-xl p-6">
        {selected === "create" && (
          <div>
            <h2 className="text-xl font-semibold mb-4">Create Referendum</h2>
            <Link href="/referendums/create">
              <button className="px-4 py-2 bg-blue-500 text-white rounded-lg">
                Go to Create Form →
              </button>
            </Link>
          </div>
        )}

        {selected === "view" && (
          <div>
            <h2 className="text-xl font-semibold mb-4">View Referendums</h2>
            <Link href="/referendums/view">
              <button className="px-4 py-2 bg-green-500 text-white rounded-lg">
                Browse Referendums →
              </button>
            </Link>
          </div>
        )}

        {selected === "my" && (
          <div>
            <h2 className="text-xl font-semibold mb-4">My Referendums</h2>
            <Link href="/referendums/my">
              <button className="px-4 py-2 bg-purple-500 text-white rounded-lg">
                See My Referendums →
              </button>
            </Link>
          </div>
        )}

        {!selected && (
          <p className="text-gray-500 text-center">
            👆 Choose an option above to get started.
          </p>
        )}
      </div>
    </div>
  );
}
