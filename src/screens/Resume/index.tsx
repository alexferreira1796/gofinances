import React from "react";
import { ActivityIndicator } from "react-native";
import * as S from "./styles";
import { VictoryPie } from "victory-native";
import { RFValue } from "react-native-responsive-fontsize";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { useFocusEffect } from "@react-navigation/native";
import { addMonths, subMonths, format } from "date-fns";
import { ptBR } from "date-fns/locale";

import { useTheme } from "styled-components";

import AsyncStorage from "@react-native-async-storage/async-storage";

import { HistoryCard } from "../../components/HistoryCard";
import { categories } from "../../utils/categories";
import { set } from "react-hook-form";

const collectionKey = "@gofinances:transactions";

interface ITransactionCardProps {
  id: string;
  type: "positive" | "nagative";
  name: string;
  amount: string;
  category: string;
  date: string;
}

interface ICategoryData {
  key: string;
  name: string;
  color: string;
  totalFormatted: string;
  total: number;
  percent: string;
}

export function Resume() {
  const [isLoading, setIsLoading] = React.useState(false);
  const [selectedDate, setSelectedDate] = React.useState(new Date());
  const [totalByCategories, setTotalByCategories] = React.useState<
    ICategoryData[]
  >([]);

  const theme = useTheme();

  function handleChangeDate(action: "next" | "prev") {
    if (action === "next") {
      const newDate = addMonths(selectedDate, 1);
      setSelectedDate(newDate);
    } else {
      const newDate = subMonths(selectedDate, 1);
      setSelectedDate(newDate);
    }
  }

  async function loadData() {
    setIsLoading(true);
    const response = await AsyncStorage.getItem(collectionKey);
    const responseFormated = response ? JSON.parse(response) : [];

    //const expensives = responseFormated.filter((expensive: ITransactionCardProps) => expensive.type === "negative");

    const expensives = responseFormated.filter(
      (expensive: ITransactionCardProps) =>
        new Date(expensive.date).getMonth() === selectedDate.getMonth() &&
        new Date(expensive.date).getFullYear() === selectedDate.getFullYear()
    );

    //const expensives = responseFormated;

    const expensivesTotal = expensives.reduce(
      (acc: number, expensive: ITransactionCardProps) => {
        return acc + Number(expensive.amount);
      },
      0
    );

    const totalByCategory: ICategoryData[] = [];

    categories.forEach((category) => {
      let categorySum = 0;

      expensives.forEach((expensive: ITransactionCardProps) => {
        if (expensive.category === category.key) {
          categorySum += Number(expensive.amount);
        }
      });

      if (categorySum > 0) {
        const totalFormatted = categorySum.toLocaleString("pt-BR", {
          style: "currency",
          currency: "BRL",
        });

        const percent = `${((categorySum / expensivesTotal) * 100).toFixed(
          0
        )}%`;

        totalByCategory.push({
          key: category.key,
          name: category.name,
          color: category.color,
          total: categorySum,
          totalFormatted,
          percent,
        });
      }
    });

    setTotalByCategories(totalByCategory);
    setIsLoading(false);
  }

  useFocusEffect(
    React.useCallback(() => {
      loadData();
    }, [selectedDate])
  );

  return (
    <S.Container>
      <S.Header>
        <S.Title>Resumo por Categoria</S.Title>
      </S.Header>

      {isLoading ? (
        <S.LoadingContainer>
          <ActivityIndicator size="large" color={theme.colors.primary} />
        </S.LoadingContainer>
      ) : (
        <>
          <S.Content
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{
              paddingHorizontal: 24,
              paddingBottom: useBottomTabBarHeight(),
            }}
          >
            <S.MonthSelect>
              <S.MonthSelectButton onPress={() => handleChangeDate("prev")}>
                <S.MonthSelectIcon name="chevron-left" />
              </S.MonthSelectButton>

              <S.Month>
                {format(selectedDate, "MMMM, yyyy", { locale: ptBR })}
              </S.Month>

              <S.MonthSelectButton onPress={() => handleChangeDate("next")}>
                <S.MonthSelectIcon name="chevron-right" />
              </S.MonthSelectButton>
            </S.MonthSelect>

            <S.ChartContainer>
              <VictoryPie
                data={totalByCategories}
                colorScale={totalByCategories.map((category) => category.color)}
                style={{
                  labels: {
                    fontSize: RFValue(18),
                    fontWeight: "bold",
                    fill: theme.colors.shape,
                  },
                }}
                labelRadius={50}
                x="percent"
                y="total"
              />
            </S.ChartContainer>

            {totalByCategories.map(({ key, name, totalFormatted, color }) => {
              return (
                <HistoryCard
                  key={key}
                  title={name}
                  amount={totalFormatted}
                  color={color}
                />
              );
            })}
          </S.Content>
        </>
      )}
    </S.Container>
  );
}
