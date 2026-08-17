import { NextRequest, NextResponse } from "next/server";

/**
 * RCO-20 — Garde d'authentification (Proxy Next.js 16).
 *
 * Vérifie la présence du cookie `token` (httponly, posé par POST /api/login).
 * Redirige vers / (page de login) si absent sur les routes protégées.
 *
 * Optimistic check : on ne valide pas le token ici (pas d'accès DB en proxy),
 * les endpoints backend font la vérification sécurisée (401 si token invalide).
 */

const PUBLIC_ROUTES = ["/"];

function isPublicRoute(pathname: string): boolean {
  return PUBLIC_ROUTES.includes(pathname);
}

export default async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const token = req.cookies.get("token")?.value;

  // Route publique (login) + utilisateur déjà authentifié → redirige vers /my_center
  if (isPublicRoute(pathname) && token) {
    return NextResponse.redirect(new URL("/my_center", req.nextUrl));
  }

  // Route protégée + pas de token → redirige vers / (login)
  if (!isPublicRoute(pathname) && !token) {
    return NextResponse.redirect(new URL("/", req.nextUrl));
  }

  return NextResponse.next();
}

// Le proxy s'exécute sur toutes les routes sauf les assets statiques et l'API
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\..*).*)"],
};