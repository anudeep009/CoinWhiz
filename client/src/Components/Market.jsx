import React, { useContext, useState, useEffect } from 'react';
import 'react-loading-skeleton/dist/skeleton.css';
import { CryptoContext } from '../Api/CryptoContext';
import { addCoin } from '../Store/watchlistslice';
import { useDispatch } from 'react-redux';
import { Toaster } from 'react-hot-toast';
import { NavLink, useNavigate } from 'react-router-dom';
import { FaSpinner } from 'react-icons/fa';

const Market = () => {
  const { crypto } = useContext(CryptoContext);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState('');
  const [filteredCrypto, setFilteredCrypto] = useState([]);

  useEffect(() => {
    if (crypto) {
      setFilteredCrypto(
        crypto.filter((coin) =>
          coin.name.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }
  }, [crypto, searchTerm]);

  if (!crypto) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-900 text-white">
        <FaSpinner className="animate-spin text-3xl text-blue-500" />
      </div>
    );
  }

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredCrypto.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredCrypto.length / itemsPerPage);

  const handleClick = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleCheckboxChange = (event, coin) => {
    event.stopPropagation();
    if (event.target.checked) {
      const coinData = {
        id: coin.id,
        coin: coin.name,
        current_price: coin.current_price,
        low_24h: coin.low_24h,
        high_24h: coin.high_24h,
        image: coin.image,
      };
      dispatch(addCoin(coinData));
    }
  };


  const handleCoinClick = (id) => {
    navigate(`/coin/${id}`);
  };

  return (
    <div className="overflow-hidden bg-gray-900 text-gray-100 min-h-screen">
      <Toaster />
      <div className="relative overflow-x-auto shadow-md p-6 bg-gray-900 text-white">
        <div className="pb-4">
          <label htmlFor="table-search" className="sr-only">
            Search
          </label>
          <div className="flex items-center">
            <div className="relative mt-1 w-full sm:w-80"> 
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <svg
                  className="w-5 h-6 text-gray-400"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 20 20"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                  />
                </svg>
              </div>
              <input
                type="text"
                id="table-search"
                className="pt-2 pl-10 h-10 px-3 py-2 w-full text-sm text-black bg-white border border-gray-300 rounded-md placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder="Search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>
        <div className="overflow-x-auto rounded-xl">
          <table className="w-full table-auto text-sm md:text-base">
            <thead>
              <tr className="bg-gray-700 text-gray-200">
                <th className="px-4 py-2"></th>
                <th className="px-2 py-2 md:px-4">Icon</th>
                <th className="px-2 py-2 md:px-4">Coin</th>
                <th className="px-2 py-2 md:px-4">Symbol</th>
                <th className="px-2 py-2 md:px-4">Price</th>
                <th className="px-2 py-2 md:px-4">24h High</th>
                <th className="px-2 py-2 md:px-4">24h Low</th>
                <th className="px-2 py-2 md:px-4">Market Cap</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.map((crypto) => (
                <tr
                  key={crypto.id}
                  className="border-b bg-gray-800 hover:bg-gray-700 cursor-pointer"
                  onClick={() => handleCoinClick(crypto.id)}
                >
                  <td className="w-4 p-4">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        className="form-checkbox h-5 w-5 text-blue-500"
                        onChange={(event) => handleCheckboxChange(event, crypto)}
                        onClick={(event) => event.stopPropagation()} 
                      />
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <img
                      src={crypto?.image}
                      alt={crypto?.name}
                      width="30"
                      height="30"
                      className="rounded-full"
                    />
                  </td>
                  <td className="px-4 py-4">{crypto?.name}</td>
                  <td className="px-4 py-4">{crypto?.symbol?.toUpperCase()}</td>
                  <td className="px-4 py-4">${crypto?.current_price?.toFixed(2)}</td>
                  <td className="px-4 py-4">${crypto?.high_24h?.toFixed(2)}</td>
                  <td className="px-4 py-4">${crypto?.low_24h?.toFixed(2)}</td>
                  <td className="px-4 py-4">${crypto?.market_cap?.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="flex flex-wrap justify-center items-center space-x-2 bg-gray-900 p-4">
        <button
          onClick={() => handleClick(currentPage - 1)}
          disabled={currentPage === 1}
          className={`mx-1 my-2 px-3 py-2 rounded-md text-sm font-medium ${
            currentPage === 1 ? 'bg-gray-500 text-gray-400' : 'bg-blue-500 text-white hover:bg-blue-400'
          }`}
        >
          Previous
        </button>

        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index + 1}
            onClick={() => handleClick(index + 1)}
            className={`mx-1 my-2 px-3 py-2 rounded-md text-sm font-medium ${
              currentPage === index + 1
                ? 'bg-blue-500 text-white'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            {index + 1}
          </button>
        ))}

        <button
          onClick={() => handleClick(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`mx-1 my-2 px-3 py-2 rounded-md text-sm font-medium ${
            currentPage === totalPages ? 'bg-gray-500 text-gray-400' : 'bg-blue-500 text-white hover:bg-blue-400'
          }`}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Market;