import { redirect } from 'next/navigation';

// Redirect from old URL format (/horse/:id) to new format (/horses/:id)
export default async function OldHorseRedirect({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  redirect(`/horses/${id}`);
}
