import { test, expect } from '@playwright/test';

async function blockThirdPartyRequests(page) {
	await page.route('**/*', (route) => {
		const url = new URL(route.request().url());
		if (url.hostname === 'localhost') return route.continue();
		return route.abort();
	});
}

async function setViewMode(page, mode) {
	await page.locator('header button').click();
	await page.getByRole('button', { name: mode }).click();
	await page.keyboard.press('Escape');
}

// Mask the build-date badge in the footer since its text changes every build.
function maskOptions(page) {
	return { mask: [page.getByText(/UPDATED/)], maxDiffPixelRatio: 0.02 };
}

for (const colorScheme of ['light', 'dark']) {
	test.describe(`${colorScheme} mode`, () => {
		test.use({ colorScheme });

		for (const mode of ['List', 'Grid', 'Compact']) {
			test(`${mode} view`, async ({ page }) => {
				await blockThirdPartyRequests(page);
				await page.goto('/');
				await expect(page.getByText(/\d+\s+results/)).toBeVisible();
				await setViewMode(page, mode);

				await expect(page).toHaveScreenshot(`${mode.toLowerCase()}-${colorScheme}.png`, maskOptions(page));
			});
		}

		test('settings drawer open', async ({ page }) => {
			await blockThirdPartyRequests(page);
			await page.goto('/');
			await expect(page.getByText(/\d+\s+results/)).toBeVisible();
			await page.locator('header button').click();
			await expect(page.getByText('Customize your viewing experience')).toBeVisible();

			await expect(page).toHaveScreenshot(`settings-drawer-${colorScheme}.png`, maskOptions(page));
		});
	});
}

test('mobile viewport, default view', async ({ page }) => {
	await page.setViewportSize({ width: 390, height: 844 });
	await blockThirdPartyRequests(page);
	await page.goto('/');
	await expect(page.getByText(/\d+\s+results/)).toBeVisible();

	await expect(page).toHaveScreenshot('mobile-default.png', maskOptions(page));
});
