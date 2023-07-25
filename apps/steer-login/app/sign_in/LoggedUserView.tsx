import Button from "@/components/Button";
import type { Config, User } from "@/utils/types";
import type { OAuthCredential, UserCredential } from "firebase/auth";
import { useQuery } from "react-query";
import LoggedUserSubview from "./LoggedUserSubview";
import { useEffect } from "react";

export type LoginState = {
    credential: OAuthCredential;
    result: UserCredential;
    provider: string;
}

type LoggedUserViewProps = {
    onOpenApp: () => void;
    userData: UserCredential['user'];
    showPremiumBanner?: boolean;
};


function createNewUser(uid: string, email: string) {
    return fetch('https://sidekick-370118.uc.r.appspot.com/user/', {
        method: "POST",
        body: JSON.stringify({
            uid,
            email,
            firebase_auth_uid: uid
        }),
        headers: {
            "content-type": "application/json"
        }
    }).then(r => {
        if (!r.ok) {
            console.error(`Failed to fetch user by id: ${uid}`, r.status)
            return null
        }
        return r.json()
    })
    .catch(e => {
        console.error("Failed to create new user", e)
        return null
    }) as Promise<User | null>
}

// @ts-ignore
async function fetchUserByID({ queryKey }) {
    const [_key, { uid, email }] = queryKey
    const user = await fetch(`https://sidekick-370118.uc.r.appspot.com/user/${uid}`)
        .then(r => {
            if (!r.ok) {
                console.error(`Failed to fetch user by id: ${uid}`, r.status)
                return null
            }
            return r.json()
        })
        .catch((e) => {
            console.log(e);
            return null
        }) as Promise<User | null>

    if (user === null) {
        console.warn("user does not exist, create new user")
        return createNewUser(uid, email)
    }

    return user;
}

function fetchConfig() {
    return fetch('https://sidekick-370118.uc.r.appspot.com/stripe/config')
        .then(r => r.json()) as Promise<Config>
}


export default function LoggedUserView({ onOpenApp, userData, showPremiumBanner=true }: LoggedUserViewProps) {
    const config = useQuery('config', fetchConfig)
    const user = useQuery(['user', { uid: userData.uid, email: userData.email }], fetchUserByID)
    const isPremium = user.data?.tier === 'premium' 

    useEffect(() => {
        if (isPremium || !showPremiumBanner) setTimeout(onOpenApp, 500)
    }, [isPremium, showPremiumBanner])



    return (
        <div className="flex flex-col items-center justify-center gap-6">

            <h1 className="text-3xl font-bold text-center text-content-primary">
                Welcome to Steer
            </h1>

            {user.data?.uid && config.data && showPremiumBanner 
                ?
                <LoggedUserSubview user={user.data} config={config.data}>
                    <>
                        <p className="text-content-secondary text-center">
                            Please continue to the app by clicking this button
                        </p>

                        <Button
                            onClick={async () => {
                                onOpenApp()
                                return true;
                            }}
                            variant='primary'
                        >
                            Open App
                        </Button>
                    </>
                </LoggedUserSubview>
                : <>
                    <p className="text-content-secondary text-center">
                        Please continue to the app by clicking this button
                    </p>

                    <Button
                        onClick={async () => {
                            onOpenApp()
                            return true;
                        }}
                        variant='primary'
                    >
                        Open App
                    </Button>
                </>
            }
        </div>
    )
}