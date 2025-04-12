import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowBigUp, Award, MessageSquare } from "lucide-react"
import { cn } from "@/lib/utils"
import type { Comment } from "@/lib/types"

interface CommentListProps {
  comments: Comment[]
}

export function CommentList({ comments }: CommentListProps) {
  // Ensure comments is defined and is an array
  const safeComments = Array.isArray(comments) ? comments : []

  return (
    <div className="space-y-4">
      {safeComments.length === 0 ? (
        <div className="text-center text-muted-foreground py-4">No comments available</div>
      ) : (
        safeComments.map((comment) => (
          <Card key={comment.id} className="overflow-hidden">
            <CardContent className="p-4">
              <div className="flex gap-4">
                <Avatar className="h-10 w-10 border">
                  <AvatarImage src="/placeholder-user.jpg" alt={comment.author} />
                  <AvatarFallback>{comment.author.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{comment.author}</span>
                    {comment.isInfluential && (
                      <Badge variant="outline" className="gap-1 px-1.5 py-0 text-xs">
                        <Award className="h-3 w-3" />
                        Influential
                      </Badge>
                    )}
                    <span className="text-xs text-muted-foreground">{comment.time}</span>
                  </div>
                  <p className="mt-1">{comment.content}</p>
                  <div className="mt-2 flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <ArrowBigUp className="h-4 w-4" />
                      <span>{comment.upvotes}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MessageSquare className="h-4 w-4" />
                      <span>{comment.replies}</span>
                    </div>
                    <div
                      className={cn(
                        "ml-auto font-medium",
                        comment.sentiment === "bullish"
                          ? "text-green-500"
                          : comment.sentiment === "bearish"
                            ? "text-red-500"
                            : "text-amber-500",
                      )}
                    >
                      {comment.sentiment === "bullish"
                        ? "🚀 Bullish"
                        : comment.sentiment === "bearish"
                          ? "📉 Bearish"
                          : "⚖️ Neutral"}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  )
}
