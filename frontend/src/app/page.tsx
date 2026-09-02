"use client";

import { AuthService } from "@/services/auth.service";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useState } from "react";

export default function Home() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const authService = new AuthService();

    try {
      await authService.login(email, password);
      router.push("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <div className="w-full h-full max-w-md flex flex-col gap-10 justify-center">
        {/* Logo Section */}
        <div className="text-center flex flex-col items-center gap-2">
          <Image
            src="/Restos_du_coeur_Logo.svg"
            alt="Restos du Coeur"
            width={100}
            height={100}
            className="w-auto object-contain"
            priority
          />
          <h1 className="text-4xl font-bold text-gray-900">RestoConnect</h1>
          <p className="text-gray-600 text-base leading-relaxed">
            Connexion à votre espace
          </p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm flex gap-3">
              <span className="text-lg">⚠️</span>
              <span>{error}</span>
            </div>
          )}

          <form className="space-y-6" onSubmit={handleLogin}>
            {/* Email Input */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-3">
                Email
              </label>
              <input
                type="email"
                placeholder="utilisateur@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[rgb(230,0,126)] focus:shadow-lg transition-all bg-gray-50 focus:bg-white"
              />
            </div>

            {/* Password Input */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-3">
                Mot de passe
              </label>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[rgb(230,0,126)] focus:shadow-lg transition-all bg-gray-50 focus:bg-white"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="cursor-pointer w-full py-3 px-4 bg-gradient-to-r from-[rgb(230,0,126)] to-[rgb(240,51,127)] text-white font-semibold rounded-lg hover:shadow-lg transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed active:scale-95"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="animate-spin">⏳</span>
                  Connexion...
                </span>
              ) : (
                "Se connecter"
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-8 pt-6 border-t border-gray-100 text-center text-sm text-gray-500">
            Des questions? Contactez le support
          </div>
        </div>
      </div>
    </div>
  );
}
