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
                    },
                    {
                        name: 'direction',
                        type: 'select',
                        default: 'long',
                        options: ['long', 'short', 'both'],
                        description: 'Trading direction'
                    }
                ]
            },
            {
                id: 'pivot-trend',
                name: 'Pivot Trend',
                description: "Enter long when previous day's close is above pivot resistance (R), exit when below pivot support (S). Entry/exit at next day's open.",
                parameters: [
                    {
                        name: 'direction',
                        type: 'select',
                        default: 'both',
                        options: ['long', 'short', 'both'],
                        description: 'Trading direction'
                    }
                ]
            },
            {
                id: 'rsi-mean-reversion',
                name: 'RSI Mean Reversion',
                description: 'Buy when RSI is oversold and sell when it is overbought, with optional trend filtering.',
                parameters: [
                    {
                        name: 'rsiPeriod',
                        type: 'number',
                        default: 14,
                        min: 2,
                        max: 50,
                        description: 'RSI period'
                    },
                    {
                        name: 'oversoldThreshold',
                        type: 'number',
                        default: 30,
                        min: 5,
                        max: 50,
                        description: 'Oversold threshold'
                    },
                    {
                        name: 'overboughtThreshold',
                        type: 'number',
                        default: 70,
                        min: 50,
                        max: 95,
                        description: 'Overbought threshold'
                    },
                    {
                        name: 'useTrendFilter',
                        type: 'boolean',
                        default: false,
                        description: 'Use SMA trend filter'
                    },
                    {
                        name: 'smaPeriod',
                        type: 'number',
                        default: 50,
                        min: 10,
                        max: 300,
                        description: 'SMA trend filter period'
                    },
                    {
                        name: 'direction',
                        type: 'select',
                        default: 'long',
                        options: ['long', 'short', 'both'],
                        description: 'Trading direction'
                    }
                ]
            },
            {
                id: 'bollinger-bands',
                name: 'Bollinger Bands',
                description: 'Buy when price crosses below the lower band and sell when it crosses above the upper band.',
                parameters: [
                    {
                        name: 'period',
                        type: 'number',
                        default: 20,
                        min: 5,
                        max: 100,
                        description: 'BB period'
                    },
                    {
                        name: 'multiplier',
                        type: 'number',
                        default: 2,
                        min: 0.5,
                        max: 5,
                        description: 'Standard deviation multiplier'
                    },
                    {
                        name: 'direction',
                        type: 'select',
                        default: 'long',
                        options: ['long', 'short', 'both'],
                        description: 'Trading direction'
                    }
                ]
            },
            {
                id: 'macd',
                name: 'MACD',
                description: 'Buy when MACD line crosses above the signal line and sell when it crosses below.',
                parameters: [
                    {
                        name: 'signalPeriod',
                        type: 'number',
                        default: 9,
                        min: 2,
                        max: 50,
                        description: 'Signal line smoothing period'
                    },
                    {
                        name: 'direction',
                        type: 'select',
                        default: 'long',
                        options: ['long', 'short', 'both'],
                        description: 'Trading direction'
                    }
                ]
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
