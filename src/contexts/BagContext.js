import React, { createContext, useContext, useState, useEffect } from 'react';

const BagContext = createContext();

export function useBag() {
  return useContext(BagContext);
}

export function BagProvider({ children }) {
  const [bagItems, setBagItems] = useState([]);

  useEffect(() => {
    // Load bag items from localStorage on app start
    const savedBag = localStorage.getItem('permacultureBag');
    if (savedBag) {
      setBagItems(JSON.parse(savedBag));
    }
  }, []);

  const addToBag = (product) => {
    const existingItem = bagItems.find(item => item.id === product.id);
    if (!existingItem) {
      const updatedBag = [...bagItems, product];
      setBagItems(updatedBag);
      localStorage.setItem('permacultureBag', JSON.stringify(updatedBag));
    }
  };

  const removeFromBag = (productId) => {
    const updatedBag = bagItems.filter(item => item.id !== productId);
    setBagItems(updatedBag);
    localStorage.setItem('permacultureBag', JSON.stringify(updatedBag));
  };

  const clearBag = () => {
    setBagItems([]);
    localStorage.removeItem('permacultureBag');
  };

  const isInBag = (productId) => {
    return bagItems.some(item => item.id === productId);
  };

  const bagCount = bagItems.length;

  const value = {
    bagItems,
    addToBag,
    removeFromBag,
    clearBag,
    isInBag,
    bagCount
  };

  return (
    <BagContext.Provider value={value}>
      {children}
    </BagContext.Provider>
  );
}
