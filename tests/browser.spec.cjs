const { test: base, expect } = require('@playwright/test');

// Each test receives a fresh browser context and storage. External fonts/images
// are optional; application exceptions and failed internal requests are errors.
const test = base.extend({
  page: async ({ page }, use) => {
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    page.on('response', response => {
      if (response.url().startsWith('http://127.0.0.1:8173/') && response.status() >= 400) errors.push(`${response.status()} ${response.url()}`);
    });
    page.on('requestfailed', request => {
      if (request.url().startsWith('http://127.0.0.1:8173/') && request.failure()?.errorText !== 'net::ERR_ABORTED') errors.push(`${request.failure()?.errorText} ${request.url()}`);
    });
    await use(page);
    expect(errors, 'Application runtime errors or internal resource failures').toEqual([]);
  }
});

test('CI-04: root opens the Dashboard and navigation', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveURL(/features\/dashboard\/index.html/);
  await expect(page.locator('#dvName')).not.toBeEmpty();
  await expect(page.locator('#tasksHeading')).toBeVisible();
  await expect(page.locator('nav').first()).toBeVisible();
});

test('CI-05: six main pages render meaningful content over HTTP', async ({ page }) => {
  for (const [route, selector] of [
    ['employee-profile', '#toggle-lien-lac'],
    ['tasks/manage-tasks', '#statusFilter'],
    ['tickets/my-tickets', '#employee'],
    ['tickets/approvals', '#manager'],
    ['admin/access-configuration', 'table'],
    ['admin/ticket-management/business-workflows', '#view .wfc']
  ]) {
    await test.step(route, async () => {
      await page.goto(`/features/${route}/index.html`);
      await expect(page.locator(selector).first()).toBeVisible();
      if (selector === '#employee' || selector === '#manager') {
        await expect(page.frameLocator(selector).locator('table').first()).toBeVisible();
      }
    });
  }
});

test('CI-06: Profile contact edit opens its iframe and cancel restores Profile', async ({ page }) => {
  await page.goto('/features/employee-profile/index.html');
  const toggle = page.locator('#toggle-lien-lac');
  if (await toggle.getAttribute('aria-expanded') !== 'true') await toggle.click();
  await page.getByRole('button', { name: 'Edit Contact Information', exact: true }).click();
  const form = page.frameLocator('.profile-editor-layer iframe');
  await expect(form.locator('#backFooter')).toBeVisible();
  await form.locator('#backFooter').click();
  // The form portals its confirmation into the parent document.
  await page.getByRole('button', { name: 'Quay lại', exact: true }).click();
  await expect(page.locator('.profile-editor-layer')).toHaveCount(0);
  await toggle.click();
  await expect(toggle).toHaveAttribute('aria-expanded', 'false');
});

test('CI-07: Create Task cancel can retain input or discard without creating a task', async ({ page }) => {
  await page.goto('/features/tasks/manage-tasks/index.html');
  const before = await page.evaluate(() => JSON.stringify(localStorage));
  await page.getByRole('link', { name: 'Create Task', exact: true }).click();
  await page.locator('#taskName').fill('CI unsaved task');
  await page.locator('#cancelCreate').click();
  await expect(page.locator('#createTaskExitDialog')).toBeVisible();
  await page.locator('#createTaskStay').click();
  await expect(page.locator('#taskName')).toHaveValue('CI unsaved task');
  await page.locator('#cancelCreate').click();
  await page.locator('#createTaskLeave').click();
  await expect(page.locator('#taskWorkspaceDrawer')).toBeHidden();
  await expect(page.locator('#statusFilter')).toBeEnabled();
  expect(await page.evaluate(() => JSON.stringify(localStorage))).toBe(before);
});

test('CI-08: Approval opens the selected ticket and closes back to its list', async ({ page }) => {
  await page.goto('/features/tickets/approvals/index.html');
  const manager = page.frameLocator('#manager');
  const button = manager.getByRole('button', { name: 'View & Approve', exact: true }).first();
  const row = button.locator('xpath=ancestor::tr');
  const ticket = (await row.locator('.c-code').innerText()).trim();
  expect(ticket).not.toBe('');
  await button.click();
  await expect(page.locator('#ticketDrawerDialog')).toBeVisible();
  const drawer = page.frameLocator('#ticketDrawerFrame');
  await expect(drawer.locator('body')).toContainText(ticket);
  await drawer.getByRole('button', { name: 'Close', exact: true }).click();
  await expect(page.locator('#ticketDrawerDialog')).toBeHidden();
  await expect(button).toBeEnabled();
});
