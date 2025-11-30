const fs = require('fs');
const path = require('path');

interface StrategyParameter {
  name: string;
  type: 'number' | 'boolean' | 'string';
  default: any;
  min?: number;
  max?: number;
  description: string;
}

interface StrategyMetadata {
  id: string;
  name: string;
  description: string;
  parameters: StrategyParameter[];
}

async function fetchStrategies() {
  try {
    // Manually define strategy metadata
    // TODO: Auto-discover from strategies package in future
    const metadata: StrategyMetadata[] = [
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
      }
    ];

    // Write to strategies.json
    const outputPath = path.resolve(__dirname, '../strategies.json');
    fs.writeFileSync(
      outputPath,
      JSON.stringify({ strategies: metadata }, null, 2)
    );

    console.log(`✅ Generated strategies.json with ${metadata.length} strategies`);
  } catch (error) {
    console.error('❌ Error fetching strategies:', error);
    process.exit(1);
  }
}

fetchStrategies();
