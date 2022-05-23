const fs = require('fs')
const crypto = require('crypto')

module.exports = {

  writeFile: (file, content) => {
    return fs.writeFileSync(`./db/${file}`, JSON.stringify(content, null, 2), 'utf8', (err) => {
      console.log(err)
    })
  },
  readFile: (file) => {
    return JSON.parse(fs.readFileSync(`./db/${file}`))
  },
  findDataById: (file, id) => {
    const data =  JSON.parse(fs.readFileSync(`./db/${file}`))
    return data.find((p) => p.id === id)
  },
  randomId: () => {
    return crypto.randomBytes(8).toString("hex")
  },
  checkFileSize: filename => {
    const stats = fs.statSync(filename)
    return stats.size / (1024 * 1024);
  }

}