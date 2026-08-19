export default function PageHeader({ tag, title, description }) {
  return (
    <div className="bg-gradient-to-br from-tis-950 via-tis-900 to-tis-800 py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {tag && <p className="text-tis-400 text-sm font-semibold uppercase tracking-widest mb-2">{tag}</p>}
        <h1 className="text-4xl font-bold text-white">{title}</h1>
        {description && <p className="text-tis-300 mt-2 text-lg">{description}</p>}
      </div>
    </div>
  );
}
