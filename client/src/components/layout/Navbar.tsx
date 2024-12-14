import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useSupabaseSession, supabase } from "@/lib/supabase";
import { AuthModal } from "../auth/AuthModal";

export function Navbar() {
  const session = useSupabaseSession();
  const [_, setLocation] = useLocation();

  return (
    <nav className="border-b">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold">
          BlogApp
        </Link>

        <div className="flex items-center gap-4">
          {session ? (
            <>
              <Link href="/write">
                <Button>Write Post</Button>
              </Link>
              <DropdownMenu>
                <DropdownMenuTrigger>
                  <Avatar>
                    <AvatarImage src={session.user.user_metadata.avatar_url} />
                    <AvatarFallback>
                      {session.user.user_metadata.name?.[0]}
                    </AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <Link href="/profile">
                    <DropdownMenuItem>Profile</DropdownMenuItem>
                  </Link>
                  <Link href="/settings">
                    <DropdownMenuItem>Settings</DropdownMenuItem>
                  </Link>
                  <DropdownMenuItem onClick={async () => {
                    await supabase.auth.signOut();
                    setLocation("/");
                  }}>
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <AuthModal />
          )}
        </div>
      </div>
    </nav>
  );
}
