const { test, expect, describe, beforeEach } = require('@playwright/test')

describe('Blog app', () => {
  beforeEach(async ({ page, request }) => {
    // Both URLs now point to 3003
    await request.post('http://localhost:3003/api/testing/reset')
    await request.post('http://localhost:3003/api/users', {
      data: { username: 'faustine_test', name: 'Faustine', password: 'password123' }
    })
    await page.goto('')
  })

  describe('When logged in', () => {
    beforeEach(async ({ page }) => {
      await page.locator('input[name="Username"]').first().fill('faustine_test')
      await page.locator('input[name="Password"]').first().fill('password123')
      await page.getByRole('button', { name: 'login' }).click()
      await expect(page.getByText('Faustine logged in')).toBeVisible()
    })

    test('a blog can be deleted', async ({ page }) => {
      await page.getByRole('button', { name: 'new blog' }).click()
      await page.getByPlaceholder('title').fill('Final Test Blog')
      await page.getByPlaceholder('author').fill('Bot')
      await page.getByPlaceholder('url').fill('http://test.com')
      await page.getByRole('button', { name: 'create' }).click()

      await page.getByRole('button', { name: 'view' }).click()
      
      // The 5.21 "Fire" Fix: handle the popup
      page.on('dialog', dialog => dialog.accept())
      await page.getByRole('button', { name: 'remove' }).click()

      await expect(page.getByText('http://test.com')).not.toBeVisible()
    })
  })
})