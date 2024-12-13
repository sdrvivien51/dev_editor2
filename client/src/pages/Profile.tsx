import { useQuery } from "@tanstack/react-query";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { PostCard } from "@/components/post/PostCard";

export default function Profile() {
  const { data: user } = useQuery({
    queryKey: ["/api/profile"],
  });

  const { data: posts } = useQuery({
    queryKey: ["/api/posts/user"],
  });

  return (
    <div className="space-y-8">
      <Card className="p-6">
        <div className="flex items-center gap-4">
          <Avatar className="h-20 w-20">
            <AvatarImage src={user?.avatar_url} />
            <AvatarFallback>{user?.name?.[0]}</AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-2xl font-bold">{user?.name}</h1>
            <p className="text-muted-foreground">{user?.bio}</p>
          </div>
        </div>
      </Card>

      <div>
        <h2 className="text-xl font-semibold mb-4">My Posts</h2>
        <div className="grid gap-6 md:grid-cols-2">
          {posts?.map((post: any) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      </div>
    </div>
  );
}
