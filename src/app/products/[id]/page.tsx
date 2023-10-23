import PriceTag from "@/components/PriceTag";
import { prisma } from "@/lib/db/prisma";
import Image from "next/image";
import { notFound } from "next/navigation";
import { cache } from "react";
import { Metadata } from "next";
import AddToCartButton from "./AddToCartButton";
import { incrementProductQuantity } from "./server-action";

interface ProductProps {
  params: {
    id: string;
  };
}

const getProduct = cache(async (id: string) => {
  const product = await prisma.product.findUnique({
    where: { id },
  });

  console.log(product?.name + " Get Product Called");
  if (!product) notFound();

  return product;
});

export async function generateMetadata({
  params: { id },
}: ProductProps): Promise<Metadata> {
  const product = await getProduct(id);

  return {
    title: product.name + " - My Cake Shop",
    description: product.description,
    openGraph: {
      images: [{ url: product.imgUrl }],
    },
  };
}

export default async function ProductPage({ params: { id } }: ProductProps) {
  const product = await getProduct(id);

  return (
    <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
      <Image
        src={product.imgUrl}
        alt={product.name}
        width={500}
        height={500}
        className="rounded-lg"
        priority
      />

      <div>
        <h1 className="text-5xl font-bold">{product.name}</h1>
        <PriceTag price={product.price} className="mt-4" />
        <p className="py-6">{product.description}</p>
        <AddToCartButton
          productId={id}
          incrementProductQuantity={incrementProductQuantity}
        />
      </div>
    </div>
  );
}
