import { unified } from "unified"
import remarkParse from "remark-parse"
import remarkRehype from "remark-rehype"
import rehypeStringify from "rehype-stringify"
import remarkGfm from "remark-gfm"

export async function markdownParser(content: string): Promise<string> {
    const parseContent = await unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkRehype)
    .use(rehypeStringify)
    .process(content)

    return String(parseContent);
}