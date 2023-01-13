import React from "react"
import { useCart } from "../../hooks/use-cart"
import { formatPrice } from "../../utils/format-price"
import { getSrc } from "gatsby-plugin-image"

const ProductListItem = ({ product }) => {
  const {
    loading,
    cart,
    actions: { addItem, removeItem },
  } = useCart()
  // just use first variant. Going for simple design, 1 var/prod
  const variant = product.variants[0]
  
  // find variant in cart
  const cartItem = cart.items.find(i => i.variant.id === variant.id)
  // match price from currency code
  const price = Array.isArray(variant.prices)
                ? variant.prices.find(p => p.currency_code === 'usd')
                : undefined
  console.log(variant.prices)
  console.log(price)
    
  // check cart. if there are items in the cart then show cart item count
  const quantityInCart = typeof cartItem == 'undefined' ? '' : cartItem.quantity
  const inventoryIsRemaining = variant.inventory_quantity > quantityInCart
  const itemIsInCart = quantityInCart > 0
  
  // pick out specific variant and only ever increase quant by 1                  
  const handleAddToCart = async () => {
    // only add to cart if there is inventory to add to the cart
    if(inventoryIsRemaining){
      await addItem({ variant_id: variant.id, quantity: 1 })
    }
  }                
  const handleRemoveFromCart = async () => {
    // if only one item in cart, remove entirely. otherwise decrease quantity by 1
    if(quantityInCart === 1) {
      await removeItem(cartItem.id)
    } else if(itemIsInCart) {
      await addItem({ variant_id: variant.id, quantity: -1 })
    }
  }

  return (
    <div className='gallery-item'>
      <div className='gallery-item-detail'>
        <p className='gallery-item-detail-title'>{ product.title }</p>
      </div>
      <div className='gallery-item-display'>
        <img src={getSrc(product.thumbnail)}
            alt={product.title}
            className="gallery-item-display-photo"/>
      </div>
      <div className="gallery-item-order">
        <div className="inline-flex mt-4">
          <span>${formatPrice(price?.amount, '', 1)}</span>
          <span>{quantityInCart}</span>
          <button className="btn-ui mr-2 px-12"
              onClick={() => handleAddToCart()}
              disabled={loading || !inventoryIsRemaining}>
            Add to order
          </button>
          {itemIsInCart &&
            <button className="btn-ui mr-2 px-12"
                onClick={() => handleRemoveFromCart()}
                disabled={loading}>
              Remove from order
            </button>
          }
        </div>
      </div>
    </div>
  )
}

export default ProductListItem