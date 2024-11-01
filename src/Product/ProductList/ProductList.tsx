import React, { useEffect, useState } from 'react'
import { Star, ShoppingCart, ChevronLeft, ChevronRight, X } from 'lucide-react'
import { useCart } from '../../context/CartContext'
import { cn } from '../../lib/utils'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../components/ui/select'
import { Button } from '../../components/ui/button'
import { Card, CardContent, CardFooter, CardHeader } from '../../components/ui/card'
import { Badge } from '../../components/ui/badge'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '../../components/ui/sheet'
import { Slider } from '../../components/ui/slider'
import { fetchProducts } from '../../services/api'
import { useNavigate } from 'react-router-dom'

interface Product {
  id: number
  title: string
  price: number
  category: string
  image: string
  rating: {
    rate: number
    count: number
  }
}

interface CartProduct extends Product {
  quantity: number
}

export default function ProductList() {
  const [filters, setFilters] = React.useState({
    category: '',
    minPrice: 0,
    maxPrice: 1000,
    rating: 0,
  })
  const [sortOption, setSortOption] = React.useState('priceLowToHigh')
  const [currentPage, setCurrentPage] = React.useState(1)
  const [products, setProducts] = React.useState<Product[]>([])
  const [cartItems, setCartItems] = React.useState<CartProduct[]>([])
  const navigate = useNavigate()
  const { addToCart } = useCart()
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const fetchedProducts = await fetchProducts()
        setProducts(fetchedProducts)
      } catch (error) {
        console.error('Error fetching products:', error)
      }
    }
    loadProducts()
  }, [])

  const filteredProducts = React.useMemo(() => {
    return products.filter((product) => {
      return (
        (!filters.category || product.category === filters.category) &&
        product.price >= filters.minPrice &&
        product.price <= filters.maxPrice &&
        product.rating.rate >= filters.rating &&
        product.title.toLowerCase().includes(searchTerm.toLowerCase())
      )
    })
  }, [products, filters, searchTerm])

  const sortedProducts = React.useMemo(() => {
    return [...filteredProducts].sort((a, b) => {
      switch (sortOption) {
        case 'priceLowToHigh':
          return a.price - b.price
        case 'priceHighToLow':
          return b.price - a.price
        case 'ratingHighToLow':
          return b.rating.rate - a.rating.rate
        case 'nameAZ':
          return a.title.localeCompare(b.title)
        case 'nameZA':
          return b.title.localeCompare(a.title)
        default:
          return 0
      }
    })
  }, [filteredProducts, sortOption])

  const ITEMS_PER_PAGE = 9
  const totalPages = Math.ceil(sortedProducts.length / ITEMS_PER_PAGE)
  const currentProducts = sortedProducts.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  )

  const handleAddToCart = (product: Product) => {
    setCartItems((prevItems) => {
      return [...prevItems, { ...product, quantity: 1 }]
    })
  }

  const handleCheckout = (cartProduct: CartProduct) => {
    cartItems.forEach(item => addToCart({ ...item, quantity: cartProduct.quantity }))
    navigate('/checkout')
  }

  const handleRemoveFromCart = (id: number) => {
    setCartItems(cartItems.filter(item => item.id !== id))
  }

  const handleQuantityChange = (id: number, quantity: number) => {
    setCartItems(cartItems.map(item => 
      item.id === id ? { ...item, quantity } : item
    ))
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 shadow-sm">
        <div className="container flex h-16 items-center justify-between">
          <h1 className="text-2xl font-bold text-black font-roboto">ShopSmart</h1>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="relative">
                <ShoppingCart className="h-5 w-5" />
                {cartItems.length > 0 && (
                  <Badge className="absolute -right-2 -top-2 h-5 w-5 rounded-full bg-primary text-primary-foreground p-0 flex items-center justify-center text-xs">
                    {cartItems.length}
                  </Badge>
                )}
              </Button>
            </SheetTrigger>
            <SheetContent className="w-full sm:max-w-lg">
              <SheetHeader>
                <SheetTitle className="text-2xl font-bold">Your Cart</SheetTitle>
                <SheetDescription>
                  You have {cartItems.length} item{cartItems.length !== 1 ? 's' : ''} in your cart
                </SheetDescription>
              </SheetHeader>
              <div className="mt-8 space-y-4">
                {cartItems.length > 0 ? (
                  cartItems.map((item, index) => (
                    <div key={index} className="flex items-center space-x-4">
                      <img src={item.image} alt={item.title} className="h-16 w-16 rounded-md object-cover" />
                      <div className="flex-1 space-y-1">
                        <h3 className="font-medium line-clamp-1">{item.title}</h3>
                        <p className="text-sm text-gray-500">${item.price.toFixed(2)}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={(e) => handleQuantityChange(item.id, parseInt(e.target.value))}
                          className="w-16 rounded-md border border-gray-300 p-1 text-center text-sm"
                        />
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleRemoveFromCart(item.id)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-gray-500">Your cart is empty.</p>
                )}
              </div>
              {cartItems.length > 0 && (
                <div className="mt-8">
                  <Button
                    onClick={() => handleCheckout(cartItems[0])}
                    className="w-full"
                  >
                    Checkout (${cartItems.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2)})
                  </Button>
                </div>
              )}
            </SheetContent>
          </Sheet>
        </div>
      </header>

      <main className="container py-8">
        <div className="flex flex-col gap-8 lg:flex-row">
          <aside className="w-full space-y-6 lg:w-64">
            <Card>
              <CardHeader>
                <h2 className="text-lg font-semibold">Filters</h2>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Category</h3>
                  <Select
                    onValueChange={(value) =>
                      setFilters({ ...filters, category: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="All Categories" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      <SelectItem value="men's clothing">Men's Clothing</SelectItem>
                      <SelectItem value="women's clothing">Women's Clothing</SelectItem>
                      <SelectItem value="jewelery">Jewelery</SelectItem>
                      <SelectItem value="electronics">Electronics</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Price Range</h3>
                  <Slider
                    defaultValue={[filters.minPrice]}
                    max={1000}
                    step={10}
                    onValueChange={(value) =>
                      setFilters({ ...filters, minPrice: value[0] })
                    }
                  />
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>${filters.minPrice}</span>
                    <span>${filters.maxPrice}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Minimum Rating</h3>
                  <Select
                    onValueChange={(value) =>
                      setFilters({ ...filters, rating: parseFloat(value) })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Any Rating" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0">Any Rating</SelectItem>
                      <SelectItem value="3">3 Stars & Above</SelectItem>
                      <SelectItem value="4">4 Stars & Above</SelectItem>
                      <SelectItem value="4.5">4.5 Stars & Above</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
            
                <div className='space-y-2'>
                <h3 className="text-sm font-medium">Search product</h3>
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="border rounded p-2 mb-4"/>
                </div>
              </CardContent>
            </Card>
          </aside>

          <div className="flex-1 space-y-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 mb-3">
                <h2 className="text-lg font-semibold">
                  {filteredProducts.length} Products
                </h2>
                <Select onValueChange={setSortOption}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="priceLowToHigh">Price: Low to High</SelectItem>
                    <SelectItem value="priceHighToLow">Price: High to Low</SelectItem>
                    <SelectItem value="ratingHighToLow">Rating: High to Low</SelectItem>
                    <SelectItem value="nameAZ">Name: A-Z</SelectItem>
                    <SelectItem value="nameZA">Name: Z-A</SelectItem>
                  </SelectContent>
                </Select>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {currentProducts.map((product) => (
                    <Card key={product.id} className="overflow-hidden bg-gray-100 shadow-lg hover:shadow-xl transition-shadow duration-300">
                      <CardHeader className="p-0">
                        <div className="aspect-square overflow-hidden">
                          <img
                            src={product.image}
                            alt={product.title}
                            className="h-full w-full object-cover transition-transform hover:scale-105"
                          />
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-2 p-4 text-black-800">
                        <h3 className="line-clamp-2 font-semibold">{product.title}</h3>
                        <div className="flex items-center justify-between">
                          <span className="text-lg font-bold text-black-500">
                            ${product.price.toFixed(2)}
                          </span>
                          <Badge variant="secondary" className="uppercase bg-gray-600 text-white">
                            {product.category}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-1">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={cn(
                                'h-4 w-4 text-yellow-500',
                                i < Math.floor(product.rating.rate)
                                  ? 'fill-yellow-500 text-yellow-500'
                                  : 'fill-yellow text-yellow-500'
                              )}
                            />
                          ))}
                          <span className="ml-2 text-sm font-semibold text-yellow-500"> 
                            {product.rating.rate.toFixed(1)}
                          </span>
                        </div>
                      </CardContent>
                      <CardFooter className="p-4 pt-0">
                        <Button
                          className="w-full"
                          onClick={() => handleAddToCart(product)}
                          disabled={cartItems.some(item => item.id === product.id)}
                        >
                          {cartItems.some(item => item.id === product.id) ? 'Added to Cart' : 'Add to Cart'}
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-center gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setCurrentPage(currentPage - 1)}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              {Array.from({ length: totalPages }, (_, i) => (
                <Button
                  key={i + 1}
                  variant={currentPage === i + 1 ? 'default' : 'outline'}
                  onClick={() => setCurrentPage(i + 1)}
                >
                  {i + 1}
                </Button>
              ))}
              <Button
                variant="outline"
                size="icon"
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}