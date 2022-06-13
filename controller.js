const fs = require('fs');
const {
  readFile,
  writeFile,
  randomId,
  findDataById,
  sort,
  pagination,
  searching,
  resSuccess,
  resError,
  resNotFound
} = require('./helper.js');

module.exports = {
  getAll: (req, res) => {
    try {
      const { search, sorting, limit, skip } = req.query;
      const [searchBy, name] = search ? search.split('-') : [null, null];
      const [field, sortBy] = sorting ? sorting.split('-') : [null, null];
      let data = readFile(req.path);

      // SEARCH FUNC
      if (name && searchBy) data = data.filter(str => searching(str[searchBy], name))

      // SORT FUNC
      if (field && sortBy) data = sort(data, field, sortBy);

      // LIMIT FUNC
      if (limit || skip) data = pagination(data, limit, skip)

      resSuccess({ req, res, data })
    } catch (err) {
      resError({ req, res, err });
    }
  },
  getByID: (req, res) => {
    try {
      const data = findDataById(req.path, req.params.id);

      if (!data) return resNotFound(req, res);
      resSuccess({ req, res, data })
    } catch (err) {
      resError({ req, res, err });
    }
  },
  create: (req, res) => {
    try {
      let db = readFile(req.path);
      const data = { id: randomId(), ...req.body, create_at: new Date() };

      db.unshift(data);
      writeFile(req.path, db);

      resSuccess({ req, res, data, msg: `data has been create!` })
    } catch (err) {
      resError({ req, res, err });
    }
  },
  update: (req, res) => {
    try {
      let db = readFile(req.path);
      let row = findDataById(req.path, req.params.id);

      if (!row) return resNotFound(req, res);

      data = { ...row, ...req.body };
      const idx = db.findIndex((p) => p.id === req.params.id);

      db[idx] = data;
      writeFile(req.path, db);

      resSuccess({ req, res, data, msg: `data has been updated!` })
    } catch (err) {
      resError({ req, res, err });
    }
  },
  del: (req, res) => {
    try {
      let db = readFile(req.path);
      const data = findDataById(req.path, req.params.id);

      if (!data) return resNotFound(req, res);

      db = db.filter((p) => p.id !== req.params.id);
      writeFile(req.path, db);

      resSuccess({ req, res, data, msg: `data has been deleted!` })
    } catch (err) {
      resError({ req, res, err });
    }
  },
}

