export default function AboutPage() {
  return (
    <div className="p-8 max-w-xl mx-auto font-sans">
      <h1 className="text-3xl font-bold mb-4 text-white">About Full Stack Open 2026</h1>
      <p className="text-gray-300 leading-relaxed mb-6">
        This course is an introduction to modern web application development with JavaScript. 
        The main focus is on building single page applications with ReactJS that use REST APIs 
        built with Node.js. This extension section introduces Next.js server-side features.
      </p>
      <div className="p-4 bg-zinc-950 border border-zinc-800 rounded text-sm text-zinc-400">
        Current Version: <span className="text-green-400 font-mono">2026.1.0</span>
      </div>
    </div>
  )
}