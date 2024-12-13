import { useEffect } from "react";
import { useLocation } from "wouter";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";

export default function AuthCallback() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // Get the hash fragment from the URL
        const hashParams = new URLSearchParams(
          window.location.hash.substring(1) // Remove the # character
        );
        
        const accessToken = hashParams.get("access_token");
        const refreshToken = hashParams.get("refresh_token");
        
        if (!accessToken) throw new Error("No access token found");

        // Set the session with the tokens
        const { data: { session }, error: sessionError } = await supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken || "",
        });

        if (sessionError) throw sessionError;

        if (session?.user) {
          // Create or update user in our database and establish session
          const response = await fetch("/api/auth/callback", {
            method: "POST",
            headers: { 
              "Content-Type": "application/json",
              "Authorization": `Bearer ${accessToken}`
            },
            body: JSON.stringify({
              id: session.user.id,
              email: session.user.email,
              name: session.user.user_metadata.name || session.user.email?.split("@")[0] || "Anonymous",
            }),
          });

          if (!response.ok) {
            throw new Error("Failed to create user profile");
          }

          toast({
            title: "Welcome!",
            description: "You have successfully signed in.",
          });
          
          // Redirect to home page after a short delay
          setTimeout(() => setLocation("/"), 1000);
        } else {
          throw new Error("No session found");
        }
      } catch (error: any) {
        console.error("Auth callback error:", error);
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
        setLocation("/");
      }
    };

    handleAuthCallback();
  }, [setLocation, toast]);

  return (
    <div className="flex items-center justify-center min-h-[50vh]">
      <div className="text-center">
        <h2 className="text-lg font-semibold">Completing sign in...</h2>
        <p className="text-muted-foreground">Please wait while we set up your account.</p>
      </div>
    </div>
  );
}
