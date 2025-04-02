import React, { useContext, useEffect, useState } from 'react';
import { ShopContext } from '../Context/ShopContext';
import Title from '../Components/Title';
import ProductItem from './ProductItem';

const RelatedProducts = ({ category, subCategory }) => {
  const { products } = useContext(ShopContext);
  const [related, setRelated] = useState([]);

  useEffect(() => {
    if (products.length > 0) {
      let productsCopy = products.slice();

      // Filter by category and subCategory
      productsCopy = productsCopy.filter((item) => item.category === category);
      productsCopy = productsCopy.filter((item) => item.subCategory === subCategory);

      // Get only the first 5 related products
      setRelated(productsCopy.slice(0, 5));
    }
  }, [products, category, subCategory]); // Add dependencies to update on prop change

  return (
    <div className='my-24'>
      <div className='text-center text-3xl py-2'>
        <Title text1="RELATED" text2="PRODUCTS" />
      </div>
      <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 gap-y-6'>
        {related.map((item, index) => (
          <ProductItem
            key={index}
            id={item._id}
            name={item.name}
            price={item.price}
            image={Array.isArray(item.Image) && item.Image.length > 0 ? item.Image[0] : item.Image} // FIX: Access first image if it's an array
          />
        ))}
      </div>
    </div>
  );
};

export default RelatedProducts;
