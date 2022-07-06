const fs = require('fs')
const crypto = require('crypto');

module.exports = {
  writeFile: (path, content) => {
    return fs.writeFileSync(
      `./db/${path.split('/')[1]}.json`,
      JSON.stringify(content, null, 2), 'utf8',
      (err) => console.log(err)
    )
  },
  readFile: (path) => {
    return JSON.parse(fs.readFileSync(`./db/${path.split('/')[1]}.json`));
  },
  findDataById: (path, id) => {
    const data = JSON.parse(fs.readFileSync(`./db/${path.split('/')[1]}.json`));
    return data.find((p) => p.id === id)
  },
  randomId: () => {
    return crypto.randomBytes(8).toString("hex");
  },
  checkFileSize: filename => {
    const stats = fs.statSync(filename);
    return stats.size / (1024 * 1024);
  },
  searching: (x, y) => x.toLowerCase().includes(y.toLowerCase()),
  sort: (x, y, z) => {
    const compare = (a, b) => (String(a)).localeCompare(String(b));
    if (z === 'DESC') return x.sort((a, b) => compare(a[y], b[y]));
    if (z === 'ASC') return x.sort((a, b) => compare(b[y], a[y]));
    return x;
  },
  pagination: (x, y, z) => {
    let m = 10; // limit
    let n = 0; // skip
    if (y) m = parseInt(y);
    if (z) n = parseInt(z);
    const o = m + n;
    return x.slice(n, o);
  },
  resSuccess: ({ req, res, data = null, msg } = {}) => {
    const route = `${req.method} - ${req.path}`;
    logger({ type: 'ok', route, ctx: data || msg });
    res.status(200).json({ msg: msg || 'success', data });
  },
  resError: ({ req, res, err, code, msg }) => {
    const route = `${req.method} - ${req.path}`;
    logger({
      type: 'err',
      route,
      ctx: String(err || msg || 'error!')
    });
    res.status(code || 500).json({ msg: msg || 'Server Error' });
  },
  resNotFound: (req, res) => {
    const route = `${req.method} - ${req.path}`;
    logger({ type: 'notFound', route, ctx: 'Data not found!' });
    res.status(404).json({ msg: `Data not found!` });
  },
}