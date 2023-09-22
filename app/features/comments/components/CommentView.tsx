import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { User } from "@prisma/client";
import { AvatarFallback } from "@radix-ui/react-avatar";
import { Link } from "@remix-run/react";

interface CommentViewProps {
  comments: CommentType[];
}

export function CommentView({ comments }: CommentViewProps) {
  return (
    <div className="my-10 w-3/4">
      <h1 className="pb-3 text-xl font-semibold text-foreground">Comments</h1>
      <Separator />
      <p className="pt-2 text-sm text-foreground/70">Comments from other gamers..</p>
      {comments.map((comment) => (
        <Comment comment={comment} key={comment.id} />
      ))}
    </div>
  );
}

export interface CommentType {
  id: number;
  user: {
    name: string;
    title: string;
    imageUrl: string;
  };
  title?: string;
  body: string;
}

interface CommentProps {
  comment: CommentType;
}

export function Comment({ comment }: CommentProps) {
  return (
    <div className="m-2 flex flex-row gap-2 rounded-md border p-2">
      <Avatar>
        <AvatarImage src={comment.user.imageUrl} />
        <AvatarFallback>AR</AvatarFallback>
      </Avatar>
      <div>
        <h1 className="mb-4 font-semibold">
          <Link
            className="text-primary hover:bg-background-hover hover:underline"
            to={"/"}
          >
            {comment.user.name}
          </Link>
          <span>{": "}</span>
          {comment.user.title}
          <Separator />
        </h1>
        <p className="text-sm">{comment.body}</p>
      </div>
    </div>
  );
}
