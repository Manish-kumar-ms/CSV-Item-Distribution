import express from 'express'
import { AddAgent, deleteAgentById, editAgentById, getAgentById, getAllAgents, uploadAndDistribute } from '../controller/AgentController.js'
import upload from '../Middleware/multer.js'
import { ensureAuthenticated } from '../Middleware/isAuth.js'


const router=express.Router()


router.post('/addAgent',ensureAuthenticated,AddAgent)
router.post('/uploadAndDistribute',ensureAuthenticated,upload.single('file'),uploadAndDistribute)
router.get('/getAgents',ensureAuthenticated,getAllAgents)
router.get('/:id',ensureAuthenticated,getAgentById)
router.delete('/deleteAgent/:id',ensureAuthenticated,deleteAgentById)
router.put('/editAgent/:id',ensureAuthenticated,editAgentById)

export default router