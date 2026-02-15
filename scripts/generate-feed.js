import { writeFileSync, readFileSync } from 'fs';
import { Feed } from 'feed';
import { globSync } from 'glob';
import path from 'path';

const siteUrl = 'https://links.rewake.org';

const feed = new Feed({
  title: "links.rewake.org",
  description: "A curated collection of interesting links.",
  id: siteUrl,
  link: siteUrl,
  language: "en",
  favicon: `${siteUrl}/icon.svg`,
  author: {
    name: "Andreas Backström",
    link: "https://andreasbackstrom.se"
  }
});

// 1. Find all your content JSON files
const files = globSync('./src/content/collections/*.json');
const allLinks = files.flatMap(file => {
  const fileContent = readFileSync(file, 'utf-8');
  if (!fileContent.trim()) return [];

  const content = JSON.parse(fileContent);
  const collectionName = path.basename(file, '.json');

  // Access the 'links' array inside your JSON object
  const linksArray = content.links || [];

  return linksArray.map(link => ({ 
    ...link, 
    collection: collectionName 
  }));
});

// Sort by the 'date' field in your JSON
allLinks.sort((a, b) => new Date(b.date) - new Date(a.date));

// Add to feed
allLinks.slice(0, 50).forEach(link => {
  feed.addItem({
    title: link.title,
    id: link.url,
    link: link.url,
    description: link.description,
    date: new Date(link.date || Date.now()), // Uses your 'date' field
    category: [{ name: link.collection }]
  });
});

// 4. Write the file to the public folder (so it's copied to dist)
writeFileSync('./public/rss.xml', feed.rss2());
console.log('✅ RSS Feed generated at /public/rss.xml');