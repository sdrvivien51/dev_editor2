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
        const { data: { user }, error } = await supabase.auth.getUser();
        if (error) throw error;

        if (user) {
          // Create or update user in our database
          const response = await fetch("/api/users", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              id: user.id,
              email: user.email,
              name: user.user_metadata.name || user.email?.split("@")[0] || "Anonymous",
            }),
          });

          if (!response.ok) {
            throw new Error("Failed to create user profile");
          }

          toast({
            title: "Welcome!",
            description: "You have successfully signed in.",
          });
        }

        // Redirect to home page
        setLocation("/");
      } catch (error: any) {
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
