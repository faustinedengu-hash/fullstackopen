const { test, expect, describe, beforeEach } = require('@playwright/test')

test.describe.serial('Blog app', () => {
  beforeEach(async ({ page, request }) => {
    await request.post('http://localhost:3003/api/testing/reset')
    await request.post('http://localhost:3003/api/users', {
      data: { username: 'faustine_test', name: 'Faustine', password: 'password123' }
    })
    await request.post('http://localhost:3003/api/users', {
      data: { username: 'hacker_user', name: 'Hacker', password: 'password123' }
    })
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
      await expect(page.getByText('Faustine logged in')).toBeVisible()
    })

    test('fails with wrong credentials', async ({ page }) => {
      await page.locator('input[name="Username"]').fill('wrong')
      await page.locator('input[name="Password"]').fill('wrong')
      await page.getByRole('button', { name: 'login' }).click()
      await expect(page.getByText('wrong username or password')).toBeVisible()
    })
  })

  describe('When logged in', () => {
    beforeEach(async ({ page }) => {
      await page.locator('input[name="Username"]').fill('faustine_test')
      await page.locator('input[name="Password"]').fill('password123')
      await page.getByRole('button', { name: 'login' }).click()
      await page.getByText('Faustine logged in').waitFor()
    })

    test('a new blog can be created', async ({ page }) => {
      await page.getByRole('button', { name: 'new blog' }).click()
      await page.getByPlaceholder('title').fill('First Blog')
      await page.getByPlaceholder('author').fill('Bot')
      await page.getByPlaceholder('url').fill('http://test.com')
      await page.getByRole('button', { name: 'create' }).click()
      await expect(page.locator('.blog').filter({ hasText: 'First Blog' })).toBeVisible()
    })

    test('a blog can be liked', async ({ page }) => {
      await page.getByRole('button', { name: 'new blog' }).click()
      await page.getByPlaceholder('title').fill('Likeable Blog')
      await page.getByPlaceholder('author').fill('Bot')
      await page.getByPlaceholder('url').fill('http://test.com')
      await page.getByRole('button', { name: 'create' }).click()
      
      // Look for the specific blog container using your className
      const blog = page.locator('.blog').filter({ hasText: 'Likeable Blog' })
      await blog.getByRole('button', { name: 'view' }).click()
      await blog.getByRole('button', { name: 'like' }).click()
      await expect(blog).toContainText('likes 1')
    })

    test('a blog can be deleted', async ({ page }) => {
      await page.getByRole('button', { name: 'new blog' }).click()
      await page.getByPlaceholder('title').fill('Delete Me')
      await page.getByPlaceholder('author').fill('Bot')
      await page.getByPlaceholder('url').fill('http://delete.com')
      await page.getByRole('button', { name: 'create' }).click()

      const blog = page.locator('.blog').filter({ hasText: 'Delete Me' })
      await blog.getByRole('button', { name: 'view' }).click()
      
      page.on('dialog', dialog => dialog.accept())
      await blog.getByRole('button', { name: 'remove' }).click()
      await expect(page.locator('.blog').filter({ hasText: 'Delete Me' })).not.toBeVisible()
    })

    test('only the creator can see the delete button', async ({ page }) => {
      await page.getByRole('button', { name: 'new blog' }).click()
      await page.getByPlaceholder('title').fill('Faustine Blog')
      await page.getByPlaceholder('author').fill('Faustine')
      await page.getByPlaceholder('url').fill('http://faustine.com')
      await page.getByRole('button', { name: 'create' }).click()

      await page.getByRole('button', { name: 'logout' }).click()

      await page.locator('input[name="Username"]').fill('hacker_user')
      await page.locator('input[name="Password"]').fill('password123')
      await page.getByRole('button', { name: 'login' }).click()

      const blog = page.locator('.blog').filter({ hasText: 'Faustine Blog' })
      await blog.getByRole('button', { name: 'view' }).click()
      await expect(blog.getByRole('button', { name: 'remove' })).not.toBeVisible()
    })

    test('blogs are ordered by likes', async ({ page }) => {
      await page.getByRole('button', { name: 'new blog' }).click()
      await page.getByPlaceholder('title').fill('Zero')
      await page.getByPlaceholder('author').fill('Bot')
      await page.getByPlaceholder('url').fill('http://zero.com')
      await page.getByRole('button', { name: 'create' }).click()
      await page.locator('.blog').filter({ hasText: 'Zero' }).waitFor()

      const titleInput = page.getByPlaceholder('title')
      if (!(await titleInput.isVisible())) {
        await page.getByRole('button', { name: 'new blog' }).click()
      }

      await titleInput.fill('Most')
      await page.getByPlaceholder('author').fill('Bot')
      await page.getByPlaceholder('url').fill('http://most.com')
      await page.getByRole('button', { name: 'create' }).click()
      await page.locator('.blog').filter({ hasText: 'Most' }).waitFor()

      const blogToLike = page.locator('.blog').filter({ hasText: 'Most' })
      await blogToLike.getByRole('button', { name: 'view' }).click()
      await blogToLike.getByRole('button', { name: 'like' }).click()
      
      await page.getByText('likes 1').waitFor()
      await page.waitForTimeout(1000) // Small pause to allow React to sort

      // Check if the FIRST '.blog' element contains the title 'Most'
      const firstBlog = page.locator('.blog').first()
      await expect(firstBlog).toContainText('Most')
    })
  })
})