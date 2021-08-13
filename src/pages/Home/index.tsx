import React, { useState, useEffect } from 'react';
import { MdAddShoppingCart } from 'react-icons/md';

import { ProductList } from './styles';
import { api } from '../../services/api';
import { formatPrice } from '../../util/format';
import { useCart } from '../../hooks/useCart';

interface Product {
  id: number;
  title: string;
  price: number;
  image: string;
}

interface ProductFormatted extends Product {
  priceFormatted: string;
}

interface CartItemsAmount {
  [key: number]: number;
}

const Home = (): JSX.Element => {
  const [products, setProducts] = useState<ProductFormatted[]>([]);
  const { addProduct, cart } = useCart();

  //"curto circuito", quando a operação do lado esquerdo dos "pipes" der FALSY
  //o resultado vai ser o que estiver do lado direito dos "pipes"
  //tem que colocar o curto circuito por que na primeira RUN do reduce a var sumAmount[id] ainda não existe
  //como ela ainda não existe, não é possível realizar a operação (sumAmount[id] + 1)
  const cartItemsAmount = cart.reduce((sumAmount, { id }) => {
    sumAmount[id] = sumAmount[id] + 1 || 1

    console.log('sumAmount: ', sumAmount);
    
    return sumAmount
  }, {} as CartItemsAmount)

  console.log('A var final: ', cartItemsAmount);

  useEffect(() => {
    async function loadProducts() {
      const response = await api.get('/products')

      const data = response.data

      setProducts(data)
    }

    loadProducts();
  }, []);

  function handleAddProduct(id: number) {

    addProduct(id)

  }

  return (
    <ProductList>
      {products.map(product => (
        <li key={product.id}>
          <img src={product.image} alt={product.title} />
          <strong>{product.title}</strong>
          <span>{product.price}</span>
          <button
            type="button"
            data-testid="add-product-button"
            onClick={() => handleAddProduct(product.id)}
          >
            <div data-testid="cart-product-quantity">
              <MdAddShoppingCart size={16} color="#FFF" />
              {cartItemsAmount[product.id] || 0}
            </div>

            <span>ADICIONAR AO CARRINHO</span>
          </button>
        </li>
      ))}
    </ProductList>
  );
};

export default Home;
