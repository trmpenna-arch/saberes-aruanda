import { createFileRoute } from "@tanstack/react-router";
2: import { useQuery } from "@tanstack/react-query";
3: import { supabase } from "@/integrations/supabase/client";
4: import { SiteHeader } from "@/components/SiteHeader";
5: import { BottomNav } from "@/components/BottomNav";
6: import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
7: import { FileText, Calendar } from "lucide-react";
8: import { format } from "date-fns";
9: import { ptBR } from "date-fns/locale";
10: 
11: export const Route = createFileRoute("/_app/news")({
12:   component: NewsPage,
13: });
14: 
15: function NewsPage() {
16:   const { data: news, isLoading } = useQuery({
17:     queryKey: ["news"],
18:     queryFn: async () => {
19:       const { data, error } = await supabase
20:         .from("news")
21:         .select("*")
22:         .order("published_at", { ascending: false });
23: 
24:       if (error) throw error;
25:       return data;
26:     },
27:   });
28: 
29:   return (
30:     <div className="min-h-screen bg-background pb-24">
31:       <SiteHeader />
32:       <main className="mx-auto max-w-xl px-4 py-8">
33:         <h1 className="mb-6 font-serif text-3xl font-bold text-foreground">
34:           News TU.ZEB
35:         </h1>
36: 
37:         {isLoading ? (
38:           <div className="space-y-4">
39:             {[1, 2, 3].map((i) => (
40:               <Card key={i} className="animate-pulse">
41:                 <div className="h-48 bg-muted rounded-t-lg" />
42:                 <CardHeader>
43:                   <div className="h-6 w-3/4 bg-muted rounded" />
44:                 </CardHeader>
45:                 <CardContent>
46:                   <div className="h-4 w-1/4 bg-muted rounded" />
47:                 </CardContent>
48:               </Card>
49:             ))}
50:           </div>
51:         ) : (
52:           <div className="grid gap-6">
53:             {news?.map((item) => (
54:               <Card key={item.id} className="overflow-hidden border-border/40 bg-card/50 backdrop-blur-sm">
55:                 {item.image_url && (
56:                   <img
57:                     src={item.image_url}
58:                     alt={item.title}
59:                     className="h-48 w-full object-cover"
60:                   />
61:                 )}
62:                 <CardHeader>
63:                   <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
64:                     <Calendar className="h-3 w-3" />
65:                     {format(new Date(item.published_at), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
66:                   </div>
67:                   <CardTitle className="font-serif text-xl">{item.title}</CardTitle>
68:                 </CardHeader>
69:                 <CardContent>
70:                   {item.content && (
71:                     <p className="text-muted-foreground line-clamp-3 mb-4">
72:                       {item.content}
73:                     </p>
74:                   )}
75:                   {item.pdf_url && (
76:                     <a
77:                       href={item.pdf_url}
78:                       target="_blank"
79:                       rel="noopener noreferrer"
80:                       className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
81:                     >
82:                       <FileText className="h-4 w-4" />
83:                       Visualizar PDF
84:                     </a>
85:                   )}
86:                 </CardContent>
87:               </Card>
88:             ))}
89: 
90:             {news?.length === 0 && (
91:               <div className="text-center py-12 text-muted-foreground">
92:                 Nenhuma notícia publicada ainda.
93:               </div>
94:             )}
95:           </div>
96:         )}
97:       </main>
98:       <BottomNav />
99:     </div>
100:   );
101: }