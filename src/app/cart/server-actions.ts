"use server";

import { createCart, getCart } from "@/lib/db/cart";
import { prisma } from "@/lib/db/prisma";
import { revalidatePath } from "next/cache";

export async function setProductQuantity(productId: string, quantity: number) {
  const cart = (await getCart()) ?? (await createCart());

  const cartItem = cart.items.find((item) => item.product.id === productId);

  if (quantity === 0 && cartItem) {
    await prisma.cartItem.delete({
      where: { id: cartItem.id },
    });
  } else if (quantity > 0 && cartItem) {
    await prisma.cartItem.update({
      where: { id: cartItem.id },
      data: { quantity },
    });
  } else {
    await prisma.cartItem.create({
      data: {
        cartId: cart.id,
        productId,
        quantity: quantity,
      },
    });
  }

  revalidatePath("/cart");
}
