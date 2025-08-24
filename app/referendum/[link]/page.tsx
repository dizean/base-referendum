/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/app/api/client";
import { useAccount } from "wagmi";
import {
  ConnectWallet,
  Wallet,
  WalletDropdown,
  WalletDropdownLink,
} from "@coinbase/onchainkit/wallet";
import {
  Avatar,
  Name,
  Address,
  EthBalance,
  Identity,
} from "@coinbase/onchainkit/identity";

type Referendum = {
  id: string;
  question: string;
  link: string;
  owner_wallet: string;
  deadline: string;
  options: string[];
};

export default function ReferendumVotePage() {
  const { link } = useParams();
  const { address, isConnected } = useAccount();
  const [referendum, setReferendum] = useState<Referendum | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [hasVoted, setHasVoted] = useState(false);

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

  useEffect(() => {
    async function checkVote() {
      if (referendum && address) {
        const { data, error } = await supabase
          .from("votes")
          .select("id")
          .eq("referendum_id", referendum.id)
          .eq("voter_wallet", address)
          .maybeSingle();

        if (!error && data) {
          setHasVoted(true);
          setMessage("You have already voted on this referendum.");
        }
      }
    }
    checkVote();
  }, [referendum, address]);

  async function handleVote(choice: string) {
    if (!isConnected || !address) {
      setMessage("Please connect your wallet to vote.");
      return;
    }
    if (!referendum) return;
    if (hasVoted) {
      setMessage("You have already voted. Duplicate votes are not allowed.");
      return;
    }

    setSubmitting(true);
    setMessage("");

    const { error } = await supabase.from("votes").insert([
      {
        referendum_id: referendum.id,
        voter_wallet: address,
        selected_option: choice,
      },
    ]);

    if (error) {
      setMessage("Error submitting vote: " + error.message);
    } else {
      setMessage("Your vote has been recorded!");
      setHasVoted(true);
    }
    setSubmitting(false);
  }

  if (loading)
    return (
      <div className="flex h-screen items-center justify-center">Loading...</div>
    );

  if (!referendum)
    return (
      <div className="flex h-screen items-center justify-center">Not found</div>
    );

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
      <div className="bg-white shadow-lg rounded-2xl p-6 w-full max-w-md">
        {!isConnected ? (
          <>
            <h1 className="text-xl font-bold text-center mb-4 text-black">
              Connect your Wallet to Vote
            </h1>
            <Wallet className="w-full flex justify-center">
              <ConnectWallet className="flex items-center justify-center space-x-2 px-4 py-3 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition">
                <Avatar className="h-6 w-6" />
                <Name />
              </ConnectWallet>

              <WalletDropdown>
                <Identity className="px-4 pt-3 pb-2" hasCopyAddressOnClick>
                  <Avatar />
                  <Name />
                  <Address />
                  <EthBalance />
                </Identity>
                <WalletDropdownLink
                  icon="wallet"
                  href="https://keys.coinbase.com"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Wallet
                </WalletDropdownLink>
              </WalletDropdown>
            </Wallet>
          </>
        ) : (
          <>
            <h1 className="text-2xl font-bold text-center mb-4 text-black">
              {referendum.question}
            </h1>
            <p className="text-center text-gray-600 mb-6">
              Deadline: {new Date(referendum.deadline).toLocaleString()}
            </p>

            <form className="flex flex-col gap-4">
              {referendum.options?.map((opt, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleVote(opt)}
                  disabled={submitting || hasVoted}
                  className={`w-full px-4 py-2 rounded-lg text-white ${
                    hasVoted
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-blue-600 hover:bg-blue-700"
                  }`}
                >
                  {opt}
                </button>
              ))}
            </form>

            {message && (
              <p className="mt-4 text-center text-sm font-medium text-red-500">{message}</p>
            )}
          </>
        )}
      </div>
    </div>
  );
}
