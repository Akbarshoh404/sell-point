export default function FAQ() {
  const faqs = [
    { q: 'How do I sell?', a: 'Register as a seller, create a store, add products.' },
    { q: 'How do I buy?', a: 'Add to cart and place an order — simple COD in MVP.' },
    { q: 'Are images supported?', a: 'Yes, upload and serve via /api/uploads.' },
  ]
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">FAQ</h1>
      <div className="space-y-2">
        {faqs.map((f, i) => (
          <details key={i} className="border rounded p-3">
            <summary className="font-medium cursor-pointer">{f.q}</summary>
            <div className="text-sm mt-2 text-gray-600">{f.a}</div>
          </details>
        ))}
      </div>
    </div>
  )
}

