import { log } from "../utils.js"

const loggerMiddleware = (req, res, next) => {
    log(req.method, req.url)
    next()
}

export {
    loggerMiddleware
}