import { createServerFn } from '@tanstack/react-start';

export const REPO_URL = 'https://github.com/Constellation-Overwatch/constellation-overwatch';

// Simple in-memory cache for the latest version
let cachedVersionInfo: { version: string; updatedAt: string } | null = null;
let lastFetchTime = 0;
const CACHE_TTL = 3600000; // 1 hour in ms

/**
 * Fetches the latest version from GitHub releases.
 * This runs ONLY on the server in TanStack Start.
 */
export const getLatestVersion = createServerFn({
    method: 'GET',
})
    .inputValidator((d: void) => d)
    .handler(async ({ data }) => {
        const now = Date.now();

        if (cachedVersionInfo && (now - lastFetchTime < CACHE_TTL)) {
            return cachedVersionInfo;
        }

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 1500); // 1.5s timeout

        try {
            const response = await fetch('https://api.github.com/repos/Constellation-Overwatch/constellation-overwatch/releases/latest', {
                signal: controller.signal,
                headers: {
                    'Accept': 'application/vnd.github.v3+json',
                    'User-Agent': 'constellation-overwatch-web'
                }
            });
            clearTimeout(timeoutId);

            if (!response.ok) {
                throw new Error(`GitHub API error: ${response.status}`);
            }

            const data = await response.json();
            cachedVersionInfo = {
                version: data.tag_name || 'v1.0.0',
                updatedAt: new Date().toISOString(),
            };
            lastFetchTime = now;
            return cachedVersionInfo;
        } catch (error) {
            console.error('Failed to fetch latest version:', error);
            // Return stale cache if available, otherwise fallback
            return cachedVersionInfo || {
                version: 'v1.0.0',
                updatedAt: new Date().toISOString(),
            };
        }
    });

// Fallback constant for types or initial state
export const VERSION = 'v1.0.0';
