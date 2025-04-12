import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { SocialPost } from "@/components/social-post"
import { generateSocialPosts } from "@/lib/mock-data"

export function CommunityFeed() {
  // Generate mock social posts
  const twitterPosts = generateSocialPosts("twitter", 5)
  const redditPosts = generateSocialPosts("reddit", 5)
  const newsPosts = generateSocialPosts("news", 5)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Community Feed</CardTitle>
        <CardDescription>Latest discussions from social platforms and news</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="all" className="space-y-4">
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="twitter">Twitter</TabsTrigger>
            <TabsTrigger value="reddit">Reddit</TabsTrigger>
            <TabsTrigger value="news">News</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4">
            {[...twitterPosts, ...redditPosts, ...newsPosts]
              .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
              .slice(0, 8)
              .map((post) => (
                <SocialPost key={post.id} post={post} />
              ))}
          </TabsContent>

          <TabsContent value="twitter" className="space-y-4">
            {twitterPosts.map((post) => (
              <SocialPost key={post.id} post={post} />
            ))}
          </TabsContent>

          <TabsContent value="reddit" className="space-y-4">
            {redditPosts.map((post) => (
              <SocialPost key={post.id} post={post} />
            ))}
          </TabsContent>

          <TabsContent value="news" className="space-y-4">
            {newsPosts.map((post) => (
              <SocialPost key={post.id} post={post} />
            ))}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
