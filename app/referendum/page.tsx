"use client";

import { useState } from "react";
import CreateReferendum from "./create/page";
import ReferendumList from "./list/page";
import { WalletDropdownDisconnect } from "@coinbase/onchainkit/wallet";
import { useRouter } from "next/navigation";

export default function ReferendumsPage() {
  const [activeTab, setActiveTab] = useState<"create" | "list">("create");
  const router = useRouter();

  return (
    <div className="min-h-screen bg-white text-blue-900 flex flex-col items-center p-8">
      <h1 className="text-3xl font-bold mb-6">Referendum</h1>

      <div className="flex space-x-4 mb-8">
        <button
          onClick={() => setActiveTab("create")}
          className={`px-4 py-2 rounded-lg font-medium border ${
            activeTab === "create"
              ? "bg-blue-600 text-white border-blue-600"
              : "bg-white text-blue-600 border-blue-600"
          }`}
        >
          Create
        </button>
        <button
          onClick={() => setActiveTab("list")}
          className={`px-4 py-2 rounded-lg font-medium border ${
            activeTab === "list"
              ? "bg-blue-600 text-white border-blue-600"
              : "bg-white text-blue-600 border-blue-600"
          }`}
        >
          View
        </button>
        <div
          onClick={() => {
            setTimeout(() => router.push("/"), 100);
          }}
        >
          <WalletDropdownDisconnect />
        </div>
      </div>

      <div className="w-full max-w-3xl bg-blue-50 p-6 rounded-2xl shadow-md border border-blue-200">
        {activeTab === "create" && <CreateReferendum />}
        {activeTab === "list" && <ReferendumList />}
      </div>
    </div>
  );
}
