import React from 'react';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { deleteAccount, useAccounts, useCurrentAccount } from '@src/state';
import ScrollView from '@components/Common/Gui/ScrollView';
import Table from '@components/Common/Table/Table';

interface IProps {
  navigation: NativeStackNavigationProp<any>;
}

export default function SettingsAccountScreen({
  navigation,
}: IProps): React.JSX.Element {
  const accounts = useAccounts();
  const currentAccount = useCurrentAccount();

  return (
    <ScrollView flex={1}>
      <Table.Container>
        <Table.Section header="Current Account">
          <Table.Cell label="Server" rightLabel={currentAccount?.instance} />
          <Table.Cell label="Username" rightLabel={currentAccount?.username} />
        </Table.Section>
        {accounts.map((account, index) => (
          <Table.Section header={account.fullUsername} key={index}>
            <Table.Cell
              label="Edit Account"
              useChevron
              onPress={() => {
                navigation.push('EditAccount', { account });
              }}
            />
            <Table.Cell
              label="Logout"
              useChevron
              onPress={() => {
                deleteAccount(account);
                navigation.push('Feed', { screen: 'FeedIndex' });
              }}
            />
          </Table.Section>
        ))}
      </Table.Container>
    </ScrollView>
  );
}
