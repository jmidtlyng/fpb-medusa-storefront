import { Link } from "gatsby"
import React from "react"
import { useCart } from "../../hooks/use-cart"
const CartCta = () => {
	const { cart } = useCart()
	
	return (
		<div className='cart-cta'>
			{cart.items.length > 0 &&
				<Link to="/checkout">
					{cart.items.reduce((sum, i) => sum + i.quantity, 0)} items in your cart.<br/>
					<span className='link-style'>Click here to checkout.</span>
				</Link>	
			}
		</div>
	)
}

export default CartCta
