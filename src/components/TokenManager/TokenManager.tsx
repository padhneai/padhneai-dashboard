"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import useSWR from "swr";

import {
  generateToken,
  getAllTokens,
  deleteToken,
} from "@/Firebase/firebaseaction/token.action";
import { getEmailByUid } from "@/Firebase/firebaseaction/auth.action";
import AlertDialogbox from "../customui/AlertDiologbox";
import DataDisplayLoading from "../Loading/DataDisplayLoading";

interface Token {
  value: string;
  createdAt: string;
  usedBy?: string;
  usedemail?: string | null;
}

const TokenManager = ({ tokensWithEmails }: { tokensWithEmails?: Token[] }) => {
  // SWR fetch tokens
  const { data: allTokens, mutate, error } = useSWR("/tokens", getAllTokens);

  // Local state
  const [tokens, setTokens] = useState<Token[]>(tokensWithEmails || []);
  const [tokensLoading, setTokensLoading] = useState(!tokensWithEmails?.length);
  const [loading, setLoading] = useState(false);
  const [generatedToken, setGeneratedToken] = useState<string>("");

  // Enrich tokens with email
  const tokenWithEmail = useCallback(async () => {
    if (!allTokens) return [];

    const enriched = await Promise.all(
      allTokens.map(async (token: any) => {
        const email = token.usedBy ? await getEmailByUid(token.usedBy) : null;
        return { ...token, usedemail: email };
      })
    );
    return enriched;
  }, [allTokens]);

  // Hide the generated token after 10 seconds
  useEffect(() => {
    if (!generatedToken) return;
    const timer = setTimeout(() => setGeneratedToken(""), 10000);
    return () => clearTimeout(timer);
  }, [generatedToken]);

  // Update tokens whenever SWR data changes
  useEffect(() => {
    const fetchAndSetTokens = async () => {
      setTokensLoading(true);
      const enriched = await tokenWithEmail();
      setTokens(enriched);
      setTokensLoading(false);
    };

    if (allTokens) {
      fetchAndSetTokens();
    }
  }, [allTokens, tokenWithEmail]);

  // Generate new token
  const handleGenerateToken = async () => {
    setLoading(true);
    try {
      const tokenValue = await generateToken(4);
      setGeneratedToken(tokenValue);
      mutate(); // revalidate SWR
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Delete token
  const handleDeleteToken = async (tokenValue: string) => {
    try {
      await deleteToken(tokenValue);
      setTokens((prev) => prev.filter((t) => t.value !== tokenValue));
      mutate(); // revalidate SWR
    } catch (err) {
      console.error("Failed to delete token:", err);
    }
  };

  // === RENDER LOGIC ===
  if (tokensLoading) {
    return (
      <div className="p-6 bg-white rounded-xl shadow-md max-w-4xl mx-auto mt-6">
        <DataDisplayLoading count={5} />
      </div>
    );
  }

  return (
    <div className="p-6 bg-white rounded-xl shadow-md max-w-4xl mx-auto mt-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Token Manager</h2>
        <Button
          onClick={handleGenerateToken}
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700"
        >
          {loading ? "Generating..." : "Generate Token"}
        </Button>
      </div>

      {generatedToken && (
        <div className="mb-4 p-4 bg-green-50 border border-green-300 rounded">
          <p className="text-green-700 font-semibold">
            New Token: <span className="font-mono">{generatedToken}</span>
          </p>
        </div>
      )}

      <h3 className="text-lg font-medium mb-2">Token History</h3>

      {tokens.length === 0 ? (
        <p className="text-gray-500">No tokens available.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 border">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">
                  Token
                </th>
                <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">
                  Created At
                </th>
                <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">
                  Used By
                </th>
                <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">
                  Status
                </th>
                <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {tokens.map((t) => (
                <tr key={t.value}>
                  <td className="px-4 py-2 font-mono text-gray-800">{t.value}</td>
                  <td className="px-4 py-2 text-gray-600">
                    {new Date(t.createdAt).toLocaleString()}
                  </td>
                  <td className="px-4 py-2 text-gray-600">{t.usedemail || "-"}</td>
                  <td className="px-4 py-2">
                    {t.usedBy ? (
                      <span className="text-sm text-red-600 font-semibold">Used</span>
                    ) : (
                      <span className="text-sm text-green-600 font-semibold">Unused</span>
                    )}
                  </td>
                  <td className="px-4 py-2">
                    <AlertDialogbox
                      trigger={
                        <Button variant="destructive" size="sm">
                          Delete
                        </Button>
                      }
                      title="Delete Token"
                      description={`Are you sure you want to delete token ${t.value}?`}
                      cancelText="Cancel"
                      actionText="Delete"
                      onAction={() => handleDeleteToken(t.value)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default TokenManager;
