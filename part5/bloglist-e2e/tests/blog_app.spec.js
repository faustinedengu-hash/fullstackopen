const { test, expect, describe, beforeEach } = require('@playwright/test')

describe('Blog app', () => {
  // Before every single test, the robot goes to our homepage
  beforeEach(async ({ page }) => {
    await page.goto('')
  })

  test('Login form is shown', async ({ page }) => {
    await expect(page.getByText('Log in to application')).toBeVisible()
  })

  describe('Login', () => {
    test('succeeds with correct credentials', async ({ page }) => {
      await page.locator('input[name="Username"]').fill('faustine_test') 
      await page.locator('input[name="Password"]').fill('password123')
      await page.getByRole('button', { name: 'login' }).click()

      await expect(page.getByText('logged in')).toBeVisible()
    })

    test('fails with wrong credentials', async ({ page }) => {
      await page.locator('input[name="Username"]').fill('wrong-user')
      await page.locator('input[name="Password"]').fill('wrong-pass')
      await page.getByRole('button', { name: 'login' }).click()

      await expect(page.getByText('wrong username or password')).toBeVisible()
      await expect(page.getByText('logged in')).not.toBeVisible()
    })
  })

  // --- EXERCISE 5.19: THIS IS THE NEW PART ---
  describe('When logged in', () => {
    beforeEach(async ({ page }) => {
      // The robot automatically logs in before running the blog creation test
      await page.locator('input[name="Username"]').fill('faustine_test')
      await page.locator('input[name="Password"]').fill('password123')
      await page.getByRole('button', { name: 'login' }).click()
    })

    test('a new blog can be created', async ({ page }) => {
      // 1. Click the button to reveal the form (assuming the button to open it says 'new blog')
      await page.getByRole('button', { name: 'new blog' }).click()

      // 2. Fill out the form fields using the exact placeholders from your screenshot
      await page.getByPlaceholder('title').fill('A Robot Wrote This Blog')
      await page.getByPlaceholder('author').fill('Playwright Bot')
      await page.getByPlaceholder('url').fill('http://robot-blog.com')

      // 3. Click the create button
      await page.getByRole('button', { name: 'create' }).click()

      // 4. Verify the new blog's title is rendered on the screen
      await expect(page.getByText('A Robot Wrote This Blog').first()).toBeVisible()
    })
  })
})