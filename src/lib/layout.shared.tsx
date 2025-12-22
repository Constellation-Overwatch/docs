import type { BaseLayoutProps } from 'fumadocs-ui/layouts/shared';
import { VERSION } from './version';

export function baseOptions(): BaseLayoutProps {
  return {
    nav: {
      title: (
        <div className="flex items-center gap-2">
          <img src="/c4-logo.png" alt="Constellation Overwatch" className="w-6 h-6" />
          <span className="font-semibold">Constellation Overwatch</span>
          <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">{VERSION}</span>
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
