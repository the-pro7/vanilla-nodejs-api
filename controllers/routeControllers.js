import { getBodyData, log } from '../utils.js'
import * as Posts from '../models/apiModel.js'
import { logError } from '../utils.js'

// @desc GET all posts
// @route GET /api/posts
const getAllPosts = async (req, res) => {
  try {
    const posts = (await Posts.findAll()) || []
    res.writeHead(200, 'All posts returned', {
      'content-type': 'application/json'
    })
    res.end(JSON.stringify({ message: 'Here are your posts', length: posts?.length, posts }))
  } catch (error) {
    logError(error)
  }
}

// @desc GET single post
// @route GET /api/posts/:id

const getSinglePost = async (req, res, id) => {
  try {
    const post = await Posts.findById(id)

    if (!post) {
      res.writeHead(404, 'No post found', {
        'content-type': 'application/json'
      })
      res.end(JSON.stringify({ message: 'No posts found with that id' }))
      return // ✅ Prevent further execution (Prevents the error of heading being sent after the response has been sent to the client)
    }

    res.writeHead(200, 'Single post returned', {
      'content-type': 'application/json'
    })
    res.end(JSON.stringify(post))
  } catch (error) {
    logError(error)
    res.writeHead(500, 'Internal Server Error', {
      'content-type': 'application/json'
    })
    res.end(JSON.stringify({ message: 'Internal server error' }))
  }
}

// @desc CREATE new post
// @route POST /api/posts/

const createPost = async (req, res) => {
  try {
    let body = ''
    req.on('data', chunk => {
      body += chunk.toString()
    })

    req.on('end', async () => {
      const created = await Posts.create(JSON.parse(body))
      res.writeHead(201, 'Resource created', {
        'content-type': 'application/json'
      })
      res.end(
        JSON.stringify({ message: 'Resource created successfully', created })
      )
    })
  } catch (error) {
    logError(error)
  }
}

// @desc UPDATE a post
// @route PATCH /api/posts/:id

const updatePost = async (req, res, id) => {
  try {
    const data = await getBodyData(req)
    await Posts.findByIdAndUpdate(id, data)
    res.writeHead(200, 'Post updated', { 'content-type': 'application/json' })
    res.end(JSON.stringify({ message: 'Post updated!' }))
  } catch (error) {
    logError(error)
  }
}

export { getAllPosts, getSinglePost, createPost, updatePost }
