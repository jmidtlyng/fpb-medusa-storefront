import React from "react"
import QuantitySelector from "./quantity-selector"
import { useCart } from "../../hooks/use-cart"
import { usePrice } from "../../hooks/use-price"
import { useRegion } from "../../hooks/use-region"
import { getSrc } from "gatsby-plugin-image"

const ProductListItem = ({ product }) => {
  const [quantity, setQuantity] = React.useState(1)

  const {
    loading,
    cart,
    actions: { addItem },
  } = useCart()
  // just use first variant. Going for simple design, 1 var/prod
  const variant = product.variants[0]
  const region = useRegion()
  const currencyCode = region.currency_code
  
  // console.log(cart)
  console.log(product)
  // console.log(variant)
  // console.log(region)
  
  // match price from currency code
  const price = variant.prices[0]
                ? variant.prices.find(p => p.currency_code === region.currency_code)
                : undefined
  // check cart. if there are items in the cart then show cart item count
  const cartItem = cart.items.find(i => i.variant.id == variant.id)
  const quantityInCart = typeof cartItem == 'undefined' ? '' : cartItem.quantity
  const itemIsInCart = quantityInCart > 0
  const inventoryIsRemaining = variant.inventory_quantity > quantityInCart
  
  // pick out specific variant and only ever increase quant by 1                  
  const handleAddToCart = async () => {
    // only add to cart if there is inventory to add to the cart
    if(inventoryIsRemaining){
      await addItem({ variant_id: variant.id, quantity: 1 })
    }
  }                
  const handleRemoveFromCart = async () => {
    // only remove if there is something in cart. Shouldnt run without cart item
    if(itemIsInCart){
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