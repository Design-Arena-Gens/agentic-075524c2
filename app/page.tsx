import Editor from "@/components/Editor";

export default function Page() {
  return (
    <main>
      <div className="no-print sticky top-0 z-10 bg-white/80 backdrop-blur border-b border-gray-200">
        <div className="mx-auto max-w-7xl px-6 py-3 flex items-center justify-between">
          <div className="text-sm font-semibold text-gray-600">Ebook Studio</div>
          <a className="text-xs text-gray-500 hover:text-gray-700" href="https://agentic-075524c2.vercel.app" target="_blank" rel="noreferrer">Live</a>
        </div>
      </div>
      <div className="mx-auto max-w-[1400px]">
        <Editor />
      </div>
    </main>
  );
}
