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
  const specificProduct = product.variants[0]
  const region = useRegion()
  const currencyCode = region.currency_code
  
  // console.log(cart)
  // console.log(product)
  // console.log(specificProduct)
  // console.log(region)
  
  // match price from currency code
  const price = specificProduct.prices[0]
                ? specificProduct.prices.find(p => p.currency_code === region.currency_code)
                : undefined
  // check cart. if there are items in the cart then show cart item count
  const cartItem = cart.items.find(i => i.variant.id == specificProduct.id)
  const quantityInCart = typeof cartItem == 'undefined' ? '' : cartItem.quantity;
  
  // pick out specific variant and only ever increase quant by 1                  
  const handleAddToCart = async () => {
    await addItem({ variant_id: specificProduct.id, quantity: 1 })
  }                
  const handleRemoveFromCart = async () => {
    await addItem({ variant_id: specificProduct.id, quantity: -1 })
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
              disabled={loading}>
            Add to order
          </button>
          <button className="btn-ui mr-2 px-12"
              onClick={() => handleRemoveFromCart()}
              disabled={loading}>
            Remove from order
          </button>
        </div>
        {/*
          <QuantitySelector
            quantity={quantity}
            increment={increaseQuantity}
            decrement={decreaseQuantity}
          />
          <p class="gallery-item-order-stock">{{bookmark.stock}} avaible</p>
          <button class="gallery-item-order-add"
                  hx-post='/add-to-cart/{{bookmark.id}}'>Add to order</button>
        */}
      </div>
    </div>
  )
}

export default ProductListItem
/*
  <RegionalLink to={product.handle} className="font-normal">
    <div key={product.id} className="group relative">
      <div className="w-full min-h-auto bg-gray-200 aspect-w-1 aspect-h-1 rounded-md overflow-hidden group-hover:opacity-75 lg:h-80 lg:aspect-none">
        <GatsbyImage
          image={product.thumbnail?.childImageSharp?.gatsbyImageData}
          alt={product.title}
          className="w-auto h-full object-center object-cover"
        />
      </div>
      <div className="mt-4 flex justify-between">
        <h3 className="text-sm text-gray-700">
          <p className="font-normal">{product.title}</p>
        </h3>
        <p className="text-sm font-semibold text-gray-900">
          from {fromPrice}
        </p>
      </div>
    </div>
  </RegionalLink>
*/