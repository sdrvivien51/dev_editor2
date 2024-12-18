import React from 'react';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink } from "@/components/ui/breadcrumb";
import { useState } from "react";
import { useLocation } from "wouter";

const BlogArticle = () => {
  const tableOfContents = [
    { id: 'introduction', title: 'Introduction' },
    { id: 'partie-1', title: 'Première partie' },
    { id: 'partie-2', title: 'Deuxième partie' },
    { id: 'conclusion', title: 'Conclusion' }
  ];

  return (
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
              Titre de l'article
            </h1>

            <p className="text-lg mb-6">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua.
            </p>

            <h2 id="partie-1" className="text-2xl font-bold mt-12 mb-6">
              Première partie
            </h2>
            <p className="mb-6">
              Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris
              nisi ut aliquip ex ea commodo consequat.
            </p>

            <h2 id="partie-2" className="text-2xl font-bold mt-12 mb-6">
              Deuxième partie
            </h2>
            <p className="mb-6">
              Duis aute irure dolor in reprehenderit in voluptate velit esse
              cillum dolore eu fugiat nulla pariatur.
            </p>

            <h2 id="conclusion" className="text-2xl font-bold mt-12 mb-6">
              Conclusion
            </h2>
            <p>
              Excepteur sint occaecat cupidatat non proident, sunt in culpa qui
              officia deserunt mollit anim id est laborum.
            </p>
          </article>
        </main>
      </div>
    </div>
  );
};

export default BlogArticle;