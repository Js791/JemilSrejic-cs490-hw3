import { comments, createComment } from './comments'
import { db } from 'src/lib/db'

describe('comments', () => {
  scenario('returns all comments for a single post from the database', async (scenario) => {
    const result = await comments({ postId: scenario.comment.jane.postId })
    const post = await db.post.findUnique({
      where: { id: scenario.comment.jane.postId },
      include: { comments: true },
    })
    expect(result.length).toEqual(post.comments.length)
  })

  // ...
})