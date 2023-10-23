import ProductCard from "@/components/ProductCard";
import { prisma } from "@/lib/db/prisma";
import { Metadata } from "next";

interface SearchPageProps {
  searchParams: { query: string };
}

export function generateMetadata({
    searchParams: { query },
  }: SearchPageProps): Metadata {
    return {
      title: `Search: ${query} - My Cake Shop`,
    };
  }

export default async function SearchPageProps({
  searchParams: { query },
}: SearchPageProps) {
  const products = await prisma.product.findMany({
    where: {
      OR: [{ name: { contains: query } }, { description: { contains: query } }],
    },
    orderBy: {id: "desc"},
    take: 6
  });

  if (products.length === 0) {
    return <div className="text-center">No products found</div>;
  }

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
      {products.map((product) => (
        <ProductCard product={product} key={product.id} />
      ))}
    </div>
  );
}
