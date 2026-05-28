export interface ScoringConfig {
  ranking: {
    preferred_peer_group: string;
    fallback_peer_group: string;
    minimum_peer_count: number;
    winsorize: boolean;
    lower_percentile_cap: number;
    upper_percentile_cap: number;
  };
  momentum: {
    enabled: boolean;
    lookbacks: {
      '1m': number;
      '3m': number;
      '6m': number;
    };
    weights: {
      '1m': number;
      '3m': number;
      '6m': number;
    };
    use_volume_confirmation: boolean;
    max_volume_multiplier: number;
  };
  composite: {
    default_profile: string;
    profiles: {
      [profileName: string]: {
        momentum: number;
        growth: number;
        valuation: number;
        earnings_revisions?: number;
        position_52w: number;
        drawdown: number;
      };
    };
  };
  actions: {
    score_thresholds: {
      strong_buy: number;
      buy: number;
      hold: number;
      trim: number;
      sell: number;
    };
    risk_rules: {
      max_single_position_pct: number;
      max_sector_pct: number;
      profit_trim_threshold_pct: number;
      large_drawdown_threshold_pct: number;
    };
  };
}

export const DEFAULT_CONFIG: ScoringConfig = {
  ranking: {
    preferred_peer_group: "sector",
    fallback_peer_group: "portfolio",
    minimum_peer_count: 5,
    winsorize: true,
    lower_percentile_cap: 0.05,
    upper_percentile_cap: 0.95
  },
  momentum: {
    enabled: true,
    lookbacks: {
      "1m": 21,
      "3m": 63,
      "6m": 126
    },
    weights: {
      "1m": 0.5,
      "3m": 0.3,
      "6m": 0.2
    },
    use_volume_confirmation: true,
    max_volume_multiplier: 1.5
  },
  composite: {
    default_profile: "balanced",
    profiles: {
      balanced: {
        momentum: 0.25,
        growth: 0.2,
        valuation: 0.15,
        position_52w: 0.15,
        drawdown: 0.1
      },
      high_growth_ai: {
        momentum: 0.3,
        growth: 0.25,
        valuation: 0.1,
        position_52w: 0.1,
        drawdown: 0.1
      },
      value_cyclical: {
        valuation: 0.3,
        momentum: 0.2,
        growth: 0.1,
        position_52w: 0.1,
        drawdown: 0.1
      }
    }
  },
  actions: {
    score_thresholds: {
      strong_buy: 0.8,
      buy: 0.65,
      hold: 0.45,
      trim: 0.3,
      sell: 0.0
    },
    risk_rules: {
      max_single_position_pct: 0.15,
      max_sector_pct: 0.3,
      profit_trim_threshold_pct: 1.0,
      large_drawdown_threshold_pct: -0.35
    }
  }
};
