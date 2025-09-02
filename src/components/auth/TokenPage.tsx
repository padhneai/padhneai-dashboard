"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { verifyToken } from "@/Firebase/firebaseaction/token.action";
import { toast } from "sonner";

const TokenPage = ({ uid }: { uid: string }) => {
  const [token, setToken] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleVerify = async () => {
    if (!token) return;

    setLoading(true);
    setError(null);

    try {
      const isValid = await verifyToken(token, uid);
      if (isValid) {
        toast.success("Successfully Token Verified")
        router.push("/");
      } else {
        setError("❌ Invalid or expired token. Please contact admin.");
      }
    } catch (err) {
      console.error(err);
      setError("⚠️ Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-gray-100">
      <div className="p-8 bg-gray-800 rounded-2xl shadow-lg w-full max-w-md space-y-6">
        {/* Header Block */}
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-bold">🔑 Verify Your Token</h2>
          <p className="text-sm text-gray-400">
            Enter the token provided by the admin to access the system.
          </p>
        </div>

        {/* Input Block */}
        <div className="space-y-3">
          <label className="block text-sm font-medium text-gray-300">
            Token
          </label>
          <input
            type="text"
            value={token}
            onChange={(e) => setToken(e.target.value.toUpperCase())}
            placeholder="Enter your token"
            className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-100 placeholder-gray-500"
          />
          {error && <p className="text-red-400 text-sm">{error}</p>}
        </div>

        {/* Action Block */}
        <div>
          <Button
            onClick={handleVerify}
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
          >
            {loading ? "Verifying..." : "Verify Token"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TokenPage;
