import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";
import { estudos, oracoes, orixas, entidades, esquerda } from "@/data/content";

const BASE_URL = "https://saberes-sagrados-aruanda.lovable.app";

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        const staticPaths = [
          "/",
          "/estudos",
          "/oracoes",
          "/orixas",
          "/entidades",
          "/esquerda",
          "/conselhos",
          "/membros",
        ];

        const dynamicPaths = [
          ...estudos.map((e) => `/estudos/${e.slug}`),
          ...oracoes.map((o) => `/oracoes/${o.slug}`),
          ...orixas.map((o) => `/orixas/${o.slug}`),
          ...entidades.map((e) => `/entidades/${e.slug}`),
          ...esquerda.map((e) => `/esquerda/${e.slug}`),
        ];

        const all = [...staticPaths, ...dynamicPaths];

        const urls = all
          .map(
            (p) =>
              `  <url>\n    <loc>${BASE_URL}${p}</loc>\n    <changefreq>weekly</changefreq>\n  </url>`,
          )
          .join("\n");

        const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>`;

        return new Response(xml, {
          headers: {
            "Content-Type": "application/xml",
            "Cache-Control": "public, max-age=3600",
          },
        });
      },
    },
  },
});
