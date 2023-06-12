import Button from "@/components/Button";
import Spinner from "@/components/Spinner";
import { useState } from "react";

type NoUserViewProps = {
    onLogin: (providerId: string) => Promise<boolean>;
};


export default function NoUserView({ onLogin }: NoUserViewProps) {
    const [loadingGithub, setLoadingGithub] = useState(false)
    const [loadingGoogle, setLoadingGoogle] = useState(false)

    return (
        <div className="flex h-full flex-col items-center justify-center gap-6">

            <h1 className="text-3xl font-bold text-center text-content-primary">
                Welcome to Steer AI
            </h1>

            <p className="text-secondary">
                Log into your account to continue
            </p>

            <div role='separator' className='h-px w-full bg-background-secondary mb-6' />

            <Button variant='secondary' onClick={async () => {
                setLoadingGoogle(true)
                onLogin('google.com')
                setLoadingGoogle(false)
            }}
                className='w-64'
            >
                {loadingGoogle ? (
                    <Spinner className='w-5 h-5' />
                ) : (
                    <>
                        <svg height="100%" viewBox="0 0 20 20" width="100%" className="w-5 h-5 mr-3">
                            <path
                                d="M19.6 10.23c0-.82-.1-1.42-.25-2.05H10v3.72h5.5c-.15.96-.74 2.31-2.04 3.22v2.45h3.16c1.89-1.73 2.98-4.3 2.98-7.34z"
                                fill="#4285F4"
                            />
                            <path
                                d="M13.46 15.13c-.83.59-1.96 1-3.46 1-2.64 0-4.88-1.74-5.68-4.15H1.07v2.52C2.72 17.75 6.09 20 10 20c2.7 0 4.96-.89 6.62-2.42l-3.16-2.45z"
                                fill="#34A853"
                            />
                            <path
                                d="M3.99 10c0-.69.12-1.35.32-1.97V5.51H1.07A9.973 9.973 0 000 10c0 1.61.39 3.14 1.07 4.49l3.24-2.52c-.2-.62-.32-1.28-.32-1.97z"
                                fill="#FBBC05"
                            />
                            <path
                                d="M10 3.88c1.88 0 3.13.81 3.85 1.48l2.84-2.76C14.96.99 12.7 0 10 0 6.09 0 2.72 2.25 1.07 5.51l3.24 2.52C5.12 5.62 7.36 3.88 10 3.88z"
                                fill="#EA4335"
                            />
                        </svg>
                        Log In with Google
                    </>
                )}

            </Button>

            <Button variant='secondary' onClick={async () => {
                setLoadingGithub(true)
                onLogin('github.com')
                setLoadingGithub(false)
            }}
                className='w-64'
            >
                {loadingGithub ? (
                    <Spinner className='w-5 h-5' />
                ) : (
                    <>
                        <svg
                            width="100%"
                            height="100%"
                            viewBox="0 0 96 96"
                            xmlns="http://www.w3.org/2000/svg"
                            className='w-5 h-5 mr-3'
                        >
                            <path
                                fillRule="evenodd"
                                clipRule="evenodd"
                                d="M48.854 0C21.839 0 0 22 0 49.217c0 21.756 13.993 40.172 33.405 46.69 2.427.49 3.316-1.059 3.316-2.362 0-1.141-.08-5.052-.08-9.127-13.59 2.934-16.42-5.867-16.42-5.867-2.184-5.704-5.42-7.17-5.42-7.17-4.448-3.015.324-3.015.324-3.015 4.934.326 7.523 5.052 7.523 5.052 4.367 7.496 11.404 5.378 14.235 4.074.404-3.178 1.699-5.378 3.074-6.6-10.839-1.141-22.243-5.378-22.243-24.283 0-5.378 1.94-9.778 5.014-13.2-.485-1.222-2.184-6.275.486-13.038 0 0 4.125-1.304 13.426 5.052a46.97 46.97 0 0 1 12.214-1.63c4.125 0 8.33.571 12.213 1.63 9.302-6.356 13.427-5.052 13.427-5.052 2.67 6.763.97 11.816.485 13.038 3.155 3.422 5.015 7.822 5.015 13.2 0 18.905-11.404 23.06-22.324 24.283 1.78 1.548 3.316 4.481 3.316 9.126 0 6.6-.08 11.897-.08 13.526 0 1.304.89 2.853 3.316 2.364 19.412-6.52 33.405-24.935 33.405-46.691C97.707 22 75.788 0 48.854 0z"
                                fill="white"
                            />
                        </svg>
                        Log In with Github
                    </>
                )}

            </Button>

        </div>
    )
}