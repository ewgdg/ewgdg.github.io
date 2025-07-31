import { NextResponse } from "next/server";
import { getAllBlogPosts, getAllPortfolioItems } from "@/lib/content/content";

// Force this route to be statically generated at build time
export const dynamic = "force-static";

export async function GET() {
    const posts = await getAllBlogPosts();
    const items = await getAllPortfolioItems();

    // Map to unified structure with full URLs including publication date
    const result = [
        ...posts.map((post: any) => ({
            title: post.frontmatter?.title || "",
            description: post.frontmatter?.description || "",
            url: `/blog/${post.slug || ""}`,
            type: "blog",
            date: post.frontmatter?.date || "",
        })),
        ...items.map((item: any) => ({
            title: item.frontmatter?.title || "",
            description: item.frontmatter?.description || "",
            url: item.frontmatter?.externalLink || `/portfolio/${item.slug || ""}`,
            type: "portfolio",
            date: item.frontmatter?.date || "",
        })),
    ];

    // Sort by publication date (newest first)
    const sortedResult = result.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    return NextResponse.json(sortedResult);
}
