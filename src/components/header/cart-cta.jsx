import { Link } from "gatsby"
import React from "react"
import { useCart } from "../../hooks/use-cart"
import ShoppingBagIcon from "../../icons/shopping-bag"

const CartCta = () => {
	const { cart } = useCart()
	
	return (
		<div className='cart-cta'>
			<Link to="/checkout">
				<ShoppingBagIcon />
				<span className='cart-cta-cnt'>{cart.items.reduce((sum, i) => sum + i.quantity, 0)}</span>
			</Link>
		</div>
	)
}

export default CartCta
