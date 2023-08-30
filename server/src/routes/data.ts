import express, { Response, Request } from 'express'
import db, { Record } from '../lib/db'

const router = express.Router()

router.post('/create', (req: Request, res: Response) => {

    try {

        const query = req.body as any as Record

        // if any of the required fields are missing, return an error
        if (!query.name || !query.email || !query.phone || !query.age) {
            return res.status(400).send({ message: 'Missing required fields' })
        }

        const result = db.insert(query)
        if (!result.success) return res.status(500).send({ message: 'Failed to insert data' })

        return res.status(200).send({ message: 'Data created', data: result.record })
    } catch (error: any) {
        return res.status(500).send({ message: error.message })
    }

})

const find = (query: Partial<Record>, res: Response) => {

    try {
        const records = db.find(query)
        return res.status(200).send(records)
    } catch (error: any) {
        return res.status(500).send({ message: error.message })
    }

}

router.get('/find', (req: Request, res: Response) => find(req.query, res))
router.post('/find', (req: Request, res: Response) => find(req.body, res))

router.get('/all', (req: Request, res: Response) => {

    try {
        const records = db.getAll()
        return res.status(200).send(records)
    } catch (error: any) {
        return res.status(500).send({ message: error.message })
    }

})

router.get('/:id', (req: Request, res: Response) => {

    try {

        const id = req.params.id
        const record = db.findById(id)

        if (!record)
            return res.status(404).send({ message: 'Data not found' })

        return res.status(200).send(record)
    } catch (error: any) {
        return res.status(500).send({ message: error.message })
    }

})

router.post('/:id', (req: Request, res: Response) => {

    try {

        const id = req.params.id
        const query = req.body as any as Record

        if (!id)
            return res.status(400).send({ message: 'id is required' })

        db.update(id, query)

        return res.status(200).send({ message: 'Data updated' })
    } catch (error: any) {
        return res.status(500).send({ message: error.message })
    }

})

router.delete('/:id', (req: Request, res: Response) => {

    try {

        const id = req.params.id

        if (!id)
            return res.status(400).send({ message: 'id is required' })

        db.delete(id)

        return res.status(200).send({ message: 'Data deleted' })
    } catch (error: any) {
        return res.status(500).send({ message: error.message })
    }

})

export default router