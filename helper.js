const fs = require('fs')
const crypto = require('crypto');

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
