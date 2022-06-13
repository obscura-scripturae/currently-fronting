import type { NextApiRequest, NextApiResponse } from 'next'
import sharp from 'sharp'

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'GET') {
    try {
      const route =
        (req.query.route as string) === 'systems' ? 'systems' : 'members'
      const id = /[a-z]{5}/.test(req.query.id as string)
        ? (req.query.id as string)
        : null
      if (!id) {
        res.status(404).json({ error: 'Member not found' })
      } else {
        const data = await fetch(`https://api.pluralkit.me/v2/${route}/${id}`)
        const json = await data.json()
        const initialImage = await fetch(json[req.query.image as string])
        const initialArrayBuffer = await initialImage.arrayBuffer()
        const initialBuffer = Buffer.from(initialArrayBuffer)
        const resizedBuffer = await sharp(initialBuffer)
          .resize({
            width: parseInt(req.query.width as string),
            height: parseInt(req.query.height as string),
          })
          .toFormat('webp')
          .toBuffer()
        res
          .setHeader('Content-Type', 'image/webp')
          .status(200)
          .send(resizedBuffer)
      }
    } catch (error) {
      res.status(500).json({ error: (error as Error).message })
    }
  } else {
    res.status(405).json({ error: `Method ${req.method} not allowed` })
  }
}

export default handler
