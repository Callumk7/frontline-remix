-- CreateTable
CREATE TABLE "PlaylistTag" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PlaylistTag_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TagsOnPlaylists" (
    "playlistId" INTEGER NOT NULL,
    "tagId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TagsOnPlaylists_pkey" PRIMARY KEY ("playlistId","tagId")
);

-- AddForeignKey
ALTER TABLE "TagsOnPlaylists" ADD CONSTRAINT "TagsOnPlaylists_playlistId_fkey" FOREIGN KEY ("playlistId") REFERENCES "Playlist"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TagsOnPlaylists" ADD CONSTRAINT "TagsOnPlaylists_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES "PlaylistTag"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
