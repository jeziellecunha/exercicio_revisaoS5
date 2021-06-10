# Workshop Back end - Reprograma

## Exercício de revisão: Carrinho de Compras

### Professora: Tassila Bomfim

###Aluna: Jezielle Cunha

Criar uma solução de um carrinho de compras.

- _Listar no console uma tabela contendo os produtos em ordem crescente de preço (do menor ao maior). Utilize a lista contida no arquivo_ `database.js`

  ````
  function ordenarProdutosPorValorMenor(produtos) {
    const protudosOrdenados = produtos.sort((a, b) => a.preco - b.preco);
    return protudosOrdenados;
  ````

  ​

  No arquivo database.js foi construído um array chamado produtos contendo objetos que foram exportado por meio do :

  ​

  ````
  module.exports = produtos
  ````
  ​

- _Receber via terminal as entradas de `id` e `quantidade` dos produtos a serem adquiridos._

````
//Recebe o valor do ID, casa não seja válido, volta a questionar o usuário. Para depois questionar a quantidade de itens desejada.

let idEhValido = false;
      while(!idEhValido){
        const idDoProduto = receberEntrada.question(
            "Digite o ID do produto desejado."
          );
          const produtoDesejado = buscarProdutosPorId(parseInt(idDoProduto));
          
          if (produtoDesejado){
            idEhValido = true
            const quantidadeDesejada = receberEntrada.question(
                "Digite quantos produtos voce quer."
              );
              novoPedido.inserirItemNoPedido(produtoDesejado, parseInt(quantidadeDesejada));

      continuarComprando = receberEntrada.question(
        "Deseja continuar comprando? (S/N)"
      );
          } else{
              console.log("Produto nao encontrado. Digite um ID válido.");
          }
      }
````



- _Perguntar se a cliente possue cupom de desconto. Caso a cliente digite 10, significa que terá 10% de desconto._

````
// A variável cupomDeDesconto recebe a entrada do usuário, caso seja digitado "N", não será calculado nenhum desconto.

const cupomDeDesconto = receberEntrada.question(
      " Se voce tem um cupom de desconto digite aqui. Caso nao tenha digite N."
    );
    if (cupomDeDesconto.toLocaleUpperCase() != "N") {
      novoPedido.calcularValorDoDesconto(cupomDeDesconto);
    }
    
// o método calcularValorDoDesconto está dentro da classe Pedidi.

 calcularValorDoDesconto(valorDesconto) {
    valorDesconto = (valorDesconto >15) ? 15 : valorDesconto
    this.desconto = (this.subtotal *(parseInt(valorDesconto)/100)).toFixed(2);
    this.calcularValorFinal();
  }
````



- _Calcular o valor do subtotal (sem considerar o desconto)_

````
// médoto está dentro da classe Pedido.

calcularValorSubtotal() {
    let valorDosProdutos = 0;
    this.itens.map((item) => (valorDosProdutos += item.precoTotal));

    this.subtotal = valorDosProdutos.toFixed(2);
  }
````



- _Calcular o valor de desconto_

````
// médoto está dentro da classe Pedido.

calcularValorDoDesconto(valorDesconto) {
    valorDesconto = (valorDesconto >15) ? 15 : valorDesconto
    this.desconto = (this.subtotal *(parseInt(valorDesconto)/100)).toFixed(2);
    this.calcularValorFinal();
  }
````



- _Calcular o valor total (considerando o desconto do cupom)_

````
// médoto está dentro da classe Pedido.

calcularValorFinal() {
    this.total = this.subtotal - this.desconto;
  }
````



- _Apresentar no console:_
  - _a tabela contendo a lista de produtos adquiridos, incluindo a quantidade de cada produto_
  - _o valor subtotal em Reais_
  - _o valor do desconto em Reais_
  - _o valor total em Reais_
  - _a data da compra_

````
// médoto está dentro da classe Pedido.

apresentarExtrato() {
    this.itens = this.itens.filter(item => item.quantidade > 0)
    console.table(this.itens);
    console.log(`Quantidade total de itens: ${this.calcularQuantidadeDeItens()}`);
    console.log(`SUBTOTAL: R$ ${this.subtotal}`);
    console.log(`DESCONTO: R$ ${this.desconto}`);
    console.log(`TOTAL: R$ ${this.total}`);
    console.log(this.dataAtualFormatada());
    
  }
````



## Regras

- _Validação de produto existente pelo `id`. Caso não encontre o produto, apresentar uma mensagem de erro e solicitar novamente um `id` válido._
- _Validação de `quantidade` para não permitir valores negativos._

````
//No método inserirItemNoPedido() consta o atributo:

item.quantidade = (quantidade > 1) ?quantidade : 0; // desse modo, caso quantidade seje menor que 1, será computado 0 e o item não será impresso no método apresentarExtrato().
````

- _Validação de cupom de desconto. Não aceitar cupom acima de 15% de desconto._

````
//Método dentro da classe Pedido, indica que se o usuário colocar um valor maior que 15, o sistema aceitará 15% que é o máximo de desconto possível, caso coloque um valor abaixo disso, o valor digitado será computado para o cálculo.

calcularValorDoDesconto(valorDesconto) {
    valorDesconto = (valorDesconto >15) ? 15 : valorDesconto
    this.desconto = (this.subtotal *(parseInt(valorDesconto)/100)).toFixed(2);
    this.calcularValorFinal();
  }
````

- _Criação de uma classe chamada `Pedido` contendo no `constructor` pelo menos as seguintes informações:_
  - a lista de produtos
  - o valor de cupom

- _A classe `Pedido` deve conter os métodos:_

  - _que calcule a quantidade de itens totais no carrinho_
  - _que calcule o valor subtotal (quantidade de itens multiplicado pelo preço unitário)_
  - _que calcule o valor de desconto (subtotal multiplicado pelo desconto)_
  - _que calcule o valor total (subtotal menos o desconto)_

  ````
  //classe Pedido e todos os seus atributos e métodos:

  class Pedido {
    itens = []; //array que recebe os itens desejados pelo usuário
    subtotal = 0; // alimentado pelo método: calcularValorSubtotal()
    desconto = 0; // alimentado pelo método: calcularValorDoDesconto()
    total = 0; // alimentado pelo método: calcularValorFinal()

    inserirItemNoPedido(produto, quantidade) {
      let item = new Item();
      item.id = produto.id;
      item.nome = produto.nome;
      item.quantidade = (quantidade > 1) ?quantidade : 0;
      item.precoUnitario = produto.preco;
      item.precoTotal = produto.preco * item.quantidade;

      this.itens.push(item);
      console.log(`${item.nome} incluído no pedido.`);
      this.calcularValorSubtotal();

      this.calcularValorFinal();
    }

    calcularQuantidadeDeItens(){
        let quantidadeInicial = 0;
        this.itens.map((item) => quantidadeInicial += item.quantidade)
        return quantidadeInicial
    }

    calcularValorSubtotal() {
      let valorDosProdutos = 0;
      this.itens.map((item) => (valorDosProdutos += item.precoTotal));

      this.subtotal = valorDosProdutos.toFixed(2);
    }

    calcularValorDoDesconto(valorDesconto) {
      valorDesconto = (valorDesconto >15) ? 15 : valorDesconto
      this.desconto = (this.subtotal *(parseInt(valorDesconto)/100)).toFixed(2);
      this.calcularValorFinal();
    }

    calcularValorFinal() {
      this.total = this.subtotal - this.desconto;
    }

    apresentarExtrato() {
      this.itens = this.itens.filter(item => item.quantidade > 0);
      console.table(this.itens);
      console.log(`Quantidade total de itens: ${this.calcularQuantidadeDeItens()}`);
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
  ````

---

### Sugestões de exercícios extras para praticar um pouco mais:

_Essas são somente sugestões de como continuar exercitando para melhorar seu projeto e suas habilidades._

- _Inclua a data do pedido_.

O método dataAtualFormatada da classe Pedido foi incluído dentro de outro método apresentarExtrato:

````
// Método dentro da classe Pedido que é chamado dentro de outro método da classe chamado 
dataAtualFormatada() {
    const data = new Date(),
      dia = data.getDate().toString(),
      diaF = dia.length == 1 ? "0" + dia : dia,
      mes = (data.getMonth() + 1).toString(), 
      mesF = mes.length == 1 ? "0" + mes : mes,
      anoF = data.getFullYear();
    return diaF + "/" + mesF + "/" + anoF;
  }
````



- _Usar sintaxe ES6._

A utilização da sintaxe ES6 é percebida no uso de arrow function, interpolação e de operador ternário.

- _Colocar o nome das variáveis em inglês._

Essa incrementação eu não fiz, pois para mim ficaria difícil identificar posteriormente.

- _Fazer o `commit` do código a cada etapa concluída._

Também não cumpri esse requesito, fiz todo projeto e depois subi para o gitHub.

- _Fazer a ordenação do mais caro para o mais barato._

Realizado por meio do sort()  dentro da função ordenarProdutoPorValorMaior.

````
function ordenarProdutoPorValorMaior(produtos){
  const protudosOrdenados = produtos.sort((a, b) => b.preco - a.preco);
  return protudosOrdenados;
}
````

- _Fazer a busca dos produtos por `categoria` e apresentar somente os produtos da categoria escolhida._

  ````
  //Nesta condição do if, se a categoria digitada pelo usuário for válida, esta categoria será apresentada por meio do console.table().

  if (categoria.length != 0) {
            console.table(categoria);
            categoriaEhValida = true;
  ````

  ​

- _Fazer um cupom de desconto "BLACKFRIDAY" que só permite dar desconto em algumas categorias._

  Item não cumprido.

- _Nesse momento de exercício livre, siga sua criatividade de como incluir novas regras para seu Carrinho de compras._

  As regras acrescentadas foram validae categoria, onde enquanto não for digitada uma categoria válida, o sistema irá voltar a perguntar qual é a categoria desejada. E também a validação do ID, onde caso o usuário digite um ID que não exista, o usuário será questionado novamente qual ID ele deseja.

- _Armazenar todos os pedidos e calcular o total que sua Lojinha vendeu._

  Para atender esse item, seria necessário alimentar outro array com os pedidos concluídos.Item não cumprido.

---



#  