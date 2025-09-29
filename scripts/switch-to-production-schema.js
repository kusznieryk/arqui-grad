const fs = require('fs');
const path = require('path');

// Copy production schema for build
const productionSchema = path.join(__dirname, '../prisma/schema.production.prisma');
const mainSchema = path.join(__dirname, '../prisma/schema.prisma');

try {
  if (fs.existsSync(productionSchema)) {
    const productionContent = fs.readFileSync(productionSchema, 'utf8');
    fs.writeFileSync(mainSchema, productionContent);
    console.log('✅ Switched to production schema for build');
  } else {
    console.log('⚠️  Production schema not found, using current schema');
  }
} catch (error) {
  console.error('❌ Error switching to production schema:', error);
  process.exit(1);
}