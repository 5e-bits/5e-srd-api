import SimpleController from '@/controllers/simpleController'
import Background from '@/models/2014/background'
import { CreateBackgroundSchema, UpdateBackgroundSchema } from '@/schemas/schemas'
import { NextFunction, Request, Response } from 'express'

class BackgroundController extends SimpleController {
  constructor() {
    super(Background)
  }

    
    async create(req: Request, res: Response, next: NextFunction) {
        try {
            const validatedBody = CreateBackgroundSchema.safeParse(req.body);

            // If validation fails, return a 400 Bad Request with error details
            if (!validatedBody.success) {
                return res.status(400).json({ error: 'Invalid request body', details: validatedBody.error.issues });
            }

            //  Extract validated data, constructing url from index
            const backgroundData = {
              _id: validatedBody.data.index,
              ...validatedBody.data,
              url: `/api/2014/backgrounds/${validatedBody.data.index}`,
              updated_at: new Date().toISOString()
            };

            console.log('Creating background with data:', backgroundData);

            // Create a new background document in the database
            await this.Schema.create(backgroundData);

            return res.status(201).json({ message: 'Background created successfully' });
            

        } catch (err) {
            console.error('Error creating background:', err);
            next(err)
        }
    }

    async update(req: Request, res: Response, next: NextFunction) { 
        try {

            //  Parse and validate request body
            const validatedBody = UpdateBackgroundSchema.safeParse(req.body);

            // If validation fails, return a 400 Bad Request with error details
            if (!validatedBody.success) {
                return res.status(400).json({ error: 'Invalid request body', details: validatedBody.error.issues });
            }

            //  Before updating, make sure the background exists
            const existingBackground = await this.Schema.findOne({ index: req.params.index });
            if (!existingBackground) {
                return res.status(404).json({ error: `Background ${req.params.index} not found` });
            }

            //  Extract validated data, constructing url from new index, if it has changed
            const backgroundData = {
            ...validatedBody.data,
            index: req.params.index,   // ← add this line
            url: `/api/2014/backgrounds/${req.params.index}`,
            updated_at: new Date().toISOString()
            };

            //  Update the existing background with the new data
            await this.Schema.updateOne({ index: req.params.index }, { $set: backgroundData });

            return res.status(200).json({ message: 'Background updated successfully' });
        } catch (err) {
            console.error(`Error updating background:`, err);
            next(err)
        }


    }
}

export default new BackgroundController()
