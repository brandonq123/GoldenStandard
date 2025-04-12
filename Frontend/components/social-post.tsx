import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowBigUp, MessageSquare, Twitter, FileText } from "lucide-react"
import { cn } from "@/lib/utils"
import type { SocialPost as SocialPostType } from "@/lib/types"

interface SocialPostProps {
  post: SocialPostType
  className?: string
}

export function SocialPost({ post, className }: SocialPostProps) {
  // Ensure post is defined
  if (!post) {
    return null
  }

  const { author, content, likes, replies, timestamp, source, stockMentions, sentiment } = post

  // Get icon based on source
  const SourceIcon = () => {
    switch (source) {
      case "twitter":
        return <Twitter className="h-4 w-4 text-blue-400" />
      case "reddit":
        return (
          <svg className="h-4 w-4 text-orange-500" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.108-.701zM9.25 12C8.561 12 8 12.562 8 13.25c0 .687.561 1.248 1.25 1.248.687 0 1.248-.561 1.248-1.249 0-.688-.561-1.249-1.249-1.249zm5.5 0c-.687 0-1.248.561-1.248 1.25 0 .687.561 1.248 1.249 1.248.688 0 1.249-.561 1.249-1.249 0-.687-.562-1.249-1.25-1.249zm-5.466 3.99a.327.327 0 0 0-.231.094.33.33 0 0 0 0 .463c.842.842 2.484.913 2.961.913.477 0 2.105-.056 2.961-.913a.361.361 0 0 0 .029-.463.33.33 0 0 0-.464 0c-.547.533-1.684.73-2.512.73-.828 0-1.979-.196-2.512-.73a.326.326 0 0 0-.232-.095z" />
          </svg>
        )
      case "news":
        return <FileText className="h-4 w-4 text-green-500" />
      default:
        return null
    }
  }

  // Format timestamp
  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))

    if (diffInHours < 1) {
      return "Just now"
    } else if (diffInHours < 24) {
      return `${diffInHours}h ago`
    } else {
      return date.toLocaleDateString()
    }
  }

  // Replace stock tickers with links
  const renderContent = () => {
    if (!stockMentions || stockMentions.length === 0) {
      return content
    }

    let formattedContent = content
    stockMentions.forEach((ticker) => {
      formattedContent = formattedContent.replace(
        new RegExp(`\\$${ticker}|\\b${ticker}\\b`, "g"),
        `<a href="/stocks/${ticker.toLowerCase()}" class="text-primary hover:underline font-medium">$${ticker}</a>`,
      )
    })

    return <div dangerouslySetInnerHTML={{ __html: formattedContent }} />
  }

  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardContent className="p-4">
        <div className="flex gap-4">
          <Avatar className="h-10 w-10 border">
            <AvatarImage src={`/placeholder-user.jpg`} alt={author} />
            <AvatarFallback>{author.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span className="font-medium">{author}</span>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <SourceIcon />
                <span>{source === "twitter" ? "Twitter" : source === "reddit" ? "Reddit" : "News"}</span>
              </div>
              <span className="text-xs text-muted-foreground">{formatTimestamp(timestamp)}</span>
            </div>
            <div className="mt-2">{renderContent()}</div>
            <div className="mt-3 flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <ArrowBigUp className="h-4 w-4" />
                <span>{likes}</span>
              </div>
              <div className="flex items-center gap-1">
                <MessageSquare className="h-4 w-4" />
                <span>{replies}</span>
              </div>
              {sentiment && (
                <Badge
                  variant={sentiment === "bullish" ? "success" : sentiment === "bearish" ? "destructive" : "outline"}
                  className="ml-auto"
                >
                  {sentiment.charAt(0).toUpperCase() + sentiment.slice(1)}
                </Badge>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
