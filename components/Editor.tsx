"use client";

import { useRef, useState } from "react";
import { TEMPLATES, TemplateId } from "@/lib/templates";
import { markdownToHtml, extractHeadings } from "@/lib/markdown";
import { exportPagesToPdf } from "@/lib/pdf";
import clsx from "classnames";

interface EbookMeta {
  title: string;
  subtitle: string;
  author: string;
}

const defaultContent = `# Introduction

Write or paste your ebook content here. Use markdown for headings, emphasis, lists, and images.

## Sample Section

- Point one\n- Point two\n- Point three

### Another Section

Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus sit amet nisi efficitur, porta velit in, volutpat justo.`;

export default function Editor() {
  const [meta, setMeta] = useState<EbookMeta>({ title: "Your Ebook Title", subtitle: "Subtitle goes here", author: "Author Name" });
  const [content, setContent] = useState<string>(defaultContent);
  const [template, setTemplate] = useState<TemplateId>("classic");
  const [pagePadding, setPagePadding] = useState<number>(48);
  const [twoColumns, setTwoColumns] = useState<boolean>(false);
  const [addTOC, setAddTOC] = useState<boolean>(true);
  const [includePageNumbers, setIncludePageNumbers] = useState<boolean>(true);

  const previewRef = useRef<HTMLDivElement>(null);

  const headings = extractHeadings(content);

  const handleFile = async (file: File) => {
    const text = await file.text();
    setContent(text);
  };

  const exportPdf = async () => {
    if (!previewRef.current) return;
    await exportPagesToPdf(previewRef.current, `${meta.title.trim() || "ebook"}`);
  };

  const tpl = TEMPLATES[template];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[360px_1fr] gap-6 p-6">
      {/* Sidebar */}
      <aside className="no-print bg-white rounded-xl shadow-sm border border-gray-200 p-4 h-fit space-y-6">
        <div>
          <h2 className="text-sm font-semibold text-gray-600 uppercase tracking-wider">Metadata</h2>
          <div className="mt-3 space-y-3">
            <input className="w-full px-3 py-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-brand-400"
              value={meta.title} onChange={e=>setMeta({...meta, title:e.target.value})} placeholder="Title" />
            <input className="w-full px-3 py-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-brand-400"
              value={meta.subtitle} onChange={e=>setMeta({...meta, subtitle:e.target.value})} placeholder="Subtitle" />
            <input className="w-full px-3 py-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-brand-400"
              value={meta.author} onChange={e=>setMeta({...meta, author:e.target.value})} placeholder="Author" />
          </div>
        </div>

        <div>
          <h2 className="text-sm font-semibold text-gray-600 uppercase tracking-wider">Template</h2>
          <div className="mt-3 grid grid-cols-3 gap-2">
            {Object.values(TEMPLATES).map(t => (
              <button key={t.id}
                onClick={()=>setTemplate(t.id)}
                className={clsx("rounded border p-2 text-xs", t.id===template?"border-brand-500 bg-brand-50":"border-gray-300 hover:border-gray-400")}
              >{t.name}</button>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-sm font-semibold text-gray-600 uppercase tracking-wider">Layout</h2>
          <div className="mt-3 space-y-3">
            <label className="flex items-center justify-between gap-3">
              <span className="text-sm text-gray-700">Page padding</span>
              <input type="range" min={24} max={80} value={pagePadding} onChange={e=>setPagePadding(parseInt(e.target.value))} />
            </label>
            <label className="flex items-center justify-between gap-3">
              <span className="text-sm text-gray-700">Two columns</span>
              <input type="checkbox" checked={twoColumns} onChange={e=>setTwoColumns(e.target.checked)} />
            </label>
            <label className="flex items-center justify-between gap-3">
              <span className="text-sm text-gray-700">Include table of contents</span>
              <input type="checkbox" checked={addTOC} onChange={e=>setAddTOC(e.target.checked)} />
            </label>
            <label className="flex items-center justify-between gap-3">
              <span className="text-sm text-gray-700">Page numbers</span>
              <input type="checkbox" checked={includePageNumbers} onChange={e=>setIncludePageNumbers(e.target.checked)} />
            </label>
          </div>
        </div>

        <div>
          <h2 className="text-sm font-semibold text-gray-600 uppercase tracking-wider">Content</h2>
          <div className="mt-2">
            <textarea
              value={content}
              onChange={e=>setContent(e.target.value)}
              className="w-full h-60 p-3 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-brand-400 font-mono text-sm"
              placeholder="Write in markdown..."
            />
            <div className="mt-2 flex items-center gap-2">
              <label className="inline-flex items-center px-3 py-2 rounded border border-gray-300 text-sm cursor-pointer hover:bg-gray-50">
                <input type="file" accept=".md,.txt" className="hidden" onChange={e=>{const f=e.target.files?.[0]; if(f) void handleFile(f);}} />
                Import .md/.txt
              </label>
              <button onClick={exportPdf} className="inline-flex items-center px-3 py-2 rounded bg-brand-600 text-white text-sm hover:bg-brand-700">Export PDF</button>
            </div>
          </div>
        </div>
      </aside>

      {/* Preview */}
      <section className="space-y-6" ref={previewRef}>
        {/* Cover */}
        <div className={clsx("page flex flex-col justify-center items-center text-center p-16", tpl.cover.bg, tpl.cover.textColor)}>
          <div className="max-w-[540px]">
            <div className={clsx("uppercase tracking-[0.35em] text-sm", tpl.cover.accent)}>EBOOK</div>
            <h1 className={clsx("mt-6", tpl.cover.titleFont, "text-5xl md:text-6xl leading-tight")}>{meta.title || "Untitled"}</h1>
            <p className={clsx("mt-4", tpl.cover.subtitleFont, "text-lg opacity-80")}>{meta.subtitle}</p>
            <div className="mt-10 text-sm opacity-70">By {meta.author}</div>
          </div>
        </div>

        {/* TOC */}
        {addTOC && headings.length > 0 && (
          <div className="page bg-white" style={{ padding: pagePadding }}>
            <h2 className={clsx(tpl.body.titleClass, tpl.body.fontClass)}>Contents</h2>
            <ol className="mt-6 space-y-2 list-decimal list-inside">
              {headings.map((h, idx) => (
                <li key={idx} className={clsx(tpl.body.fontClass, "text-gray-700")}>{"".padStart((h.level-1)*2, " ")}{h.text}</li>
              ))}
            </ol>
          </div>
        )}

        {/* Body pages */}
        <ArticlePages
          html={markdownToHtml(content)}
          tplBody={tpl.body}
          padding={pagePadding}
          twoColumns={twoColumns}
          pageNumbers={includePageNumbers}
        />
      </section>
    </div>
  );
}

function ArticlePages({ html, tplBody, padding, twoColumns, pageNumbers }:{ html:string; tplBody: any; padding:number; twoColumns:boolean; pageNumbers:boolean; }) {
  // Simple pagination by chunking content into pages using CSS columns or overflow detection isn't trivial.
  // We'll render content in a single flow container with CSS columns when enabled, inside one page-height, and duplicate as needed isn't robust.
  // Simpler: render one big container and let PDF capture across multiple artificial pages using CSS breaks.
  // We'll split by top-level headings to encourage page breaks.
  const sections = html.split(/<h1[^>]*>|<h2[^>]*>/i).filter(Boolean);

  return (
    <div>
      {sections.map((sectionHtml, i) => (
        <div key={i} className="page bg-white relative" style={{ padding }}>
          <div className={clsx(tplBody.fontClass, twoColumns?"columns-2 gap-10":"", "prose max-w-none prose-headings:mt-6 prose-p:mt-4")}
               dangerouslySetInnerHTML={{ __html: sectionHtml.startsWith("</h1")||sectionHtml.startsWith("</h2")?sectionHtml:sectionHtml }} />
          {pageNumbers && (
            <div className="absolute bottom-4 right-6 text-xs text-gray-500">{i+1}</div>
          )}
        </div>
      ))}
    </div>
  );
}
