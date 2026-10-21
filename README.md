# MimoPet

Mural comunitário para ajudar um pet a encontrar o caminho de casa.

O MimoPet transforma o quadro de avisos do bairro em uma página simples de usar: cada animal vira um cartaz, com foto, local, data e um contato. A vizinhança vê o caso, filtra o que procura e sabe o que fazer nas primeiras horas.

## A ideia

Quando um animal some, o tempo conta mais do que um sistema complicado. As pessoas já espalham foto em grupo, portaria e comércio. O MimoPet organiza esse gesto.

- O cartaz imita um papel de “procura-se”, fácil de ler de relance.
- O contato do tutor fica atrás de um clique, para a ficha não virar um bloco de texto.
- O guia de resgate vem antes do improviso: o que fazer nas primeiras 24 horas, como se aproximar, quando procurar veterinário ou microchip e quem acionar na região.

Fotos, nomes, bairros, telefones e ONGs publicados hoje são ilustrativos. Servem para apresentar o produto. Nenhum desses contatos corresponde a uma pessoa real.

## O que o visitante encontra

| Página | Função |
| --- | --- |
| Início | Apresenta o mural, mostra o alcance da rede e destaca três casos urgentes. |
| Mural de Cartazes | Lista os cartazes e permite filtrar entre todos, procura-se e encontrados. |
| Guia de Resgate | Reúne, em quatro passos, o que fazer ao perder ou encontrar um pet. |

No mural, **Cadastrar Pet Perdido** abre um formulário. A foto é lida no próprio navegador e o cartaz novo aparece no topo na hora. Nada é enviado a um servidor.

## Como abrir

O site é estático. Não precisa de instalação nem de banco de dados.

1. Abra `index.html` no navegador.
2. Para navegar entre as páginas com os caminhos relativos estáveis, sirva a pasta por um servidor local. Exemplo:

```bash
python3 -m http.server 8765
```

Depois acesse `http://127.0.0.1:8765`.

## Como está organizado

```text
index.html          página inicial
css/style.css       visual do mural e dos cartazes
js/main.js          filtros, contato e publicação do cartaz
html/mural.html     mural e cadastro
html/guias.html     guia de resgate
images/             logo e fotos dos pets
```

## Tecnologias

HTML5 semântico, CSS3, Bootstrap 5 e JavaScript puro. A interface carrega o Bootstrap por CDN e não depende de framework, build ou backend.

## Identidade

A paleta junta terracota e laranja com verde escuro e papel creme. A navbar, os botões e os cartazes usam a mesma família de cores para a página parecer um único quadro de avisos, não um conjunto de telas soltas.
