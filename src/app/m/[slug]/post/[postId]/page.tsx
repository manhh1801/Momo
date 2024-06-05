import {redis} from "@/lib/redis";
import {CachedPost} from "@/types/redis";
import {Post, User, Vote} from "@prisma/client";
import {db} from "@/lib/db";
import {notFound} from "next/navigation";
import {Suspense} from "react";
import {buttonVariants} from "@/components/ui/Button";
import {ArrowBigUp, Loader2} from "lucide-react";
import PostVoteServer from "@/components/post-vote/PostVoteServer";
import {formatTimeToNow} from "@/lib/utils";
import EditorOutput from "@/components/EditorOutput";
import CommentsSection from "@/components/CommentsSection";

interface PageProps {
    params: {
        postId: string
    }
}

export const dynamic = "force-dynamic"
export const fetchCache = "force-no-store"

const Page = async ({params}: PageProps) => {
    const cachedPost = (await redis.hgetall(`post: ${params.postId}`)) as CachedPost

    let post: Post & {votes: Vote[]; author: User} | null = null

    if(!cachedPost) {
        post = await db.post.findFirst({
            where: {
                id: params.postId
            },
            include: {
                votes: true,
                author: true
            }
        })
    }

    if(!post && !cachedPost) return notFound()

    return (
        <div>
            <div className="h-full flex flex-col sm:flex-row items-center sm:items-start justify-between">
                <Suspense fallback={<PostVoteShell/>}>
                    <PostVoteServer postId={post?.id ?? cachedPost.id} getData={async () => {
                        return db.post.findUnique({
                            where: {
                                id: params.postId
                            },
                            include: {
                                votes: true
                            }
                        })
                    }}/>
                </Suspense>
                <div className="sm:w-0 w-full flex-1 bg-white p-4 rounded-sm">
                    <p className="max-h-40 mt-1 truncate text-xs text-gray-500">
                        Posted by u/{post?.author.username ?? cachedPost.authorUsername}{" "}{formatTimeToNow(new Date(post?.createdAt ?? cachedPost.createdAt))}
                    </p>
                    <h1 className="text-xl font-semibold py-2 leading-6 text-gray-900">
                        {post?.title ?? cachedPost.title}
                    </h1>
                    <EditorOutput content={post?.content ?? cachedPost.content}/>
                    <Suspense fallback={<Loader2 className="h-5 w-5 animate-spin text-zinc-500"/>}>
                        <CommentsSection postId={post?.id ?? cachedPost.id}/>
                    </Suspense>
                </div>
            </div>
        </div>
    )
}

function PostVoteShell() {
    return <div className="flex items-center flex-col pr-6 w-20">
        <div className={buttonVariants({variant: "ghost"})}>
            <ArrowBigUp className="h-5 w-5 text-zinc-700"/>
            <div className="text-center py-2 font-medium text-sm text-zinc-900">
                <Loader2 className="h-3 w-3 animate-spin"/>
            </div>
            <div className="text-center py-2 font-medium text-sm text-zinc-900">
                <Loader2 className="h-3 w-3 animate-spin"/>
            </div>
        </div>
    </div>
}

export default Page