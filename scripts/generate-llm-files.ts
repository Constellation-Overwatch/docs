#!/usr/bin/env bun
import { writeFile, mkdir, readFile } from 'fs/promises';
import { join, dirname } from 'path';
import { glob } from 'glob';

async function generateLLMFiles() {
  console.log('🤖 Generating LLM-friendly files...');
  
  const outputDir = 'dist/client/llms.mdx';
  
  // Ensure output directory exists
  await mkdir(outputDir, { recursive: true });
  await mkdir('dist/client', { recursive: true });
  
  // Find all MDX files in content/docs
  const mdxFiles = await glob('content/docs/**/*.mdx');
  
  const tasks = mdxFiles.map(async (filePath) => {
    try {
      const content = await readFile(filePath, 'utf-8');
      
      // Convert file path to URL path
      const urlPath = filePath
        .replace('content/docs/', '')
        .replace('.mdx', '');
      
      const outputPath = join(outputDir, `${urlPath}.mdx`);
      
      // Ensure subdirectory exists
      await mkdir(dirname(outputPath), { recursive: true });
      
      // Write the raw markdown content
      await writeFile(outputPath, content, 'utf-8');
      console.log(`  ✓ Generated ${outputPath}`);
    } catch (error) {
      console.error(`  ✗ Failed to generate ${filePath}:`, error);
    }
  });
  
  // Generate llms-full.txt
  try {
    const allContent = [];
    for (const filePath of mdxFiles) {
      const content = await readFile(filePath, 'utf-8');
      const urlPath = filePath
        .replace('content/docs/', '/docs/')
        .replace('.mdx', '');
      
      // Extract title from frontmatter
      const titleMatch = content.match(/^title:\s*(.+)$/m);
      const title = titleMatch ? titleMatch[1] : 'Untitled';
      
      allContent.push(`# ${title} (${urlPath})\n\n${content}`);
    }
    
    const fullPath = 'dist/client/llms-full.txt';
    await writeFile(fullPath, allContent.join('\n\n---\n\n'), 'utf-8');
    console.log(`  ✓ Generated ${fullPath}`);
  } catch (error) {
    console.error('  ✗ Failed to generate llms-full.txt:', error);
  }
  
  await Promise.all(tasks);
  console.log('🎉 LLM files generation complete!');
}

// Run if called directly
if (import.meta.main) {
  generateLLMFiles().catch(console.error);
}

export { generateLLMFiles };