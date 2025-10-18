'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Search, Edit, Trash2, Eye, EyeOff, Calendar, User, Tag } from 'lucide-react';
import { BlogPost } from '@/lib/types/blog';
import { BlogEditor } from '@/components/admin/BlogEditor';

export default function BlogAdminPage() {
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [editingBlog, setEditingBlog] = useState<BlogPost | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  // Lade Blog-Posts
  useEffect(() => {
    loadBlogs();
  }, []);

  const loadBlogs = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/blogs');
      if (response.ok) {
        const data = await response.json();
        setBlogs(data.blogs || []);
      }
    } catch (error) {
      console.error('Error loading blogs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Möchten Sie diesen Blog-Post wirklich löschen?')) return;

    try {
      const response = await fetch(`/api/admin/blogs?id=${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        await loadBlogs();
        alert('Blog-Post erfolgreich gelöscht!');
      } else {
        const error = await response.json();
        alert(`Fehler: ${error.error}`);
      }
    } catch (error) {
      console.error('Error deleting blog:', error);
      alert('Fehler beim Löschen des Blog-Posts');
    }
  };

  const handleSave = async (blogData: Omit<BlogPost, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const url = editingBlog ? '/api/admin/blogs' : '/api/admin/blogs';
      const method = editingBlog ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editingBlog ? { id: editingBlog.id, ...blogData } : blogData),
      });

      if (response.ok) {
        await loadBlogs();
        setEditingBlog(null);
        setIsCreating(false);
        alert(editingBlog ? 'Blog-Post erfolgreich aktualisiert!' : 'Blog-Post erfolgreich erstellt!');
      } else {
        const error = await response.json();
        alert(`Fehler: ${error.error}`);
      }
    } catch (error) {
      console.error('Error saving blog:', error);
      alert('Fehler beim Speichern des Blog-Posts');
    }
  };

  const handleCancel = () => {
    setEditingBlog(null);
    setIsCreating(false);
  };

  // Filter Blogs
  const filteredBlogs = blogs.filter(blog => {
    const matchesSearch = blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                      blog.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || blog.category === categoryFilter;
    const matchesStatus = statusFilter === 'all' || 
                         (statusFilter === 'published' && blog.published) ||
                         (statusFilter === 'draft' && !blog.published);
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const categories = [...new Set(blogs.map(blog => blog.category))];

  if (editingBlog || isCreating) {
    return (
      <div className="container mx-auto px-4 py-8">
        <BlogEditor
          blog={editingBlog || undefined}
          onSave={handleSave}
          onCancel={handleCancel}
          isCreating={isCreating}
        />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Blog-Verwaltung</h1>
        <p className="text-muted-foreground">Verwalten Sie Ihre Blog-Posts</p>
      </div>

      {/* Filter und Suche */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Blog-Posts durchsuchen..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Kategorie" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Alle Kategorien</SelectItem>
                {categories.map(category => (
                  <SelectItem key={category} value={category}>{category}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Alle Status</SelectItem>
                <SelectItem value="published">Veröffentlicht</SelectItem>
                <SelectItem value="draft">Entwurf</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={() => setIsCreating(true)} className="w-full">
              <Plus className="h-4 w-4 mr-2" />
              Neuer Blog-Post
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Blog-Liste */}
      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Lade Blog-Posts...</p>
        </div>
      ) : filteredBlogs.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <p className="text-muted-foreground">Keine Blog-Posts gefunden</p>
            <Button onClick={() => setIsCreating(true)} className="mt-4">
              <Plus className="h-4 w-4 mr-2" />
              Ersten Blog-Post erstellen
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {filteredBlogs.map((blog) => (
            <Card key={blog.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-xl font-semibold">{blog.title}</h3>
                      {blog.published ? (
                        <Badge variant="default" className="bg-green-100 text-green-800">
                          <Eye className="h-3 w-3 mr-1" />
                          Veröffentlicht
                        </Badge>
                      ) : (
                        <Badge variant="secondary">
                          <EyeOff className="h-3 w-3 mr-1" />
                          Entwurf
                        </Badge>
                      )}
                      {blog.featured && (
                        <Badge variant="outline" className="border-yellow-300 text-yellow-700">
                          Featured
                        </Badge>
                      )}
                    </div>
                    
                    <p className="text-muted-foreground mb-3 line-clamp-2">{blog.excerpt}</p>
                    
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <User className="h-4 w-4" />
                        {blog.author}
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {new Date(blog.createdAt).toLocaleDateString('de-DE')}
                      </div>
                      <div className="flex items-center gap-1">
                        <Tag className="h-4 w-4" />
                        {blog.category}
                      </div>
                    </div>
                    
                    {blog.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {blog.tags.map((tag, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                  
                  <div className="flex gap-2 ml-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setEditingBlog(blog)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(blog.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}


