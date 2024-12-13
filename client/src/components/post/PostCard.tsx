import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { format } from "date-fns";

interface PostCardProps {
  post: {
    title: string;
    content: string;
    cover_image: string;
    created_at: string;
    author: {
      name: string;
      avatar_url: string;
    };
  };
}

export function PostCard({ post }: PostCardProps) {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      {post.cover_image && (
        <img
          src={post.cover_image}
          alt={post.title}
          className="w-full h-48 object-cover"
        />
      )}
      <CardHeader>
        <div className="flex items-center gap-2 mb-2">
          <Avatar className="h-8 w-8">
            <AvatarImage src={post.author.avatar_url} />
            <AvatarFallback>{post.author.name[0]}</AvatarFallback>
          </Avatar>
          <div className="text-sm">
            <p className="font-medium">{post.author.name}</p>
            <p className="text-muted-foreground">
              {format(new Date(post.created_at), "MMM d, yyyy")}
            </p>
          </div>
        </div>
        <h3 className="text-xl font-bold">{post.title}</h3>
      </CardHeader>
      <CardContent>
        <div
          className="line-clamp-3 text-muted-foreground"
          dangerouslySetInnerHTML={{
            __html: JSON.parse(post.content).blocks[0]?.data?.text || "",
          }}
        />
      </CardContent>
    </Card>
  );
}
