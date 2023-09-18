import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/form";
import { Form } from "@remix-run/react";

export function AddPlaylistForm({ userId }: { userId: string }) {
  return (
    // NOTE: This might need to change to a fetcher, if we don't want to always navigate to a
    // different page
    <Form
      method="post"
      action="/playlists"
      className="flex flex-row items-center space-x-3"
    >
      <Input type="text" name="playlistName" placeholder="Best RPGs ever.." />
      <input type="hidden" name="userId" value={userId} />
      <Button variant={"outline"} size={"sm"}>
        add
      </Button>
    </Form>
  );
}
