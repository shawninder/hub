module.exports = exports = process.env.NODE_ENV === 'dev'
  ? console.log
  : () => {
    // Don't log in production
    // to avoid busting rate limit
    // :(
    // TODO start paying for zeit to solve the issue. In the mean time, use AWS?
  }
