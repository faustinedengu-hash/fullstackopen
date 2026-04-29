const { test, expect, describe, beforeEach } = require('@playwright/test')

describe('Blog app', () => {
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

  describe('When logged in', () => {
    beforeEach(async ({ page }) => {
      await page.locator('input[name="Username"]').fill('faustine_test')
      await page.locator('input[name="Password"]').fill('password123')
      await page.getByRole('button', { name: 'login' }).click()
    })

    test('a new blog can be created', async ({ page }) => {
      await page.getByRole('button', { name: 'new blog' }).click()
      await page.getByPlaceholder('title').fill('A Robot Wrote This Blog')
      await page.getByPlaceholder('author').fill('Playwright Bot')
      await page.getByPlaceholder('url').fill('http://robot-blog.com')
      await page.getByRole('button', { name: 'create' }).click()

      await expect(page.getByText('A Robot Wrote This Blog').first()).toBeVisible()
    })

    // EXERCISE 5.20 - Now it is safely outside the beforeEach!
    test('a blog can be liked', async ({ page }) => {
      await page.getByRole('button', { name: 'new blog' }).click()
      await page.getByPlaceholder('title').fill('A Blog to Like')
      await page.getByPlaceholder('author').fill('Playwright Bot')
      await page.getByPlaceholder('url').fill('http://like-me.com')
      await page.getByRole('button', { name: 'create' }).click()

      await expect(page.getByText('A Blog to Like').first()).toBeVisible()

      // Expand the last blog in the list
      await page.getByRole('button', { name: 'view' }).last().click()
      
      // Smash the like button (using .first() so the robot doesn't panic)
      await page.getByRole('button', { name: 'like' }).first().click()

      // Verify the likes go up to 1 (using .first() to ignore any other blogs)
      await expect(page.getByText('likes 1').first()).toBeVisible()
    })
  })
})