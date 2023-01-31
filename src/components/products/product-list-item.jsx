import React from "react"
import { useCart } from "../../hooks/use-cart"
import { formatPrice } from "../../utils/format-price"
import { getSrc } from "gatsby-plugin-image"

const ProductListItem = ({ product, prodCount, prodPosition }) => {
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
  // check if first and/or last position in prod list ui
  const firstPosition = prodPosition === 0
  const lastPosition = prodPosition === prodCount - 1
    
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
  
  // ui scroll
  const scrollToNext = () => {
    // parent el
    const el_gallery = document.getElementById('gallery')
    
    el_gallery.scrollBy({ top: el_gallery.clientHeight,
                          left: 0,
                          behavior: 'smooth' });
  }
  const scrollToPrev = () => {
    // parent el
    const el_gallery = document.getElementById('gallery')
    
    el_gallery.scrollBy({ top: -el_gallery.clientHeight,
                          left: 0,
                          behavior: 'smooth' })
  }

  return (
    <div className='gallery-item'>
      <div className='gallery-item-detail'>
        <p className='gallery-item-detail-title'>
          { product.title } - ${formatPrice(price?.amount, '', 1)}
        </p>
      </div>
      <div className='gallery-item-display'>
        <img src={getSrc(product.thumbnail)}
            alt={product.title}
            className="gallery-item-display-photo"/>
      </div>
      {prodCount > 1 &&
        <div className="gallery-item-page">
          <p>Design { prodPosition + 1} of { prodCount }</p>
          {!firstPosition &&
            <button className="gallery-item-page-control gallery-item-page-control--up"
                    style={{transform: 'rotate(180deg)'}}
                    onClick={() => scrollToPrev()}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024">
                <path d="M8.2 275.4c0-8.6 3.4-17.401 10-24.001 13.2-13.2 34.8-13.2 48 0l451.8 451.8 445.2-445.2c13.2-13.2 34.8-13.2 48 0s13.2 34.8 0 48L542 775.399c-13.2 13.2-34.8 13.2-48 0l-475.8-475.8c-6.8-6.8-10-15.4-10-24.199z"/>
              </svg>
            </button>
          }
          {!lastPosition &&
            <button className='gallery-item-page-control gallery-item-page-control--down'
                    onClick={() => scrollToNext()}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024">
                <path d="M8.2 275.4c0-8.6 3.4-17.401 10-24.001 13.2-13.2 34.8-13.2 48 0l451.8 451.8 445.2-445.2c13.2-13.2 34.8-13.2 48 0s13.2 34.8 0 48L542 775.399c-13.2 13.2-34.8 13.2-48 0l-475.8-475.8c-6.8-6.8-10-15.4-10-24.199z"/>
              </svg>
            </button>
          }
        </div>
      }
      <div className="gallery-item-order">
        {itemIsInCart &&
          <p className="gallery-item-order-cart"># in cart: {quantityInCart}</p>
        }
        {itemIsInCart &&
          <button className="gallery-item-order-remove"
                  onClick={() => handleRemoveFromCart()}
                  disabled={loading}>
            Remove
          </button>
        }
        <button className="gallery-item-order-add"
                onClick={() => handleAddToCart()}
                disabled={loading || !inventoryIsRemaining}>
          Add to order
        </button>
      </div>
    </div>
  )
}

export default ProductListItem