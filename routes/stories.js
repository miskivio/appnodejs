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

// post stories
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
        res.render('error/500')
    }
})

// get story
// get /stories/:id
router.get('/:id', ensureAuth, async(req,res) => {
    try {
        let story = await Story.findById(req.params.id)
        .populate('user')
        .lean()
        if(!story) {
            return res.render('error/404')
        }
 
           res.render('stories/show', {
               story
           })

    } catch(err) {
        console.error(err)
        return res.render('error/404')
    } 
})

// show show edit page
// get /stories/edit/:id
router.get('/edit/:id', ensureAuth, async (req,res) => {
    try {
        const story = await Story.findOne({
            _id:req.params.id
        }).lean()
    
        if(!story) {
            return res.render('error/404')
        }
    
        if(story.user != req.user.id) {
            res.redirect('/stories')
        } else {
            res.render('stories/edit', {
                story
            })
            
        }
    } catch(err) {
        console.log(err)
        return res.render('error/500')
    } 
    
})

// update story
// put /stories/:id
router.put('/:id', ensureAuth, async(req,res) => {
    
    try {
        let story = await Story.findById(req.params.id).lean()
        if(!story) {
            return res.render('error/404')
        }
        if(story.user != req.user.id) {
            res.redirect('/stories')
        } else {
            story = await Story.findOneAndUpdate({_id: req.params.id}, req.body )
            res.redirect('/tools')
        }
    } catch(err) {
        console.log(err)
        return res.render('error/500')
    } 
})

module.exports = router

// update story
// put /stories/:id
router.delete('/:id', ensureAuth, async(req,res) => {
   try {
       await Story.remove({ _id: req.params.id})
       res.redirect('/tools')
   } catch (err) {
    console.log(err)
    return res.render('error/500')
   }

   })


   // show user stories
// get stories/user/:userId
router.get('/user/:userId', ensureAuth, async(req,res) => {
 try {
     const stories = await  Story.find({
         user: req.params.userId,
         status: 'public'
     }).populate('user').lean()
     res.render('stories/index', {
         stories
     })
 } catch (err){
    console.error(err)
    res.render('error/500')
 }
})

module.exports = router
