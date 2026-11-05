import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..');
const required = ['index.html','style.css','script.js','data/projects.json','data/projects.js','projects/project.html','projects/project-detail.js','assets/images/profile.png'];
let failed = false;
for (const file of required) {
  const target = path.join(root,file);
  if (!fs.existsSync(target) || fs.statSync(target).size === 0) { console.error(`Missing or empty: ${file}`); failed = true; }
}
const projects = JSON.parse(fs.readFileSync(path.join(root,'data/projects.json'),'utf8'));
const embeddedSource = fs.readFileSync(path.join(root,'data/projects.js'),'utf8')
  .replace(/^window\.PORTFOLIO_PROJECTS\s*=\s*/, '')
  .replace(/;\s*$/, '');
const embeddedProjects = JSON.parse(embeddedSource);
if (JSON.stringify(embeddedProjects) !== JSON.stringify(projects)) {
  console.error('data/projects.js is out of sync with data/projects.json');
  failed = true;
}
const slugs = new Set();
for (const project of projects) {
  for (const key of ['slug','title','category','summary','problem','solution','role','contributions','technologies','objectives','process','outcome','lessons']) if (!project[key] || (Array.isArray(project[key]) && !project[key].length)) { console.error(`${project.slug || 'unknown'} missing ${key}`); failed = true; }
  if (slugs.has(project.slug)) { console.error(`Duplicate slug: ${project.slug}`); failed = true; }
  slugs.add(project.slug);
  for (const image of project.gallery || []) {
    if (!fs.existsSync(path.join(root,image.src))) { console.error(`Missing image: ${image.src}`); failed = true; }
    for (const entry of (image.srcset || '').split(',').map(item => item.trim()).filter(Boolean)) {
      const src = entry.split(/\s+/)[0];
      if (!fs.existsSync(path.join(root,src))) { console.error(`Missing srcset image: ${src}`); failed = true; }
    }
    if (!image.alt || !image.caption) { console.error(`${project.slug} has gallery image without alt/caption`); failed = true; }
  }
  if (!project.gallery?.length && !project.missingImages?.length) { console.error(`${project.slug} needs verified gallery media or explicit missing image requests`); failed = true; }
}
const html = fs.readFileSync(path.join(root,'index.html'),'utf8');
for (const id of ['home','about','skills','projects','experience','research','contact']) if (!html.includes(`id="${id}"`)) { console.error(`Missing section: ${id}`); failed = true; }
if (failed) process.exit(1);
const imageCount = projects.reduce((total, project) => total + (project.gallery?.length || 0), 0);
console.log(`Validation passed: ${required.length} required files, ${projects.length} projects, ${slugs.size} unique slugs, ${imageCount} verified gallery images.`);
