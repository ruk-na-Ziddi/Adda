# Adda
npm install
mkdir tests/data
node scripts/initialize_db.js tests/data/adda.db 
sqlite3 tests/data/adda.db < scripts/fill_sample_data.sql 
cp tests/data/adda.db tests/data/adda.db.backup