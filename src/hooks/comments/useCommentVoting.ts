import {
  useCommentDownvotes,
  useCommentMyVote,
  useCommentScore,
  useCommentUpvotes,
} from '@src/state';
import { useCallback } from 'react';
import instance from '@src/Instance';
import { playHaptic } from '@helpers/haptics';

interface UseCommentVoting {
  upvotes: number | undefined;
  downvotes: number | undefined;
  score: number | undefined;
  myVote: number | undefined;

  upvote: () => void;
  downvote: () => void;
  scoreVote: () => void;
}

export const useCommentVoting = (
  itemId: number,
  playHaptics = false,
): UseCommentVoting => {
  const upvotes = useCommentUpvotes(itemId);
  const downvotes = useCommentDownvotes(itemId);
  const score = useCommentScore(itemId);
  const myVote = useCommentMyVote(itemId);

  const upvote = useCallback(() => {
    void instance.likeComment(itemId, 1);
    if (playHaptics) void playHaptic();
  }, [itemId]);

  const downvote = useCallback(() => {
    void instance.likeComment(itemId, -1);
    if (playHaptics) void playHaptic();
  }, [itemId]);

  const scoreVote = useCallback(() => {
    switch (myVote) {
      case 0:
        void instance.likeComment(itemId, 1);
        break;
      case 1:
        void instance.likeComment(itemId, -1);
        break;
      case -1:
        void instance.likeComment(itemId, 0);
        break;
    }
  }, [itemId, myVote]);

  return {
    upvotes,
    downvotes,
    score,
    myVote,

    upvote,
    downvote,
    scoreVote,
  };
};
