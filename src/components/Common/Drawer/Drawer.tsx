import React, { useCallback, useMemo } from 'react';
import { useSubscriptions, setDrawerOpen } from '@src/state';
import { FlashList, ListRenderItemInfo } from '@shopify/flash-list';
import { CommunityView } from 'lemmy-js-client';
import DrawerItem from '@components/Common/Drawer/DrawerItem';
import { Separator, YStack } from 'tamagui';
import { addAlphabeticalLabels } from '@src/helpers';
import DrawerLabel from '@components/Common/Drawer/DrawerLabel';
import { NavigationContainerRefWithCurrent } from '@react-navigation/core';
// import ButtonOne from '@components/Common/Button/ButtonOne';
import { Bookmark, History } from '@tamagui/lucide-icons';
import ButtonOne from '../Button/ButtonOne';

const getItemType = (item: CommunityView | string): 'community' | 'label' => {
  if ((item as CommunityView).community != null) {
    return 'community';
  } else {
    return 'label';
  }
};
const keyExtractor = (item: CommunityView | string): string => {
  const itemType = getItemType(item);

  if (itemType === 'community')
    return (item as CommunityView).community.id.toString();
  else return item as string;
};

interface IProps {
  navigation: NavigationContainerRefWithCurrent<any>;
}

export default function Drawer({ navigation }: IProps): React.JSX.Element {
  const subscriptions = useSubscriptions();
  const subscriptionsWithLabels = useMemo(
    () => addAlphabeticalLabels(subscriptions),
    [subscriptions],
  );

  const renderItem = useCallback(
    ({
      item,
    }: ListRenderItemInfo<CommunityView | string>): React.JSX.Element => {
      const itemType = getItemType(item);

      if (itemType === 'community') {
        return (
          <DrawerItem view={item as CommunityView} navigation={navigation} />
        );
      } else {
        return <DrawerLabel char={item as string} />;
      }
    },
    [],
  );

  return (
    <YStack flex={1} backgroundColor="$bg">
      <YStack mt={50} flex={1}>
        <FlashList<CommunityView | string>
          renderItem={renderItem}
          keyExtractor={keyExtractor}
          data={subscriptionsWithLabels}
          getItemType={getItemType}
          estimatedItemSize={80}
          ItemSeparatorComponent={() => <Separator />}
          contentContainerStyle={{
            paddingBottom: 100,
          }}
          ListHeaderComponent={() => (
            <YStack px="$3" py="$2" space="$2">
              <ButtonOne
                icon={Bookmark}
                onPress={() => {
                  setDrawerOpen(false);
                  navigation.navigate('SavedPosts');
                }}
                label="Saved posts"
                backgroundColor="$fg"
              />
              <ButtonOne
                icon={History}
                onPress={() => {
                  setDrawerOpen(false);
                  navigation.navigate('RecentPostHistory');
                }}
                label="Recently seen posts"
                backgroundColor="$fg"
              />
            </YStack>
          )}
        />
      </YStack>
    </YStack>
  );
}
