import React from 'react';
import { TouchableOpacityProps } from 'react-native';
import * as S from './styles';

interface IButtonProps extends TouchableOpacityProps {
  title: string;
  onPress: () => void;
}

export function Button({ title, onPress, ...rest }: IButtonProps) {
  return (
    <S.Container {...rest} onPress={onPress}>
      <S.Title>{title}</S.Title>
    </S.Container>
  );
}
