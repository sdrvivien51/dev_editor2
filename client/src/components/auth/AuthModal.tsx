import { useState } from "react";
import { Dialog, DialogContent, DialogTrigger, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { useLocation } from "wouter";

export function AuthModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState("");
  const { toast } = useToast();
  const [, setLocation] = useLocation();

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
          data: {
            name: email.split('@')[0],
          },
        },
      });
      if (error) throw error;
      toast({
        title: "Check your email",
        description: "We sent you a login link",
      });
      setIsOpen(false);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Sign In</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogTitle>Sign in to your account</DialogTitle>
        <form onSubmit={handleSignIn} className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Enter your email to receive a magic link for signing in.
          </p>
          <Input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Button type="submit" className="w-full">
            Send Magic Link
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
