import { useState, useEffect } from "react";

export function SocialPopupPage() {
  const params = new URLSearchParams(window.location.search);
  const provider = params.get("provider") || "google";
  
  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
  const facebookClientId = import.meta.env.VITE_FACEBOOK_CLIENT_ID;
  const appleClientId = import.meta.env.VITE_APPLE_CLIENT_ID;

  const [googleInitialized, setGoogleInitialized] = useState(false);
  const [error, setError] = useState("");

  // 1. OAUTH CALLBACK PARSING (Handles redirects back from Facebook/Apple)
  useEffect(() => {
    const hash = window.location.hash;
    const search = window.location.search;
    
    let parsedToken = null;
    let parsedEmail = null;
    let parsedName = null;
    
    if (hash) {
      const hashParams = new URLSearchParams(hash.substring(1));
      parsedToken = hashParams.get("access_token") || hashParams.get("id_token");
    }
    
    if (!parsedToken && search) {
      const searchParams = new URLSearchParams(search);
      parsedToken = searchParams.get("code") || searchParams.get("token") || searchParams.get("credential");
      parsedEmail = searchParams.get("email");
      parsedName = searchParams.get("name");
    }
    
    if (parsedToken) {
      if (window.opener) {
        window.opener.postMessage(
          {
            type: "social-auth-success",
            payload: {
              provider,
              token: parsedToken,
              email: parsedEmail,
              name: parsedName
            }
          },
          window.location.origin
        );
        window.close();
      }
    }
  }, [provider]);

  // 2. GOOGLE LOGIN SCRIPT LOADING
  useEffect(() => {
    if (provider === "google" && googleClientId) {
      const script = document.createElement("script");
      script.src = "https://accounts.google.com/gsi/client";
      script.async = true;
      script.defer = true;
      script.onload = () => {
        if (window.google?.accounts?.id) {
          window.google.accounts.id.initialize({
            client_id: googleClientId,
            callback: (response) => {
              if (window.opener) {
                window.opener.postMessage(
                  {
                    type: "social-auth-success",
                    payload: {
                      provider: "google",
                      token: response.credential
                    }
                  },
                  window.location.origin
                );
                window.close();
              }
            }
          });
          setGoogleInitialized(true);
          window.google.accounts.id.prompt();
          
          setTimeout(() => {
            const btnEl = document.getElementById("real-google-btn-container");
            if (btnEl) {
              window.google.accounts.id.renderButton(btnEl, {
                theme: "outline",
                size: "large",
                width: 250
              });
            }
          }, 100);
        }
      };
      document.body.appendChild(script);
    }
  }, [provider, googleClientId]);

  // 3. FACEBOOK REDIRECT INITIATION
  useEffect(() => {
    if (provider === "facebook" && facebookClientId) {
      const redirectUri = encodeURIComponent(`${window.location.origin}/social-popup?provider=facebook`);
      window.location.href = `https://www.facebook.com/v12.0/dialog/oauth?client_id=${facebookClientId}&redirect_uri=${redirectUri}&response_type=token&scope=email,public_profile`;
    }
  }, [provider, facebookClientId]);

  // 4. APPLE REDIRECT INITIATION
  useEffect(() => {
    if (provider === "apple" && appleClientId) {
      const redirectUri = encodeURIComponent(`${window.location.origin}/social-popup?provider=apple`);
      window.location.href = `https://appleid.apple.com/auth/authorize?client_id=${appleClientId}&redirect_uri=${redirectUri}&response_type=code%20id_token&scope=name%20email&response_mode=fragment`;
    }
  }, [provider, appleClientId]);

  // Helper template for missing credentials
  const renderConfigMissing = (title, variableName, docUrl) => {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 font-sans">
        <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-lg border border-slate-200/60 text-center flex flex-col items-center gap-6">
          <div className="p-4 bg-red-50 text-brand-red rounded-full">
            <svg className="h-10 w-10 stroke-current" fill="none" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <div>
            <h1 className="text-xl font-black text-brand-ink uppercase font-headline tracking-wide">{title} Configuration Required</h1>
            <p className="text-sm text-slate-500 mt-3 leading-relaxed">
              Real social authentication requires environment variables to link with the developer platform.
            </p>
            <div className="mt-4 p-3 bg-slate-50 border border-slate-200 text-left rounded font-mono text-xs">
              <span className="text-slate-400 font-bold"># Add to frontend/.env</span>
              <br />
              <span className="text-brand-ink font-semibold">{variableName}=your_client_id</span>
            </div>
          </div>
          <button
            onClick={() => window.close()}
            className="w-full py-3 bg-brand-ink text-white font-headline text-sm font-bold uppercase tracking-wider hover:bg-black transition-colors rounded-none"
          >
            Close Window
          </button>
        </div>
      </div>
    );
  };

  // Google view
  if (provider === "google") {
    if (!googleClientId) {
      return renderConfigMissing("Google Sign-In", "VITE_GOOGLE_CLIENT_ID");
    }
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 font-sans">
        <div className="w-full max-w-sm bg-white p-8 rounded-xl shadow-lg border border-slate-100 text-center flex flex-col items-center gap-6">
          <svg className="h-10 w-10" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
          </svg>
          <div>
            <h1 className="text-xl font-bold text-slate-800">Sign in with Google</h1>
            <p className="text-sm text-slate-500 mt-1">Connecting to your Google Account securely</p>
          </div>
          
          <div id="real-google-btn-container" className="my-4"></div>
          
          {!googleInitialized && (
            <div className="w-8 h-8 border-4 border-slate-200 border-t-blue-600 rounded-full animate-spin"></div>
          )}
        </div>
      </div>
    );
  }

  // Facebook view
  if (provider === "facebook") {
    if (!facebookClientId) {
      return renderConfigMissing("Facebook OAuth", "VITE_FACEBOOK_CLIENT_ID");
    }
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 font-sans">
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="w-12 h-12 border-4 border-slate-200 border-t-[#1877F2] rounded-full animate-spin"></div>
          <p className="text-sm font-semibold text-slate-600">Redirecting to Facebook Auth...</p>
        </div>
      </div>
    );
  }

  // Apple view
  if (provider === "apple") {
    if (!appleClientId) {
      return renderConfigMissing("Apple Sign-In", "VITE_APPLE_CLIENT_ID");
    }
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 font-sans">
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="w-12 h-12 border-4 border-zinc-800 border-t-white rounded-full animate-spin"></div>
          <p className="text-sm font-semibold text-zinc-600">Redirecting to Apple ID Auth...</p>
        </div>
      </div>
    );
  }

  return null;
}
