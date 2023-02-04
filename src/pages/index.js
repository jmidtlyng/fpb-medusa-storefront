import { graphql } from "gatsby"
// import { StaticImage } from "gatsby-plugin-image"
import React from "react"
import ProductListItem from "../components/products/product-list-item"
import SearchEngineOptimization from "../components/utility/seo"
import CartCta from "../components/header/cart-cta"


const IndexPage = ({ data }) => {
  // const { products, collections } = data
  const prods = data.products.edges
                  .map(edge => edge.node)
                  .filter(p => p.variants[0].inventory_quantity > 0)

  return (
    <div>
      <div className='gallery' id='gallery'>
        <SearchEngineOptimization title="Products" />
        {/* only output products with inventory*/}
        {prods.map((p, i) => <ProductListItem product={p} key={p.handle}
                                              prodCount={prods.length} prodPosition={i} /> )}
      </div>
      <CartCta/>
    </div>
  )
}

export const query = graphql`
  query {
    products: allMedusaProducts {
      edges {
        node {
          handle
          title
          collection_id
          thumbnail {
            childImageSharp {
              gatsbyImageData
            }
          }
          variants {
            id
            inventory_quantity
            prices {
              amount
              currency_code
            }
          }
          options {
            values {
              value
            }
            title
          }
        }
      }
    }
    collections: allMedusaCollections {
      edges {
        node {
          id
          title
          handle
        }
      }
    }
  }
`

export default IndexPage
