import React from "react";
import { Keyboard, Modal, TouchableWithoutFeedback, Alert } from "react-native";
import { useForm } from "react-hook-form";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import AsyncStore from "@react-native-async-storage/async-storage";

import uuid from "react-native-uuid";
import { useNavigation } from "@react-navigation/native";

import { Button } from "../../components/Forms/Button";
import { TransactionTypeButton } from "../../components/Forms/TransactionTypeButton";
import { SelectForm } from "../../components/Forms/SelectForm";
import { InputForm } from "../../components/Forms/InputForm";

interface IFormData {
  name: string;
  amount: string;
}

type NavigationProps = {
  navigate: (screen: string) => void;
};

const schema = Yup.object().shape({
  name: Yup.string().required("Nome é obrigátorio"),
  amount: Yup.number()
    .typeError("Informe um valor númerico")
    .positive("O valor não pode ser negativo")
    .required("Valor é obrigátorio"),
});
const collectionKey = "@gofinances:transactions";

import * as S from "./styles";
import { CategorySelect } from "../CategorySelect";

export function Register() {
  const [category, setCategory] = React.useState({
    key: "category",
    name: "Categoria",
  });
  const [transactionType, setTransactionType] = React.useState<string>("");
  const [categoryModalOpen, setCategoryModalOpen] =
    React.useState<boolean>(false);

  const navigation = useNavigation<NavigationProps>();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  function handleTransactionSelect(type: "positive" | "negative"): void {
    setTransactionType(type);
  }

  function handleOpenSelectCategoryModal(): void {
    setCategoryModalOpen(true);
  }

  function handleCloseSelectCategoryModal(): void {
    setCategoryModalOpen(false);
  }

  // LoadStorage
  async function loadData() {
    const data = await AsyncStore.getItem(collectionKey);
    return data;
  }

  // Delete Storage
  async function removeAll() {
    await AsyncStore.removeItem(collectionKey);
  }

  async function handleRegister(form: IFormData) {
    if (!transactionType) {
      return Alert.alert("Selecione o tipo da transação");
    }
    if (category.key === "category") {
      return Alert.alert("Selecione uma categoria");
    }

    const newTransaction = {
      id: String(uuid.v4()),
      name: form.name,
      amount: form.amount,
      type: transactionType,
      category: category.key,
      date: new Date(),
    };

    // Salvando dados no localstorage
    try {
      const data = await loadData();
      const currentData = data ? JSON.parse(data) : [];

      const dataFormated = [...currentData, newTransaction];

      await AsyncStore.setItem(collectionKey, JSON.stringify(dataFormated));

      reset();
      setTransactionType("");
      setCategory({
        key: "category",
        name: "Categoria",
      });

      navigation.navigate("Listagem");
    } catch (error) {
      console.log(error);
      Alert.alert("Não foi possível salvar");
    }
  }

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <S.Container>
        <S.Header>
          <S.Title>Cadastro</S.Title>
        </S.Header>

        <S.Form>
          <S.Fields>
            <InputForm
              control={control}
              name="name"
              placeholder="Nome"
              autoCapitalize="sentences"
              autoCorrect={false}
              error={errors.name && errors.name.message}
            />
            <InputForm
              control={control}
              name="amount"
              placeholder="Preço"
              keyboardType="numeric"
              error={errors.amount && errors.amount.message}
            />

            <S.TransactionsTypes>
              <TransactionTypeButton
                type="up"
                title="Income"
                onPress={() => handleTransactionSelect("positive")}
                isActive={transactionType === "positive"}
              />
              <TransactionTypeButton
                type="down"
                title="Outcome"
                onPress={() => handleTransactionSelect("negative")}
                isActive={transactionType === "negative"}
              />
            </S.TransactionsTypes>
            <SelectForm
              title={category.name}
              onPress={handleOpenSelectCategoryModal}
            />
          </S.Fields>
          <Button title="Enviar" onPress={handleSubmit(handleRegister)} />
        </S.Form>

        <Modal visible={categoryModalOpen}>
          <CategorySelect
            category={category}
            setCategory={setCategory}
            closeSelectCategory={handleCloseSelectCategoryModal}
          />
        </Modal>
      </S.Container>
    </TouchableWithoutFeedback>
  );
}
