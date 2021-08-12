import { createContext, ReactNode, useContext, useState } from 'react';
import { toast } from 'react-toastify';
import { api } from '../services/api';
import { Product, Stock } from '../types';

interface CartProviderProps {
  children: ReactNode;
}

interface UpdateProductAmount {
  productId: number;
  amount: number;
}

interface CartContextData {
  cart: Product[];
  addProduct: (productId: number) => Promise<void>;
  removeProduct: (productId: number) => void;
  updateProductAmount: ({ productId, amount }: UpdateProductAmount) => void;
}

const CartContext = createContext<CartContextData>({} as CartContextData);

export function CartProvider({ children }: CartProviderProps): JSX.Element {
  const [cart, setCart] = useState<Product[]>(() => {
    const storagedCart = localStorage.getItem('@RocketShoes:cart')

    if (storagedCart) {
      return JSON.parse(storagedCart);
    }

    return [];
  });

  const addProduct = async (productId: number) => {
    try {
      const newCart = [...cart]
      //buscando dados lá do estoque para saber se ainda tem o produto
      const response = await api.get('stock')
      const inStock = response.data

      //encontrando produto no estoque pelo ID
      const selectedProduct = inStock.find((product: Stock) => product.id === productId)
      
      //verificando se o produto já existe no carrinho
      const alreadyInCart = newCart.find(item => item.id === productId)
      //Se o produto já existe no carrinho, pega a quantidade que já tinha. Else {ZERO}
      const cartAmount = alreadyInCart ? alreadyInCart.amount : 0
      const newAmount = cartAmount +1

      if(newAmount > selectedProduct.amount) {
        toast.error('Quantidade solicitada fora de estoque');
        return
      }

      //Se produto já existe no carrinho, apenas atualiza o valor
      //Se não, busca os dados daquele produto pelo ID na api e insere todos eles e inclui o amount
      if(alreadyInCart) {
        alreadyInCart.amount = newAmount
      } else {
        const product = await api.get(`stock/${productId}`)

        const newProductToCart = {...product.data, amount : 1}

        newCart.push(newProductToCart)
      }

      //setCart altera o valor da variável 'cart' para o que passarmos como parâmetro
      setCart(newCart)

      //Define novamente o localstorage, passando o carrinho novamente depois de já atualizado
      localStorage.setItem('@RocketSeat:cart', JSON.stringify(newCart))

    } catch {
      toast.error('Erro na adição do produto');
    }
  };

  //remover produto do carrinho
  const removeProduct = (productId: number) => {
    try {
      // TODO
    } catch {
      toast.error('Erro na remoção do produto');
    }
  };

  const updateProductAmount = async ({
    productId,
    amount,
  }: UpdateProductAmount) => {
    try {
      // TODO
    } catch {
      // TODO
    }
  };

  return (
    <CartContext.Provider
      value={{ cart, addProduct, removeProduct, updateProductAmount }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart(): CartContextData {
  const context = useContext(CartContext);

  return context;
}
