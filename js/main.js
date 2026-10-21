(function () {
  "use strict";

  const ano = document.getElementById("ano-atual");
  if (ano) {
    ano.textContent = String(new Date().getFullYear());
  }

  const contadores = document.querySelectorAll("[data-contador]");
  if (contadores.length && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    contadores.forEach((elemento) => {
      const alvo = Number(elemento.dataset.contador);
      const inicio = performance.now();
      const duracao = 900;
      const prefixo = elemento.dataset.prefixo || "";

      const animar = (agora) => {
        const progresso = Math.min((agora - inicio) / duracao, 1);
        const valor = Math.round(alvo * (1 - Math.pow(1 - progresso, 3)));
        elemento.textContent = prefixo + valor.toLocaleString("pt-BR");
        if (progresso < 1) {
          requestAnimationFrame(animar);
        }
      };

      requestAnimationFrame(animar);
    });
  } else {
    contadores.forEach((elemento) => {
      const prefixo = elemento.dataset.prefixo || "";
      elemento.textContent = prefixo + Number(elemento.dataset.contador).toLocaleString("pt-BR");
    });
  }

  const botoesFiltro = document.querySelectorAll("[data-filtro]");
  const grade = document.getElementById("grade-cartazes");
  const avisoVazio = document.getElementById("sem-resultados");

  const filtroAtivo = () => {
    const ativo = document.querySelector("[data-filtro].active");
    return ativo ? ativo.dataset.filtro : "todos";
  };

  const aplicarFiltro = (filtro) => {
    if (!grade) {
      return;
    }
    let visiveis = 0;
    grade.querySelectorAll("[data-situacao]").forEach((cartaz) => {
      const mostrar = filtro === "todos" || cartaz.dataset.situacao === filtro;
      cartaz.classList.toggle("oculto", !mostrar);
      if (mostrar) {
        visiveis += 1;
      }
    });
    if (avisoVazio) {
      avisoVazio.classList.toggle("d-none", visiveis > 0);
    }
  };

  botoesFiltro.forEach((botao) => {
    botao.addEventListener("click", () => {
      botoesFiltro.forEach((item) => {
        const ativo = item === botao;
        item.classList.toggle("active", ativo);
        item.setAttribute("aria-pressed", ativo ? "true" : "false");
      });
      aplicarFiltro(botao.dataset.filtro);
    });
  });

  const modalContato = document.getElementById("modalContato");
  if (modalContato) {
    modalContato.addEventListener("show.bs.modal", (evento) => {
      const origem = evento.relatedTarget;
      if (!origem) {
        return;
      }
      document.getElementById("contato-titulo").textContent = "Contato sobre " + (origem.dataset.pet || "o pet");
      document.getElementById("contato-papel").textContent = origem.dataset.papel || "Tutor";
      document.getElementById("contato-pessoa").textContent = origem.dataset.pessoa || "Não informado";
      document.getElementById("contato-telefone").textContent = origem.dataset.telefone || "Não informado";
      document.getElementById("contato-nota").textContent = origem.dataset.nota || "Contato ilustrativo. Não corresponde a uma pessoa real.";
    });
  }

  const form = document.getElementById("form-cadastro");
  const campoFoto = document.getElementById("foto-pet");
  const preview = document.getElementById("preview-foto");
  const erroFoto = document.getElementById("erro-foto");
  const avisoPublicado = document.getElementById("aviso-publicado");
  let fotoAtual = "";

  if (campoFoto && preview) {
    campoFoto.addEventListener("change", () => {
      const arquivo = campoFoto.files && campoFoto.files[0];
      fotoAtual = "";
      preview.classList.add("d-none");
      if (!arquivo) {
        return;
      }
      if (!arquivo.type.startsWith("image/")) {
        if (erroFoto) {
          erroFoto.textContent = "Escolha um arquivo de imagem.";
          erroFoto.classList.remove("d-none");
        }
        campoFoto.value = "";
        return;
      }
      const leitor = new FileReader();
      leitor.onload = () => {
        fotoAtual = String(leitor.result || "");
        preview.src = fotoAtual;
        preview.alt = "Prévia da foto escolhida para o cartaz";
        preview.classList.remove("d-none");
        if (erroFoto) {
          erroFoto.classList.add("d-none");
        }
      };
      leitor.readAsDataURL(arquivo);
    });
  }

  const formatarData = (valor) => {
    const partes = String(valor || "").split("-");
    if (partes.length !== 3) {
      return valor || "Data não informada";
    }
    return partes[2] + "/" + partes[1] + "/" + partes[0];
  };

  const linha = (rotulo, valor) => {
    const grupo = document.createElement("div");
    const termo = document.createElement("dt");
    const desc = document.createElement("dd");
    termo.textContent = rotulo;
    desc.textContent = valor;
    grupo.append(termo, desc);
    return grupo;
  };

  const criarCartaz = (dados) => {
    const coluna = document.createElement("div");
    coluna.className = "col-sm-6 col-lg-4 d-flex";
    coluna.dataset.situacao = dados.situacao;

    const artigo = document.createElement("article");
    artigo.className = "cartaz w-100";

    const papel = document.createElement("div");
    papel.className = "cartaz-papel";

    const topo = document.createElement("div");
    topo.className = "cartaz-topo";
    const selo = document.createElement("span");
    const perdido = dados.situacao === "perdido";
    selo.className = "badge " + (perdido ? "bg-danger" : "bg-success");
    selo.textContent = perdido ? "PROCURA-SE" : "ENCONTRADO";
    topo.append(selo);

    const figura = document.createElement("figure");
    figura.className = "cartaz-foto";
    const imagem = document.createElement("img");
    imagem.src = dados.foto;
    imagem.alt = "Foto de " + dados.nome + ", " + dados.raca + ", cor " + dados.cor + ".";
    figura.append(imagem);

    const bloco = document.createElement("div");
    bloco.className = "cartaz-dados";
    const titulo = document.createElement("h2");
    titulo.textContent = dados.nome;
    const lista = document.createElement("dl");
    lista.append(
      linha("Raça e porte", dados.raca),
      linha("Cor", dados.cor),
      linha("Onde", dados.lugar),
      linha("Data", formatarData(dados.data)),
      linha("Observação", dados.obs || "Sem observação")
    );

    const botao = document.createElement("button");
    botao.type = "button";
    botao.className = "btn btn-contato";
    botao.textContent = "Ver Contato do Tutor";
    botao.dataset.bsToggle = "modal";
    botao.dataset.bsTarget = "#modalContato";
    botao.dataset.pet = dados.nome;
    botao.dataset.papel = perdido ? "Tutor" : "Quem encontrou";
    botao.dataset.pessoa = dados.pessoa;
    botao.dataset.telefone = dados.telefone;
    botao.dataset.nota = "Cartaz criado neste navegador. O telefone é ilustrativo e não é enviado a lugar nenhum.";

    bloco.append(titulo, lista, botao);
    papel.append(topo, figura, bloco);
    artigo.append(papel);
    coluna.append(artigo);
    return coluna;
  };

  if (form && grade) {
    const lerFoto = (arquivo) => new Promise((resolver, rejeitar) => {
      const leitor = new FileReader();
      leitor.onload = () => resolver(String(leitor.result || ""));
      leitor.onerror = () => rejeitar(new Error("Não foi possível ler a foto."));
      leitor.readAsDataURL(arquivo);
    });

    form.addEventListener("submit", async (evento) => {
      evento.preventDefault();
      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }

      const arquivo = campoFoto.files && campoFoto.files[0];
      let foto = fotoAtual;
      if (!foto && arquivo) {
        try {
          foto = await lerFoto(arquivo);
        } catch (erro) {
          if (erroFoto) {
            erroFoto.textContent = erro.message;
            erroFoto.classList.remove("d-none");
          }
          return;
        }
      }
      if (!foto) {
        if (erroFoto) {
          erroFoto.textContent = "Anexe uma foto para o cartaz. Ela fica só neste navegador.";
          erroFoto.classList.remove("d-none");
        }
        campoFoto.focus();
        return;
      }

      const campos = form.elements;
      const dados = {
        nome: campos.nome.value.trim(),
        situacao: campos.situacao.value,
        raca: campos.raca.value.trim(),
        cor: campos.cor.value.trim(),
        lugar: campos.lugar.value.trim(),
        data: campos.data.value,
        obs: campos.obs.value.trim(),
        pessoa: campos.pessoa.value.trim(),
        telefone: campos.telefone.value.trim(),
        foto: foto
      };

      grade.prepend(criarCartaz(dados));
      botoesFiltro.forEach((item) => {
        const ativo = item.dataset.filtro === "todos";
        item.classList.toggle("active", ativo);
        item.setAttribute("aria-pressed", ativo ? "true" : "false");
      });
      aplicarFiltro("todos");

      if (avisoPublicado) {
        avisoPublicado.textContent = "Cartaz de " + dados.nome + " publicado no topo do mural.";
        avisoPublicado.classList.remove("d-none");
      }

      form.reset();
      fotoAtual = "";
      preview.classList.add("d-none");
      preview.removeAttribute("src");
      const modal = bootstrap.Modal.getInstance(document.getElementById("modalCadastro"));
      if (modal) {
        modal.hide();
      }
      const novo = grade.querySelector(".cartaz");
      if (novo) {
        novo.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    });
  }

  const modalCadastro = document.getElementById("modalCadastro");
  if (modalCadastro) {
    const definirSituacao = (valor) => {
      const situacao = document.getElementById("situacao");
      if (situacao) {
        situacao.value = valor;
      }
    };

    if (window.location.hash === "#cadastrar" || window.location.hash === "#cadastrar-encontrado") {
      definirSituacao(window.location.hash === "#cadastrar-encontrado" ? "encontrado" : "perdido");
      bootstrap.Modal.getOrCreateInstance(modalCadastro).show();
    }

    document.querySelectorAll("[data-bs-target='#modalCadastro']").forEach((botao) => {
      botao.addEventListener("click", () => {
        definirSituacao("perdido");
      });
    });
  }
})();
