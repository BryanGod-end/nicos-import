const categoryModel = require('../models/category.model');

async function getCategories(req, res, next) {
  try {
    const categories = await categoryModel.findAll();
    res.json({ data: categories });
  } catch (err) {
    next(err);
  }
}

module.exports = { getCategories };
