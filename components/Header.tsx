"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { createClient } from "../util/supabase/client";

export default function Header() {
  const [supabase] = useState(() => createClient());
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);

  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "signup">("login");
  const [authEmail, setAuthEmail] = useState("");
  const [authPassword, setAuthPassword] = useState("");
  const [authError, setAuthError] = useState<string | null>(null);
  const [authSubmitting, setAuthSubmitting] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const loadSession = async () => {
      setAuthLoading(true);
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (!isMounted) return;
        setUser(user ?? null);

        if (user) {
          const { data: profile } = await supabase
            .from("profiles")
            .select("is_admin")
            .eq("id", user.id)
            .single();
          if (!isMounted) return;
          setIsAdmin(Boolean(profile?.is_admin));
        } else {
          setIsAdmin(false);
        }
      } finally {
        if (isMounted) setAuthLoading(false);
      }
    };

    loadSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        supabase
          .from("profiles")
          .select("is_admin")
          .eq("id", session.user.id)
          .single()
          .then(({ data }) => {
            setIsAdmin(Boolean(data?.is_admin));
          })
          .catch(() => {
            setIsAdmin(false);
          });
      } else {
        setIsAdmin(false);
      }
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, [supabase]);

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    setAuthSubmitting(true);
    try {
      if (authMode === "login") {
        const { error } = await supabase.auth.signInWithPassword({
          email: authEmail,
          password: authPassword,
        });
        if (error) {
          setAuthError(error.message);
          return;
        }
        setShowAuthModal(false);
      } else {
        const { error } = await supabase.auth.signUp({
          email: authEmail,
          password: authPassword,
        });
        if (error) {
          setAuthError(error.message);
          return;
        }
        setAuthError(
          "Compte créé. Vérifiez votre boîte courriel pour confirmer votre adresse."
        );
      }
    } finally {
      setAuthSubmitting(false);
    }
  };

  const handleGoogleLogin = async () => {
    setAuthError(null);
    try {
      await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: typeof window !== "undefined" ? window.location.href : undefined,
        },
      });
    } catch (err: any) {
      setAuthError(err?.message ?? "Erreur lors de la connexion avec Google.");
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  return (
    <>
      <header className="re-header">
        <div className="re-container re-header-inner">
          <div className="re-logo">
            <Link href="/" className="re-logo-link">
              <span className="re-logo-mark">RE</span>
              <span className="re-logo-text">
                <span className="re-logo-title">Ressources Entrepreneurs</span>
                <span className="re-logo-subtitle">
                  Répertoire d'accompagnement
                </span>
              </span>
            </Link>
          </div>
          <nav className="re-nav">
            <div className="re-nav-auth">
              {!authLoading && !user && (
                <button
                  type="button"
                  className="re-btn-secondary"
                  onClick={() => {
                    setAuthMode("login");
                    setShowAuthModal(true);
                    setAuthEmail("");
                    setAuthPassword("");
                    setAuthError(null);
                  }}
                >
                  Connexion / inscription
                </button>
              )}
              {!authLoading && user && (
                <div style={{ display: "flex", alignItems: "center", gap: ".75rem" }}>
                  <div className="re-user-pill">
                    <span className="re-user-email">
                      {user.email ?? "Compte"}
                    </span>
                    {isAdmin && (
                      <span className="re-tag re-tag--type" style={{ marginLeft: ".5rem" }}>
                        Admin
                      </span>
                    )}
                  </div>
                  <button
                    type="button"
                    className="re-btn-link"
                    onClick={handleLogout}
                  >
                    Déconnexion
                  </button>
                </div>
              )}
            </div>
          </nav>
        </div>
      </header>

      {showAuthModal && (
        <div className="re-modal">
          <div className="re-modal-backdrop" onClick={() => setShowAuthModal(false)} />
          <div className="re-modal-dialog" role="dialog" aria-modal="true">
            <div className="re-modal-header">
              <h3>{authMode === "login" ? "Connexion" : "Inscription"}</h3>
            </div>
            <div className="re-modal-body">
              <div style={{ display: "flex", flexDirection: "column", gap: ".75rem" }}>
                <button
                  type="button"
                  className="re-btn-secondary"
                  onClick={handleGoogleLogin}
                >
                  Continuer avec Google
                </button>

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: ".75rem",
                    margin: ".5rem 0",
                  }}
                >
                  <div style={{ flex: 1, height: 1, background: "var(--re-border, #e0e0e0)" }} />
                  <span style={{ fontSize: ".85rem", color: "#666" }}>ou</span>
                  <div style={{ flex: 1, height: 1, background: "var(--re-border, #e0e0e0)" }} />
                </div>

                <form onSubmit={handleAuthSubmit}>
                  <label className="re-field-label" htmlFor="auth-email">
                    Courriel
                  </label>
                  <input
                    id="auth-email"
                    type="email"
                    className="re-input"
                    value={authEmail}
                    onChange={(e) => setAuthEmail(e.target.value)}
                    required
                  />

                  <label
                    className="re-field-label"
                    htmlFor="auth-password"
                    style={{ marginTop: ".75rem" }}
                  >
                    Mot de passe
                  </label>
                  <input
                    id="auth-password"
                    type="password"
                    className="re-input"
                    value={authPassword}
                    onChange={(e) => setAuthPassword(e.target.value)}
                    required
                    minLength={6}
                  />

                  {authError && (
                    <p style={{ marginTop: ".75rem", color: "#b00020" }}>{authError}</p>
                  )}

                  <div
                    style={{
                      marginTop: "1rem",
                      display: "flex",
                      flexDirection: "column",
                      gap: ".5rem",
                    }}
                  >
                    <button
                      type="submit"
                      className="re-btn-primary"
                      disabled={authSubmitting}
                    >
                      {authSubmitting
                        ? authMode === "login"
                          ? "Connexion…"
                          : "Inscription…"
                        : authMode === "login"
                          ? "Se connecter"
                          : "Créer un compte"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
            <div className="re-modal-footer" style={{ justifyContent: "space-between" }}>
              <button
                type="button"
                className="re-btn-link"
                onClick={() =>
                  setAuthMode((prev) => (prev === "login" ? "signup" : "login"))
                }
              >
                {authMode === "login"
                  ? "Pas encore de compte ? Inscription"
                  : "Déjà un compte ? Connexion"}
              </button>
              <button
                type="button"
                className="re-btn-link"
                onClick={() => setShowAuthModal(false)}
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

