export declare const readableTextStream: (path: string, options?: {
    method: "GET" | "POST";
    mode?: "cors" | "no-cors" | "same-origin";
    body?: string;
    headers?: Record<string, string>;
}) => Promise<ReadableStream<string>>;
