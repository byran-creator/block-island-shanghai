import { defineConfig } from 'vite';
import {fileURLToPath} from 'node:url';
import {localSavesPlugin} from './scripts/local-saves.mjs';
export default defineConfig({root:'game',plugins:[localSavesPlugin(fileURLToPath(new URL('./.local-data/',import.meta.url)))],server:{host:'0.0.0.0',allowedHosts:['terminal.local']}});
