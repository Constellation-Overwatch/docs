import { createServerFn } from '@tanstack/react-start';

export const REPO_URL = 'https://github.com/Constellation-Overwatch/constellation-overwatch';

// Simple in-memory cache for the latest version
let cachedVersionInfo: { version: string; stars: number; updatedAt: string } | null = null;
let lastFetchTime = 0;
const CACHE_TTL = 3600000; // 1 hour in ms

/**
 * Fetches the latest version and star count from GitHub.
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

        const headers = {
            'Accept': 'application/vnd.github.v3+json',
            'User-Agent': 'constellation-overwatch-web',
        };

        try {
            const [releaseRes, repoRes] = await Promise.all([
                fetch('https://api.github.com/repos/Constellation-Overwatch/constellation-overwatch/releases/latest', {
                    headers,
                    signal: AbortSignal.timeout(1500),
                }),
                fetch('https://api.github.com/repos/Constellation-Overwatch/constellation-overwatch', {
                    headers,
                    signal: AbortSignal.timeout(1500),
                }),
            ]);

            const releaseData = releaseRes.ok ? await releaseRes.json() : null;
            const repoData = repoRes.ok ? await repoRes.json() : null;

            cachedVersionInfo = {
                version: releaseData?.tag_name || 'v1.0.0',
                stars: repoData?.stargazers_count ?? 0,
                updatedAt: new Date().toISOString(),
            };
            lastFetchTime = now;
            return cachedVersionInfo;
        } catch (error) {
            console.error('Failed to fetch GitHub data:', error);
            return cachedVersionInfo || {
                version: 'v1.0.0',
                stars: 0,
                updatedAt: new Date().toISOString(),
            };
        }
    });

// Fallback constant for types or initial state
export const VERSION = 'v1.0.0';
