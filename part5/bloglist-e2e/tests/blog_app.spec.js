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
      // Enter the winning combo
      // Enter the NEW winning combo
      await page.locator('input[name="Username"]').fill('faustine_test') 
      await page.locator('input[name="Password"]').fill('password123')
      await page.getByRole('button', { name: 'login' }).click()

      // The robot waits to see this text
      await expect(page.getByText('logged in')).toBeVisible()
    })

    test('fails with wrong credentials', async ({ page }) => {
      // 1. Fill out with garbage data
      await page.locator('input[name="Username"]').fill('wrong-user')
      await page.locator('input[name="Password"]').fill('wrong-pass')
      
      await page.getByRole('button', { name: 'login' }).click()

      // 2. Verify error message: Matches your App.jsx catch block text
      const errorDiv = page.locator('.error') 
      await expect(page.getByText('wrong username or password')).toBeVisible()
      
      // 3. Verify we are NOT logged in
      await expect(page.getByText('logged in')).not.toBeVisible()
    })
  })
})