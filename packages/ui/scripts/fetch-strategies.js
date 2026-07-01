const fs = require('fs');
const path = require('path');

function fetchStrategies() {
    try {
        const metadataPath = path.resolve(__dirname, 'strategiesMetadata.json');
        const metadata = JSON.parse(fs.readFileSync(metadataPath, 'utf8'));

        const rootPath = path.resolve(__dirname, '../strategies.json');
        const serverPath = path.resolve(__dirname, '../server/strategies.json');

        fs.writeFileSync(rootPath, JSON.stringify({ strategies: metadata }, null, 2));
        fs.writeFileSync(serverPath, JSON.stringify({ strategies: metadata }, null, 2));

        console.log(`✅ Generated strategies.json in root and server directories`);
    } catch (error) {
        console.error('❌ Error fetching strategies:', error);
        process.exit(1);
    }
}

fetchStrategies();
