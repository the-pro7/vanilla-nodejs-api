import fs from 'fs'

const log = (...args) => console.log('[LOG]:', ...args)

// LOGS errors
const logError = (...args) => console.error('[ERROR]:', ...args)

// Write file
const writeFile = (pathToFile, newContent) => {
  try {
    let existingData = []
    if (existingData) {
      const fileContent = fs.readFileSync(pathToFile, 'utf-8')
      existingData = fileContent ? JSON.parse(fileContent) : []
    }

    if (!Array.isArray(existingData)) {
      logError('Expected an array')
    }

    if (Array.isArray(newContent)) {
      existingData = [...newContent]
    } else {
      existingData.push(newContent)
    }

    fs.writeFileSync(pathToFile, JSON.stringify(existingData, null, 2), 'utf-8')
  } catch (error) {
    logError('Error writing to file', error)
  }
}

// Get body data
const getBodyData = req => {
  return new Promise((resolve, reject) => {
    let body = ''
    req.on('data', chunk => {
      body += chunk
    })

    req.on('end', () => {
      resolve(body)
    })
  })
}

export { log, logError, writeFile, getBodyData }
