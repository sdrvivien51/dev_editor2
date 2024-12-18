import { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useParams } from "wouter";
import { Helmet } from "react-helmet";

interface Article {
  title: string;
  content: string;
  author: {
    name: string;
    avatar?: string;
  };
  publishedAt: string;
  updatedAt: string;
  slug: string;
  excerpt?: string;
}

const BlogArticle = () => {
  const params = useParams();
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const response = await fetch(`/api/posts/${params.slug}`);
        if (!response.ok) throw new Error('Article not found');
        const data = await response.json();
        setArticle(data);
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
    "datePublished": article.publishedAt,
    "dateModified": article.updatedAt,
    "description": article.excerpt,
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": window.location.href
    }
  };

  return (
    <>
      <Helmet>
        <title>{article.title} | Mon Blog</title>
        <meta name="description" content={article.excerpt} />
        <meta property="og:title" content={article.title} />
        <meta property="og:description" content={article.excerpt} />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={window.location.href} />
        <meta property="article:published_time" content={article.publishedAt} />
        <meta property="article:modified_time" content={article.updatedAt} />
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

              <div dangerouslySetInnerHTML={{ __html: article.content }} />

              <div className="mt-8 text-sm text-gray-500">
                Publié le {new Date(article.publishedAt).toLocaleDateString('fr-FR')}
                {article.updatedAt !== article.publishedAt && 
                  ` • Mis à jour le ${new Date(article.updatedAt).toLocaleDateString('fr-FR')}`
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
