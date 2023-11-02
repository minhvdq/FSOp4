const app = require('../app')
const logger = require('../utils/logger')
const helper = require('./helper')
const mongoose = require('mongoose')
const Blog = require('../models/blog')
const supertest = require('supertest')
mongoose.set('bufferTimeoutMS', 30000)

const api = supertest(app)
beforeEach( async () => {
    await Blog.deleteMany({})
    await Blog.insertMany(helper.initalBlogs)
})

describe('test the get api', () => {
    test('test number of blogs', async () => {
        const allBlog = await api.get('/api/blogs')
        .expect(200)
        .expect('Content-Type', /application\/json/)

        expect(allBlog.body).toHaveLength(6)
    }, 10000000)

    test('test the Id', async () => {
        const Blog = await api.get('/api/blogs')
        const allBlog = Blog.body
        expect(allBlog[0].id).toBeDefined()
    }, 1000000)
})

describe('test the post api', () => {
    test('new blog cann be added', async () => {
        const newBLog = {
        title: "My Facebook",
        author: "Damian Vu",
        url: "https://www.facebook.com/minh.vdq/",
        likes: 11
        }

        await api.post('/api/blogs')
        .send(newBLog).expect(201)
        .expect('Content-Type',/application\/json/)

        const allBlog = await helper.blogsInDb()
        expect(allBlog).toHaveLength(helper.initalBlogs.length + 1)
    }, 1000000)

    test('like is set to 0 as default', async () => {
        const addBlog = {
            title: "My Facebook",
            author: "Damian Vu",
            url: "https://www.facebook.com/minh.vdq/"
        }

        const newBlog = await api.post('/api/blogs')
        .send(addBlog)

        const addedBlog = newBlog.body
        logger.infor(addedBlog)
        expect(addedBlog.likes).toBeDefined()
    
    }, 1000000)
})

describe('test delete and update', () => {
    test('url and title are required', async () => {
        const testBlog = {
            title: "My Facebook",
            author: "Haha"
        }
        await api.post('/api/blogs').expect(400)
    }, 1000000)

    test('can delete a blog by its id', async () => {
        const blog = await helper.blogsInDb()
        const firstId = blog[0].id
        logger.infor(firstId)
        await api.delete(`/api/blogs/${firstId}`)
        .expect(204)
    },1000000)

    test('can update a blog', async () => {
        const blogs = await helper.blogsInDb()
        const firstBlog = blogs[0]
        const newBlog = {
            title: "updated Title",
            author: "updated author",
            url: "updated url"
        }
        const updatedBlog = await api.put(`/api/blogs/${firstBlog.id}`)
        .send(newBlog)
        .expect(200)
    },1000000)
})

afterAll(async () => {
    mongoose.connection.close()
})
