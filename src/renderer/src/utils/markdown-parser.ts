import { unified } from "unified"
import remarkParse from "remark-parse"
import remarkRehype from "remark-rehype"
import rehypeStringify from "rehype-stringify"
import remarkGfm from "remark-gfm"
import rehypeHighlight from "rehype-highlight"
import remarkMath from "remark-math"
import rehypeKatex from "rehype-katex"
import rehypeMermaid from "rehype-mermaidjs"

export async function markdownParser(content: string): Promise<string> {
    const parseContent = await unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkRehype, {
        allowDangerousHtml: true
    })
    .use(rehypeStringify, {
        allowDangerousHtml: true
    })
    .use(rehypeHighlight, {
        plainText: ['mermaid', 'txt', 'text', '', 'katex']
    })
    .use(remarkMath)
    .use(rehypeKatex)
    .use(rehypeMermaid)
    .process(content)

    return String(parseContent);
}