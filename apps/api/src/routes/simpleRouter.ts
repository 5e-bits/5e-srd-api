import express, { NextFunction, Request, Response } from 'express'

type Handler = (req: Request, res: Response, next: NextFunction) => unknown

/** Router for the list and show-by-index endpoints shared by most resources. */
export const simpleRouter = (controller: { index: Handler; show: Handler }) => {
  const router = express.Router()
  router.get('/', (req, res, next) => {
    controller.index(req, res, next)
  })
  router.get('/:index', (req, res, next) => {
    controller.show(req, res, next)
  })
  return router
}
