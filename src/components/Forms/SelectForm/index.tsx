import React from 'react';
import * as S from './styles';

interface ISelectFormProps {
  title: string;
  onPress: () => void;
}

export function SelectForm({ title, onPress, ...rest }: ISelectFormProps) {
  return (
    <S.Container {...rest} onPress={onPress}>
      <S.Category>{title}</S.Category>
      <S.Icon name="chevron-down" />
    </S.Container>
  );
}
