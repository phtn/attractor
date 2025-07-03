export default function AssetPage({ params }: { params: { asset: string } }) {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold capitalize">{params.asset}</h1>
      <p className="mt-2">
        This is a dynamic page for the &quot;{params.asset}&quot; asset type.
      </p>
    </div>
  );
}
