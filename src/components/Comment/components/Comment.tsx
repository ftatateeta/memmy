import React, { useCallback, useMemo } from 'react';
import { Separator, View, YStack } from 'tamagui';
import CommentHeader from '@components/Comment/components/CommentHeader';
import CommentContent from '@components/Comment/components/CommentContent';
import { Pressable } from 'react-native';
import { SwipeableRow } from '@components/Common/SwipeableRow/SwipeableRow';
import {
  useCommentContent,
  useCommentCreator,
  useCommentDeleted,
  useCommentGesturesEnabled,
  useCommentPath,
  useCommentPostId,
  useCommentRemoved,
  useCommentSaved,
  usePostCreatorId,
  useShowCommentButtons,
} from '@src/state';
import { LeftOptions } from '@components/Common/SwipeableRow/LeftOptions';
import { SwipeableActionParams } from '@helpers/swipeableActions';
import { useNavigation } from '@react-navigation/core';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RightOptions } from '@components/Common/SwipeableRow/RightOptions';
import { ISwipeableOptions } from '@components/Common/SwipeableRow/types';
import CommentEllipsisButton from '@components/Comment/components/CommentEllipsisButton';
import CommentMetrics from '@components/Comment/components/CommentMetrics';
import CommentActionBar from '@components/Comment/components/CommentActionBar';

interface IProps {
  itemId: number;
  depth?: number;
  onPress?: () => unknown | Promise<unknown>;
  collapsed?: boolean;
  leftOptions?: ISwipeableOptions;
  rightOptions?: ISwipeableOptions;
  space?: boolean;
}

const depthToColor = (depth: number): string => {
  switch (depth) {
    case 0:
      return '$color';
    case 1:
      return '$comments-1';
    case 2:
      return '$comments-2';
    case 3:
      return '$comments-3';
    case 4:
      return '$comments-4';
    case 5:
      return '$comments-5';
    default:
      return '$comments-5';
  }
};

function Comment({
  itemId,
  depth = 0,
  onPress,
  collapsed = false,
  leftOptions,
  rightOptions,
  space = false,
}: IProps): React.JSX.Element {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();

  const postId = useCommentPostId(itemId);
  const postCreatorId = usePostCreatorId(postId);
  const commentContent = useCommentContent(itemId);
  const commentRemoved = useCommentRemoved(itemId);
  const commentDeleted = useCommentDeleted(itemId);
  const commentSaved = useCommentSaved(itemId);
  const commentPath = useCommentPath(itemId);
  const commentCreator = useCommentCreator(itemId);

  const swipesEnabled = useCommentGesturesEnabled();
  const showButtons = useShowCommentButtons();

  const borderWidth = useMemo(() => (depth > 0 ? 2 : 0), [depth]);
  const borderColor = useMemo(() => depthToColor(depth), [depth]);

  const actionParams = useMemo<SwipeableActionParams>(
    () => ({
      postId,
      commentId: itemId,
      path: commentPath,
      navigation,
    }),
    [itemId],
  );

  const ellipsisButton = useCallback(
    () => <CommentEllipsisButton itemId={itemId} />,
    [itemId],
  );

  const commentMetrics = useCallback(
    () => <CommentMetrics itemId={itemId} />,
    [itemId],
  );

  return (
    <View my={space ? 2 : 0}>
      <SwipeableRow
        leftOption={
          swipesEnabled && leftOptions?.actions.first != null ? (
            <LeftOptions options={leftOptions} actionParams={actionParams} />
          ) : undefined
        }
        rightOption={
          swipesEnabled && rightOptions?.actions.first != null ? (
            <RightOptions options={rightOptions} actionParams={actionParams} />
          ) : undefined
        }
      >
        {commentSaved && (
          <View
            position="absolute"
            top={0}
            right={0}
            width={0}
            height={0}
            backgroundColor="transparent"
            borderTopColor="$bookmark"
            borderTopWidth={15}
            borderLeftWidth={15}
            borderLeftColor="transparent"
            zIndex={1}
          />
        )}
        <YStack backgroundColor="$fg">
          <YStack
            ml={depth * 10}
            my="$2"
            borderLeftColor={borderColor}
            borderLeftWidth={borderWidth}
            px="$2"
            py="$1"
          >
            <CommentHeader
              creatorAvatar={commentCreator?.avatar}
              userCommunity={commentCreator?.actor_id}
              userName={commentCreator?.name}
              isAdmin={commentCreator?.admin}
              EllipsisButton={ellipsisButton}
              CommentMetrics={commentMetrics}
              isOp={commentCreator?.id === postCreatorId}
            />
            {!collapsed && (
              <CommentContent
                content={commentContent}
                deleted={commentDeleted}
                removed={commentRemoved}
              />
            )}
            {showButtons && <CommentActionBar itemId={itemId} />}
          </YStack>
          <Separator borderColor="$bg" ml={depth * 10 + 10} />
        </YStack>
      </SwipeableRow>
    </View>
  );
}

export const PressableComment = React.memo(function pressableComment({
  itemId,
  depth = 0,
  onPress,
  collapsed = false,
  leftOptions,
  rightOptions,
  space,
}: IProps): React.JSX.Element {
  return (
    <Pressable onPress={onPress}>
      <Comment
        itemId={itemId}
        depth={depth}
        collapsed={collapsed}
        leftOptions={leftOptions}
        rightOptions={rightOptions}
        space={space}
      />
    </Pressable>
  );
});

export default React.memo(Comment);
