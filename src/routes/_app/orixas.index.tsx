import { createFileRoute, Link } from "@tanstack/react-router";
2: import { orixas } from "@/data/content";
3: import { ArrowLeft, Flower2, Gem, Leaf, MapPin, Milk, Sparkles, Star } from "lucide-react";
4: 
5: export const Route = createFileRoute("/_app/orixas/")({
6:   component: OrixasIndex,
7: });
8: 
9: function OrixasIndex() {
10:   return (
11:     <div className="space-y-8">
12:       <header className="text-center">
13:         <p className="text-[11px] uppercase tracking-[0.22em] text-gold">Sagrados Tronos</p>
14:         <h1 className="mt-2 font-serif text-3xl font-semibold leading-tight">Os Orixás</h1>
15:         <div className="divider-gold" />
16:         <p className="mx-auto max-w-sm text-sm text-muted-foreground">
17:           Conheça as divindades que regem a natureza e os sentidos da vida na Umbanda Sagrada.
18:         </p>
19:       </header>
20: 
21:       <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
22:         {orixas.map((orixa) => (
23:           <Link
24:             key={orixa.slug}
25:             to="/orixas/$slug"
26:             params={{ slug: orixa.slug }}
27:             className="group flex flex-col gap-3 rounded-2xl border border-border bg-card p-5 transition hover:border-gold hover:shadow-soft"
28:           >
29:             <div className="flex items-center justify-between">
30:               <h2 className="font-serif text-xl font-bold text-foreground group-hover:text-gold">
31:                 {orixa.nome}
32:               </h2>
33:               <Sparkles className="h-5 w-5 text-gold opacity-50" />
34:             </div>
35:             
36:             <p className="text-sm leading-relaxed text-muted-foreground">
37:               {orixa.resumo}
38:             </p>
39: 
40:             <div className="mt-2 flex flex-wrap gap-2">
41:               <span className="inline-flex items-center gap-1 rounded-full bg-sky-soft px-2.5 py-1 text-[10px] font-medium text-primary uppercase tracking-wider">
42:                 <Star className="h-3 w-3" /> {orixa.forcas.split(",")[0]}
43:               </span>
44:               <span className="inline-flex items-center gap-1 rounded-full bg-gold/10 px-2.5 py-1 text-[10px] font-medium text-gold uppercase tracking-wider">
45:                 <Sparkles className="h-3 w-3" /> Ver detalhes
46:               </span>
47:             </div>
48:           </Link>
49:         ))}
50:       </div>
51: 
52:       <div className="pt-4 text-center">
53:         <Link to="/" className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground">
54:           <ArrowLeft className="h-4 w-4" /> Voltar ao início
55:         </Link>
56:       </div>
57:     </div>
58:   );
59: }