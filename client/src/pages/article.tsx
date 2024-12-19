import { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useParams } from "wouter";
import { Helmet } from "react-helmet";
import { supabase } from '@/lib/supabase';

interface Article {
  id: number;
  title: string;
  html_content: string;
  description: string;
  slug: string;
  created_at: string;
  updated_at: string;
  author_id: string;
  author?: {
    name: string;
    avatar_url?: string;
  };
}

const BlogArticle = () => {
  const { slug } = useParams();
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArticle = async () => {
      if (!slug) return;
      
      try {
        console.log('Fetching article with slug:', slug);
        
        const { data, error } = await supabase
          .from('posts')
          .select(`
            *,
            users (
              name,
              avatar_url
            )
          `)
          .eq('slug', slug)
          .single()
          .headers({
            'Accept': 'application/vnd.pgrst.object+json',
            'Accept-Profile': 'public'
          });

        if (error) {
          console.error('Error fetching article:', error);
          if (error.code === 'PGRST116') {
            throw new Error('Article not found');
          }
          throw error;
        }

        if (!data) {
          console.error('No article found with slug:', slug);
          throw new Error('Article not found');
        }

        console.log('Article data:', data);

        // Transform the data to include author information
        const transformedArticle: Article = {
          id: data.id,
          title: data.title,
          html_content: data.html_content || '',
          description: data.description || '',
          slug: data.slug,
          created_at: data.created_at,
          updated_at: data.updated_at,
          author_id: data.author_id,
          author: data.users ? {
            name: data.users.name,
            avatar_url: data.users.avatar_url
          } : undefined
        };

        console.log('Transformed article:', transformedArticle);
        setArticle(transformedArticle);
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();
  }, [slug]);

  if (loading) return <div>Chargement...</div>;
  if (!article) return <div>Article non trouvé</div>;

  // Schema.org structured data for the article
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": article.title,
    "description": article.description,
    "articleBody": article.html_content,
    "author": {
      "@type": "Person",
      "name": article.author?.name || "Anonymous"
    },
    "datePublished": article.created_at,
    "dateModified": article.updated_at,
    "publisher": {
      "@type": "Organization",
      "name": "Modern Blog Platform",
      "url": window.location.origin
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": window.location.href
    }
  };

  return (
    <>
      <Helmet>
        <title>{article.title} | Modern Blog Platform</title>
        <meta name="description" content={article.description} />
        <meta property="og:title" content={article.title} />
        <meta property="og:description" content={article.description} />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={window.location.href} />
        <meta property="article:published_time" content={article.created_at} />
        <meta property="article:modified_time" content={article.updated_at} />
        <meta property="article:author" content={article.author?.name || 'Anonymous'} />
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
                    {/* Add your table of contents items here */}
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
              <h1 className="text-4xl font-bold mb-8">
                {article.title}
              </h1>

              <div className="mb-4 text-sm text-gray-500">
                Par {article.author?.name || 'Anonymous'} • 
                Publié le {new Date(article.created_at).toLocaleDateString('fr-FR')}
                {article.updated_at !== article.created_at && 
                  ` • Mis à jour le ${new Date(article.updated_at).toLocaleDateString('fr-FR')}`
                }
              </div>

              <div 
                className="mt-6"
                dangerouslySetInnerHTML={{ __html: article.html_content }} 
              />
            </article>
          </main>
        </div>
      </div>
    </>
  );
};

export default BlogArticle;