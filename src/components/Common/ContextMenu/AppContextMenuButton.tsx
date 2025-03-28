import {
  ContextMenuButton,
  OnPressMenuItemEvent,
} from 'react-native-ios-context-menu';
import React, { PropsWithChildren, useCallback, useMemo } from 'react';
import { MenuConfig } from 'react-native-ios-context-menu/lib/typescript/types/MenuConfig';
import { Pressable, StyleProp, StyleSheet, ViewStyle } from 'react-native';
import { MenuElementConfig } from 'react-native-ios-context-menu/src/types/MenuConfig';
import { IContextMenuOption } from '@src/types';

interface AppContextMenuButtonProps<S = string> extends PropsWithChildren {
  options: IContextMenuOption[];
  selection?: S;
  title?: string;
  isPrimaryAction?: boolean;
  style?: StyleProp<ViewStyle>;
  onPressMenuItem: OnPressMenuItemEvent;
  onLayout?: () => void;
  isFirst?: boolean;
  isLast?: boolean;
  noPressable?: boolean;
}

export function AppContextMenuButton<S = string>(
  props: AppContextMenuButtonProps<S>,
): React.JSX.Element {
  const {
    children,
    selection,
    title = '',
    options,
    isPrimaryAction = true,
    style,
    onPressMenuItem,
    onLayout,
    noPressable = false,
  } = props;

  const transformOption = useCallback(
    (option: IContextMenuOption): MenuElementConfig => {
      if (option.options != null) {
        return {
          type: 'menu',
          menuOptions: option.inline === true ? ['displayInline'] : [],
          menuTitle: option.title,
          icon: {
            type: 'IMAGE_SYSTEM',
            imageValue: {
              systemName: option.icon ?? '',
            },
          },
          menuItems: [...option.options.map(transformOption)],
        };
      }
      return {
        actionKey: option.key,
        actionTitle: option.title,
        actionSubtitle: option.subtitle,
        menuState: selection === option.key ? 'on' : 'off',
        menuAttributes: option.destructive === true ? ['destructive'] : [],
        icon: {
          type: 'IMAGE_SYSTEM',
          imageValue: {
            // @ts-expect-error - icon is optional idk
            systemName: option.icon,
          },
        },
      };
    },
    [selection],
  );

  const menuConfig = useMemo<MenuConfig>(
    () => ({
      menuTitle: title,
      menuItems: [...options.map(transformOption)],
    }),
    [options, title, transformOption],
  );

  if (noPressable) {
    return (
      <ContextMenuButton
        isMenuPrimaryAction={isPrimaryAction}
        menuConfig={menuConfig}
        style={[styles.button, style]}
        onPressMenuItem={onPressMenuItem}
        onLayout={onLayout}
        hitSlop={{
          top: 10,
          bottom: 10,
          left: 10,
          right: 10,
        }}
      >
        {children}
      </ContextMenuButton>
    );
  }

  return (
    <Pressable hitSlop={10}>
      <ContextMenuButton
        isMenuPrimaryAction={isPrimaryAction}
        menuConfig={menuConfig}
        style={[styles.button, style]}
        onPressMenuItem={onPressMenuItem}
        onLayout={onLayout}
        hitSlop={{
          top: 10,
          bottom: 10,
          left: 10,
          right: 10,
        }}
      >
        {children}
      </ContextMenuButton>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    zIndex: 5,
  },
});
