import { Request, Response } from 'express'
import mongoose from 'mongoose'

import { databaseService } from '@/util/databaseService'

/**
 * Health check controller for monitoring API and database status
 */
export const healthCheck = async (req: Request, res: Response): Promise<void> => {
  try {
    const dbStatus = databaseService.getConnectionStatus()
    const dbReadyState = mongoose.connection.readyState

    // MongoDB ready states: 0 = disconnected, 1 = connected, 2 = connecting, 3 = disconnecting
    const readyStateMap = {
      0: 'disconnected',
      1: 'connected',
      2: 'connecting',
      3: 'disconnecting'
    }

    const health = {
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      database: {
        status: dbStatus ? 'connected' : 'disconnected',
        readyState: readyStateMap[dbReadyState as keyof typeof readyStateMap] || 'unknown',
        name: mongoose.connection.name || '5e-database'
      },
      memory: {
        used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
        total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024)
      },
      version: process.env.npm_package_version || 'unknown'
    }

    const statusCode = dbStatus ? 200 : 503
    res.status(statusCode).json(health)
  } catch (error) {
    console.error('Health check error:', error)
    res.status(500).json({
      status: 'error',
      timestamp: new Date().toISOString(),
      error: 'Health check failed'
    })
  }
}

/**
 * Detailed health check with collection information
 */
export const detailedHealthCheck = async (req: Request, res: Response): Promise<void> => {
  try {
    const dbStatus = databaseService.getConnectionStatus()

    if (!dbStatus) {
      res.status(503).json({
        status: 'error',
        timestamp: new Date().toISOString(),
        error: 'Database not connected'
      })
      return
    }

    // Get collection information
    const collections = await databaseService.getAllCollections()

    // Get some sample counts
    const sampleCounts: Record<string, number> = {}

    try {
      sampleCounts['2014-spells'] = await databaseService.getCollectionCount('2014-spells')
      sampleCounts['2014-monsters'] = await databaseService.getCollectionCount('2014-monsters')
      sampleCounts['2024-ability-scores'] =
        await databaseService.getCollectionCount('2024-ability-scores')
    } catch (error) {
      console.warn('Error getting sample counts:', error)
    }

    const health = {
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      database: {
        status: 'connected',
        name: mongoose.connection.name || '5e-database',
        collections: {
          '2014': {
            count: collections['2014'].length,
            collections: collections['2014']
          },
          '2024': {
            count: collections['2024'].length,
            collections: collections['2024']
          }
        },
        sampleCounts
      },
      memory: {
        used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
        total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024),
        external: Math.round(process.memoryUsage().external / 1024 / 1024)
      },
      version: process.env.npm_package_version || 'unknown'
    }

    res.status(200).json(health)
  } catch (error) {
    console.error('Detailed health check error:', error)
    res.status(500).json({
      status: 'error',
      timestamp: new Date().toISOString(),
      error: 'Detailed health check failed'
    })
  }
}
