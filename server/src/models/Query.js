import mongoose from 'mongoose';

const QuerySchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    category: {
      type: String,
      required: true,
      enum: ['CRUD', 'Joins', 'Indexing', 'Aggregation', 'CTE', 'Window Functions', 'Misc'],
    },
    queryText: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    // Future-proof: optional fields/tags can be added without breaking schema
    tags: { type: [String], default: [] },
    metadata: { type: Map, of: String },
  },
  { versionKey: false }
);

const Query = mongoose.model('Query', QuerySchema);
export default Query;