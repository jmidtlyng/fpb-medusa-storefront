import { GatsbyImage } from "gatsby-plugin-image"
import React, { useMemo } from "react"
import { usePrice } from "../../hooks/use-price"
import { useRegion } from "../../hooks/use-region"

const ProductListItem = ({ product }) => {
  const {
    actions: { getFromPrice },
  } = usePrice()

  const { region } = useRegion()

  const fromPrice = useMemo(() => {
    return getFromPrice(product, region?.currency_code, region?.tax_rate)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product, region])

  return (
    <div class='gallery-item'>
      <div class='gallery-item-detail'>
          <p class='gallery-item-detail-title'>{ product.title }</p>
          <div class='gallery-item-detail-note'>
            <p>
              <text>Loading images</text>
              {/* https://codepen.io/nikhil8krishnan/pen/rVoXJa */}
              <svg version="1.1" id="L4" xmlns="http://www.w3.org/2000/svg"
                  x="0px" y="0px"
                  enable-background="new 0 0 0 0"
                  style={{width: '12px'}} viewBox="0 0 40 12">
                <circle fill="#000" stroke="none" cx="6" r="6" cy="6">
                  <animate attributeName="opacity" dur="1s" values="0;1;0" repeatCount="indefinite" begin="0.1"></animate>    
                </circle>
                <circle fill="#000" stroke="none" r="6" cy="6" cx="20">
                  <animate attributeName="opacity" dur="1s" values="0;1;0" repeatCount="indefinite" begin="0.2"></animate>       
                </circle>
                <circle fill="#000" stroke="none" r="6" cy="6" cx="34">
                  <animate attributeName="opacity" dur="1s" values="0;1;0" repeatCount="indefinite" begin="0.3"></animate>     
                </circle>
              </svg>
            </p>
          </div>
        </div>
        <div class='gallery-item-display'>
          <GatsbyImage image={product.thumbnail?.childImageSharp?.gatsbyImageData}
                        alt={product.title}
                        className="w-auto h-full object-center object-cover gallery-item-display-photo"/>
        </div>
        <div class="gallery-item-order">
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