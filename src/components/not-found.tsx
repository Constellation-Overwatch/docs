import { Link } from '@tanstack/react-router';
import { HomeLayout } from 'fumadocs-ui/layouts/home';
import { baseOptions } from '@/lib/layout.shared';
import { CosmicParallaxBg } from '@/components/ui/parallax-cosmic-background';

export function NotFound() {
  return (
    <HomeLayout {...baseOptions()}>
      <div className="relative min-h-[calc(100vh-64px)] w-full overflow-hidden bg-gradient-to-b from-[#090A0F] to-[#1B2735]">
        <CosmicParallaxBg head="" loop={true} />

        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center px-6">
          <img
            src="/images/c4-logo.png"
            alt="Constellation Overwatch"
            width="80"
            height="80"
            className="w-14 h-14 md:w-16 md:h-16 mb-6 opacity-60"
          />

          <h1 className="text-8xl md:text-9xl font-bold text-white/10 mb-2 tracking-tighter">
            404
          </h1>

          <h2 className="text-xl md:text-2xl font-semibold text-white/90 mb-3">
            Signal Lost
          </h2>

          <p className="text-white/50 text-sm md:text-base max-w-md mx-auto text-center mb-8 leading-relaxed">
            The entity you are looking for could not be found in the constellation.
            It may have been decommissioned or moved to a different sector.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-3">
            <Link
              to="/"
              className="inline-block px-8 py-3 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/25"
            >
              Return to Base
            </Link>
            <Link
              to="/docs/$"
              params={{ _splat: '' }}
              className="inline-block px-8 py-3 bg-white/10 text-white/80 text-sm font-semibold rounded-lg hover:bg-white/15 transition-colors border border-white/10"
            >
              Browse Docs
            </Link>
          </div>
        </div>
      </div>
    </HomeLayout>
  );
}
