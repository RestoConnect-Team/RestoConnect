"use client";

import { AuthService } from "@/services/auth.service";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useState } from "react";
import { TriangleAlert, XCircle } from "lucide-react";
import checkEmailFormat from "@/utils/checkEmailFormat";

function ErrorSection({ error }: { error: string }) {
  if (error === "wrong_credentials") {
    return (
      <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm flex gap-3">
        <XCircle className="w-5 h-5" />
        <span>Email ou mot de passe incorrect</span>
      </div>
    );
  } else if (error === "incomplete_email") {
    return (
      <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-amber-700 text-sm flex gap-3">
        <TriangleAlert className="w-5 h-5" />
        <span>Votre adresse mail est incomplète</span>
      </div>
    );
  }
}

export default function Home() {
  const router = useRouter();
  const [email, setEmail] = useState<string>("");
  const [hasEmailError, setHasEmailError] = useState<boolean>(false);
  const [password, setPassword] = useState<string>("");
  const [hasPasswordError, setHasPasswordError] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!checkEmailFormat(email)) {
      setError("incomplete_email");
      setHasEmailError(true);
      return;
    }

    setLoading(true);
    const authService = new AuthService();

    try {
      await authService.login(email, password);
      router.push("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      setHasEmailError(true);
      setHasPasswordError(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <div className="w-full h-full max-w-md flex flex-col justify-center justify-evenly">
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
            Seine-et-Marne (77)
          </p>
        </div>
        {/* Card */}
        <div className="space-y-4 bg-white rounded-2xl shadow-xl p-8">
          {error && <ErrorSection error={error} />}

          <form className="space-y-6" onSubmit={handleLogin}>
            {/* Email Input */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-3">
                Email
              </label>
              <input
                type="text"
                placeholder="utilisateur@email.com"
                value={email}
                onChange={(e) => {
                  setHasEmailError(false);
                  setEmail(e.target.value);
                }}
                required
                className={`w-full px-4 py-3 border-2  rounded-lg text-gray-900 placeholder-gray-400 
                focus:outline-none focus:border-[rgb(230,0,126)] focus:shadow-lg transition-all bg-gray-50 focus:bg-white
                ${hasEmailError ? "border-[rgb(230,0,126)]" : "border-gray-200"}`}
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
                onChange={(e) => {
                  setPassword(e.target.value);
                  setHasPasswordError(false);
                }}
                required
                className={`w-full px-4 py-3 border-2  rounded-lg text-gray-900 placeholder-gray-400 
                focus:outline-none focus:border-[rgb(230,0,126)] focus:shadow-lg transition-all bg-gray-50 focus:bg-white
                ${hasPasswordError ? "border-[rgb(230,0,126)]" : "border-gray-200"}`}
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
                  Connexion...
                </span>
              ) : (
                "Se connecter"
              )}
            </button>
            {/* Footer */}
            <div className="flex w-full items-center justify-center">
              <a
                href=""
                className="font-semibold text-[var(--primary)] text-sm"
              >
                Mot de passe oublié ?
              </a>
            </div>
          </form>
        </div>
        <span className="text-xs text-[#a6a6b9] text-center">
          Accès réservé aux bénévoles Restos du Coeur 77
        </span>
      </div>
    </div>
  );
}
