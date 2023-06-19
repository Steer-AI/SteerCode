import Button from "@/components/Button";

type LoggedUserViewProps = {
    onOpenApp: () => void;
};


export default function LoggedUserView({onOpenApp}: LoggedUserViewProps) {
    return (
        <div className="flex flex-col items-center justify-center gap-6">

            <h1 className="text-3xl font-bold text-center text-content-primary">
                Welcome to Steer
            </h1>

            <p className="text-content-secondary text-center">
                You have successfully logged in to <strong>Steer account</strong>.
                <br/>
                Please continue to the app.
            </p>

            <div role='separator' className='h-px w-full bg-background-secondary mb-6' />

            <Button
                onClick={async () => {
                    onOpenApp()
                    return true;
                }}
                variant='primary'
            >
                Open App
            </Button>
        </div>
    )
}