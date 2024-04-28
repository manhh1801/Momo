"use client"

import {cn} from "@/libs/utils";
import {FC, useState} from "react";
import {Button} from "@/components/ui/Button";
import {signIn} from "next-auth/react"
import {Icons} from "@/components/Icons";
import {useToast} from "@/hooks/use-toast";

interface UserAuthFormProps extends React.HTMLAttributes<HTMLDivElement> {}

const UserAuthForm: FC<UserAuthFormProps> = ({className, ...props}) => {

    const [IsLoading, setIsLoading] = useState<boolean>(false)
    const {toast} = useToast()

    const loginGoogle = async () => {
        setIsLoading(true)
        try {
            await signIn("google")
        }
        catch(error) {
            toast({
                    title: "There was a problem.",
                    description: "There was an error logging in with Google",
                    variant: "destructive"
                }
            )
        }
        finally {
            setIsLoading(true)
        }
    }


    return (
        <div className={cn("flex justify-center", className)} {...props}>
            <Button onClick={loginGoogle} isLoading={IsLoading} size="sm" className="w-full">
                {IsLoading ? null : <Icons.google className="h-4 w-4 mr-2"/>}
                Google
            </Button>
        </div>
    );
}

export default UserAuthForm
