import { createFileRoute, Link } from '@tanstack/react-router';
import { HomeLayout } from 'fumadocs-ui/layouts/home';
import { baseOptions } from '@/lib/layout.shared';
import { getLatestVersion } from '@/lib/version';
import { CosmicParallaxBg } from '@/components/ui/parallax-cosmic-background';

export const Route = createFileRoute('/')({
  loader: () => getLatestVersion({ data: undefined }),
  component: Home,
});

function Home() {
  const versionInfo = Route.useLoaderData();
  const version = versionInfo?.version || 'v1.0.0';

  return (
    <HomeLayout {...baseOptions()}>
      <div className="flex flex-col min-h-[calc(100vh-64px)]">
        {/* Cosmic Parallax Hero Section - Full Height */}
        <div className="relative min-h-[calc(100vh-64px)] w-full overflow-hidden bg-gradient-to-b from-[#090A0F] to-[#1B2735]">
          <CosmicParallaxBg
            head=""
            loop={true}
          />

          {/* TOP Section - All content above the animated title */}
          <div className="absolute top-8 md:top-12 lg:top-16 left-0 right-0 z-20 flex flex-col items-center justify-center pointer-events-none px-6">
            {/* Logo */}
            <img src="/images/c4-logo.png" alt="Constellation Overwatch" className="w-14 h-14 md:w-16 md:h-16 lg:w-20 lg:h-20 mb-4 md:mb-5" />

            {/* Tagline */}
            <p className="text-white/70 text-xs md:text-sm lg:text-base tracking-[0.2em] md:tracking-[0.3em] uppercase mb-3 md:mb-4">
              Open Source C4 for the Industrial Edge
            </p>

            {/* Version Badge */}
            <span className="inline-block text-xs md:text-sm bg-blue-500/20 text-blue-300 px-4 py-1 rounded-full border border-blue-500/30 mb-4 md:mb-5">
              {version}
            </span>

            {/* Description */}
            <p className="text-white/90 text-sm md:text-lg lg:text-xl font-medium mb-2 md:mb-3 max-w-sm md:max-w-2xl lg:max-w-3xl mx-auto text-center leading-relaxed">
              Data Fabric & Toolbelt for Agentic Drones, Robots, Sensors, and Video Streams
            </p>
            <p className="text-white/50 text-xs md:text-sm lg:text-base max-w-xs md:max-w-xl lg:max-w-2xl mx-auto text-center mb-6 md:mb-8">
              Rapid response industrial data stack designed with ontological data primitives. Use <code>entity_id</code> to stream semantic real time signal trees.
            </p>

            {/* Quick Install */}
            <div className="max-w-sm md:max-w-lg lg:max-w-xl w-full mx-auto mb-5 md:mb-6 pointer-events-auto">
              <div className="bg-black/50 backdrop-blur-sm text-green-400 p-3 md:p-4 rounded-lg font-mono text-left relative group border border-white/10">
                <button
                  onClick={() => {
                    navigator.clipboard.writeText('curl -LsSf https://constellation-overwatch.dev/install.sh | sh');
                  }}
                  className="absolute top-2 md:top-3 right-2 md:right-3 p-1.5 rounded bg-white/10 hover:bg-white/20 text-white/60 hover:text-white transition-colors opacity-0 group-hover:opacity-100"
                  title="Copy to clipboard"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </button>
                <div className="text-white/40 text-xs md:text-sm mb-1"># Quick Install</div>
                <div className="pr-8 text-xs md:text-sm break-all md:break-normal">curl -LsSf https://constellation-overwatch.dev/install.sh | sh</div>
              </div>
            </div>

            {/* Get Started Button */}
            <div className="pointer-events-auto mb-5 md:mb-6">
              <Link
                to="/docs/$"
                params={{ _splat: '' }}
                className="inline-block px-8 md:px-10 py-3 md:py-3.5 bg-blue-600 text-white text-sm md:text-base font-semibold rounded-lg hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/25"
              >
                Get Started
              </Link>
            </div>

            {/* Powered By */}
            <div>
              <h3 className="text-xs md:text-sm font-medium mb-3 md:mb-4 text-white/40 tracking-wider uppercase text-center">Powered By</h3>
              <div className="flex items-center justify-center gap-5 md:gap-8 lg:gap-10 flex-wrap">
                <img src="/images/go-logo.svg" alt="Go" className="h-10 md:h-12 lg:h-14" />
                <img src="/images/nats.avif" alt="NATS" className="h-6 md:h-8 lg:h-10" />
                <img src="/images/templ.svg" alt="Templ" className="h-5 md:h-6 lg:h-7" />
                <img src="/images/data-star.webp" alt="Datastar" className="h-6 md:h-8 lg:h-10" />
                <img src="/images/turso.svg" alt="Turso" className="h-6 md:h-8 lg:h-10" />
              </div>
            </div>
          </div>

          {/* Footer - overlaid on earth */}
          <footer className="absolute bottom-4 left-0 right-0 z-20">
            <div className="text-center text-sm text-white/50">
              Managed by <a href="https://jedi-ops.dev" target="_blank" rel="noopener noreferrer" className="hover:text-blue-400 transition-colors">Jedi Labs</a>
            </div>
          </footer>
        </div>
      </div>
    </HomeLayout>
  );
}
