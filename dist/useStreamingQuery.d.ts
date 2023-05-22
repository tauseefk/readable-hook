/**
 * Fetch data from a streaming endpoint
 * @param path endpoint to fetch the response from
 * @returns {[string, () => void]} returns a tuple of data retrieved from the stream, and a query trigger function
 */
export declare const useStreamingQuery: (path: string) => [string, () => void];
