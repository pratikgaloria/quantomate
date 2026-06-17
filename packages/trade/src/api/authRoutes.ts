import { Router } from 'express';
import log from 'npmlog';
import { prisma } from '@quantomate/db';
// @ts-ignore
import { KiteConnect } from 'kiteconnect';
import { reconcileEngine } from '../daemon/orchestrator';

const router = Router();

router.get("/auth/zerodha/login", (req, res) => {
  const apiKey = process.env.ZERODHA_API_KEY;
  if (!apiKey) {
    return res.status(500).send("ZERODHA_API_KEY is not defined in env.");
  }
  res.redirect(`https://kite.zerodha.com/connect/login?api_key=${apiKey}&v=3`);
});

router.get("/auth/zerodha/callback", async (req, res) => {
  try {
    const requestToken = req.query.request_token as string;
    if (!requestToken) {
      return res.status(400).send("Missing request_token parameter.");
    }

    const apiKey = process.env.ZERODHA_API_KEY;
    const apiSecret = process.env.ZERODHA_API_SECRET;
    if (!apiKey || !apiSecret) {
      return res.status(500).send("ZERODHA_API_KEY or ZERODHA_API_SECRET is missing in env.");
    }

    log.info("Auth", `Callback received. Exchanging request token: ${requestToken}...`);
    const kc = new KiteConnect({ api_key: apiKey });
    const session = await kc.generateSession(requestToken, apiSecret);

    log.info("Auth", "Token exchange successful! Storing session to DB...");
    await prisma.tradingSession.create({
      data: {
        provider: "zerodha",
        accessToken: session.access_token,
        publicToken: session.public_token || "",
      },
    });

    res.send(`
      <html>
        <head>
          <title>Broker Connected</title>
          <style>
            body { font-family: sans-serif; background: #f8fafc; display: flex; justify-content: center; align-items: center; height: 100vh; margin: 0; }
            .card { background: white; padding: 2rem; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.05); text-align: center; max-width: 420px; border-top: 4px solid #16a34a; }
            h1 { color: #16a34a; font-size: 1.5rem; margin: 0 0 0.75rem; }
            p { color: #475569; font-size: 0.9rem; line-height: 1.5; margin-bottom: 1.5rem; }
            .badge { display: inline-block; background: #dcfce7; color: #15803d; font-weight: bold; padding: 0.25rem 0.5rem; border-radius: 4px; font-size: 0.8rem; }
          </style>
        </head>
        <body>
          <div class="card">
            <h1>Broker Connected Successfully!</h1>
            <p>Your Zerodha session has been initialized. The background trading daemon has automatically re-reconciled and started running.</p>
            <span class="badge">Session Active</span>
          </div>
        </body>
      </html>
    `);

    setTimeout(async () => {
      try {
        await reconcileEngine();
      } catch (err: any) {
        log.error("Auth", "Failed reconciling engine after callback login:", err.message);
      }
    }, 1000);
  } catch (err: any) {
    log.error("Auth", "Failed token callback exchange:", err.message);
    res.status(500).send(`
      <html>
        <body style="font-family: sans-serif; padding: 2rem; background: #fef2f2;">
          <h1 style="color: #991b1b;">Authentication Failed</h1>
          <p>${err.message}</p>
        </body>
      </html>
    `);
  }
});

export const authRoutes = router;
