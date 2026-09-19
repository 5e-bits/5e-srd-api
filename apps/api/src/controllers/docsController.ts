import { Request, Response } from 'express'

export default (req: Request, res: Response) => {
  res.redirect('https://5e-bits.github.io/docs')
}
