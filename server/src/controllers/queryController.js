import Query from '../models/Query.js';

export const getQueries = async (req, res, next) => {
  try {
    const { category, search } = req.query;
    const filter = {};
    if (category) filter.category = category;
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { queryText: { $regex: search, $options: 'i' } },
      ];
    }

    const queries = await Query.find(filter).sort({ createdAt: -1 });
    const categories = await Query.distinct('category');
    res.json({ queries, categories });
  } catch (err) {
    next(err);
  }
};

export const getQueryById = async (req, res, next) => {
  try {
    const query = await Query.findById(req.params.id);
    if (!query) {
      return res.status(404).json({ message: 'Query not found' });
    }
    res.json(query);
  } catch (err) {
    next(err);
  }
};

export const createQuery = async (req, res, next) => {
  try {
    const { title, description, category, queryText, tags, metadata } = req.body;
    const created = await Query.create({ title, description, category, queryText, tags, metadata });
    res.status(201).json(created);
  } catch (err) {
    next(err);
  }
};

export const updateQuery = async (req, res, next) => {
  try {
    const updated = await Query.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!updated) return res.status(404).json({ message: 'Query not found' });
    res.json(updated);
  } catch (err) {
    next(err);
  }
};

export const deleteQuery = async (req, res, next) => {
  try {
    const deleted = await Query.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Query not found' });
    res.json({ message: 'Query deleted' });
  } catch (err) {
    next(err);
  }
};