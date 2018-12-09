import shortid from "shortid";

// Give every card in a list an _id and the color white UNLESS those properties already exist
const appendAttributes = list =>
  list.map(card => ({
    color: "white",
    _id: shortid.generate(),
    ...card
  }));

// Generate the initial showcase board that every user and guest gets when they first log in
const createWelcomeBoard = userId => {
  const list1 = [
    { text: "Detalhes do contato do pai, mãe ou guardião(ã)" },
    { text: "Criança" },
    { text: "Revisar Política de Privacidade" },
    { text: "Informações da Criança" },
    { text: "Política de Privacidade" },
    { text: "Criar nova Regra de Privacidade" },
    { text: "Controle Principal de Acesso aos dados da criança" },
    { text: "Serviço móvel autorizado a acessar dados das crianças" },
    { text: "Autorizar acesso ao GPS" },
    { text: "Propósito de acesso aos dados da Criança" },
    { text: "Escolher Destinatários para receber dados da criança" },
    { text: "Obrigações e Retenção dos dados" },
    { text: "Descrição da regra de privacidade" },
    { text: "Revisar e Adicionar Regra de privacidade" },
    { text: "Mostrar todas as regras de privacidade" },
    { text: "Habilitar regra de privacidade" },
    { text: "Desabilitar regra de privacidade" },
    { text: "Consentiu com a Política de Privacidade de Serviço" },
    { text: "Aceita receber atualizações por e-mail" },
  ];

  const list2 = [
    {
      text: `Card 2`
    }
  ];

  return {
    _id: shortid.generate(),
    title: "Privacidade e Segurança Usável",
    color: "green",
    lists: [
      {
        _id: 1,
        title: "Arraste um cartão de cada vez",
        cards: appendAttributes(list1)
      },
      {
        _id: shortid.generate(),
        title: "Categoria 1",
        cards: []
      },
    ],
    users: userId ? [userId] : []
  };
};

export default createWelcomeBoard;
