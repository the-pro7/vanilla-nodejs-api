import { writeFile } from '../utils.js'
import { createRequire } from 'module'
const require = createRequire(import.meta.url)
const posts = require('../db/data.json') // must be done for .json files
// import posts from '../db/data.json' assert { type: 'json' }
import { v4 as uuid } from 'uuid'
import path from 'path'
import url from 'url'
import fs from 'fs'

const __filename = url.fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
// log()

const DB_PATH = path.join(__dirname.replace('models', 'db'), 'data.json')

function findAll () {
  return new Promise((resolve, reject) => {
    if (posts && posts.length > 0) {
      resolve(posts)
    } else {
      reject('Posts empty')
    }
  })
}

function findById (id) {
  return new Promise((resolve, reject) => {
    if (id) {
      const post = posts.find(item => item.id === id)
      resolve(post)
    } else {
      reject('An id value must be provided')
    }
  })
}

function create (data) {
  return new Promise((resolve, reject) => {
    if (data) {
      const { title, content, author } = data
      const newItem = {
        id: uuid(),
        title,
        content,
        author,
        createdAt: new Date()
      }
      posts.push(newItem)
      writeFile(DB_PATH, newItem)
      resolve(newItem)
    } else {
      reject('No data provided!')
    }
  })
}

function findByIdAndUpdate (id, newContent) {
  return new Promise((resolve, reject) => {
    if (!id) reject('No id provided!')

    const postIndex = posts.findIndex(item => item.id === id)

    if (postIndex === -1) reject('No post found with that id')
    const { title, content, author } = JSON.parse(newContent)

    const updatedPost = {
      ...posts[postIndex],
      title: title || posts[postIndex].title,
      content: content || posts[postIndex].content,
      author: author || posts[postIndex].author,
      updatedAt: new Date().toISOString()
    }

    try {
      posts[postIndex] = updatedPost
      writeFile(DB_PATH, posts)
      resolve(updatedPost)
    } catch (error) {
      reject('An error occurred', error)
    }
  })
}

function findByIdAndDelete (id) {
  return new Promise((resolve, reject) => {
    if (!id) reject('An id needs to be provided')

    const postToDelete = posts.find(item => item.id === id)

    if (!postToDelete) return reject('No post found to delete')

    const updatedPosts = posts.filter(item => item.id !== id)

    // Save posts without deleted posts.
    writeFile(DB_PATH, updatedPosts)
    resolve(postToDelete)
  })
}

export { findAll, findById, findByIdAndUpdate, findByIdAndDelete, create }
