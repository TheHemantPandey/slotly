import { redirect } from "next/navigation";

export default async function BookWithIdPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  redirect(`/book?service=${encodeURIComponent(id)}`);
}
