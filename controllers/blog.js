const blogRouter = require('express').Router()
const User = require('../models/user')
const jwt = require('jsonwebtoken')

const Blog = require('../models/blog')

blogRouter.get('/', async (request, response) => {
    const blogs = await Blog.find({}).populate('user',{username: 1, name: 1})
    response.json(blogs)
})

blogRouter.get('/:id', async (request, response) => {
    const blog = await Blog.findById(request.params.id)
    if(blog){
        response.json(blog)
    }
    else{
        repsonse.status(400).end()
    }
})

/*
const getTokenFrom = (request ) => {
    const auth = request.get('authorization')
    if( auth.startsWith("Bearer ")){
        return auth.replace("Bearer ", "")
    }
    return null
}
*/


blogRouter.post('/', async (request, response) => {
    //await Blog.deleteMany({})
    const blog = request.body
    console.log(request.token)
    console.log(typeof(request.token))
    const decodedToken = await jwt.verify(request.token, process.env.SECRET)
    console.log(decodedToken)

    if(!decodedToken.id){
        response.status(400).json({error: "Invalid Token"})
    }

    const creator = await User.findById(decodedToken.id)
    const addBlog = new Blog({
        title: blog.title,
        author: blog.author,
        url: blog.url,
        user: creator._id,
        likes: blog.likes ? blog.likes : 0
    })
  
    const newBlog  = await addBlog.save()
    creator.blogs = creator.blogs.concat(newBlog._id)
    await creator.save()
    response.status(201).json(newBlog)
  })

blogRouter.delete('/:id', async (request, response) => {
    const blogId = request.params.id
    const decodedToken = await jwt.verify(request.token, process.env.SECRET)
    if(!decodedToken.id){
        response.status(400).json({error: "invalid Token"})
    }
    const tokenUser = await User.findById(decodedToken.id)
    const blog = await Blog.findById(blogId)
    if(blog.user.toString() === tokenUser.id.toString()){
        const newBlog = await Blog.findByIdAndRemove(blogId)
        response.status(204).json(newBlog)
    }
    else{
        response.status(400).json({error: "invalid User"})
    }
    
    
})

blogRouter.put('/:id', async (request, response, next) => {
    const body = request.body
    const newBlog = {
        title: body.title,
        author: body.author,
        url: body.url,
        likes: body.likes || 0
    }

    const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, newBlog, {new: true})
    response.json(updatedBlog)
})

module.exports = blogRouter