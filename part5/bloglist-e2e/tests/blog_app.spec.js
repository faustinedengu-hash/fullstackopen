const { test, expect, describe } = require('@playwright/test')

describe('Blog app', () => {
  test('Login form is shown', async ({ page }) => {
    // 1. Playwright goes to your app (http://localhost:5173)
    await page.goto('')

    // 2. We check if the text "Log in to application" is visible on the screen
    const locator = page.getByText('Log in to application')
    await expect(locator).toBeVisible()
  })
})
