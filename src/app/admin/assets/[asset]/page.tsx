interface AssetPageProps {
  params: Promise<{ asset: string }>;
}
export default async function AssetPage({ params }: AssetPageProps) {
  const asset = (await params).asset;
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold capitalize">{asset}</h1>
      <p className="mt-2">
        This is a dynamic page for the &quot;{asset}&quot; asset type.
      </p>
    </div>
  );
}
