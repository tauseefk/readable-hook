/**
 * Fetch state from a streaming endpoint
 * @param path endpoint to fetch the response from
 * @returns {[string, () => void]} returns a tuple of data retrieved from the stream, and a query trigger function
 */
export declare const useStreamingQuery: (path: string) => [string, () => void];
/**
 * Trigger a mutation at a streaming endpoint
 * @param path to the endpoint endpoint
 * @param staticParams parameters that can be passed at hook initialization
 * @returns {[string, (dynamicParams?: Record<string, string>) => void]} returns a tuple of data retrieved from the stream, and a mutation trigger function
 */
export declare const useStreamingMutation: (path: string, staticParams?: Record<string, string>) => [string, (dynamicParams?: Record<string, string>) => void];
