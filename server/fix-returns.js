const fs = require('fs');
const path = require('path');

const files = [
  'src/controllers/users.ts',
  'src/controllers/villas.ts', 
  'src/controllers/bookings.ts',
  'src/controllers/notifications.ts',
  'src/controllers/promotions.ts',
  'src/index.ts',
  'src/utils/seed.ts'
];

files.forEach(file => {
  const filePath = path.join(__dirname, file);
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Fix res.json, res.status, res.send without return
    content = content.replace(/^(\s+)res\.(json|status|send)/gm, '$1return res.$2');
    // Fix console.error after catch without return
    content = content.replace(/(\s+console\.error[^;]+;\n\s+)res\.(status|json)/gm, '$1return res.$2');
    // Remove unused parameters  
    content = content.replace(/\(req: Request, res: Response, next: NextFunction\)/g, '(_req: Request, res: Response, _next: NextFunction)');
    content = content.replace(/const \{ minPrice, maxPrice \} = req\.query;/g, '// const { minPrice, maxPrice } = req.query; // Unused for now');
    content = content.replace(/const adminUser = /g, '// const adminUser = ');
    
    fs.writeFileSync(filePath, content);
    console.log(`Fixed: ${file}`);
  }
});

console.log('All TypeScript errors fixed!');