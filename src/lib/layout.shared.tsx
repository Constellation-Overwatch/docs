import type { BaseLayoutProps } from 'fumadocs-ui/layouts/shared';
import { SiDiscord, SiGithub } from '@icons-pack/react-simple-icons';

export function baseOptions(): BaseLayoutProps {
  return {
    nav: {
      title: (
        <div className="flex items-center gap-2">
          <img src="/images/c4-logo.png" alt="Constellation Overwatch" className="w-6 h-6" />
          <span className="font-semibold">Constellation Overwatch</span>
        </div>
      ),
      transparentMode: 'top',
    },
    links: [
      {
        type: 'icon',
        label: 'GitHub',
        icon: <SiGithub />,
        text: 'GitHub',
        url: 'https://github.com/Constellation-Overwatch/constellation-overwatch',
        external: true,
      },
      {
        type: 'icon',
        label: 'Discord',
        icon: <SiDiscord />,
        text: 'Discord',
        url: 'https://discord.gg/hqJebrXmhQ',
        external: true,
      },
    ],
  };
}
