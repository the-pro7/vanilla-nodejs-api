import http from 'http'
import { log, logError } from './utils.js'
import {
  createPost,
  getAllPosts,
  getSinglePost,
  updatePost
} from './controllers/routeControllers.js'
import { loggerMiddleware } from './middleware/middleware.js'

const PORT = process.env.PORT || 8000
const ID_REGEXP = /^\/api\/posts\/([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})$/i
// /^\/api\/posts\/([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})$/i
//  /\/api\/users\/([0-9a-zA-Z-]+)/

const server = http.createServer((req, res) => {
  loggerMiddleware(req, res, () => {
    // GET requests for all posts
    if (req.url === '/api/posts' && req.method === 'GET') {
      getAllPosts(req, res)
    }
    // Get single post
    else if (req.url.match(ID_REGEXP) && req.method === 'GET') {
      const id = req.url.split('/')[3]
      getSinglePost(req, res, id)
    }
    // Create post
    else if (req.url == "/api/posts" && req.method === 'POST') {
      createPost(req, res)
    }
    // Update post
    else if (req.url.match(ID_REGEXP) && req.method === "PATCH") {
        const id = req.url.split("/")[3]
        updatePost(req, res, id)
    }
    else {
      res.writeHead(400, 'No routes found', {
        'content-type': 'application/json'
      })
      res.end(JSON.stringify({ message: 'No routes found!' }))
    }
  })
})

server.listen(PORT, () => {
  log(`Server running on port ${PORT}`)
})
