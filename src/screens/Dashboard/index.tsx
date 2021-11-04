import React from 'react';
import * as S from './styles';
import { ActivityIndicator } from 'react-native'
import { HighlightCard } from '../../components/HighlightCard';
import {
  TransactionCard,
  ITransactionCardProps,
} from '../../components/TransactionCard';
import AsyncStore from '@react-native-async-storage/async-storage';

import { useFocusEffect } from '@react-navigation/native';

import { useTheme } from 'styled-components'


export interface IDataListProps extends ITransactionCardProps {
  id: string;
}

interface IHighlightProps {
  amount: string;
  lastTransaction: string;
}

interface IHighlightData {
  entries: IHighlightProps;
  expensive: IHighlightProps;
  total: IHighlightProps
}

const collectionKey = "@gofinances:transactions";

export function Dashboard() {
  const theme = useTheme();
  const [isLoading, setIsLoading] = React.useState<boolean>(true);
  const [transactions, setTransactions] = React.useState<IDataListProps[]>([]);
  const [highlightData, setHighlightData] = React.useState<IHighlightData>({} as IHighlightData);

  async function loadTransactions() {
    const response = await AsyncStore.getItem(collectionKey);
    const transactions = response ? JSON.parse(response) : [];

    let entriesTotal = 0;
    let expensiveTotal = 0;

    function getLastTransactionDate(collection: IDataListProps[], type: 'positive' | 'negative') {
      const lastTransactionEntries = Math.max.apply(Math, transactions
        .filter((transaction: IDataListProps) => transaction.type === type)
        .map((transaction: IDataListProps) => new Date(transaction.date).getTime())
      );
      let date = new Date(lastTransactionEntries)
      return `${date.getDate()} de ${date.toLocaleDateString('pt-BR', { month: 'long' })}`
    }


    const transactionsFormated: IDataListProps[] = transactions.map((item: IDataListProps) => {

      if(item.type === "positive") {
        entriesTotal += Number(item.amount);
      } else {
        expensiveTotal += Number(item.amount);
      }


      const amount = Number(item.amount).toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL'
      });

      const date = Intl.DateTimeFormat('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: '2-digit'
      }).format(new Date(item.date));

      return {
        id: item.id,
        name: item.name,
        amount,
        type: item.type,
        category: item.category,
        date,
      }

    });

    const total = entriesTotal - expensiveTotal;

    setTransactions(transactionsFormated);

    const lastTransactionEntries = getLastTransactionDate(transactions, 'positive');
    const lastTransactionExpansive = getLastTransactionDate(transactions, 'negative');
    const totalInterval = `01 à ${lastTransactionEntries}`

    setHighlightData({
      entries: {
        amount: entriesTotal.toLocaleString('pt-BR', {
          style: 'currency',
          currency: 'BRL'
        }),
        lastTransaction: `Última entrada ${ lastTransactionEntries }`
      },
      expensive: {
        amount: expensiveTotal.toLocaleString('pt-BR', {
          style: 'currency',
          currency: 'BRL'
        }),
        lastTransaction: `Última entrada ${lastTransactionExpansive}`
      },
      total: {
        amount: total.toLocaleString('pt-BR', {
          style: 'currency',
          currency: 'BRL',
        }),
        lastTransaction: totalInterval
      }
    });

    setIsLoading(false);
  }

  useFocusEffect(React.useCallback(() => {
    loadTransactions();
  }, []))

  return (
    <S.Container>
      {
        isLoading ? 
        <S.LoadingContainer>
          <ActivityIndicator size="large" color={theme.colors.primary}/>
        </S.LoadingContainer> : 
        <>
          <S.Header>
            <S.UserHelper>
              <S.UserInfo>
                <S.Photo
                  source={{
                    uri: 'https://avatars.githubusercontent.com/u/25517947?v=4',
                  }}
                />
                <S.User>
                  <S.UserGreeting>Olá, </S.UserGreeting>
                  <S.UserName>Alex</S.UserName>
                </S.User>
              </S.UserInfo>

              <S.LogoutButton onPress={() => {}}>
                <S.Icon name="power" />
              </S.LogoutButton>
            </S.UserHelper>
          </S.Header>

          <S.HighlightCards>
            <HighlightCard
              title="Entradas"
              amount={highlightData.entries.amount}
              lastTransaction={highlightData.entries.lastTransaction}
              type="up"
            />
            <HighlightCard
              title="Saída"
              amount={highlightData.expensive.amount}
              lastTransaction={highlightData.entries.lastTransaction}
              type="down"
            />
            <HighlightCard
              title="Total"
              amount={highlightData.total.amount}
              lastTransaction={highlightData.total.lastTransaction}
              type="total"
            />
          </S.HighlightCards>

          <S.Transactions>
            <S.Title>Listagem</S.Title>

            <S.TransactionList
              data={transactions}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => <TransactionCard data={item} />}
            />
          </S.Transactions>
        </>
      }
    </S.Container>
  );
}
