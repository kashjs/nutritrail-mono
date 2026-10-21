import './Loading.css';

interface LoadingProps {
    loadingText?: string;
}

export default function Loading({ loadingText }: LoadingProps) {
    return (
        <div className="loading-spinner-container">
            <div className="loading-spinner-spinning"></div>
            {loadingText && <p>{loadingText}</p>}
        </div>
    )
}