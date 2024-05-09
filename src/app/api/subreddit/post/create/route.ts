import { getAuthSession } from '@/lib/auth'
import { db } from '@/lib/db'
import { z } from 'zod'
import {PostValidator} from "@/lib/validators/post";

export async function POST(req: Request) {
    try {
        const session = await getAuthSession()

        if (!session?.user) {
            return new Response("Unauthorized", { status: 401 })
        }

        const body = await req.json()
        const { subredditId, title, content } = PostValidator.parse(body)

        // check if user has already subscribed to subreddit
        const subscriptionExists = await db.subscription.findFirst({
            where: {
                subredditId,
                userId: session.user.id
            },
        })

        if (!subscriptionExists) {
            return new Response("You need to subscribe to this community to post", {
                status: 400
            })
        }

        // create subreddit and associate it with the user
        await db.post.create({
            data: {
                title,
                content,
                authorId: session.user.id,
                subredditId
            },
        })

        return new Response("OK")
    }
    catch (error) {
        if (error instanceof z.ZodError) {
            return new Response(error.message, { status: 422 })
        }

        return new Response(
            "Could not post to community at this time",
            { status: 500 }
        )
    }
}