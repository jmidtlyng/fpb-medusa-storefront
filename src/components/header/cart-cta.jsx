import { Link } from "gatsby"
import React from "react"
import { useCart } from "../../hooks/use-cart"
const CartCta = () => {
	const { cart } = useCart()
	const cartCnt = cart.items.reduce((sum, i) => sum + i.quantity, 0)
	
	return (
		<div className='cart-cta'>
			{cart.items.length > 0 &&
				<Link to="/checkout">
					{cartCnt} bookmark{cartCnt > 1 ? 's' : ''} in cart.<br/>
					<span className='link-style'>Checkout.</span>
				</Link>	
			}
		</div>
	)
}

export default CartCta
