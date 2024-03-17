import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Adminpage() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingItemId, setEditingItemId] = useState(null);
  const [editedItem, setEditedItem] = useState({});
  const [showEditPopup, setShowEditPopup] = useState(false);
  const [showAddPopup, setShowAddPopup] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const navigate = useNavigate();

  const checkLoginStatus = () => {
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
    if (!isLoggedIn) {
      navigate("/login");
      return navigate("/Login");
    }
  };

  useEffect(() => {
    checkLoginStatus();
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch("http://localhost/ApiApple/");
      const jsonData = await response.json();
      const sortedData = jsonData.sort((a, b) => a.id - b.id);
      setData(sortedData);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleEdit = (id) => {
    const selectedItem = data.find((item) => item.id === id);
    setEditingItemId(id);
    setEditedItem(selectedItem);
    setShowEditPopup(true);
  };

  const handleSaveEdit = async () => {
    try {
      const response = await fetch(
        `http://localhost/ApiApple/${editingItemId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(editedItem),
        }
      );

      if (response.ok) {
        const updatedData = data.map((item) =>
          item.id === editingItemId ? editedItem : item
        );
        setData(updatedData);
        setEditingItemId(null);
        setEditedItem({});
        setShowEditPopup(false);
      } else {
        console.error("Edit request failed:", response);
      }
    } catch (error) {
      console.error("Error editing data:", error);
    }
  };

  const handleCancelEdit = () => {
    setEditingItemId(null);
    setEditedItem({});
    setShowEditPopup(false);
  };

  const handleDelete = (id) => {
    const confirmDelete = window.confirm("ต้องการลบสินค้านี้หรือไม่ ?");
    if (confirmDelete) {
      fetch(`http://localhost/ApiApple/`, {
        method: "DELETE",
        headers: {
          "Content-status": "application/json",
        },
        body: JSON.stringify({ id }),
      })
        .then((response) => response.json())
        .then(() => {
          setData(data.filter((data) => data.id !== id));
          window.location.reload();
        })
        .catch((error) => {
          console.error("Error deleting data from the API:", error);
        });
    } else {
      console.log("Deletion canceled.");
    }
  };

  const handleAdd = () => {
    setShowAddPopup(true);
  };

  const handleSaveAdd = async () => {
    try {
      const response = await fetch("http://localhost/ApiApple/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editedItem),
      });

      if (response.ok) {
        fetchData();
        setShowAddPopup(false);
        setEditedItem({});
      } else {
        console.error("Add request failed:", response);
      }
    } catch (error) {
      console.error("Error adding data:", error);
    }
  };

  const handleCancelAdd = () => {
    setShowAddPopup(false);
    setEditedItem({});
  };

  const handleLogout = () => {
    // Clear local storage
    localStorage.clear();

    // Redirect to the homepage
    window.location.href = "/";
  };

  const totalPages = Math.ceil(data.length / itemsPerPage);
  const MAX_PAGE_DISPLAY = 3;

  if (loading) {
    return <div className="text-center mt-8">Loading...</div>;
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-semibold mb-4">Admin Page</h1>
      {/* Pagination*/}
      <div className="flex justify-center items-center mt-4">
        <button
          className={`${
            currentPage === 1 ? "hidden" : ""
          } mr-1 bg-gray-500 hover:bg-gray-800 text-white font-bold py-2 px-4 rounded`}
          onClick={() => setCurrentPage(currentPage - 1)}
        >
          <span>&#8592;</span> Previous
        </button>
        <div className="flex">
          {Array.from({ length: totalPages }, (_, index) => {
            if (
              index === 0 ||
              index === totalPages - 1 ||
              (index >= currentPage - 2 && index <= currentPage)
            ) {
              return (
                <button
                  key={index}
                  className={`${
                    currentPage === index + 1 ? "bg-gray-700" : "bg-gray-500"
                  } mr-1 hover:bg-gray-800 text-white font-bold py-2 px-4 rounded`}
                  onClick={() => setCurrentPage(index + 1)}
                >
                  {index + 1}
                </button>
              );
            }
            return null;
          })}
        </div>
        <button
          className={`${
            currentPage * itemsPerPage >= data.length ? "hidden" : ""
          } bg-gray-500 hover:bg-gray-800 text-white font-bold py-2 px-4 rounded`}
          onClick={() => setCurrentPage(currentPage + 1)}
        >
          Next <span>&#8594;</span>
        </button>
      </div>

      {/* Pagination*/}

      <div className="flex justify-between items-center">
        <div>
          <button
            className="mb-4 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>

        <button
          className="mb-4 bg-zinc-500 hover:bg-zinc-700 text-white font-bold py-2 px-4 rounded"
          onClick={handleAdd}
        >
          Add Item
        </button>
      </div>

      <table className="table-auto w-full shadow-2xl">
        <thead>
          <tr>
            <th className="px-4 py-2">ID</th>
            <th className="px-8 py-2">Image</th>
            <th className="px-4 py-2">Name</th>
            <th className="px-4 py-2">Type</th>
            <th className="px-4 py-2">Description</th>
            <th className="px-4 py-2">Year</th>
            <th className="px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {data
            .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
            .map((item) => (
              <tr key={item.id} className="bg-white">
                <td className="px-4 py-2">{item.id}</td>
                <td className="px-4 py-2">
                  <img
                    src={item.product_img}
                    alt={`Product ${item.id}`}
                    className="h-24 w-auto"
                  />
                </td>
                <td className="px-4 py-2">{item.product_name}</td>
                <td className="px-4 py-2">{item.product_type}</td>
                <td className="px-4 py-2">{item.product_descript}</td>
                <td className="px-4 py-2">{item.product_year}</td>
                <td className="px-4 py-2">
                  <button
                    className="mr-2 bg-zinc-700 hover:bg-zinc-950 text-white font-bold py-2 px-4 rounded w-20"
                    onClick={() => handleEdit(item.id)}
                  >
                    Edit
                  </button>
                  <button
                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded w-20"
                    onClick={() => handleDelete(item.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
        </tbody>
      </table>

      {showAddPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded shadow-lg w-1/3">
            <h2 className="text-lg font-semibold mb-4">Add Item</h2>
            <div className="mb-4">
              <label htmlFor="productName" className="block font-semibold mb-1">
                Product Name
              </label>
              <input
                type="text"
                id="productName"
                className="w-full border rounded py-2 px-3"
                value={editedItem.product_name || ""}
                onChange={(e) =>
                  setEditedItem({ ...editedItem, product_name: e.target.value })
                }
              />
            </div>
            <div className="mb-4">
              <label htmlFor="productType" className="block font-semibold mb-1">
                Product Type
              </label>
              <input
                type="text"
                id="productType"
                className="w-full border rounded py-2 px-3"
                value={editedItem.product_type || ""}
                onChange={(e) =>
                  setEditedItem({ ...editedItem, product_type: e.target.value })
                }
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="productDescription"
                className="block font-semibold mb-1"
              >
                Product Description
              </label>
              <textarea
                id="productDescription"
                className="w-full border rounded pb-24 px-3"
                value={editedItem.product_descript || ""}
                onChange={(e) =>
                  setEditedItem({
                    ...editedItem,
                    product_descript: e.target.value,
                  })
                }
              />
            </div>
            <div className="mb-4">
              <label htmlFor="productYear" className="block font-semibold mb-1">
                Product Year
              </label>
              <input
                type="text"
                id="productYear"
                className="w-full border rounded py-2 px-3"
                value={editedItem.product_year || ""}
                onChange={(e) =>
                  setEditedItem({ ...editedItem, product_year: e.target.value })
                }
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="productImage"
                className="block font-semibold mb-1"
              >
                Product Image URL
              </label>
              <input
                type="text"
                id="productImage"
                className="w-full border rounded py-2 px-3"
                value={editedItem.product_img || ""}
                onChange={(e) =>
                  setEditedItem({ ...editedItem, product_img: e.target.value })
                }
              />
            </div>
            <button
              className="mr-2 bg-zinc-700 hover:bg-zinc-950 text-white font-bold py-2 px-4 rounded"
              onClick={handleSaveAdd}
            >
              Save
            </button>
            <button
              className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
              onClick={handleCancelAdd}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {showEditPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 ">
          <div className="bg-white p-6 rounded shadow-lg w-1/3">
            <h2 className="text-lg font-semibold mb-4">Edit Item</h2>
            <div className="mb-4">
              <label htmlFor="productName" className="block font-semibold mb-1">
                Product Name
              </label>
              <input
                type="text"
                id="productName"
                className="w-full border rounded py-2 px-3"
                value={editedItem.product_name}
                onChange={(e) =>
                  setEditedItem({ ...editedItem, product_name: e.target.value })
                }
              />
            </div>
            <div className="mb-4">
              <label htmlFor="productType" className="block font-semibold mb-1">
                Product Type
              </label>
              <input
                type="text"
                id="productType"
                className="w-full border rounded py-2 px-3"
                value={editedItem.product_type}
                onChange={(e) =>
                  setEditedItem({ ...editedItem, product_type: e.target.value })
                }
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="productDescription"
                className="block font-semibold mb-1"
              >
                Product Description
              </label>
              <textarea
                id="productDescription"
                className="w-full border rounded pb-24 px-3"
                value={editedItem.product_descript}
                onChange={(e) =>
                  setEditedItem({
                    ...editedItem,
                    product_descript: e.target.value,
                  })
                }
              />
            </div>
            <div className="mb-4">
              <label htmlFor="productYear" className="block font-semibold mb-1">
                Product Year
              </label>
              <input
                type="text"
                id="productYear"
                className="w-full border rounded py-2 px-3"
                value={editedItem.product_year}
                onChange={(e) =>
                  setEditedItem({ ...editedItem, product_year: e.target.value })
                }
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="productImage"
                className="block font-semibold mb-1"
              >
                Product Image URL
              </label>
              <input
                type="text"
                id="productImage"
                className="w-full border rounded py-2 px-3"
                value={editedItem.product_img}
                onChange={(e) =>
                  setEditedItem({ ...editedItem, product_img: e.target.value })
                }
              />
            </div>
            <button
              className="mr-2 bg-zinc-500 hover:bg-zinc-700 text-white font-bold py-2 px-4 rounded"
              onClick={handleSaveEdit}
            >
              Save
            </button>
            <button
              className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
              onClick={handleCancelEdit}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Adminpage;
