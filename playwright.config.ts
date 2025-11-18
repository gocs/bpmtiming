import { defineConfig } from '@playwright/test';

export default defineConfig({
	webServer: {
		command: 'npm run build && npm run preview',
		port: 4174,
	},
	use: {
		video: 'on',
	},
	testDir: 'e2e'
});
