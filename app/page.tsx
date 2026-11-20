
"use client";

import { useEffect, useState } from "react";

type Candle = {
  open: number;
  close: number;
  high: number;
  low: number;
};

export default function Home() {
  const [price, setPrice] = useState(1.08420);
  const [candles, setCandles] = useState<Candle[]>([]);
  const [stake, setStake] = useState("100");
  const [side, setSide] = useState<"BUY" | "SELL">("BUY");
  const [position, setPosition] = useState<{
    entry: number;
    stake: number;
    side: "BUY" | "SELL";
  } | null>(null);
  const [balance, setBalance] = useState(10000);
  const [message, setMessage] = useState("Demo account ready");

  useEffect(() => {
    const initial = Array.from({ length: 35 }, (_, i) => {
      const base = 1.084 + Math.sin(i * 0.5) * 0.0004;
      return {
        open: base,
        close: base + (Math.random() - 0.5) * 0.0003,
        high: base + 0.0002,
        low: base - 0.0002,
      };
    });
    setCandles(initial);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setPrice((old) => {
        const next = old + (Math.random() - 0.49) * 0.00012;

        setCandles((previous) => {
          if (!previous.length) return previous;
          const updated = [...previous];
          const last = updated[updated.length - 1];
          updated[updated.length - 1] = {
            open: last.open,
            close: next,
            high: Math.max(last.high, next),
            low: Math.min(last.low, next),
          };

          if (Math.random() > 0.82) {
            updated.push({
              open: next,
              close: next + (Math.random() - 0.5) * 0.0002,
              high: next + 0.0001,
              low: next - 0.0001,
            });
          }

          return updated.slice(-35);
        });

        return next;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const openTrade = () => {
    const amount = Number(stake);

    if (!Number.isFinite(amount) || amount <= 0) {
      setMessage("Enter a valid stake.");
      return;
    }

    if (amount > balance) {
      setMessage("Insufficient demo balance.");
      return;
    }

    if (position) {
      setMessage("Close your current position first.");
      return;
    }

    setBalance((b) => b - amount);
    setPosition({ entry: price, stake: amount, side });
    setMessage(`${side} position opened.`);
  };

  const closeTrade = () => {
    if (!position) return;

    const difference =
      position.side === "BUY"
        ? price - position.entry
        : position.entry - price;

    const profit = (difference / position.entry) * position.stake;
    setBalance((b) => b + position.stake + profit);
    setMessage(
      `Position closed. ${profit >= 0 ? "+" : ""}$${profit.toFixed(2)}`
    );
    setPosition(null);
  };

  const min = candles.length
    ? Math.min(...candles.map((c) => c.low))
    : 1.083;

  const max = candles.length
    ? Math.max(...candles.map((c) => c.high))
    : 1.085;

  const range = max - min || 0.001;

  return (
    <main className="app">
      <header className="header">
        <div className="logo">PIP<span>ARENA</span></div>
        <div className="live"><i /> SIMULATION LIVE</div>
        <div className="avatar">P</div>
      </header>

      <div className="ticker">
        MARKET SIMULATOR
        <span>EUR/USD</span>
        <b>CONTINUOUS PRACTICE</b>
      </div>

      <section className="welcome">
        <div className="eyebrow">WELCOME TO THE ARENA</div>
        <h1>Trade the <span>movement.</span></h1>
        <p>Watch the market move. Choose your direction.</p>
      </section>

      <section className="balance">
        <div>
          <small>DEMO WALLET</small>
          <h2>${balance.toFixed(2)}</h2>
          <span>Virtual funds · No cash value</span>
        </div>
        <div className="shield">✓ DEMO</div>
      </section>

      <section className="market">
        <div className="marketHead">
          <div>
            <small>FOREX MARKET</small>
            <h2>EUR / USD</h2>
          </div>
          <div className="quote">
            <small>LIVE SIMULATED PRICE</small>
            <strong>{price.toFixed(5)}</strong>
          </div>
        </div>

        <div className="chart">
          <div className="chartGrid">
            {[0, 1, 2, 3, 4].map((n) => (
              <div key={n} />
            ))}
          </div>

          <svg viewBox="0 0 350 200" preserveAspectRatio="none">
            {candles.map((c, i) => {
              const x = 5 + i * 10;
              const y = (v: number) =>
                185 - ((v - min) / range) * 170;
              const up = c.close >= c.open;

              return (
                <g
                  key={i}
                  fill={up ? "#20d6a0" : "#ff637c"}
                  stroke={up ? "#20d6a0" : "#ff637c"}
                >
                  <line
                    x1={x}
                    x2={x}
                    y1={y(c.high)}
                    y2={y(c.low)}
                  />
                  <rect
                    x={x - 2}
                    y={Math.min(y(c.open), y(c.close))}
                    width="5"
                    height={Math.max(
                      2,
                      Math.abs(y(c.open) - y(c.close))
                    )}
                  />
                </g>
              );
            })}
          </svg>

          <div className="chartLabel">1 SECOND SIMULATED TICKS</div>
        </div>

        <div className="timeframes">
          <span>1M</span><span>5M</span><span>15M</span>
          <span>1H</span><span>4H</span>
        </div>
      </section>

      <section className="trading">
        <h3>OPEN A POSITION</h3>
        <div className="directions">
          <button
            className={side === "BUY" ? "buy selected" : "buy"}
            onClick={() => setSide("BUY")}
          >
            ↗ BUY
          </button>
          <button
            className={side === "SELL" ? "sell selected" : "sell"}
            onClick={() => setSide("SELL")}
          >
            ↘ SELL
          </button>
        </div>

        <label>YOUR STAKE (USD)</label>
        <input
          type="number"
          min="0.01"
          value={stake}
          onChange={(e) => setStake(e.target.value)}
        />

        <div className="quick">
          {[50, 100, 250, 500].map((n) => (
            <button key={n} onClick={() => setStake(String(n))}>
              ${n}
            </button>
          ))}
        </div>

        {position ? (
          <button className="close" onClick={closeTrade}>
            CLOSE POSITION
          </button>
        ) : (
          <button
            className={side === "BUY" ? "executeBuy" : "executeSell"}
            onClick={openTrade}
          >
            OPEN {side} POSITION
          </button>
        )}

        <div className="notice">{message}</div>

        {position && (
          <div className="position">
            <b>{position.side} EUR/USD</b>
            <span>Entry: {position.entry.toFixed(5)}</span>
            <span>Stake: ${position.stake.toFixed(2)}</span>
            <span>Current: {price.toFixed(5)}</span>
          </div>
        )}
      </section>

      <section className="history">
        <h3>YOUR TRADING ARENA</h3>
        <p>
          {position
            ? "You have one open demo position."
            : "No open positions. Your next move starts here."}
        </p>
      </section>

      <footer>
        PIP ARENA · PRACTICE EDITION
        <p>Simulated prices. Not connected to a financial market.</p>
      </footer>
    </main>
  );
}
