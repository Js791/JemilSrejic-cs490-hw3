import { db } from 'src/lib/db'
import { requireAuth } from 'src/lib/auth'

export const comments = ({ postId }) => {
  return db.comment.findMany({ where: { postId } })
}
export const comment = ({ id }) => {
  return db.comment.findUnique({
    where: { id },
  })
}

export const Comment = {
  post: (_obj, { root }) => {
    return db.comment.findUnique({ where: { id: root?.id } }).post()
  },
}
export const deleteComment = ({ id }) => {
  requireAuth({ roles: 'moderator' })
  return db.comment.delete({
    where: { id },
  })
}
export const createComment = ({ input }) => {
  return db.comment.create({
    data: input,
  })
}