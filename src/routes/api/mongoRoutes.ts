import express from 'express'

import { MongoController } from '@/controllers/api/mongoController'
import { databaseService } from '@/util/databaseService'

const router = express.Router()

/**
 * Get all available collections
 */
router.get('/collections', MongoController.collections)

/**
 * Search across collections
 */
router.get('/search', MongoController.search)

/**
 * Dynamic route for any collection
 * Supports both 2014 and 2024 versions
 */
router.get('/:version/:collection', (req, res, next) => {
  const { version, collection } = req.params

  if (!['2014', '2024'].includes(version)) {
    res.status(400).json({ error: 'Version must be either "2014" or "2024"' })
    return
  }

  const collectionName = `${version}-${collection}`
  MongoController.index(req, res, next, collectionName)
})

/**
 * Dynamic route for specific item in a collection
 */
router.get('/:version/:collection/:index', (req, res, next) => {
  const { version, collection } = req.params

  if (!['2014', '2024'].includes(version)) {
    res.status(400).json({ error: 'Version must be either "2014" or "2024"' })
    return
  }

  const collectionName = `${version}-${collection}`
  MongoController.show(req, res, next, collectionName)
})

/**
 * Legacy route support - redirect to versioned routes
 */
router.get('/:collection', (req, res, next) => {
  const { collection } = req.params

  // Check if collection exists in 2014 first, then 2024
  databaseService
    .collectionExists(`2014-${collection}`)
    .then((exists2014) => {
      if (exists2014) {
        // Redirect to 2014 version
        const newUrl = req.url.replace(`/${collection}`, `/2014/${collection}`)
        return res.redirect(301, newUrl)
      }

      return databaseService.collectionExists(`2024-${collection}`).then((exists2024) => {
        if (exists2024) {
          // Redirect to 2024 version
          const newUrl = req.url.replace(`/${collection}`, `/2024/${collection}`)
          return res.redirect(301, newUrl)
        } else {
          // Collection doesn't exist in either version
          return res.status(404).json({
            error: `Collection '${collection}' not found in either 2014 or 2024 versions`
          })
        }
      })
    })
    .catch((error) => {
      console.error('Error checking collection existence:', error)
      next(error)
    })
})

/**
 * Legacy route for specific item
 */
router.get('/:collection/:index', (req, res, next) => {
  const { collection, index } = req.params

  // Check if collection exists in 2014 first, then 2024
  databaseService
    .collectionExists(`2014-${collection}`)
    .then((exists2014) => {
      if (exists2014) {
        // Redirect to 2014 version
        const newUrl = req.url.replace(`/${collection}/${index}`, `/2014/${collection}/${index}`)
        return res.redirect(301, newUrl)
      }

      return databaseService.collectionExists(`2024-${collection}`).then((exists2024) => {
        if (exists2024) {
          // Redirect to 2024 version
          const newUrl = req.url.replace(`/${collection}/${index}`, `/2024/${collection}/${index}`)
          return res.redirect(301, newUrl)
        } else {
          // Collection doesn't exist in either version
          return res.status(404).json({
            error: `Collection '${collection}' not found in either 2014 or 2024 versions`
          })
        }
      })
    })
    .catch((error) => {
      console.error('Error checking collection existence:', error)
      next(error)
    })
})

export default router
