const userRouter = require('express').Router()
const User = require('../models/user')
const bcrypt = require('bcrypt')
const mongoose = require('mongoose')

userRouter.get('/', async (request, response) => {
    const users = await User.find({}).populate('blogs', {content: 1, important: 1})
    response.status(200).json(users)
})
userRouter.post('/', async (request, response) => {
    const body = request.body
    const salt = 10
    const passwordHash = await bcrypt.hash(body.password, salt)

    const newUser = new User({
        username: body.username,
        passwordHash: passwordHash
    })

    const savedUser = await newUser.save()
    response.status(201).json(savedUser)
})

module.exports = userRouter