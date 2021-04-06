const express = require ('express')
const passport = require ('passport')
const { ensureAuth } = require ('../middleware/auth')
const Story = require('../models/Story')

const router = express.Router()

// show add page
// get /stories/add
router.get('/add', ensureAuth, (req,res) => {
    res.render('stories/add')
})




// post /stories
router.post('/', ensureAuth, async (req,res) => {
   try {
    console.log(req.body)
        req.body.user = req.user.id
        await Story.create(req.body)
        res.redirect('/tools')
   } catch (err){
    
    res.render('error/500')
   }
})


// show show all stories
// get /stories
router.get('/', ensureAuth, async (req,res) => {
    try {
        const stories = await Story.find({status: 'public'})
        .populate('user')
        .sort({cratedAt: 'desc'})
        .lean()

        res.render('stories/index', {
            stories
        })
    } catch (err){
        console.error(err)
        res.render('errror/500')
    }
})

module.exports = router

