const fs = require('fs')
const crypto = require('crypto')

module.exports = {

  writeFile: (file, content) => {
    return fs.writeFileSync(
      `./db/${file}`,
      JSON.stringify(content, null, 2), 'utf8',
      (err) => console.log(err)
    )
  },
  readFile: (file) => {
    return JSON.parse(fs.readFileSync(`./db/${file}`));
  },
  findDataById: (file, id) => {
    const data =  JSON.parse(fs.readFileSync(`./db/${file}`));
    return data.find((p) => p.id === id)
  },
  randomId: () => {
    return crypto.randomBytes(8).toString("hex");
  },
  checkFileSize: filename => {
    const stats = fs.statSync(filename);
    return stats.size / (1024 * 1024);
  },
  searching:(x,y) => x.toLowerCase().includes(y.toLowerCase()),
  sort: (x, y, z) => {
    const compare = (a, b) => (String(a)).localeCompare(String(b));
    if (z === 'DESC') return x.sort((a, b) => compare(a[y], b[y]));
    if (z === 'ASC') return x.sort((a, b) => compare(b[y], a[y]));
    return x;
  },
  pagination: (x, y, z) =>{
    let m = 10; // limit
    let n = 0; // skip
    if (y) m = parseInt(y);
    if (z) n = parseInt(z);
    const o = m + n;
    return x.slice(n, o);
  }
}