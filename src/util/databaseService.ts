import mongoose from 'mongoose'

import { mongodbUri } from './environmentVariables'

/**
 * Database service for managing MongoDB Atlas connections and operations
 */
export class DatabaseService {
  private static instance: DatabaseService
  private isConnected = false

  private constructor() {}

  public static getInstance(): DatabaseService {
    if (!DatabaseService.instance) {
      DatabaseService.instance = new DatabaseService()
    }
    return DatabaseService.instance
  }

  /**
   * Connect to MongoDB Atlas
   */
  public async connect(): Promise<void> {
    if (this.isConnected) {
      console.log('Database already connected')
      return
    }

    try {
      await mongoose.connect(mongodbUri, {
        maxPoolSize: 10,
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 45000
      })

      this.isConnected = true
      console.log('✅ Connected to MongoDB Atlas successfully')

      // Handle connection events
      mongoose.connection.on('error', (err) => {
        console.error('MongoDB connection error:', err)
        this.isConnected = false
      })

      mongoose.connection.on('disconnected', () => {
        console.log('MongoDB disconnected')
        this.isConnected = false
      })

      mongoose.connection.on('reconnected', () => {
        console.log('MongoDB reconnected')
        this.isConnected = true
      })
    } catch (error) {
      console.error('Failed to connect to MongoDB Atlas:', error)
      throw error
    }
  }

  /**
   * Disconnect from MongoDB Atlas
   */
  public async disconnect(): Promise<void> {
    if (!this.isConnected) {
      return
    }

    try {
      await mongoose.disconnect()
      this.isConnected = false
      console.log('Disconnected from MongoDB Atlas')
    } catch (error) {
      console.error('Error disconnecting from MongoDB Atlas:', error)
      throw error
    }
  }

  /**
   * Get connection status
   */
  public getConnectionStatus(): boolean {
    return this.isConnected
  }

  /**
   * Get available collections for a specific version
   */
  public async getCollections(version: '2014' | '2024'): Promise<string[]> {
    try {
      const db = mongoose.connection.db
      if (!db) {
        throw new Error('Database connection not available')
      }
      const collections = await db.listCollections().toArray()

      return collections
        .map((col) => col.name)
        .filter((name) => name.startsWith(`${version}-`))
        .map((name) => name.replace(`${version}-`, ''))
        .sort()
    } catch (error) {
      console.error(`Error getting ${version} collections:`, error)
      throw error
    }
  }

  /**
   * Get all available collections
   */
  public async getAllCollections(): Promise<{ '2014': string[]; '2024': string[] }> {
    try {
      const [collections2014, collections2024] = await Promise.all([
        this.getCollections('2014'),
        this.getCollections('2024')
      ])

      return {
        '2014': collections2014,
        '2024': collections2024
      }
    } catch (error) {
      console.error('Error getting all collections:', error)
      throw error
    }
  }

  /**
   * Get collection count
   */
  public async getCollectionCount(collectionName: string): Promise<number> {
    try {
      const db = mongoose.connection.db
      if (!db) {
        throw new Error('Database connection not available')
      }
      const collection = db.collection(collectionName)
      return await collection.countDocuments()
    } catch (error) {
      console.error(`Error getting count for collection ${collectionName}:`, error)
      throw error
    }
  }

  /**
   * Check if a collection exists
   */
  public async collectionExists(collectionName: string): Promise<boolean> {
    try {
      const db = mongoose.connection.db
      if (!db) {
        return false
      }
      const collections = await db.listCollections({ name: collectionName }).toArray()
      return collections.length > 0
    } catch (error) {
      console.error(`Error checking if collection ${collectionName} exists:`, error)
      return false
    }
  }
}

export const databaseService = DatabaseService.getInstance()
