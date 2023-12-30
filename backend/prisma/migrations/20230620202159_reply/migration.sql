-- CreateTable
CREATE TABLE "ReplyLikes" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "replyId" TEXT NOT NULL,
    "postId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ReplyLikes_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ReplyLikes" ADD CONSTRAINT "ReplyLikes_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReplyLikes" ADD CONSTRAINT "ReplyLikes_replyId_fkey" FOREIGN KEY ("replyId") REFERENCES "Reply"("id") ON DELETE CASCADE ON UPDATE CASCADE;
