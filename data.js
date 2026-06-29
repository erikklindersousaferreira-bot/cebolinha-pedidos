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
  sorvetes: [
    { id: 301, nome: "Casquinha Tradicional",                  preco: 6.00 },
    { id: 302, nome: "Casquinha Trufada",                      preco: 8.00 },
    { id: 303, nome: "Cascão Tradicional",                      preco: 8.00 },
    { id: 304, nome: "Cascão Trufado",                          preco: 10.00 },
    { id: 305, nome: "Sundae Chocolate",                        preco: 8.00 },
    { id: 306, nome: "Sundae Disquete",                        preco: 8.00 },
    { id: 307, nome: "Sundae Morango",                          preco: 8.00 },
    { id: 308, nome: "Sundae Maracujá",                        preco: 8.00 },
    { id: 309, nome: "Sundae Ovomaltine",                      preco: 8.00 },
    { id: 310, nome: "Sundae Frutas Vermelhas",                preco: 8.00 },
    { id: 311, nome: "Milk Shake Morango 300ml",                preco: 10.00 },
    { id: 312, nome: "Milk Shake Morango 400ml",                preco: 12.00 },
    { id: 313, nome: "Milk Shake Morango 500ml",                preco: 15.00 },
    { id: 314, nome: "Milk Shake Maracujá 300ml",              preco: 10.00 },
    { id: 315, nome: "Milk Shake Maracujá 400ml",              preco: 12.00 },
    { id: 316, nome: "Milk Shake Maracujá 500ml",              preco: 15.00 },
    { id: 317, nome: "Milk Shake Ovomaltine 300ml",            preco: 10.00 },
    { id: 318, nome: "Milk Shake Ovomaltine 400ml",            preco: 12.00 },
    { id: 319, nome: "Milk Shake Ovomaltine 500ml",            preco: 15.00 },
    { id: 320, nome: "Milk Shake Frutas Vermelhas 300ml",      preco: 10.00 },
    { id: 321, nome: "Milk Shake Frutas Vermelhas 400ml",      preco: 12.00 },
    { id: 322, nome: "Milk Shake Frutas Vermelhas 500ml",      preco: 15.00 },
    { id: 323, nome: "Milk Shake Chocolate 300ml",              preco: 10.00 },
    { id: 324, nome: "Milk Shake Chocolate 400ml",              preco: 12.00 },
    { id: 325, nome: "Milk Shake Chocolate 500ml",              preco: 15.00 },
  ],
};

const ADICIONAIS_PASTEL = [
  { id: "carne", nome: "Carne" },
  { id: "frango", nome: "Frango" },
  { id: "queijo", nome: "Queijo" },
  { id: "calabresa", nome: "Calabresa" },
  { id: "catupiry", nome: "Catupiry" },
  { id: "cheddar", nome: "Cheddar" },
  { id: "presunto", nome: "Presunto" },
  { id: "banana", nome: "Banana" },
  { id: "pizza", nome: "Pizza" },
];

const PIX_INFO = {
  nome: "Tamara Thais Lima de Araujo",
  banco: "Nubank",
  chave: "(94) 99294-8035",
};

const BAIRROS = [
  { nome: "São Félix 1, São Félix 2 e Pioneiro", taxa: 5.00 },
  { nome: "Novo Progresso",                       taxa: 5.00 },
  { nome: "Residencial Tocantins",                taxa: 5.00 },
  { nome: "Km 3",                                 taxa: 6.00 },
  { nome: "Francolândia",                         taxa: 7.00 },
  { nome: "Residencial Paris",                    taxa: 7.00 },
  { nome: "Magalhães 1",                          taxa: 7.00 },
  { nome: "Tiradentes",                           taxa: 10.00 },
  { nome: "Magalhães 2",                          taxa: 10.00 },
  { nome: "Morada Nova",                          taxa: 15.00 },
];
