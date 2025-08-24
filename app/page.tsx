/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

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
import { useAccount } from "wagmi";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const { address, isConnected } = useAccount();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const createUser = async () => {
      if (!address) return;
      setLoading(true);
      setError(null);

      try {
        const res = await fetch("/api/user", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: address }),
        });

        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.message || "Failed to create user");
        }

        router.push("/referendum");
      } catch (err: any) {
        console.error("Error creating user:", err);
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    if (isConnected && address) {
      createUser();
    }
  }, [isConnected, address, router]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-r from-blue-500 to-indigo-600">
      <div className="bg-white shadow-2xl rounded-2xl p-8 w-full max-w-md text-center">
        <h1 className="text-2xl font-bold mb-6 text-gray-800">
          Login with Wallet
        </h1>
        <p className="text-gray-600 mb-6">
          Connect your crypto wallet to continue
        </p>

        {loading ? (
          <p className="text-blue-600 font-medium">Finding your account...</p>
        ) : (
          <div className="flex justify-center">
            <Wallet className="w-full flex justify-center">
              <ConnectWallet className="flex items-center justify-center space-x-2 px-4 py-5 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition">
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
          </div>
        )}

        {error && (
          <p className="mt-4 text-red-600 font-medium">{error}</p>
        )}
      </div>
    </div>
  );
}
