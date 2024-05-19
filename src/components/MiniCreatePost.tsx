"use client"

import {FC} from "react"
import {Session} from "next-auth";
import {usePathname, useRouter} from "next/navigation";
import UserAvatar from "@/components/UserAvatar";
import {Input} from "@/components/ui/Input";
import {Button} from "@/components/ui/Button";
import {ImageIcon, Link2} from "lucide-react";

interface MiniCreatePostProps {
    session: Session | null
}

const MiniCreatePost:FC<MiniCreatePostProps> = ({session}) => {
    const router = useRouter()
    const pathname = usePathname()

    return (
        <div className="overflow-hidden rounded-md bg-white shadow">
            <div className="h-full px-4 py-6 flex justify-between gap-6">
                <div className="relative">
                    <UserAvatar user={{
                        name: session?.user.name || null,
                        image: session?.user.image || null
                    }}/>
                    <span className="absolute bottom-0 right-0 rounded-full w-3 h-3 bg-green-500 outline outline-2 outline-white"/>
                </div>
                <Input readOnly onClick={() => {
                    router.push(pathname + "/submit")
                    router.refresh()
                }}/>
                <Button variant="ghost" onClick={() => {
                    router.push(pathname + "/submit")
                    router.refresh()
                }}>
                    <ImageIcon className="text-zinc-600"/>
                </Button>
                <Button variant="ghost" onClick={() => {
                    router.push(pathname + "/submit")
                    router.refresh()
                }}>
                    <Link2 className="text-zinc-600"/>
                </Button>

            </div>
        </div>
    )
}

export default MiniCreatePost