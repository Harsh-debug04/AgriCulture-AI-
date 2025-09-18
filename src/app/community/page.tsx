import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { MessageCircle, PenSquare, Search } from 'lucide-react';

const forumPosts = [
  {
    title: "What's the best way to deal with whiteflies on my cotton crop?",
    author: 'Ramesh Patel',
    avatar: 'https://picsum.photos/seed/ramesh/40/40',
    category: 'Pest Control',
    categoryVariant: 'destructive',
    replies: 12,
    lastActivity: '2 hours ago',
  },
  {
    title: 'Sharing my success with drip irrigation for sugarcane in Maharashtra.',
    author: 'Sunita Rao',
    avatar: 'https://picsum.photos/seed/sunita/40/40',
    category: 'Water Management',
    categoryVariant: 'default',
    replies: 8,
    lastActivity: '5 hours ago',
  },
  {
    title: 'Tomato prices in Nashik mandi - discussion thread',
    author: 'Vijay Singh',
    avatar: 'https://picsum.photos/seed/vijay/40/40',
    category: 'Market Talk',
    categoryVariant: 'secondary',
    replies: 25,
    lastActivity: '1 day ago',
  },
  {
    title: 'Is organic farming profitable for small-scale farmers?',
    author: 'Priya Desai',
    avatar: 'https://picsum.photos/seed/priya/40/40',
    category: 'Organic Farming',
    categoryVariant: 'outline',
    replies: 42,
    lastActivity: '3 days ago',
  },
  {
    title: 'Need advice on soil testing labs near Lucknow.',
    author: 'Amit Kumar',
    avatar: 'https://picsum.photos/seed/amit/40/40',
    category: 'Soil Health',
    categoryVariant: 'default',
    replies: 5,
    lastActivity: '1 week ago',
  },
];

export default function CommunityForumPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-headline text-3xl font-bold">Community Forum</h1>
        <p className="text-muted-foreground mt-1">
          Connect, share, and learn with fellow farmers.
        </p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <CardTitle>Discussions</CardTitle>
              <CardDescription>
                Browse topics or start a new conversation.
              </CardDescription>
            </div>
            <div className="flex gap-2 w-full sm:w-auto">
              <div className="relative flex-1 sm:flex-auto">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search topics..." className="pl-8" />
              </div>
              <Button>
                <PenSquare className="mr-2 h-4 w-4" />
                New Post
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[60%]">Topic</TableHead>
                <TableHead className="text-center hidden md:table-cell">Replies</TableHead>
                <TableHead className="text-right">Last Activity</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {forumPosts.map((post) => (
                <TableRow key={post.title}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="hidden sm:flex">
                        <AvatarImage src={post.avatar} alt={post.author} />
                        <AvatarFallback>
                          {post.author.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <a href="#" className="font-medium hover:underline">
                          {post.title}
                        </a>
                        <div className="text-sm text-muted-foreground mt-1 flex items-center gap-2">
                           <span>by {post.author}</span>
                           <Badge variant={post.categoryVariant as any} className="hidden lg:inline-flex">{post.category}</Badge>
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-center hidden md:table-cell">
                    <div className="flex items-center justify-center gap-1">
                      <MessageCircle className="h-4 w-4 text-muted-foreground" />
                      <span>{post.replies}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right text-muted-foreground text-sm">
                    {post.lastActivity}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
