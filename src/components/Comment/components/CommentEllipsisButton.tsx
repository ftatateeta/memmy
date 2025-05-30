import React from 'react';
import CommentContextMenu from '@components/Common/ContextMenu/components/CommentContextMenu';
import Ellipsis from '@components/Common/Icons/Ellipsis';
import { useTheme } from 'tamagui';

interface IProps {
  itemId: number;
}

export default function CommentEllipsisButton({
  itemId,
}: IProps): React.JSX.Element {
  const theme = useTheme();

  return (
    <CommentContextMenu itemId={itemId}>
      <Ellipsis size={16} color={theme.accent.val} />
    </CommentContextMenu>
  );
}
