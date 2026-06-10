import { KiteInstrumentMapper } from '@quantomate/data';

describe('KiteInstrumentMapper - findATMOption', () => {
  const mockInstruments = [
    {
      name: 'NIFTY',
      exchange: 'NFO',
      instrument_type: 'CE',
      expiry: '2026-06-18',
      strike: 22000,
      tradingsymbol: 'NIFTY2661822000CE'
    },
    {
      name: 'NIFTY',
      exchange: 'NFO',
      instrument_type: 'CE',
      expiry: '2026-06-18',
      strike: 22100,
      tradingsymbol: 'NIFTY2661822100CE'
    },
    {
      name: 'BANKNIFTY',
      exchange: 'NFO',
      instrument_type: 'CE',
      expiry: '2026-06-18',
      strike: 48000,
      tradingsymbol: 'BANKNIFTY2661848000CE'
    },
    {
      name: 'BANKNIFTY',
      exchange: 'NFO',
      instrument_type: 'CE',
      expiry: '2026-06-18',
      strike: 48100,
      tradingsymbol: 'BANKNIFTY2661848100CE'
    }
  ];

  beforeAll(() => {
    // Inject mock cached list
    (KiteInstrumentMapper as any).cachedList = mockInstruments;
  });

  it('should resolve ATM option for NIFTY 50 and NIFTY index symbols', () => {
    const optNifty = KiteInstrumentMapper.findATMOption('NIFTY', 'CE', 22010);
    expect(optNifty).toBeDefined();
    expect(optNifty.tradingsymbol).toBe('NIFTY2661822000CE');

    const optNifty50 = KiteInstrumentMapper.findATMOption('NIFTY 50', 'CE', 22090);
    expect(optNifty50).toBeDefined();
    expect(optNifty50.tradingsymbol).toBe('NIFTY2661822100CE');
  });

  it('should resolve ATM option for ^NSEI and NSEI index symbols', () => {
    const optNseiSymbol = KiteInstrumentMapper.findATMOption('^NSEI', 'CE', 22010);
    expect(optNseiSymbol).toBeDefined();
    expect(optNseiSymbol.tradingsymbol).toBe('NIFTY2661822000CE');

    const optNseiNoHat = KiteInstrumentMapper.findATMOption('NSEI', 'CE', 22090);
    expect(optNseiNoHat).toBeDefined();
    expect(optNseiNoHat.tradingsymbol).toBe('NIFTY2661822100CE');
  });

  it('should resolve ATM option for ^NSEBANK and NSEBANK index symbols', () => {
    const optBankSymbol = KiteInstrumentMapper.findATMOption('^NSEBANK', 'CE', 48010);
    expect(optBankSymbol).toBeDefined();
    expect(optBankSymbol.tradingsymbol).toBe('BANKNIFTY2661848000CE');

    const optBankNoHat = KiteInstrumentMapper.findATMOption('NSEBANK', 'CE', 48090);
    expect(optBankNoHat).toBeDefined();
    expect(optBankNoHat.tradingsymbol).toBe('BANKNIFTY2661848100CE');
  });
});
