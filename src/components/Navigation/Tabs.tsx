import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React from 'react';
import FeedStackScreen from '@components/Navigation/FeedStackScreen';
import SettingsStackScreen from '@components/Navigation/SettingsStackScreen';
import SearchStackScreen from '@components/Navigation/SearchStackScreen';
import InboxStackScreen from '@components/Navigation/InboxStackScreen';
import ProfileStackScreen from '@components/Navigation/ProfileStackScreen';
import { Cog, Home, Inbox, Search, User } from '@tamagui/lucide-icons';
import {
  setDrawerOpen,
  setHomePress,
  useCurrentAccount,
  usePersonAvatar,
  useShowAvatarInTabBar,
  useShowUsernameInTabBar,
  useUnreadCount,
} from '@src/state';
import { Image } from 'expo-image';
import { StyleSheet } from 'react-native';
import { playHaptic } from '@helpers/haptics';
import AccountsContextMenu from '@components/Common/ContextMenu/components/AccountsContextMenu';

const Tab = createBottomTabNavigator();

let lastPress = 0;

const onHomeTabPress = (): void => {
  const now = Date.now();

  if (now < lastPress + 200) {
    setHomePress();
  }

  lastPress = now;

  void playHaptic();
};

const onHomeTabLongPress = (): void => {
  setDrawerOpen(true);
};

const onTabPress = (): void => {
  void playHaptic();
};

interface ProfileTabIconProps {
  color: string;
}

function ProfileTabIcon({ color }: ProfileTabIconProps): React.JSX.Element {
  const showAvatarInTabBar = useShowAvatarInTabBar();
  const personAvatar = usePersonAvatar();

  if (showAvatarInTabBar && personAvatar != null) {
    return (
      <AccountsContextMenu>
        <Image source={personAvatar} style={styles.avatarIcon} />
      </AccountsContextMenu>
    );
  }

  return (
    <AccountsContextMenu>
      <User color={color} size={24} />
    </AccountsContextMenu>
  );
}

export default function Tabs(): React.JSX.Element {
  const showUsernameInTabBar = useShowUsernameInTabBar();
  const account = useCurrentAccount();
  const unread = useUnreadCount();

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
      }}
      screenListeners={{
        tabPress: onTabPress,
      }}
    >
      <Tab.Screen
        name="Home"
        component={FeedStackScreen}
        options={{
          tabBarIcon: ({ color }) => <Home color={color} size={24} />,
        }}
        listeners={{
          tabPress: onHomeTabPress,
          tabLongPress: onHomeTabLongPress,
        }}
      />
      <Tab.Screen
        name="Inbox"
        component={InboxStackScreen}
        options={{
          tabBarIcon: ({ color }) => <Inbox color={color} size={24} />,
          tabBarBadge: unread > 0 ? unread.toString() : undefined,
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileStackScreen}
        options={{
          tabBarIcon: ({ color }) => <ProfileTabIcon color={color} />,
          tabBarLabel: showUsernameInTabBar ? account?.fullUsername : 'Profile',
          tabBarLabelStyle: {
            width: '80%',
          },
        }}
      />
      <Tab.Screen
        name="Search"
        component={SearchStackScreen}
        options={{
          tabBarIcon: ({ color }) => <Search color={color} size={24} />,
        }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsStackScreen}
        options={{
          tabBarIcon: ({ color }) => <Cog color={color} size={24} />,
        }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  avatarIcon: {
    height: 24,
    width: 24,
    borderRadius: 100,
  },
});
