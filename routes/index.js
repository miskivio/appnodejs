const express = require ('express')
const passport = require ('passport')
const { ensureAuth, ensureGuest } = require ('../middleware/auth')
const Story = require('../models/Story')

const router = express.Router()

// atuhwith Google
// get auth/google
router.get('/google', passport.authenticate('google', {scope: ['profile']}))

//Google auth callback
// get /auth/google/callback
router.get('/google/callback', passport.authenticate('google', {
    failureRedirect: '/'
}), (req, res) => {
    res.redirect('/tools')
})

//login
// get
router.get('/', ensureGuest, (req,res) => {
    res.render('login', {
        layout: 'login'
    })
})

//tools
// get/tools
router.get('/tools', ensureAuth, async (req,res) => {
    try {
        const stories = await Story.find({user: req.user.id}).lean()
        res.render('tools',{
            name: req.user.firstNamem,
            stories
        })
    } catch (err) {
        console.error(err)
    }

})

//logout user
// /auth/logout
router.get('/logout', (req, res )=> {
    req.logout()
    res.redirect('/')
})

module.exports = router