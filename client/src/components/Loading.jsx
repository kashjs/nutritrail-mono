import './Loading.css';

export default function Loading({ loadingText }) {
    return (
        <div className="loading-spinner-container">
            <div className="loading-spinner-spinning"></div>
            {loadingText && <p>{loadingText}</p>}
        </div>
    )
}