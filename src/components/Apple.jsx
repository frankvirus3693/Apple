import React, { useState, useEffect } from "react";
import axios from "axios";
import "tailwindcss/tailwind.css";

function Apple() {
  const [products, setProducts] = useState([]);
  const [uniqueTypes, setUniqueTypes] = useState([]);
  const [selectedType, setSelectedType] = useState("");
  const [searchKeyword, setSearchKeyword] = useState("");
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);

  useEffect(() => {
    axios
      .get("http://localhost/ApiApple/")
      .then((response) => {
        const fetchedData = response.data;
        setProducts(fetchedData);

        const types = [
          ...new Set(fetchedData.map((item) => item.product_type)),
        ];
        setUniqueTypes(types);

        // Initialize favorites array from localStorage
        const storedFavorites = localStorage.getItem("favorites");
        const initialFavorites = storedFavorites
          ? JSON.parse(storedFavorites)
          : [];
        setFavorites(initialFavorites);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  useEffect(() => {
    // ... (โค้ดเดิม)

    // Initialize filtered products based on selected type and search keyword
    const filteredByType = selectedType
      ? products.filter((item) => item.product_type === selectedType)
      : products;

    const filteredByYearAndKeyword = filteredByType.filter((item) => {
      const yearMatch =
        !searchKeyword || item.product_year.includes(searchKeyword);
      const keywordMatch =
        !searchKeyword ||
        item.product_name.toLowerCase().includes(searchKeyword.toLowerCase());

      // Check if either yearMatch or keywordMatch is true
      return yearMatch || keywordMatch;
    });

    setFilteredProducts(filteredByYearAndKeyword);
  }, [selectedType, searchKeyword, products]);

  const openModal = (product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedProduct(null);
    setIsModalOpen(false);
  };

  const toggleFavorite = (productId) => {
    const updatedFavorites = favorites.includes(productId)
      ? favorites.filter((id) => id !== productId)
      : [...favorites, productId];

    setFavorites(updatedFavorites);
    localStorage.setItem("favorites", JSON.stringify(updatedFavorites));

    if (favorites.includes(productId)) {
      setFilteredProducts(
        filteredProducts.filter((product) => product.id !== productId)
      );
    } else {
      setFilteredProducts(products);
      setSelectedType("");
      setSearchKeyword("");
    }
  };

  // Calculate the number of items to display per page
  const itemsPerPage = 8;

  // Calculate the total number of pages based on filteredProducts length
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  // Use state to keep track of the current page
  const [currentPage, setCurrentPage] = useState(1);

  // Calculate the starting and ending indices for the current page
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  // Get the items to display for the current page
  const itemsToShow = filteredProducts.slice(startIndex, endIndex);

  const typeCounts = products.reduce((acc, product) => {
    acc[product.product_type] = (acc[product.product_type] || 0) + 1;
    return acc;
  }, {});

  const typeOptions = uniqueTypes.map((type) => ({
    type,
    count: typeCounts[type] || 0,
  }));

  return (
    <div className="bg-gray-100 min-h-screen">
      <div className="py-6 px-4 container mx-auto">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center">
            <label htmlFor="type" className="mr-2">
              เลือกแสดงประเภทของสินค้า :
            </label>
            <select
              id="type"
              name="type"
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="py-1 px-2 rounded border-gray-400 border"
            >
              <option value="">ทั้งหมด</option>
              {typeOptions.map((option, index) => (
                <option key={index} value={option.type}>
                  {`${option.type} (${option.count})`}
                </option>
              ))}
            </select>
          </div>
          <div>
            <button
              onClick={() => {
                setShowModal(false); // Close the modal
                const favoriteProducts = products.filter((product) =>
                  favorites.includes(product.id)
                );
                setFilteredProducts(favoriteProducts);
                setCurrentPage(1);
                setSelectedType(""); // Clear selected type
                setSearchKeyword(""); // Clear search keyword
              }}
              className="ml-2 py-1 px-2 rounded bg-gray-500 text-white mr-2"
            >
              WhiteList
            </button>
            <input
              type="text"
              placeholder="ค้นหาด้วยชื่อ หรือ ปีผลิต"
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              className="py-1 px-2 rounded border-gray-400 border"
            />
          </div>
        </div>

        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {itemsToShow.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-lg shadow-md p-4 relative transform transition-transform hover:scale-105"
              >
                <img
                  src={product.product_img}
                  alt={product.product_name}
                  className="w-36 h-40 mx-auto mb-4"
                />
                <h2 className="text-lg font-semibold mb-2">
                  {product.product_name}
                </h2>
                <p className="text-sm">{product.product_year}</p>
                <p className="text-gray-500 mb-2">{product.product_type}</p>
                <p className="text-sm mb-2">
                  {product.product_descript.length > 100
                    ? product.product_descript.substring(0, 100) + "..."
                    : product.product_descript}
                </p>
                <button
                  onClick={() => openModal(product)}
                  className="bg-white-500 text-black text-l font-semibold py-1 px-2 mt-2"
                >
                  แสดงเพิ่มเติม
                </button>
                <button
                  onClick={() => toggleFavorite(product.id)}
                  className="absolute top-2 right-2 text-gray-600"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill={favorites.includes(product.id) ? "grey" : "none"}
                    viewBox="0 0 24 24"
                    strokeWidth="0.5"
                    stroke="currentColor"
                    className="w-8 h-8"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
                    />
                  </svg>
                </button>
              </div>
            ))}
            {showModal && (
              <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50">
                <div className="bg-white rounded-lg p-4 max-w-md relative">
                  <button
                    onClick={() => setShowModal(false)} // ปิด modal เมื่อคลิกปุ่มปิด
                    className="absolute top-2 right-2 text-gray-600"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      fill="currentColor"
                      className="bi bi-x"
                      viewBox="0 0 16 16"
                    >
                      <path d="M.293 1.293a1 1 0 0 1 1.414 0L8 6.586l6.293-6.293a1 1 0 1 1 1.414 1.414L9.414 8l6.293 6.293a1 1 0 0 1-1.414 1.414L8 9.414l-6.293 6.293a1 1 0 0 1-1.414-1.414L6.586 8 .293 1.707a1 1 0 0 1 0-1.414z" />
                    </svg>
                  </button>
                  <p className="text-lg font-semibold mb-2 mt-4">
                    {isFavorite
                      ? "คุณได้กดถูกใจสินค้านี้แล้ว"
                      : "คุณได้ยกเลิกการถูกใจสินค้านี้แล้ว"}
                  </p>
                </div>
              </div>
            )}
          </div>
          {/* Pagination */}
          <div className="flex justify-center mt-6">
            {Array.from({ length: totalPages }).map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentPage(index + 1)}
                className={`mx-1 px-2 py-1 rounded ${
                  currentPage === index + 1
                    ? "bg-gray-500 text-white"
                    : "bg-gray-300 text-gray-600"
                }`}
              >
                {index + 1}
              </button>
            ))}
          </div>
        </div>
      </div>
      {isModalOpen && selectedProduct && (
        <ProductModal product={selectedProduct} onClose={closeModal} />
      )}
    </div>
  );
}

function ProductModal({ product, onClose }) {
  return (
    <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg p-4 max-w-md relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-600"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="currentColor"
            className="bi bi-x"
            viewBox="0 0 16 16"
          >
            <path d="M.293 1.293a1 1 0 0 1 1.414 0L8 6.586l6.293-6.293a1 1 0 1 1 1.414 1.414L9.414 8l6.293 6.293a1 1 0 0 1-1.414 1.414L8 9.414l-6.293 6.293a1 1 0 0 1-1.414-1.414L6.586 8 .293 1.707a1 1 0 0 1 0-1.414z" />
          </svg>
        </button>
        <img
          src={product.product_img}
          alt={product.product_name}
          className="w-36 h-36 mx-auto mb-4"
        />
        <h2 className="text-lg font-semibold mb-2">{product.product_name}</h2>
        <p className="text-sm">{product.product_year}</p>
        <p className="text-gray-500 mb-2">{product.product_type}</p>
        <p className="text-sm mb-2">{product.product_descript}</p>
      </div>
    </div>
  );
}

export default Apple;
