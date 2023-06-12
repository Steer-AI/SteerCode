"use client";

import Button from "@/components/Button";
import { useEffect } from "react";

export default function RedirectPage() {

    function openDeepLink() {
        // get current url param called 'redirect' and 'protocol'
        const urlParams = new URLSearchParams(window.location.search)
        const redirect = urlParams.get('redirect') || ''
        const protocol = urlParams.get('protocol') || 'steer'
        setTimeout(() => {
            window.location.href = `${protocol}://${redirect}`
        }, 250)
    }

    useEffect(() => {
        openDeepLink()
    }, [])

    return (
        <main className="flex-1 flex flex-col items-center justify-center mb-40">
            <div className="flex flex-col items-center justify-center gap-6">

                <h1 className="text-3xl font-bold text-center text-content-primary">
                    Welcome to Steer
                </h1>

                <p className="text-content-secondary text-center">
                    You will be redirected to the app shortly<br/>
                    If you are not redirected, please click the button below  <br />
                    to continue to the the app.
                </p>

                <div role='separator' className='h-px w-full bg-background-secondary mb-6' />

                <Button
                    onClick={openDeepLink}
                    variant='primary'
                >
                    Open App
                </Button>
            </div>
        </main>
    )
}