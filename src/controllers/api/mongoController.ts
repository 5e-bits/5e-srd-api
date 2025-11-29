import { NextFunction, Request, Response } from 'express'
import mongoose from 'mongoose'

import { escapeRegExp, redisClient, ResourceList } from '@/util'
import { databaseService } from '@/util/databaseService'

interface SearchQuery {
  [key: string]: any
}

interface PaginationOptions {
  page: number
  limit: number
  skip: number
}

/**
 * Generic controller for MongoDB Atlas collections
 */
export class MongoController {
  /**
   * Get all items from a collection with optional filtering and pagination
   */
  public static async index(
    req: Request,
    res: Response,
    next: NextFunction,
    collectionName: string
  ): Promise<void> {
    try {
      // Check if collection exists
      const exists = await databaseService.collectionExists(collectionName)
      if (!exists) {
        res.status(404).json({ error: `Collection '${collectionName}' not found` })
        return
      }

      const db = mongoose.connection.db
      if (!db) {
        res.status(500).json({ error: 'Database connection not available' })
        return
      }
      const collection = db.collection(collectionName)

      // Parse query parameters
      const { page = 1, limit = 20, search, sort = 'name', order = 'asc', ...filters } = req.query

      const pageNum = Math.max(1, parseInt(page as string))
      const limitNum = Math.min(100, Math.max(1, parseInt(limit as string)))
      const skip = (pageNum - 1) * limitNum

      // Build search query
      const searchQuery: SearchQuery = {}

      if (search) {
        // Search in name field (case-insensitive)
        searchQuery.name = { $regex: new RegExp(escapeRegExp(search as string), 'i') }
      }

      // Add other filters
      Object.keys(filters).forEach((key) => {
        const value = filters[key]
        if (value !== undefined && value !== '') {
          if (Array.isArray(value)) {
            searchQuery[key] = { $in: value }
          } else {
            searchQuery[key] = value
          }
        }
      })

      // Build sort object
      const sortOrder = order === 'desc' ? -1 : 1
      const sortObj = { [sort as string]: sortOrder } as any

      // Get total count for pagination
      const totalCount = await collection.countDocuments(searchQuery)
      const totalPages = Math.ceil(totalCount / limitNum)

      // Execute query with pagination
      const data = await collection
        .find(searchQuery)
        .sort(sortObj)
        .skip(skip)
        .limit(limitNum)
        .toArray()

      // Format response
      const response = {
        count: data.length,
        total: totalCount,
        page: pageNum,
        total_pages: totalPages,
        results: data.map((item) => ({
          index: item.index || item._id,
          name: item.name,
          url: item.url || `/api/${collectionName}/${item.index || item._id}`
        }))
      }

      // Cache the response (optional)
      if (redisClient) {
        try {
          const redisKey = req.originalUrl
          await redisClient.setEx(redisKey, 300, JSON.stringify(response)) // 5 minutes
        } catch (error) {
          // Redis caching failed, continue without cache
          console.log('Redis caching failed for', req.originalUrl, ':', error instanceof Error ? error.message : String(error))
        }
      }

      res.status(200).json(response)
    } catch (error) {
      console.error(`Error in ${collectionName} index:`, error)
      next(error)
    }
  }

  /**
   * Get a single item by index or ID
   */
  public static async show(
    req: Request,
    res: Response,
    next: NextFunction,
    collectionName: string
  ): Promise<void> {
    try {
      const { index } = req.params

      // Check if collection exists
      const exists = await databaseService.collectionExists(collectionName)
      if (!exists) {
        res.status(404).json({ error: `Collection '${collectionName}' not found` })
        return
      }

      const db = mongoose.connection.db
      if (!db) {
        res.status(500).json({ error: 'Database connection not available' })
        return
      }
      const collection = db.collection(collectionName)

      // Try to find by index first, then by _id
      let item = await collection.findOne({ index })

      if (!item) {
        // Try to find by _id if it's a valid ObjectId
        if (mongoose.Types.ObjectId.isValid(index)) {
          item = await collection.findOne({ _id: new mongoose.Types.ObjectId(index) })
        }
      }

      if (!item) {
        res
          .status(404)
          .json({ error: `Item with index '${index}' not found in collection '${collectionName}'` })
        return
      }

      // Cache the response (optional)
      if (redisClient) {
        try {
          const redisKey = req.originalUrl
          await redisClient.setEx(redisKey, 600, JSON.stringify(item)) // 10 minutes
        } catch (error) {
          // Redis caching failed, continue without cache
          console.log('Redis caching failed for', req.originalUrl, ':', error instanceof Error ? error.message : String(error))
        }
      }

      res.status(200).json(item)
    } catch (error) {
      console.error(`Error in ${collectionName} show:`, error)
      next(error)
    }
  }

  /**
   * Search across multiple collections
   */
  public static async search(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { q: query, collections, version = '2014' } = req.query

      if (!query) {
        res.status(400).json({ error: 'Search query parameter "q" is required' })
        return
      }

      const db = mongoose.connection.db
      if (!db) {
        res.status(500).json({ error: 'Database connection not available' })
        return
      }
      const searchResults: any[] = []

      // Determine which collections to search
      let collectionsToSearch: string[] = []

      if (collections) {
        // Search specific collections
        const collectionList = Array.isArray(collections) ? collections : [collections]
        collectionsToSearch = collectionList.map((col) => `${version}-${col}`)
      } else {
        // Search all collections for the version
        collectionsToSearch = await databaseService.getCollections(version as '2014' | '2024')
        collectionsToSearch = collectionsToSearch.map((col) => `${version}-${col}`)
      }

      // Search each collection
      for (const collectionName of collectionsToSearch) {
        try {
          const collection = db.collection(collectionName)
          const results = await collection
            .find({
              name: { $regex: new RegExp(escapeRegExp(query as string), 'i') }
            })
            .limit(10)
            .toArray()

          results.forEach((item) => {
            searchResults.push({
              ...item,
              collection: collectionName.replace(`${version}-`, ''),
              version
            })
          })
        } catch (error) {
          console.warn(`Error searching collection ${collectionName}:`, error)
        }
      }

      // Sort results by relevance (exact matches first)
      searchResults.sort((a, b) => {
        const aExact = a.name.toLowerCase() === (query as string).toLowerCase()
        const bExact = b.name.toLowerCase() === (query as string).toLowerCase()

        if (aExact && !bExact) return -1
        if (!aExact && bExact) return 1
        return a.name.localeCompare(b.name)
      })

      const response = {
        query: query as string,
        count: searchResults.length,
        results: searchResults.slice(0, 50) // Limit to 50 results
      }

      res.status(200).json(response)
    } catch (error) {
      console.error('Error in search:', error)
      next(error)
    }
  }

  /**
   * Get collection information
   */
  public static async collections(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const allCollections = await databaseService.getAllCollections()

      const response = {
        '2014': {
          count: allCollections['2014'].length,
          collections: allCollections['2014']
        },
        '2024': {
          count: allCollections['2024'].length,
          collections: allCollections['2024']
        }
      }

      res.status(200).json(response)
    } catch (error) {
      console.error('Error getting collections:', error)
      next(error)
    }
  }
}
