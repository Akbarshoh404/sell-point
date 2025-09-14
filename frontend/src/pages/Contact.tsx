export default function Contact() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Contact</h1>
      <p>Questions? Reach out at <a className="underline" href="mailto:support@sellpoint.test">support@sellpoint.test</a></p>
      <form className="space-y-2 max-w-md">
        <input className="border p-2 rounded w-full" placeholder="Your email" />
        <textarea className="border p-2 rounded w-full" placeholder="Message" rows={5} />
        <button className="border px-4 py-2 rounded bg-blue-600 text-white">Send</button>
      </form>
    </div>
  )
}

