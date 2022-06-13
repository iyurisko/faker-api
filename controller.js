const {
  readFile,
  writeFile,
  randomId,
  findDataById,
  sort,
  pagination,
  searching,
  apiSuccess,
  apiError,
  apiNotFound
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

      apiSuccess({req, res, data })
    } catch (err) {
      apiError({req, res, err});
    }
  },
  getByID: (req, res) => {
    try {
      const data = findDataById(req.path, req.params.id);

      if (!data) return apiNotFound(req, res);
      apiSuccess({req, res, data })
    } catch (err) {
      apiError({req, res, err});
    }
  },
  create: (req, res) => {
    try {
      let db = readFile(req.path);
      const data = { id: randomId(), ...req.body, create_at: new Date() };

      db.unshift(data);
      writeFile(req.path, db);

      apiSuccess({req, res, data, msg: `data has been create!` })
    } catch (err) {
      apiError({req, res, err});
    }
  },
  update: (req, res) => {
    try {
      let db = readFile(req.path);
      let data = findDataById(req.path, req.params.id);

      if (!data) return apiNotFound(req, res);

      data = { ...row, ...req.body };
      const idx = db.findIndex((p) => p.id === req.params.id);
      
      db[idx] = data;
      writeFile(req.path, db);

      apiSuccess({req, res, data, msg: `data has been updated!` })
    } catch (err) {
      apiError({req, res, err});
    }
  },
  del: (req, res) => {
    try {
      let db = readFile(req.path);
      const data = findDataById(req.path, req.params.id);

      if (!data) return apiNotFound(req, res);

      db = db.filter((p) => p.id !== req.params.id);
      writeFile(req.path, db);

      apiSuccess({req, res, data, msg: `data has been deleted!` })
    } catch (err) {
      apiError({req, res, err});
    }
  }
}

