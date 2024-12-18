import { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useParams } from "wouter";
import { Helmet } from "react-helmet";
import { supabase } from '@/lib/supabase';

// Type pour les données brutes de l'article depuis Supabase
interface RawArticle {
  title: string;
  html_content: string;
  description: string;
  slug: string;
  created_at: string;
  updated_at: string;
  users: {
    name: string;
    avatar_url: string | null;
  } | null;
}

// Type pour l'article transformé utilisé dans le composant
interface TransformedArticle {
  title: string;
  html_content: string;
  description: string;
  slug: string;
  created_at: string;
  updated_at: string;
  author: {
    name: string;
    avatar_url?: string;
  };
}

const BlogArticle = () => {
  const params = useParams();
  const [article, setArticle] = useState<TransformedArticle | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        // Récupérer l'article avec les données de l'auteur
        const { data, error } = await supabase
          .from('posts')
          .select(`
            title,
            html_content,
            description,
            slug,
            created_at,
            updated_at,
            users (
              name,
              avatar_url
            )
          `)
          .eq('slug', params.slug)
          .single();

        if (error) {
          console.error('Supabase error:', error);
          throw error;
        }

        if (!data) {
          throw new Error('Article not found');
        }

        // Cast the data to RawArticle type
        const rawArticle = data as RawArticle;
        
        // Transform the data to match the TransformedArticle interface
        const transformedArticle: TransformedArticle = {
          title: rawArticle.title,
          html_content: rawArticle.html_content,
          description: rawArticle.description,
          slug: rawArticle.slug,
          created_at: rawArticle.created_at,
          updated_at: rawArticle.updated_at,
          author: {
            name: rawArticle.users?.name ?? 'Anonymous',
            avatar_url: rawArticle.users?.avatar_url ?? undefined
          }
        };
        
        setArticle(transformedArticle);
      } catch (error) {
        console.error('Error fetching article:', error);
      } finally {
        setLoading(false);
      }
    };

    if (params.slug) {
      fetchArticle();
    }
  }, [params.slug]);

  if (loading) return <div>Chargement...</div>;
  if (!article) return <div>Article non trouvé</div>;

  const tableOfContents = [
    { id: 'introduction', title: 'Introduction' },
    { id: 'partie-1', title: 'Première partie' },
    { id: 'partie-2', title: 'Deuxième partie' },
    { id: 'conclusion', title: 'Conclusion' }
  ];

  // Schema.org structured data for the article
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": article.title,
    "author": {
      "@type": "Person",
      "name": article.author.name
    },
    "datePublished": article.created_at,
    "dateModified": article.updated_at,
    "description": article.description,
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": window.location.href
    }
  };

  return (
    <>
      <Helmet>
        <title>{article.title} | Mon Blog</title>
        <meta name="description" content={article.description} />
        <meta property="og:title" content={article.title} />
        <meta property="og:description" content={article.description} />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={window.location.href} />
        <meta property="article:published_time" content={article.created_at} />
        <meta property="article:modified_time" content={article.updated_at} />
        <meta property="article:author" content={article.author.name} />
        <script type="application/ld+json">
          {JSON.stringify(articleSchema)}
        </script>
      </Helmet>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar - ToC & Newsletter */}
          <aside className="md:w-64 space-y-8">
            {/* Table of Contents */}
            <Card>
              <CardHeader>
                <CardTitle>Table des matières</CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[200px]">
                  <nav className="space-y-2">
                    {tableOfContents.map((item) => (
                      <a
                        key={item.id}
                        href={`#${item.id}`}
                        className="block text-sm hover:text-blue-500 transition-colors"
                      >
                        {item.title}
                      </a>
                    ))}
                  </nav>
                </ScrollArea>
              </CardContent>
            </Card>

            {/* Newsletter Signup */}
            <Card>
              <CardHeader>
                <CardTitle>Newsletter</CardTitle>
              </CardHeader>
              <CardContent>
                <form className="space-y-4">
                  <Input
                    type="email"
                    placeholder="Votre email"
                    className="w-full"
                  />
                  <Button className="w-full">
                    S'abonner
                  </Button>
                </form>
              </CardContent>
            </Card>
          </aside>

          {/* Main Content */}
          <main className="flex-1 max-w-3xl">
            <article className="prose lg:prose-xl">
              <h1 id="introduction" className="text-4xl font-bold mb-8">
                {article.title}
              </h1>

              <div dangerouslySetInnerHTML={{ __html: article.html_content }} />

              <div className="mt-8 text-sm text-gray-500">
                Publié le {new Date(article.created_at).toLocaleDateString('fr-FR')}
                {article.updated_at !== article.created_at && 
                  ` • Mis à jour le ${new Date(article.updated_at).toLocaleDateString('fr-FR')}`
                }
                {" • "} 
                Par {article.author.name}
              </div>
            </article>
          </main>
        </div>
      </div>
    </>
  );
};

export default BlogArticle;
