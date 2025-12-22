import { createFileRoute, Link } from '@tanstack/react-router';
import { HomeLayout } from 'fumadocs-ui/layouts/home';
import { baseOptions } from '@/lib/layout.shared';
import { VERSION } from '@/lib/version';

export const Route = createFileRoute('/')({
  component: Home,
});

function Home() {
  return (
    <HomeLayout {...baseOptions()}>
      <div className="container mx-auto px-4 py-20">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="flex flex-col items-center justify-center mb-6">
            <img src="/c4-logo.png" alt="Constellation Overwatch" className="w-24 h-24 mb-6" />
            <div>
              <h1 className="text-4xl font-bold mb-2">Constellation Overwatch</h1>
              <span className="text-sm bg-blue-100 text-blue-800 px-3 py-1 rounded-full">{VERSION}</span>
            </div>
          </div>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Open Source C4 Data Fabric for Industrial Edge Computing
          </p>
          <p className="text-lg text-gray-500 mb-12 max-w-3xl mx-auto">
            Lightweight industrial data stack designed with ontological data primitives for UAVs, robotics, sensors, and real-time video intelligence at the edge.
          </p>

          <div className="flex items-center justify-center gap-4 mb-12">
            <Link
              to="/docs/$"
              params={{ _splat: '' }}
              className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
              Get Started
            </Link>

          </div>

          {/* Quick Install */}
          <div className="max-w-2xl mx-auto">
            <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-left">
              <div className="text-gray-400 text-sm mb-2"># Quick Install</div>
              <div>curl -LsSf https://constellation-overwatch.github.io/overwatch/install.sh | sh</div>
            </div>
          </div>
        </div>



        {/* Tech Stack */}
        <div className="text-center">
          <h3 className="text-lg font-semibold mb-8 text-gray-600">Powered By</h3>
          <div className="flex items-center justify-center gap-8 flex-wrap">
            <img src="/go-logo.svg" alt="Go" className="h-8" />
            <img src="/nats.avif" alt="NATS" className="h-8" />
            <img src="/templ.svg" alt="Templ" className="h-8" />
            <img src="/data-star.webp" alt="Datastar" className="h-8" />
            <img src="/turso.svg" alt="Turso" className="h-8" />
          </div>
        </div>
      </div>
      <footer className="mt-20 py-8">
        <div className="flex flex-col items-center justify-center gap-4">
          <a
            href="https://github.com/Constellation-Overwatch/constellation-overwatch"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="View on GitHub"
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
            </svg>
          </a>
          <div className="text-sm text-gray-500">
            Managed by <a href="https://jedi-ops.dev" target="_blank" rel="noopener noreferrer" className="hover:text-blue-600 transition-colors">Jedi Labs</a>
          </div>
        </div>
      </footer>
    </HomeLayout>
  );
}
