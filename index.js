class Item {
  id;
  nome;
  quantidade;
  precoUnitario;
  precoTotal;
}

class Pedido {
  itens = [];
  subtotal = 0;
  desconto = 0;
  total = 0;

  inserirItemNoPedido(produto, quantidade) {
    let item = new Item();
    item.id = produto.id;
    item.nome = produto.nome;
    item.quantidade = quantidade > 1 ? quantidade : 0;
    item.precoUnitario = produto.preco;
    item.precoTotal = produto.preco * item.quantidade;

    this.itens.push(item);
    console.log(`${item.nome} incluído no pedido.`);
    this.calcularValorSubtotal();

    this.calcularValorFinal();
  }

  calcularQuantidadeDeItens() {
    let quantidadeInicial = 0;
    this.itens.map((item) => (quantidadeInicial += item.quantidade));
    return quantidadeInicial;
  }

  calcularValorSubtotal() {
    let valorDosProdutos = 0;
    this.itens.map((item) => (valorDosProdutos += item.precoTotal));

    this.subtotal = valorDosProdutos.toFixed(2);
  }

  calcularValorDoDesconto(valorDesconto) {
    valorDesconto = valorDesconto > 15 ? 15 : valorDesconto;
    this.desconto = (this.subtotal * (parseInt(valorDesconto) / 100)).toFixed(
      2
    );
    this.calcularValorFinal();
  }

  calcularValorFinal() {
    this.total = this.subtotal - this.desconto;
  }

  apresentarExtrato() {
    this.itens = this.itens.filter((item) => item.quantidade > 0);
    console.table(this.itens);
    console.log(
      `Quantidade total de itens: ${this.calcularQuantidadeDeItens()}`
    );
    console.log(`SUBTOTAL: R$ ${this.subtotal}`);
    console.log(`DESCONTO: R$ ${this.desconto}`);
    console.log(`TOTAL: R$ ${this.total}`);
    console.log(this.dataAtualFormatada());
  }
  dataAtualFormatada() {
    const data = new Date(),
      dia = data.getDate().toString(),
      diaF = dia.length == 1 ? "0" + dia : dia,
      mes = (data.getMonth() + 1).toString(),
      mesF = mes.length == 1 ? "0" + mes : mes,
      anoF = data.getFullYear();
    return diaF + "/" + mesF + "/" + anoF;
  }
}

const bancoDeDados = require("./database.js");

function ordenarProdutosPorValorMenor(produtos) {
  const protudosOrdenados = produtos.sort((a, b) => a.preco - b.preco);
  return protudosOrdenados;
}
function ordenarProdutoPorValorMaior(produtos) {
  const protudosOrdenados = produtos.sort((a, b) => b.preco - a.preco);
  return protudosOrdenados;
}

function buscarProdutoPorCategoria(categoria) {
  const produtosDaCategoriaDesejada = bancoDeDados.filter(
    (produto) => produto.categoria == categoria
  );
  return produtosDaCategoriaDesejada;
}

function buscarProdutosPorId(id) {
  const produtoBuscado = bancoDeDados.find((item) => item.id === id);
  return produtoBuscado;
}

function validarCupomDeDesconto(cupom) {
  return cupom == 10;
}

console.log("==============================================");
console.log("         Projeto Carrinho de Compras     ");
console.log("               Jezielle Cunha     ");
console.log("==============================================");

function menu() {
  console.log("============================================");
  console.log("1- Listar todos os produtos pelo menor valor.");
  console.log("2- Buscar produtos por categoria e efetuar a compra.");
  console.log("3- Listar todos os produtos pelo maoir valor.");
  console.log("4- Sair da aplicacao.");
  console.log("============================================");
}
const receberEntrada = require("readline-sync");

menu();

const opcao = receberEntrada.question(
  "Digite o numero referente a opcao desejada. (1, 2, 3 ou 4)"
);
switch (opcao) {
  case "1":
    console.log("Voce escolheu listar todos os produtos pelo menor valor.");
    console.table(ordenarProdutosPorValorMenor(bancoDeDados));
    console.log("Busca encerrada.");
    break;

  case "2":
    const novoPedido = new Pedido();
    console.log("Voce escolheu buscar protudos por categoria.");
    let continuarComprando = "N";
    do {
      console.log("============================================");
      console.log("Categorias disponíveis: ");
      console.log("alimento, bebida, casa, higiene, informatica");
      console.log("============================================");

      let categoriaEhValida = false;
      while (!categoriaEhValida) {
        const categoriaDesejada = receberEntrada.question(
          "Voce esta buscando por qual categoria?"
        );
        const categoria = buscarProdutoPorCategoria(categoriaDesejada);

        if (categoria.length != 0) {
          console.table(categoria);
          categoriaEhValida = true;
        } else {
          console.log("============================================");
          console.log("Informe uma categoria válida:");
          console.log("alimento, bebida, casa, higiene, informatica");
        }
      }

      let idEhValido = false;
      while (!idEhValido) {
        const idDoProduto = receberEntrada.question(
          "Digite o ID do produto desejado."
        );
        const produtoDesejado = buscarProdutosPorId(parseInt(idDoProduto));

        if (produtoDesejado) {
          idEhValido = true;
          const quantidadeDesejada = receberEntrada.question(
            "Digite quantos produtos voce quer."
          );
          novoPedido.inserirItemNoPedido(
            produtoDesejado,
            parseInt(quantidadeDesejada)
          );

          continuarComprando = receberEntrada.question(
            "Deseja continuar comprando? (S/N)"
          );
        } else {
          console.log("Produto nao encontrado. Digite um ID válido.");
        }
      }
    } while (continuarComprando.toLocaleUpperCase() === "S");
    console.log("Pedido concluído!");
    const cupomDeDesconto = receberEntrada.question(
      " Se voce tem um cupom de desconto digite aqui. Caso nao tenha digite N."
    );
    if (cupomDeDesconto.toLocaleUpperCase() != "N") {
      novoPedido.calcularValorDoDesconto(cupomDeDesconto);
    }

    novoPedido.apresentarExtrato();
    break;

  case "3":
    console.log("Voce escolheu listar todos os produtos pelo maior valor.");
    console.table(ordenarProdutoPorValorMaior(bancoDeDados));
    console.log("Busca encerrada.");
    break;

  case "4":
    console.log("Voce escolheu encerrar a busca.");
    console.log("Busca encerrada.");
    break;

  default:
    console.log("Programa nao encontrou a opcao desejada.");
}
