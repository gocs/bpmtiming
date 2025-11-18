import { expect, test } from '@playwright/test';

test('play the audio', async ({ page }) => {
	await page.goto('/');
	await expect(page.locator('button')).toBeVisible();

	await page.getByRole('button', { name: 'play' }).click();
	await sleep(500);
	await page.getByRole('slider', { name: 'bpm:' }).fill('240');
	await sleep(500);
	await page.getByRole('button', { name: 'stop' }).click();
	await sleep(500);
	await page.getByRole('slider', { name: 'bpm:' }).fill('60');
	await page.getByRole('button', { name: 'play' }).click();
	await sleep(1000 * 8 - 1500); // try to play the remainder
	// and then it never continues...
});

async function sleep(ms: number): Promise<void> {
	return new Promise((res) => (setTimeout(res, ms)));
}