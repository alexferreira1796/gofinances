import React from 'react';
import { categories } from '../../utils/categories';
import * as S from './styles';


export interface ITransactionCardProps {
  type: 'positive' | 'nagative';
  name: string;
  amount: string;
  category: string;
  date: string;
}

interface Props {
  data: ITransactionCardProps;
}

export function TransactionCard({ data }: Props) {
  const [ category ] = categories.filter((item) => item.key == data.category);

  return (
    <S.Container>
      <S.Title>{data.name}</S.Title>

      <S.Amount type={data.type}>{data.amount}</S.Amount>

      <S.Footer>
        <S.Category>
          <S.Icon name={category.icon} />
          <S.CategoryName>{category.name}</S.CategoryName>
        </S.Category>
        <S.FDate>{data.date}</S.FDate>
      </S.Footer>
    </S.Container>
  );
}
