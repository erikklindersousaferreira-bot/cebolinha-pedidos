// ===================================
// DADOS DO ESTABELECIMENTO
// Edite aqui produtos, preços e bairros
// ===================================

const WHATSAPP_NUMBER = "5594991361499"; // número da loja, formato internacional sem espaços/símbolos

const MENU = {
  pasteis: [
    { id: 1,  nome: "Carne",                              preco: 13.00 },
    { id: 2,  nome: "Carne e Queijo",                      preco: 13.00 },
    { id: 3,  nome: "Carne, Queijo e Catupiry",            preco: 13.00 },
    { id: 4,  nome: "Carne, Queijo e Cheddar",              preco: 13.00 },
    { id: 5,  nome: "Carne Seca",                          preco: 15.00 },
    { id: 6,  nome: "Carne Seca e Queijo",                  preco: 15.00 },
    { id: 7,  nome: "Carne Seca, Queijo e Catupiry",        preco: 15.00 },
    { id: 8,  nome: "Carne Seca, Queijo e Cheddar",          preco: 15.00 },
    { id: 9,  nome: "Queijo e Presunto",                    preco: 13.00 },
    { id: 10, nome: "Queijo e Banana",                      preco: 13.00 },
    { id: 11, nome: "Queijo e Calabresa",                    preco: 13.00 },
    { id: 12, nome: "Queijo",                                preco: 13.00 },
    { id: 13, nome: "Pizza",                                preco: 13.00 },
    { id: 14, nome: "Frango",                                preco: 13.00 },
    { id: 15, nome: "Frango e Queijo",                      preco: 13.00 },
    { id: 16, nome: "Frango, Queijo e Catupiry",            preco: 13.00 },
    { id: 17, nome: "Frango, Queijo e Cheddar",              preco: 13.00 },
    { id: 18, nome: "Camarão",                              preco: 18.00 },
    { id: 19, nome: "Camarão e Queijo",                      preco: 18.00 },
    { id: 20, nome: "Romeu e Julieta",                      preco: 13.00 },
  ],
  batatas: [
    { id: 101, nome: "Batata, Queijo e Cheddar",                       preco: 15.00 },
    { id: 102, nome: "Batata, Queijo e Catupiry",                      preco: 15.00 },
    { id: 103, nome: "Batata, Queijo, Cheddar e Calabresa",            preco: 20.00 },
    { id: 104, nome: "Batata, Queijo, Catupiry e Calabresa",            preco: 20.00 },
    { id: 105, nome: "Batata, Queijo, Cheddar e Carne Seca",            preco: 22.00 },
    { id: 106, nome: "Batata, Queijo, Catupiry e Carne Seca",            preco: 22.00 },
  ],
  bebidas: [
    { id: 201, nome: "Refrigerante Lata",      preco: 7.00 },
    { id: 202, nome: "Refrigerante 600ml",      preco: 8.00 },
    { id: 203, nome: "Refrigerante 1 Litro",    preco: 10.00 },
    { id: 204, nome: "Refrigerante 1,5 Litro",  preco: 13.00 },
    { id: 205, nome: "Água Mineral",            preco: 4.00 },
    { id: 206, nome: "Água com Gás",            preco: 5.00 },
    { id: 207, nome: "Suco de Maracujá 300ml",  preco: 8.00 },
    { id: 208, nome: "Suco de Cajá 300ml",      preco: 8.00 },
    { id: 209, nome: "Suco de Goiaba 300ml",    preco: 7.00 },
    { id: 210, nome: "Suco de Acerola 300ml",   preco: 7.00 },
    { id: 211, nome: "Caldo de Cana 300ml",     preco: 7.00 },
  ],
};

const BAIRROS = [
  { nome: "São Félix",              taxa: 5.00 },
  { nome: "Pioneiro",                taxa: 5.00 },
  { nome: "São Félix 1",            taxa: 5.00 },
  { nome: "São Félix 2",            taxa: 5.00 },
  { nome: "Novo Progresso",          taxa: 5.00 },
  { nome: "Magalhães",              taxa: 7.00 },
  { nome: "São Félix 3",            taxa: 7.00 },
  { nome: "Francolândia",            taxa: 7.00 },
  { nome: "Residencial Tiradentes",  taxa: 10.00 },
  { nome: "Morada Nova",            taxa: 10.00 },
];
