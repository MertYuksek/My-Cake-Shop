import FormSubmitButton from "@/components/FormSubmitButton";
import { prisma } from "@/lib/db/prisma";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";

export const metadata = {
  title: "Add Cake - My Cake Shop",
};

async function addProduct(formData: FormData) {
  "use server";

  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/api/auth/signin?callbackUrl=/add-product")
  }

  const name = formData.get("name")?.toString();
  const description = formData.get("description")?.toString();
  const imgUrl = formData.get("imageUrl")?.toString();
  const price = Number(formData.get("price") || 0);

  if (!name || !description || !imgUrl || !price) {
    throw Error("Missing required fields");
  }

  await prisma.product.create({
    data: { name, description, imgUrl, price },
  });

  redirect("/");
}

export default async function AddProduct() {

  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/api/auth/signin?callbackUrl=/add-product")
  }

  return (
    <div>
      <h1 className="mb-3 text-lg font-bold">Add Cake</h1>
      <form action={addProduct}>
        <input
          required
          name="name"
          placeholder="Name"
          className="input-bordered input mb-3 w-full"
        />
        <textarea
          required
          name="description"
          placeholder="Description"
          className="textarea-bordered textarea mb-3 w-full"
        />
        <input
          required
          name="imageUrl"
          placeholder="Image URL"
          type="url"
          className="input-bordered input mb-3 w-full"
        />
        <input
          required
          name="price"
          placeholder="Price"
          type="number"
          className="input-bordered input mb-3 w-full"
        />
        <FormSubmitButton className="btn-primary btn mb-3 w-full">
          Add Cake
        </FormSubmitButton>
      </form>
    </div>
  );
}
