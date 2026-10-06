export class ApiError extends Error {
    status: number;
    constructor(status: number, message: string) {
        super(message);
        this.status = status;
    }
}

export async function request<T>(path: string, options: { method?: string, body?: unknown } = {}): Promise<T> {
    const { method = 'GET', body } = options;

    const response = await fetch(`/api${path}`, {
        method,
        credentials: 'include',
        headers: body !== undefined ? { 'Content-Type': 'application/json' } : undefined,
        body: body !== undefined ? JSON.stringify(body) : undefined
    })

    const data = await response.json().catch(() => null);

    if (!response.ok) {
        throw new ApiError(response.status, data?.error ?? 'Request failed');
    }

    return data as T;
}