import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProduct } from "../store/slices/productSlice";
import { RootState, AppDispatch } from "../store/store";
import Graph from "./Graph";

const Product: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { items, loading, error } = useSelector(
    (state: RootState) => state.product
  );

  useEffect(() => {
    dispatch(fetchProduct());
  }, [dispatch]);

  if (loading) return <p>Loading products...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="bg-gray-100 min-h-screen flex p-8">
      <div className="bg-white rounded-lg shadow-lg p-6 w-1/4 flex flex-col items-center">
        {items.map((product) => (
          <div
            key={product.id}
            className="flex flex-col items-center text-center"
          >
            <div className="mb-4">
              <img
                src={product.image}
                alt={product.title}
                className="w-32 h-32 object-cover rounded-lg mb-4"
              />
            </div>

            <h1 className="text-2xl font-bold mb-2">{product.title}</h1>

            <p className="text-gray-500 mb-4">{product.subtitle}</p>

            <div className="flex flex-wrap gap-3 justify-start w-full">
              {product.tags.map((tag, index) => (
                <span
                  key={index}
                  className="border border-gray-400 text-gray-700 text-sm font-semibold px-3 py-1 rounded-lg"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Graph Card */}
      <div className="flex-grow bg-white rounded-lg shadow-lg ml-8 pt-6 pb-6">
        <h3 className="text-lg mb-4 px-6">Retail Sales</h3>
        <div className="w-full">
          <Graph />
        </div>
      </div>
    </div>
  );
};

export default Product;
