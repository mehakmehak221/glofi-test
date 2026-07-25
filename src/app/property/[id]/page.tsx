import PropertyDeepLinkHandler from "@/components/property/PropertyDeepLinkHandler";

export const dynamic = "force-dynamic";

interface PropertyDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function PropertyIdRoutePage({ params }: PropertyDetailPageProps) {
  const resolvedParams = await params;
  return <PropertyDeepLinkHandler propertyIdParam={resolvedParams.id} />;
}
