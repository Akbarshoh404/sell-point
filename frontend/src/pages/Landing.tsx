import { Link } from "react-router-dom"
export default function Landing() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Welcome to SellPoint</h1>
      <p>Find electronics by category, filter and compare.</p>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
        {[["phones","Phones"],["laptops","Laptops"],["pcs","PCs"],["consoles","Consoles"],["accessories","Accessories"]].map(([key,label]) => (
          <Link key={key} to={`/category/${key}`} className="border p-4 rounded hover:bg-gray-50">{label}</Link>
        ))}
      </div>
    </div>
  )
}
