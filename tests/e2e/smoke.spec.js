import { test, expect } from '@playwright/test';

// Block requests to third-party hosts (favicons, link preview images, share API)
// so tests stay fast and deterministic regardless of external content.
async function blockThirdPartyRequests(page) {
	await page.route('**/*', (route) => {
		const url = new URL(route.request().url());
		if (url.hostname === 'localhost') return route.continue();
		return route.abort();
	});
}

test.beforeEach(async ({ page }) => {
	await blockThirdPartyRequests(page);
	await page.goto('/');
	await expect(page.getByText(/\d+\s+results/)).toBeVisible();
});

test('loads the app and renders links for the default "All" collection', async ({ page }) => {
	const links = page.locator('a[target="_blank"][rel="noopener"]');
	await expect(links.first()).toBeVisible();
	expect(await links.count()).toBeGreaterThan(0);
});

test('switching collections changes the visible links', async ({ page }) => {
	const resultsText = page.getByText(/\d+\s+results/);
	const allCount = Number((await resultsText.textContent()).match(/\d+/)[0]);

	const firstTag = page.locator('nav .tag-btn').nth(1);
	const tagName = (await firstTag.textContent()).trim();
	await firstTag.click();

	await expect(firstTag).toHaveClass(/bg-black|dark:bg-white/);
	const filteredCount = Number((await resultsText.textContent()).match(/\d+/)[0]);
	expect(filteredCount).toBeLessThanOrEqual(allCount);
	expect(tagName.length).toBeGreaterThan(0);
});

test('search filters the results and shows an empty state for no matches', async ({ page }) => {
	const resultsText = page.getByText(/\d+\s+results/);
	const allCount = Number((await resultsText.textContent()).match(/\d+/)[0]);

	const search = page.getByPlaceholder('Search links...');
	await search.fill('zzzzzz-no-such-link-zzzzzz');
	await expect(page.getByText('No links found')).toBeVisible();
	expect(Number((await resultsText.textContent()).match(/\d+/)[0])).toBe(0);

	await search.fill('');
	await expect(resultsText).toContainText(String(allCount));
});

test('Ctrl/Cmd+P focuses the search box', async ({ page }) => {
	const search = page.getByPlaceholder('Search links...');
	await expect(search).not.toBeFocused();
	await page.keyboard.press('Control+p');
	await expect(search).toBeFocused();
});

test('domain filter narrows the results', async ({ page }) => {
	const resultsText = page.getByText(/\d+\s+results/);
	const allCount = Number((await resultsText.textContent()).match(/\d+/)[0]);

	await page.getByRole('button', { name: 'All Domains' }).click();
	const firstDomainOption = page.locator('.max-h-60 button').first();
	await firstDomainOption.click();

	await expect(page.getByText('1 selected')).toBeVisible();
	expect(Number((await resultsText.textContent()).match(/\d+/)[0])).toBeLessThanOrEqual(allCount);
});

test('view mode can be switched via the settings drawer', async ({ page }) => {
	await page.locator('header button').click(); // open settings (gear icon button)
	await expect(page.getByText('Customize your viewing experience')).toBeVisible();

	await page.getByRole('button', { name: 'Grid' }).click();
	await page.getByRole('button', { name: 'Compact' }).click();

	await page.keyboard.press('Escape');
	await expect(page.getByText('Customize your viewing experience')).not.toBeVisible();
});

test('keyboard navigation focuses, opens, and clears link focus', async ({ page }) => {
	const firstCard = page.locator('a[target="_blank"][rel="noopener"]').first();
	const firstCardContainer = firstCard.locator(
		'xpath=ancestor::div[contains(concat(" ", normalize-space(@class), " "), " group ")][1]',
	);

	await page.keyboard.press('k');
	// The focus ring in the DOM and the app's keydown listener are both driven by
	// the same `focusedIndex` state, but Preact re-subscribes the listener in a
	// useEffect that can lag one tick behind the DOM update. Waiting for the ring
	// class alone is therefore not a reliable signal that Enter will now work, so
	// retry the press a few times instead of trusting a single attempt.
	await expect(firstCardContainer).toHaveClass(/ring-2/);

	let popup;
	for (let attempt = 0; !popup && attempt < 5; attempt++) {
		try {
			const popupPromise = page.waitForEvent('popup', { timeout: 1000 });
			await page.keyboard.press('Enter');
			popup = await popupPromise;
		} catch {
			// Listener wasn't attached with the latest focusedIndex yet - wait a
			// paint cycle and try again.
			await page.evaluate(() => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r))));
		}
	}

	expect(popup).toBeTruthy();
	expect(popup.url()).toBe(await firstCard.getAttribute('href'));
	await popup.close();

	await page.keyboard.press('Escape');
	await expect(firstCardContainer).not.toHaveClass(/ring-2/);
});

test('theme choice persists across reloads', async ({ page }) => {
	await page.locator('header button').click();
	await page.getByRole('button', { name: 'Dark' }).click();
	await expect(page.locator('html')).toHaveClass(/dark/);

	await page.reload();
	await expect(page.locator('html')).toHaveClass(/dark/);
});

test('the CMS admin entry point loads without erroring', async ({ page }) => {
	const errors = [];
	page.on('pageerror', (err) => errors.push(err));

	await page.goto('/admin/');
	await expect(page).toHaveTitle(/.+/);
	expect(errors).toEqual([]);
});
