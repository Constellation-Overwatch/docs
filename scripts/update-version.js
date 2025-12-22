#!/usr/bin/env node

import { writeFile } from 'fs/promises';
import { join } from 'path';

async function getLatestVersion() {
  try {
    const response = await fetch('https://api.github.com/repos/Constellation-Overwatch/constellation-overwatch/releases/latest');
    const data = await response.json();
    return data.tag_name || 'v1.0.0';
  } catch (error) {
    console.warn('Failed to fetch latest version, using fallback:', error.message);
    return 'v1.0.0';
  }
}

async function updateVersionConfig() {
  const version = await getLatestVersion();
  const configContent = `// Auto-generated version config
export const VERSION = '${version}';
export const REPO_URL = 'https://github.com/Constellation-Overwatch/constellation-overwatch';
export const DOCS_UPDATED = new Date().toISOString();
`;

  await writeFile(join(process.cwd(), 'src', 'lib', 'version.ts'), configContent);
  console.log(`✅ Updated version to ${version}`);
}

updateVersionConfig().catch(console.error);