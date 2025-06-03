import React from 'react';

export default function ProductCard({ product }) {
  return (
    <div className="min-w-[160px] max-w-[160px] bg-white rounded-xl shadow p-2 mx-2">
      {product.thumbnail && (
        <img
          src={product.thumbnail}
          alt={product.title}
          className="w-full h-36 object-cover rounded-lg"
        />
      )}
      <div className="mt-2 font-medium text-sm line-clamp-2">{product.title}</div>
      <div className="text-sm text-gray-600">{product.price}</div>
      <a
        href={product.link}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-600 text-sm underline mt-1 block"
      >
        View
      </a>
    </div>
  );
}
