"use client";

import { useSelector, useDispatch } from "react-redux";
import { addCoin, removeCoin } from "../Store/watchlistslice";
import { Button } from "../Components/ui/Button";
import { Card, CardHeader, CardTitle } from "../Components/ui/Card";
import { Toaster } from 'react-hot-toast';
import { Link } from 'react-router-dom';
import '../card.css';

export default function Watchlist() {
  const dispatch = useDispatch();
  const watchlist = useSelector((state) => state.watchlist.coins);

  const handleAddCoin = () => {
    dispatch(addCoin({
      id: "sol",
      coin: "Solana",
      current_price: 100.25,
      low_24h: 95.00,
      high_24h: 105.00,
      image: "https://example.com/solana.png"
    }));
  };

  const handleRemoveCoin = (id) => {
    dispatch(removeCoin(id));
  };

  return (
    <section className="w-full py-12 bg-gray-900 text-white min-h-[680px]">
      <Toaster />
      <div className="container mx-auto px-4 md:px-6 max-w-4xl">
        {/* Header section */}
        <div className="flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-8 mb-8">
          <div className="grid gap-1">
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight">Watchlist</h1>
            <p className="text-gray-400 text-base md:text-lg">Track your favorite cryptocurrencies.</p>
          </div>
          <Link to={'/Market'}>
            <Button variant="outline" size="sm">
              Go to Market
            </Button>
          </Link>
        </div>

        {/* Watchlist items */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {watchlist.map((coin) => (
            <Card
              key={coin.id}
              className="p-4 flex flex-col items-start w-full bg-gray-800 justify-between shadow-lg rounded-lg transition-transform duration-200 hover:shadow-xl hover:scale-105"
            >
              <CardHeader className="w-full flex justify-between items-center">
                <div className="flex items-center gap-4">
                  <img
                    src={coin.image}
                    alt={coin.coin}
                    className="w-10 h-10 md:w-12 md:h-12 rounded-full border border-gray-600"
                  />
                  <div className="grid gap-1">
                    <div className="flex flex-col items-start">
                      <CardTitle className="font-medium text-lg md:text-xl">{coin.coin}</CardTitle>
                      <div className="text-gray-400 text-sm">({coin.id.toUpperCase()})</div>
                    </div>
                    <div className="flex flex-col items-start text-lg">
                      <div className="font-medium text-xl md:text-2xl">${coin.current_price.toFixed(2)}</div>
                      <div
                        className={`px-2 py-1 mt-1 rounded-md text-xs font-semibold ${
                          coin.current_price >= coin.low_24h ? "bg-green-600" : "bg-red-600"
                        }`}
                      >
                        ${coin.current_price.toFixed(2)}
                      </div>
                    </div>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleRemoveCoin(coin.id)}
                  aria-label={`Remove ${coin.coin} from watchlist`}
                >
                  <XIcon className="h-5 w-5 md:h-6 md:w-6 text-red-400 transition-transform duration-200 hover:scale-110" />
                  <span className="sr-only">Remove {coin.coin}</span>
                </Button>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

function XIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  );
}