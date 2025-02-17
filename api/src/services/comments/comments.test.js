import { comments, createComment, deleteComment } from './comments'
import { db } from 'src/lib/db'
import { AuthenticationError, ForbiddenError } from '@redwoodjs/graphql-server'

describe('comments', () => {
  scenario('returns all comments for a single post from the database', async (scenario) => {
    const result = await comments({ postId: scenario.comment.jane.postId })
    const post = await db.post.findUnique({
      where: { id: scenario.comment.jane.postId },
      include: { comments: true },
    })
    expect(result.length).toEqual(post.comments.length)
  })
  scenario('allows a moderator to delete a comment', async (scenario) => {
    mockCurrentUser({ roles: ['moderator'] })

    const comment = await deleteComment({
      id: scenario.comment.jane.id,
    })
    expect(comment.id).toEqual(scenario.comment.jane.id)

    const result = await comments({ postId: scenario.comment.jane.id })
    expect(result.length).toEqual(0)
  })

  scenario(
    'does not allow a non-moderator to delete a comment',
    async (scenario) => {
      mockCurrentUser({ roles: 'user' })

      expect(() =>
        deleteComment({
          id: scenario.comment.jane.id,
        })
      ).toThrow(ForbiddenError)
    }
  )

  scenario(
    'does not allow a logged out user to delete a comment',
    async (scenario) => {
      mockCurrentUser(null)

      expect(() =>
        deleteComment({
          id: scenario.comment.jane.id,
        })
      ).toThrow(AuthenticationError)
    }
  )
})