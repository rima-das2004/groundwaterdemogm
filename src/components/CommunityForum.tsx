import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { ScrollArea } from './ui/scroll-area';
import { 
  Plus, 
  MessageCircle, 
  Heart, 
  Share2, 
  Search,
  Filter,
  ThumbsUp,
  MapPin,
  Calendar,
  Users,
  TrendingUp,
  AlertTriangle,
  Droplets,
  Lightbulb
} from 'lucide-react';
import { toast } from 'sonner';

interface ForumPost {
  id: string;
  author: {
    name: string;
    avatar?: string;
    location: string;
    userType: string;
  };
  title: string;
  content: string;
  category: string;
  timestamp: Date;
  likes: number;
  replies: number;
  isLiked: boolean;
  tags: string[];
}

export const CommunityForum: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'feed' | 'create'>('feed');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [newPostTitle, setNewPostTitle] = useState('');
  const [newPostContent, setNewPostContent] = useState('');
  const [newPostCategory, setNewPostCategory] = useState('');

  const categories = [
    { id: 'all', label: 'All Posts', icon: Users },
    { id: 'conservation', label: 'Conservation', icon: Droplets },
    { id: 'technology', label: 'Technology', icon: Lightbulb },
    { id: 'agriculture', label: 'Agriculture', icon: TrendingUp },
    { id: 'alerts', label: 'Alerts', icon: AlertTriangle },
  ];

  const [posts, setPosts] = useState<ForumPost[]>([
    {
      id: '1',
      author: {
        name: 'Rajesh Kumar',
        location: 'Punjab, India',
        userType: 'Farmer'
      },
      title: 'Successful Drip Irrigation Implementation',
      content: 'I recently installed a drip irrigation system on my 5-acre farm and have seen remarkable results. Water usage decreased by 40% while crop yield increased by 15%. Happy to share my experience and costs involved.',
      category: 'Agriculture',
      timestamp: new Date('2024-03-14T10:30:00'),
      likes: 24,
      replies: 8,
      isLiked: false,
      tags: ['drip-irrigation', 'water-saving', 'agriculture']
    },
    {
      id: '2',
      author: {
        name: 'Dr. Priya Sharma',
        location: 'Gujarat, India',
        userType: 'Researcher'
      },
      title: 'Groundwater Depletion Trends in Western India',
      content: 'Our latest research shows concerning trends in groundwater depletion across Gujarat and Rajasthan. Sharing some key findings and recommendations for community action.',
      category: 'Research',
      timestamp: new Date('2024-03-13T15:45:00'),
      likes: 67,
      replies: 23,
      isLiked: true,
      tags: ['research', 'data-analysis', 'conservation']
    },
    {
      id: '3',
      author: {
        name: 'Community Admin',
        location: 'Kerala, India',
        userType: 'Administrator'
      },
      title: 'Rainwater Harvesting Success Story - Kollam District',
      content: 'Amazing news! The community-led rainwater harvesting project in Kollam has successfully recharged over 500 bore wells. Here\'s how we did it and what you can replicate in your area.',
      category: 'Success Story',
      timestamp: new Date('2024-03-12T09:15:00'),
      likes: 156,
      replies: 45,
      isLiked: true,
      tags: ['rainwater-harvesting', 'community-action', 'success-story']
    },
    {
      id: '4',
      author: {
        name: 'Anita Desai',
        location: 'Maharashtra, India',
        userType: 'Household'
      },
      title: 'Simple Water Conservation Tips for Urban Homes',
      content: 'Sharing 10 easy and practical tips that helped our family reduce water consumption by 30%. These work especially well for apartment dwellers.',
      category: 'Conservation',
      timestamp: new Date('2024-03-11T16:20:00'),
      likes: 89,
      replies: 34,
      isLiked: false,
      tags: ['urban-conservation', 'household-tips', 'water-saving']
    }
  ]);

  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         post.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || post.category.toLowerCase() === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleLike = (postId: string) => {
    setPosts(posts.map(post => 
      post.id === postId 
        ? { 
            ...post, 
            isLiked: !post.isLiked,
            likes: post.isLiked ? post.likes - 1 : post.likes + 1
          }
        : post
    ));
  };

  const handleCreatePost = () => {
    if (!newPostTitle.trim() || !newPostContent.trim() || !newPostCategory) {
      toast.error('Please fill in all fields');
      return;
    }

    const newPost: ForumPost = {
      id: Date.now().toString(),
      author: {
        name: 'You',
        location: 'Your Location',
        userType: 'User'
      },
      title: newPostTitle,
      content: newPostContent,
      category: newPostCategory,
      timestamp: new Date(),
      likes: 0,
      replies: 0,
      isLiked: false,
      tags: []
    };

    setPosts([newPost, ...posts]);
    setNewPostTitle('');
    setNewPostContent('');
    setNewPostCategory('');
    setActiveTab('feed');
    toast.success('Post created successfully!');
  };

  const getCategoryIcon = (category: string) => {
    const cat = categories.find(c => c.label.toLowerCase() === category.toLowerCase());
    return cat ? cat.icon : Users;
  };

  const getCategoryColor = (category: string) => {
    switch (category.toLowerCase()) {
      case 'agriculture': return 'bg-secondary/10 text-secondary border-secondary/20';
      case 'research': return 'bg-primary/10 text-primary border-primary/20';
      case 'conservation': return 'bg-success/10 text-success border-success/20';
      case 'success story': return 'bg-warning/10 text-warning border-warning/20';
      default: return 'bg-muted/10 text-muted-foreground border-muted/20';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      {/* Header */}
      <div className="bg-card border-b border-border p-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold text-foreground">Community Forum</h1>
            <p className="text-sm text-muted-foreground">Share knowledge and connect with others</p>
          </div>
          <Button 
            onClick={() => setActiveTab(activeTab === 'feed' ? 'create' : 'feed')}
            className="bg-gradient-to-r from-primary to-secondary"
          >
            {activeTab === 'feed' ? <Plus className="w-4 h-4" /> : <MessageCircle className="w-4 h-4" />}
          </Button>
        </div>
      </div>

      {activeTab === 'feed' && (
        <>
          {/* Search and Filter */}
          <div className="bg-card border-b border-border p-4 space-y-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search discussions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <ScrollArea className="w-full">
              <div className="flex space-x-2 pb-2">
                {categories.map((category) => {
                  const Icon = category.icon;
                  return (
                    <Button
                      key={category.id}
                      variant={selectedCategory === category.id ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedCategory(category.id)}
                      className="whitespace-nowrap"
                    >
                      <Icon className="w-4 h-4 mr-1" />
                      {category.label}
                    </Button>
                  );
                })}
              </div>
            </ScrollArea>
          </div>

          {/* Posts Feed */}
          <ScrollArea className="flex-1">
            <div className="p-4 space-y-4 pb-20">
              {filteredPosts.map((post) => {
                const CategoryIcon = getCategoryIcon(post.category);
                return (
                  <Card key={post.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      {/* Post Header */}
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <Avatar>
                            <AvatarFallback>
                              {post.author.name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium text-sm">{post.author.name}</p>
                            <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                              <Badge variant="outline" className="text-xs">
                                {post.author.userType}
                              </Badge>
                              <div className="flex items-center space-x-1">
                                <MapPin className="w-3 h-3" />
                                <span>{post.author.location}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        <Badge className={getCategoryColor(post.category)}>
                          <CategoryIcon className="w-3 h-3 mr-1" />
                          {post.category}
                        </Badge>
                      </div>

                      {/* Post Content */}
                      <h3 className="font-semibold mb-2">{post.title}</h3>
                      <p className="text-sm text-muted-foreground mb-3 line-clamp-3">{post.content}</p>

                      {/* Tags */}
                      {post.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mb-3">
                          {post.tags.map((tag, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              #{tag}
                            </Badge>
                          ))}
                        </div>
                      )}

                      {/* Post Actions */}
                      <div className="flex items-center justify-between pt-3 border-t border-border">
                        <div className="flex items-center space-x-4">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleLike(post.id)}
                            className={`h-auto p-1 ${post.isLiked ? 'text-destructive' : ''}`}
                          >
                            <Heart className={`w-4 h-4 mr-1 ${post.isLiked ? 'fill-current' : ''}`} />
                            <span className="text-sm">{post.likes}</span>
                          </Button>
                          
                          <Button variant="ghost" size="sm" className="h-auto p-1">
                            <MessageCircle className="w-4 h-4 mr-1" />
                            <span className="text-sm">{post.replies}</span>
                          </Button>
                          
                          <Button variant="ghost" size="sm" className="h-auto p-1">
                            <Share2 className="w-4 h-4" />
                          </Button>
                        </div>
                        
                        <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                          <Calendar className="w-3 h-3" />
                          <span>{post.timestamp.toLocaleDateString()}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </ScrollArea>
        </>
      )}

      {activeTab === 'create' && (
        <div className="p-4 space-y-6 pb-20">
          <Card>
            <CardHeader>
              <CardTitle>Create New Post</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Category</label>
                <select 
                  value={newPostCategory}
                  onChange={(e) => setNewPostCategory(e.target.value)}
                  className="w-full p-2 border border-border rounded-md"
                >
                  <option value="">Select category</option>
                  <option value="Conservation">Conservation</option>
                  <option value="Agriculture">Agriculture</option>
                  <option value="Technology">Technology</option>
                  <option value="Research">Research</option>
                  <option value="Success Story">Success Story</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Title</label>
                <Input
                  placeholder="What would you like to discuss?"
                  value={newPostTitle}
                  onChange={(e) => setNewPostTitle(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Content</label>
                <Textarea
                  placeholder="Share your thoughts, experiences, or questions..."
                  value={newPostContent}
                  onChange={(e) => setNewPostContent(e.target.value)}
                  className="min-h-[120px]"
                />
              </div>

              <div className="flex space-x-2">
                <Button 
                  onClick={handleCreatePost}
                  className="flex-1 bg-gradient-to-r from-primary to-secondary"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Create Post
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setActiveTab('feed')}
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};