import React, { useMemo } from "react"
import QuantitySelector from "./quantity-selector"
import { useCart } from "../../hooks/use-cart"
import { useProduct } from "../../hooks/use-product"
import { usePrice } from "../../hooks/use-price"
import { useRegion } from "../../hooks/use-region"
import { getSrc } from "gatsby-plugin-image"

const ProductListItem = ({ product }) => {
  const {
    loading,
    actions: { addItem },
  } = useCart()
  
  const {
    variant,
    quantity,
    actions: {
      increaseQuantity,
      decreaseQuantity,
      resetOptions,
    },
  } = useProduct(product)

  const { region } = useRegion()
  
  const handleAddToCart = async () => {
    await addItem({ variant_id: variant.id, quantity })
    resetOptions()
  }

  return (
    <div class='gallery-item'>
      <div class='gallery-item-detail'>
        <p class='gallery-item-detail-title'>{ product.title }</p>
      </div>
      <div class='gallery-item-display'>
        <img  src={getSrc(product.thumbnail)}
            alt={product.title}
            className="gallery-item-display-photo"/>
      </div>
      <div class="gallery-item-order">
        <div className="inline-flex mt-4">
          <button className="btn-ui mr-2 px-12"
              onClick={() => handleAddToCart()}
              disabled={loading}>
            Add to bag
          </button>
          <QuantitySelector
            quantity={quantity}
            increment={increaseQuantity}
            decrement={decreaseQuantity}
          />
        </div>
        {/*
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