import type { BaseLayoutProps } from 'fumadocs-ui/layouts/shared';
import { VERSION } from './version';

export function baseOptions(): BaseLayoutProps {
  return {
    nav: {
      title: (
        <div className="flex items-center gap-2">
          <img src="/c4-logo.png" alt="Constellation Overwatch" className="w-6 h-6" />
          <span className="font-semibold">Constellation Overwatch</span>
        </div>
      ),
      children: (
        <div className="flex flex-1 justify-end items-center gap-2 mr-2">
          <a
            href="https://github.com/Constellation-Overwatch/constellation-overwatch/releases"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full hover:bg-blue-200 transition-colors"
          >
            {VERSION}
          </a>
        </div>
      ),
    },
    links: [
      {
        text: 'Documentation',
        url: '/docs',
        active: 'nested-url',
      },
      {
        text: 'Discord',
        url: 'https://discord.gg/hqJebrXmhQ',
        external: true,
      },
    ],
  };
}
