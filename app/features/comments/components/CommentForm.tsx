import { Button } from "@/components/ui/button";
import { TextArea } from "@/components/ui/form";
import { useFetcher } from "@remix-run/react";

interface CommentFormProps {
  userId: string;
  playlistId: number;
}

export function CommentForm({ playlistId, userId }: CommentFormProps) {
  const fetcher = useFetcher()
  return (
    <fetcher.Form
      action={`/playlists/${playlistId}/comments`}
      method="post"
      className="mx-auto flex w-4/5 flex-col gap-3"
    >
      <input type="hidden" value={userId} name="userId" />
      <TextArea name="body" placeholder="Leave a comment.." />
      <Button>Send</Button>
    </fetcher.Form>
  );
}
