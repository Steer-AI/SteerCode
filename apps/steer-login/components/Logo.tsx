export default function Logo(props: { className: string | undefined; }) {
    return (
        <svg width="100%" height="100%" viewBox="0 0 256 256" fill="none" xmlns="http://www.w3.org/2000/svg" className={props.className}>
            <path d="M65.8241 27.2657L46.5444 46.5455H209.453V209.455L228.733 190.175C246.191 172.717 255.999 149.039 255.999 124.35V0H131.649C106.96 0 83.2821 9.80777 65.8241 27.2657Z" fill="white"></path>
            <path d="M190.175 228.734L209.455 209.455L46.5454 209.455L46.5455 46.5454L27.2657 65.8252C9.80777 83.2831 -2.2294e-06 106.961 -4.3878e-06 131.65L-1.52588e-05 256L124.35 256C149.039 256 172.717 246.192 190.175 228.734Z" fill="white"></path>
        </svg>
    )
}