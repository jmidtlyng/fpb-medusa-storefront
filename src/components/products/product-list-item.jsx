import React from "react"
import { useCart } from "../../hooks/use-cart"
import { formatPrice } from "../../utils/format-price"
import _ from "/node_modules/lodash"

const ProductListItem = ({ product, prodCount, prodPosition }) => {
  const {
    loading,
    cart,
    actions: { addItem, removeItem },
  } = useCart()
  
  // just use first variant. Going for simple design, 1 var/prod
  const variant = product.variants[0]
  const images = product.images
  
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
  const quantityInCart = typeof cartItem == 'undefined' ? 0 : cartItem.quantity
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
  
  // gallery image ui scroll
  const scrollToNextImg = e => {
    // parent el
    const el = e.target
    const el_imgGallery = el.closest('.gallery-item-display')
    
    el_imgGallery.scrollBy({ top: 0,
                          left: el_imgGallery.clientWidth,
                          behavior: 'smooth' })
    
    // adjust dots
    adjustImgDotRight(el)
  }
  const scrollToPrevImg = e => {
    // parent el
    const el = e.target
    const el_imgGallery = e.target.closest('.gallery-item-display')
    
    el_imgGallery.scrollBy({ top: 0,
                          left: -el_imgGallery.clientWidth,
                          behavior: 'smooth' })
    
    // adjust dots
    adjustImgDotLeft(el)
  }
  
  const adjustImgDotRight = el => {
    const el_product = el.closest('.gallery-item')
    const el_dots = el_product.getElementsByClassName('gallery-item-image-dots')[0]
    // get last child
    const el_lastDot = el_dots.children[el_dots.children.length - 1]
    // set last empty dot to first position to move filled dot right
    el_dots.prepend(el_lastDot)
  }
  
  const adjustImgDotLeft = el => {
    const el_product = el.closest('.gallery-item')
    const el_dots = el_product.getElementsByClassName('gallery-item-image-dots')[0]
    // get first child
    const el_firstDot = el_dots.children[0]
    // set first empty dot to last position to move filled dot left
    el_dots.appendChild(el_firstDot)
  }
  
  const testScrollEnd = e => {
    const el = e.target
    // get window width to compare to fulls-width image scroll position
    const vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0)
    // divide scroll by total screen width to find scroll position
    const position = Math.floor(el.scrollLeft / vw)
    // get container and UI dots, and filled UI dot
    const el_product = el.closest('.gallery-item')
    const el_dots = el_product.getElementsByClassName('gallery-item-image-dots')[0]
    const el_filledDot = el_dots.getElementsByClassName('gallery-item-image-dots--fill')[0]
    const el_emptyDots = el_dots.querySelectorAll(':not(.gallery-item-image-dots--fill)')
    
    // if scrolled fully right then there is nothing to insert before so append
    if(position === el_dots.children.length - 1){
      el_dots.appendChild(el_filledDot)
    } else {
      // otherwise place before empty dot at position idx
      el_dots.insertBefore(el_filledDot, el_emptyDots[position])
    }
  }

  return (
    <div className='gallery-item'>
      <div className='gallery-item-detail'>
        <p className='gallery-item-detail-title'>
          { product.title } - ${formatPrice(price?.amount, '', 1)}
        </p>
      </div>
      <div className='gallery-item-display'
            onScroll={_.debounce(e => testScrollEnd(e), 200)}>
        <div className='gallery-item-display-slider'>
          {images.map((img, i) => 
              <div key={i} className="gallery-item-display-slider-img">
                <img src={img.url}
                    alt={product.title}
                    loading="lazy"/>
                {images.length > 0 && images.length - 1 > i &&
                  <button className="gallery-item-image-control gallery-item-image-control--right"
                          style={{transform: 'rotate(-90deg)'}}
                          onClick={scrollToNextImg}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024">
                      <path d="M8.2 275.4c0-8.6 3.4-17.401 10-24.001 13.2-13.2 34.8-13.2 48 0l451.8 451.8 445.2-445.2c13.2-13.2 34.8-13.2 48 0s13.2 34.8 0 48L542 775.399c-13.2 13.2-34.8 13.2-48 0l-475.8-475.8c-6.8-6.8-10-15.4-10-24.199z"/>
                    </svg>
                  </button>
                }
                {i > 0 &&
                  <button className="gallery-item-image-control gallery-item-page-control--left"
                          style={{transform: 'rotate(90deg)'}}
                          onClick={scrollToPrevImg}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024">
                      <path d="M8.2 275.4c0-8.6 3.4-17.401 10-24.001 13.2-13.2 34.8-13.2 48 0l451.8 451.8 445.2-445.2c13.2-13.2 34.8-13.2 48 0s13.2 34.8 0 48L542 775.399c-13.2 13.2-34.8 13.2-48 0l-475.8-475.8c-6.8-6.8-10-15.4-10-24.199z"/>
                    </svg>
                  </button>
                }
              </div>
            )}
        </div>
      </div>
      {images.length > 1 &&
        <div className='gallery-item-image-dots'>
          {images.map((img, i) => 
            <svg xmlns="http://www.w3.org/2000/svg" key={i}
                  className={i === 0 ? 'gallery-item-image-dots--fill' : ''}
                  width="24" height="24" viewBox="0 0 24 24">
              {i === 0 &&
                <path fill="#000000"
                      d="M12 2C6.47 2 2 6.47 2 12s4.47 10 10 10s10-4.47 10-10S17.53 2 12 2z"></path>
              }
              {i > 0 &&
                <path fill="#000000" d="M12 2C6.47 2 2 6.47 2 12s4.47 10 10 10s10-4.47 10-10S17.53 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8s8 3.58 8 8s-3.58 8-8 8z"></path>
              }
            </svg>
          )}
        </div>
      }
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
          <div className="gallery-item-order-cart">
            <p className="gallery-item-order-cart-qty">{quantityInCart} in cart</p>
            <button className="gallery-item-order-remove"
                    onClick={() => handleRemoveFromCart()}
                    disabled={loading}>
              Remove
            </button>
          </div>
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