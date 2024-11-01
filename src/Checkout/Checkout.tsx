import { useEffect, useState } from 'react';
import { useCart } from '../context/CartContext';
import { Minus, Plus, ShoppingCart, Trash2 } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Separator } from "../components/ui/separator";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '../components/ui/dialog';


export default function Component() {
  const { cartItems, updateQuantity, removeFromCart, getTotalPrice, clearCart } = useCart();
  const [isDialogOpen, setIsDialogOpen] = useState(false);





  const handleCheckout = () => {
    if (getTotalPrice() > 0) {
      setIsDialogOpen(true);
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-3xl">
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-center">Your Cart</CardTitle>
        </CardHeader>
        <CardContent>
          {cartItems.length === 0 ? (
            <div className="text-center py-12">
              <ShoppingCart className="mx-auto h-12 w-12 text-gray-400" />
              <p className="mt-4 text-xl font-semibold text-gray-900">Your cart is empty</p>
              <p className="mt-2 text-gray-500">Looks like you haven't added any items to your cart yet.</p>
            </div>
          ) : (
            <ul className="divide-y divide-gray-200">
              {cartItems.map((item) => (
                <li key={item.id} className="py-6 flex items-center">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-medium text-gray-900">{item.title}</h3>
                    <p className="mt-1 text-sm text-gray-500">${item.price.toFixed(2)}</p>
                  </div>
                  <div className="flex items-center ml-4">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      disabled={item.quantity === 0}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <Input
                      type="number"
                      min="0"
                      value={item.quantity}
                      onChange={(e) => updateQuantity(item.id, parseInt(e.target.value, 10))}
                      className="w-16 mx-2 text-center"
                    />
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="ml-4"
                    onClick={() => removeFromCart(item.id)}
                  >
                    <Trash2 className="h-5 w-5 text-red-500" />
                  </Button>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
        {cartItems.length > 0 && (
          <CardFooter className="flex flex-col">
            <Separator className="my-4" />
            <div className="flex justify-between items-center w-full">
              <span className="text-lg font-semibold text-gray-900">Total</span>
              <span className="text-2xl font-bold text-gray-900">${getTotalPrice().toFixed(2)}</span>
            </div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button
                  className="w-40 mt-6"
                  size="lg"
                  onClick={handleCheckout}
                  disabled={getTotalPrice() <= 0}
                >
                  Proceed to Checkout
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Checkout Success</DialogTitle>
                  <DialogDescription>Thank you for your purchase!</DialogDescription>
                </DialogHeader>
                <div className="mt-4">
                  <ul className="divide-y divide-gray-200">
                    {cartItems.map((item) => (
                      <li key={item.id} className="py-2 flex justify-between">
                        <span>{item.title} (x{item.quantity})</span>
                        <span>${(item.price * item.quantity).toFixed(2)}</span>
                      </li>
                    ))}
                  </ul>
                  <Separator className="my-4" />
                  <p className="text-lg font-semibold">Total: ${getTotalPrice().toFixed(2)}</p>
                </div>
                <Button
                  className="mt-6"
                  onClick={() => setIsDialogOpen(false)}
                >
                  Close
                </Button>
              </DialogContent>
            </Dialog>
          </CardFooter>
        )}
      </Card>
    </div>
  );
}
