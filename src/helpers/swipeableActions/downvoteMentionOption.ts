import instance from '@src/Instance';
import { SwipeableActionParams } from '@helpers/swipeableActions/swipeableActions';
import { playHaptic } from '@helpers/haptics';
import { likeReply } from '@src/state/inbox/actions';

export const downvoteMentionOption = ({
  mentionId,
  commentId,
}: SwipeableActionParams): void => {
  if (mentionId == null || commentId == null) return;

  void instance.likeComment(commentId, -1);
  likeReply(mentionId, -1, 'mention');
  void playHaptic();
};
