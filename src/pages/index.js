import { graphql } from "gatsby"
// import { StaticImage } from "gatsby-plugin-image"
import React from "react"
import ProductListItem from "../components/products/product-list-item"
import SearchEngineOptimization from "../components/utility/seo"

const IndexPage = ({ data }) => {
  // const { products, collections } = data
  const prods = data.products.edges.map(edge => edge.node)

  return (
    <div className='gallery' id='gallery'>
      <SearchEngineOptimization title="Products" />
      {/* only output products with inventory*/}
      {prods
        .filter(p => p.variants[0].inventory_quantity > 0)
        .map(p => {
          return <ProductListItem product={p} key={p.handle} />
        })}
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
