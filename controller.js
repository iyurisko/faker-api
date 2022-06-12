const {
  readFile,
  writeFile,
  randomId,
  findDataById,
  sort,
  pagination,
  searching
} = require('./helper.js');

module.exports = {
  getAllController: (req, res, file) => {
    try {
      const { search, sorting, limit, skip } = req.query;
      const [searchBy, name] = search ? search.split('-') : [null, null];
      const [field, sortBy] = sorting ? sorting.split('-') : [null, null];
      let data = readFile(file);

      // SEARCH FUNC
      if (name && searchBy) data = data.filter(str => searching(str[searchBy], name))

      // SORT FUNC
      if (field && sortBy) data = sort(data, field, sortBy);

      // LIMIT FUNC
      if (limit || skip) data = pagination(data, limit, skip)

      res.status(200).json({ success: true, data });
    } catch (error) {
      res.status(500).json({ status: false, msg: error });
    }
  },
  getByIdController: (req, res, file) => {
    try {
      const collectionName = file.replace(".json", "");
      const item = findDataById(file, req.params.id);
      if (item) return res.status(200).json({ success: true, data: item });
      return res.status(404).json({ success: false, msg: `${collectionName} not found!` });
    } catch (error) {
      res.status(500).json({ status: false, msg: error });
    }
  },
  postController: (req, res, file) => {
    try {
      let items = readFile(file);
      const item = { id: randomId(), ...req.body, create_at: new Date() };
      items.unshift(item);
      writeFile(file, items);
      res.status(200).json({ success: true, data: item, msg: 'data has been create' });
    } catch (error) {
      res.status(500).json({ status: false, msg: error });
    }
  },
  updateController: (req, res, file) => {
    try {
      const collectionName = file.replace(".json", "");
      let items = readFile(file);
      const item = findDataById(file, req.params.id);
      if (item) {
        const updateItem = { ...item, ...req.body };
        console.log(updateItem);
        const idx = items.findIndex((p) => p.id === req.params.id);
        items[idx] = updateItem;
        writeFile(file, items);
        res.status(200).json({ success: true, data: updateItem, msg: `${collectionName} deleted!` });
      } else {
        res.status(404).json({ success: false, msg: `${collectionName} not found!` });
      }
    } catch (error) {
      res.status(500).json({ status: false, msg: error });
    }
  },
  deleteController: (req, res, file) => {
    try {
      const collectionName = file.replace(".json", "");
      let items = readFile(file);
      const item = findDataById(file, req.params.id);
      if (item) {
        items = items.filter((p) => p.id !== req.params.id);
        writeFile(file, items);
        res.status(200).json({ success: true, msg: `${collectionName} deleted!` });
      } else {
        res.status(404).json({ success: false, msg: `${collectionName} not found!` });
      }
    } catch (error) {
      res.status(500).json({ status: false, msg: error });
    }
  }
}

