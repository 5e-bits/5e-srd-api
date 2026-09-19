import { modelOptions, Severity } from '@typegoose/typegoose'

/**
 * Helper function to recursively remove _id and __v fields.
 * @param obj The object or array to process.
 */
function removeInternalFields(obj: any): any {
  if (Array.isArray(obj)) {
    return obj.map(removeInternalFields)
  } else if (obj !== null && typeof obj === 'object') {
    // Mongoose documents might have a toObject method, use it if available
    const plainObject = typeof obj.toObject === 'function' ? obj.toObject() : obj

    // Create a new object to avoid modifying the original Mongoose document directly if necessary
    const newObj: any = {}
    for (const key in plainObject) {
      if (key !== '_id' && key !== '__v' && key !== 'id') {
        newObj[key] = removeInternalFields(plainObject[key])
      }
    }
    return newObj
  }
  return obj // Return primitives/unhandled types as is
}

/**
 * Creates common Typegoose model options for SRD API models.
 * - Sets the collection name.
 * - Disables the default _id field.
 * - Enables timestamps (createdAt, updatedAt).
 * - Configures toJSON and toObject transforms to remove _id and __v recursively.
 *
 * @param collectionName The name of the MongoDB collection.
 * @returns A Typegoose ClassDecorator.
 */
export function srdModelOptions(collectionName: string): ClassDecorator {
  return modelOptions({
    // It's often good practice to explicitly set allowMixed
    options: { allowMixed: Severity.ALLOW },
    schemaOptions: {
      collection: collectionName,
      // Prevent Mongoose from managing the _id field directly
      _id: false,
      // Automatically add createdAt and updatedAt timestamps
      timestamps: true,
      // Modify the object when converting to JSON (e.g., for API responses)
      toJSON: {
        virtuals: true, // Ensure virtuals are included if you add any
        transform: (doc, ret) => {
          return removeInternalFields(ret)
        }
      },
      // Also apply the same transform when converting to a plain object
      toObject: {
        virtuals: true,
        transform: (doc, ret) => {
          return removeInternalFields(ret)
        }
      }
    }
  })
}
