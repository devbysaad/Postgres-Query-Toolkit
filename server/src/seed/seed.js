import dotenv from 'dotenv';
import mongoose from 'mongoose';
import Query from '../models/Query.js';

dotenv.config({ path: './.env' });

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/postgres_query_library';

const tables = ['users', 'orders', 'products', 'customers', 'payments', 'shipments', 'invoices', 'categories', 'suppliers', 'reviews'];
const categories = ['CRUD', 'Joins', 'Indexing', 'Aggregation', 'CTE', 'Window Functions', 'Misc'];

function makeCrud(i) {
  const t = tables[i % tables.length];
  const variant = i % 4;
  if (variant === 0) {
    return {
      title: `CRUD create ${t}_${i}`,
      description: `Create table ${t}_${i} with basic columns`,
      category: 'CRUD',
      queryText: `CREATE TABLE IF NOT EXISTS ${t}_${i} (id SERIAL PRIMARY KEY, name TEXT NOT NULL, created_at TIMESTAMP DEFAULT NOW());`,
      tags: ['ddl', t],
      metadata: { source: 'seed' },
    };
  } else if (variant === 1) {
    return {
      title: `CRUD insert into ${t} ${i}`,
      description: `Insert a sample row into ${t}`,
      category: 'CRUD',
      queryText: `INSERT INTO ${t} (name) VALUES ('sample-${i}') ON CONFLICT DO NOTHING;`,
      tags: ['insert', t],
      metadata: { source: 'seed' },
    };
  } else if (variant === 2) {
    return {
      title: `CRUD update ${t} ${i}`,
      description: `Update a row in ${t}`,
      category: 'CRUD',
      queryText: `UPDATE ${t} SET name = 'updated-${i}' WHERE id = ${i};`,
      tags: ['update', t],
      metadata: { source: 'seed' },
    };
  }
  return {
    title: `CRUD delete from ${t} ${i}`,
    description: `Delete a row from ${t}`,
    category: 'CRUD',
    queryText: `DELETE FROM ${t} WHERE id = ${i};`,
    tags: ['delete', t],
    metadata: { source: 'seed' },
  };
}

function makeJoin(i) {
  const joinTypes = ['INNER JOIN', 'LEFT JOIN', 'RIGHT JOIN', 'FULL JOIN'];
  const jt = joinTypes[i % joinTypes.length];
  return {
    title: `Join example ${i} (${jt})`,
    description: `Join orders with customers using ${jt}`,
    category: 'Joins',
    queryText: `SELECT o.id, c.name, o.total FROM orders o ${jt} customers c ON o.customer_id = c.id WHERE o.total > ${(i % 10) + 10};`,
    tags: ['join', jt.toLowerCase()],
    metadata: { source: 'seed' },
  };
}

function makeIndex(i) {
  const t = tables[i % tables.length];
  const cols = ['email', 'name', 'created_at', 'updated_at'];
  const col = cols[i % cols.length];
  return {
    title: `Index on ${t}.${col} ${i}`,
    description: `Create index on ${t}.${col}`,
    category: 'Indexing',
    queryText: `CREATE INDEX IF NOT EXISTS idx_${t}_${col}_${i} ON ${t}(${col});`,
    tags: ['index', t, col],
    metadata: { source: 'seed' },
  };
}

function makeAggregation(i) {
  const t = ['orders', 'payments', 'invoices'][i % 3];
  return {
    title: `Aggregate by month ${t} ${i}`,
    description: `Group ${t} by month and sum totals`,
    category: 'Aggregation',
    queryText: `SELECT DATE_TRUNC('month', created_at) AS month, SUM(total) AS sum_total FROM ${t} GROUP BY month ORDER BY month DESC;`,
    tags: ['aggregation', t],
    metadata: { source: 'seed' },
  };
}

function makeCTE(i) {
  const t = ['orders', 'products', 'customers'][i % 3];
  return {
    title: `CTE recent ${t} ${i}`,
    description: `CTE selecting recent rows from ${t}`,
    category: 'CTE',
    queryText: `WITH recent AS (SELECT * FROM ${t} WHERE created_at > NOW() - INTERVAL '30 days') SELECT * FROM recent ORDER BY created_at DESC;`,
    tags: ['cte', t],
    metadata: { source: 'seed' },
  };
}

function makeWindow(i) {
  const t = ['orders', 'products'][i % 2];
  return {
    title: `Window row_number ${t} ${i}`,
    description: `Row numbers per category/customer on ${t}`,
    category: 'Window Functions',
    queryText: `SELECT id, ROW_NUMBER() OVER (ORDER BY created_at DESC) AS rn, RANK() OVER (ORDER BY created_at DESC) AS rnk FROM ${t} LIMIT 100;`,
    tags: ['window', t],
    metadata: { source: 'seed' },
  };
}

function makeMisc(i) {
  const t = ['products', 'customers'][i % 2];
  return {
    title: `Exists subquery ${t} ${i}`,
    description: `EXISTS subquery example on ${t}`,
    category: 'Misc',
    queryText: `SELECT * FROM ${t} p WHERE EXISTS (SELECT 1 FROM orders o WHERE o.product_id = p.id AND o.total > ${(i % 20) + 1});`,
    tags: ['exists', t],
    metadata: { source: 'seed' },
  };
}

function buildData() {
  const out = [];
  for (let i = 1; i <= 90; i++) out.push(makeCrud(i));
  for (let i = 1; i <= 90; i++) out.push(makeJoin(i));
  for (let i = 1; i <= 70; i++) out.push(makeIndex(i));
  for (let i = 1; i <= 80; i++) out.push(makeAggregation(i));
  for (let i = 1; i <= 80; i++) out.push(makeCTE(i));
  for (let i = 1; i <= 60; i++) out.push(makeWindow(i));
  for (let i = 1; i <= 30; i++) out.push(makeMisc(i));
  return out.map((q) => ({ ...q, createdAt: new Date() }));
}

async function run() {
  try {
    await mongoose.connect(MONGO_URI);
    await Query.deleteMany({});
    const data = buildData();
    await Query.insertMany(data);
    console.log(`Inserted ${data.length} queries`);
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

run();