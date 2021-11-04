import React from 'react';
import * as S from './style';

interface IHistoryCardProps {
    color: string;
    title: string;
    amount: string;
}

export function HistoryCard({ title, color, amount }: IHistoryCardProps) {
    return (
        <S.Container color={color} >
            <S.Title>{title}</S.Title>
            <S.Amount>{amount}</S.Amount>
        </S.Container>
    )
}