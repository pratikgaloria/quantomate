const fs = require('fs');
const path = require('path');

async function fetchStrategies() {
    try {
        // Manually define strategy metadata
        // TODO: Auto-discover from strategies package in future
        const metadata = [
            {
                id: 'golden-cross',
                name: 'Golden Cross',
                description: 'Buy when fast SMA crosses above slow SMA, sell when it crosses below',
                parameters: [
                    {
                        name: 'fastPeriod',
                        type: 'number',
                        default: 50,
                        min: 10,
                        max: 100,
                        description: 'Fast SMA period'
                    },
                    {
                        name: 'slowPeriod',
                        type: 'number',
                        default: 200,
                        min: 50,
                        max: 300,
                        description: 'Slow SMA period'
                    }
                ]
            },
            {
                id: 'pivot-trend',
                name: 'Pivot Trend',
                description: "Enter long when previous day's close is above pivot resistance (R), exit when below pivot support (S). Entry/exit at next day's open.",
                parameters: []
            }
        ];

        // Write to both root and server directories
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
