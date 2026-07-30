import fs from 'node:fs/promises';
import path from 'node:path';
import yaml from 'yaml';
import { ManifestSchema, type Manifest } from './manifest-schema';

const CURRICULUM_DIR = './src/content/curriculum/english';

export async function loadManifest(): Promise<Manifest> {
  const raw = await fs.readFile(path.join(CURRICULUM_DIR, 'manifest.yaml'), 'utf-8');
  return ManifestSchema.parse(yaml.parse(raw));
}
