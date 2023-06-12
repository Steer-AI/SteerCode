type ButtonProps = {
    children: React.ReactNode;
    onClick: () => void;
    className?: string;
    variant?: 'primary' | 'secondary';
    disabled?: boolean;
};

export default function Button({ children, onClick, className = '', variant = 'primary', disabled = false }: ButtonProps) {


    const buttonClass = `box-border flex items-center justify-center text-sm font-semibold uppercase px-4 py-2 border ${className}`;

    return (
        <button
            disabled={disabled}
            onClick={onClick}
            className={`${buttonClass} ${variant === 'primary'
                ? 'border-neutral-200 bg-neutral-200 hover:enabled:bg-neutral-50 text-content-inverse'
                : 'border-neutral-400 hover:enabled:border-neutral-200 text-content-primary'}`}
        >
            {children}
        </button>
    );
}