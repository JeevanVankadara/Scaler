// frontend/src/utils/apiCache.js

const cache = new Map();

/**
 * Custom fetch wrapper that caches responses.
 * Since the cache is an in-memory Map, it resets naturally on hard browser reloads,
 * fulfilling the "cache until reload" requirement without touching localStorage/sessionStorage.
 */
export async function cachedFetch(url, options = {}) {
    // We only cache GET requests
    if (options.method && options.method.toUpperCase() !== 'GET') {
        const response = await fetch(url, options);
        return response.json();
    }

    if (cache.has(url)) {
        return Promise.resolve(cache.get(url));
    }

    try {
        const response = await fetch(url, options);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        
        // Save to cache
        cache.set(url, data);
        return data;
    } catch (err) {
        console.error("Cached fetch failed:", err);
        throw err;
    }
}
