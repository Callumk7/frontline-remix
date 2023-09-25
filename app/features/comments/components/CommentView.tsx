import { Separator } from "@/components/ui/separator";
import { Link } from "@remix-run/react";
import { CommentWithAuthor } from "../queries";
import { ProfileLink } from "@/components/navigation/ProfileLink";

interface CommentViewProps {
  comments: CommentWithAuthor[];
}

export function CommentView({ comments }: CommentViewProps) {
  return (
    <div className="my-10 w-full">
      <h1 className="pb-3 text-xl font-semibold text-foreground">Comments</h1>
      <Separator />
      {comments.map((comment) => (
        <CommentEntry comment={comment} key={comment.id} />
      ))}
    </div>
  );
}

interface CommentProps {
  comment: CommentWithAuthor;
}

export function CommentEntry({ comment }: CommentProps) {
  return (
    <div className="m-2 flex w-max flex-col gap-2 rounded-md border p-4">
      <div className="mb-1 flex w-full flex-row items-center justify-between font-semibold">
        <ProfileLink userId={comment.authorId} username={comment.author.username} />
        <p className="text-sm text-foreground/80">{comment.createdAt.toDateString()}</p>
      </div>
      <Separator className="mb-2" />
      <p className="max-w-screen-md text-sm whitespace-pre-wrap">{comment.body}</p>
    </div>
  );
}
