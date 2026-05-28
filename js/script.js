// script.js - ImóveisCo

// -------------------------------------------------------
// Cards — remove bolinhas das listas de detalhes
// -------------------------------------------------------

var cardLists = document.querySelectorAll(".property-card aside ul");
for (var cl = 0; cl < cardLists.length; cl++) {
    cardLists[cl].style.listStyle = "none";
    cardLists[cl].style.padding   = "0";
    cardLists[cl].style.margin    = "0";
}

// -------------------------------------------------------
// Busca por localização — filtra cards em tempo real
// -------------------------------------------------------

function normalizarTexto(texto) {
    return texto
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, ""); // remove acentos
}

var apelidos = {
    "apt":        "apartamento",
    "apto":       "apartamento",
    "ap":         "apartamento",
    "studio":     "studio",
    "kitnet":     "kitnet",
    "kit":        "kitnet",
    "duplex":     "duplex",
    "sp":         "sao paulo",
    "sao paulo":  "sao paulo"
};

var campoBusca = document.getElementById("location-search");

if (campoBusca) {
    campoBusca.addEventListener("input", function () {
        var termoOriginal = this.value.trim();
        var termo = normalizarTexto(termoOriginal);

        // Expande abreviações
        if (apelidos[termo]) {
            termo = apelidos[termo];
        }

        var cards = document.querySelectorAll(".property-card");

        for (var i = 0; i < cards.length; i++) {
            var card = cards[i];
            var li   = card.closest("li");
            if (!li) continue;

            var textoCompleto = normalizarTexto(card.textContent || "");
            var locData       = normalizarTexto(card.dataset.location || "");

            var corresponde =
                textoCompleto.includes(termo) ||
                locData.includes(termo);

            li.style.display = (termo === "" || corresponde) ? "" : "none";
        }
    });
}

// -------------------------------------------------------
// Filtro de preço — atualiza o label e filtra os cards
// -------------------------------------------------------

var slider = document.getElementById("maxPrice");
var labelPreco = document.querySelector("label[for='maxPrice']");

if (slider && labelPreco) {
    // Atualiza o texto enquanto arrasta
    slider.addEventListener("input", function () {
        labelPreco.textContent = "Preço máximo: R$ " + slider.value;
    });
}

// Botão "Aplicar" do modal de filtros
var formFiltros = document.querySelector(".filters-content");

if (formFiltros) {
    formFiltros.addEventListener("submit", function (e) {
        e.preventDefault();

        var precoMax = slider ? parseInt(slider.value) : 9999;
        var cards = document.querySelectorAll(".property-card");

        for (var f = 0; f < cards.length; f++) {
            var precoCard = parseInt(cards[f].dataset.price) || 0;
            var li = cards[f].closest("li");
            if (li) {
                li.style.display = precoCard <= precoMax ? "" : "none";
            }
        }

        // Fecha o modal de filtros
        window.location.hash = "";
    });

    // Botão "Limpar" — mostra todos de volta e reseta o label
    formFiltros.addEventListener("reset", function () {
        setTimeout(function () {
            var cards = document.querySelectorAll(".property-card");
            for (var f = 0; f < cards.length; f++) {
                var li = cards[f].closest("li");
                if (li) li.style.display = "";
            }
            if (labelPreco) {
                labelPreco.textContent = "Preço máximo: R$ 2.000";
            }
        }, 0);
    });
}


// -------------------------------------------------------
// Envia mensagem no chat e adiciona o balão na tela
// -------------------------------------------------------

var formsMensagem = document.querySelectorAll(".message-form");

for (var i = 0; i < formsMensagem.length; i++) {
    formsMensagem[i].addEventListener("submit", function (e) {
        e.preventDefault();

        var input = this.querySelector("input[name='msg']");
        var texto = input.value.trim();

        if (texto === "") return;

        var conversa = this.closest(".conversation");
        var caixaMensagens = conversa.querySelector(".messages");

        var novaMensagem = document.createElement("p");
        novaMensagem.className = "message right";
        novaMensagem.textContent = texto;

        caixaMensagens.appendChild(novaMensagem);
        input.value = "";
        caixaMensagens.scrollTop = caixaMensagens.scrollHeight;
    });
}

// -------------------------------------------------------
// Login — valida, fecha modal e troca botão "Entrar"
// -------------------------------------------------------

var formLogin = document.querySelector("#login form");

if (formLogin) {
    formLogin.addEventListener("submit", function (e) {
        e.preventDefault();

        var email = formLogin.querySelector("input[type='email']").value;
        var senha = formLogin.querySelector("input[type='password']").value;

        if (email === "" || senha === "") {
            alert("Preencha todos os campos!");
            return;
        }

        alert("Login realizado com sucesso!");
        window.location.hash = "";
        localStorage.setItem("logado", "true");
        atualizarBotaoLogin();
    });
}

// Troca o texto do botão "Entrar" no header se já estiver logado
function atualizarBotaoLogin() {
    if (localStorage.getItem("logado") === "true") {
        var botao = document.querySelector("header a.button.secondary");
        if (botao) {
            botao.textContent = "Você já está logado";
            botao.removeAttribute("href");
            botao.style.cursor = "default";
            botao.style.backgroundColor = "#888";
        }
    }
}

// Roda ao carregar a página também
atualizarBotaoLogin();

// -------------------------------------------------------
// Favoritar — troca imagem e salva/remove do localStorage
// -------------------------------------------------------

var checkboxesFavorito = document.querySelectorAll(".favorite-checkbox");

for (var j = 0; j < checkboxesFavorito.length; j++) {
    var checkbox = checkboxesFavorito[j];
    var id = checkbox.id;
    var label = document.querySelector("label[for='" + id + "'].star");

    // Restaura o estado salvo ao carregar a página
    if (localStorage.getItem("fav_" + id) === "true") {
        checkbox.checked = true;
        if (label) {
            label.style.backgroundImage = "url('imagens/coracaoverm.png')";
            label.style.backgroundSize = "cover";
            label.style.backgroundPosition = "center";
        }
    }

    checkbox.addEventListener("change", function () {
        var thisId = this.id;
        var thisLabel = document.querySelector("label[for='" + thisId + "'].star");

        if (this.checked) {
            // Salva e troca para coração vermelho
            localStorage.setItem("fav_" + thisId, "true");
            if (thisLabel) {
                thisLabel.style.backgroundImage = "url('imagens/coracaoverm.png')";
                thisLabel.style.backgroundSize = "cover";
                thisLabel.style.backgroundPosition = "center";
            }
        } else {
            // Remove e volta para imagem original
            localStorage.setItem("fav_" + thisId, "false");
            if (thisLabel) {
                thisLabel.style.backgroundImage = "url('imagens/like.png')";
                thisLabel.style.backgroundSize = "20px";
                thisLabel.style.backgroundPosition = "center";
            }
        }

        // Atualiza a lista de favoritos se estiver na página de favoritos
        if (document.querySelector(".tab-moradias")) {
            renderizarFavoritos();
        }
    });
}

// -------------------------------------------------------
// Favoritos — monta os cards na página favorites.html
// -------------------------------------------------------

// Dados de cada imóvel correspondendo aos IDs da home
var dadosImoveis = {
    "fav-1": {
        titulo: "Apartamento",
        descricao: "Localizado em Diadema, 50m² com quarto mobiliado e ótima iluminação.",
        imagem: "imagens/apartamento.jpg",
        link: "teste1.html#property-1"
    },
    "fav-2": {
        titulo: "Estúdio Favorito",
        descricao: "Estúdio moderno em Vila Olímpia com varanda e suíte privativa.",
        imagem: "imagens/quarto2.jpg",
        link: "teste1.html#property-2"
    },
    "fav-3": {
        titulo: "Kitnet Integrada",
        descricao: "Próximo ao metrô, ideal para estudantes. Excelente isolamento acústico.",
        imagem: "imagens/apartamento.jpg",
        link: "teste1.html#property-1"
    },
    "fav-4": {
        titulo: "Apartamento Duplex",
        descricao: "Espaço amplo com varanda gourmet, armários embutidos e ótima iluminação.",
        imagem: "imagens/quarto2.jpg",
        link: "teste1.html#property-2"
    },
    "fav-5": {
        titulo: "Quarto Individual",
        descricao: "Ambiente limpo, silencioso, mobiliado e com contas inclusas.",
        imagem: "imagens/quarto1.jpg",
        link: "teste1.html#property-1"
    },
    "fav-6": {
        titulo: "Studio Mobiliado",
        descricao: "Condomínio moderno com lavanderia coletiva, academia e portaria 24h.",
        imagem: "imagens/quarto2.jpg",
        link: "teste1.html#property-2"
    }
};

function renderizarFavoritos() {
    var secao = document.querySelector(".tab-moradias");
    if (!secao) return;

    // Esconde todos os artigos que vieram do HTML (fav-1 e fav-2)
    var artigosHTML = secao.querySelectorAll("article:not(.js-fav-card)");
    for (var k = 0; k < artigosHTML.length; k++) {
        artigosHTML[k].style.display = "none";
    }

    // Remove só os cards gerados pelo JS anteriormente para não duplicar
    var cardsGerados = secao.querySelectorAll(".js-fav-card");
    for (var l = 0; l < cardsGerados.length; l++) {
        cardsGerados[l].remove();
    }

    // Adiciona um card para cada imóvel favoritado
    for (var favId in dadosImoveis) {
        if (localStorage.getItem("fav_" + favId) === "true") {
            var imovel = dadosImoveis[favId];

            var artigo = document.createElement("article");
            artigo.className = "js-fav-card";

            // Monta o mesmo HTML que estava originalmente no favorites.html
            artigo.innerHTML =
                "<input type='checkbox' id='" + favId + "-fav' class='favorite-checkbox' checked>" +
                "<label for='" + favId + "-fav' class='star' style=\"background-image:url('imagens/coracaoverm.png');background-size:cover;background-position:center\">" +
                    "<span class='sr-only'>Favoritar</span>" +
                "</label>" +
                "<figure>" +
                    "<img src='" + imovel.imagem + "' alt='" + imovel.titulo + "'>" +
                "</figure>" +
                "<h2>" + imovel.titulo + "</h2>" +
                "<p>" + imovel.descricao + "</p>" +
                "<a href='" + imovel.link + "' class='button'>Ver Detalhes</a>";

            secao.appendChild(artigo);

            // Adiciona o evento de change no checkbox recém-criado
            var novoCheckbox = artigo.querySelector(".favorite-checkbox");
            novoCheckbox.addEventListener("change", function () {
                var thisId = this.id.replace("-fav", "");
                localStorage.setItem("fav_" + thisId, this.checked ? "true" : "false");
                renderizarFavoritos();

                // Sincroniza o checkbox original na home se existir
                var checkboxHome = document.getElementById(thisId);
                if (checkboxHome) checkboxHome.checked = this.checked;
            });
        }
    }
}

// Roda ao carregar a página de favoritos
if (document.querySelector(".tab-moradias")) {
    renderizarFavoritos();
}

// -------------------------------------------------------
// Chat — redireciona o morador para a tela de chat oficial
// -------------------------------------------------------

// Nomes dos moradores que existem no chat.html
// A chave é o id do modal do morador, o valor é o id do radio do chat
var moradorParaConversa = {
    "resident-ana": "conv-ana"
};

// Quando clicar em "Conversar" no modal do morador
var botoesConversar = document.querySelectorAll("a[href='#chat-modal']");

for (var m = 0; m < botoesConversar.length; m++) {
    botoesConversar[m].addEventListener("click", function (e) {
        e.preventDefault();

        // Descobre qual modal de morador está aberto
        var modalAberto = document.querySelector(".modal:target");
        var nomeId = modalAberto ? modalAberto.id : "";

        // Pega o nome do morador pelo h2 do modal
        var nomeEl = modalAberto ? modalAberto.querySelector("h2") : null;
        var nome = nomeEl ? nomeEl.textContent.trim() : "Morador";

        // Salva no localStorage para o chat.html abrir a conversa certa
        localStorage.setItem("abrirConversa", nome.toLowerCase());

        // Vai para a página de chat
        window.location.href = "chat.html";
    });
}

// Ao carregar o chat.html, verifica se tem conversa pra abrir ou criar
if (window.location.pathname.includes("chat")) {
    var nomeParaAbrir = localStorage.getItem("abrirConversa");

    if (nomeParaAbrir) {
        localStorage.removeItem("abrirConversa");

        // Procura se já existe um radio com esse nome
        var radioExistente = document.getElementById("conv-" + nomeParaAbrir);

        if (radioExistente) {
            // Já existe — só abre a conversa
            radioExistente.checked = true;
        } else {
            // Não existe — cria a conversa nova na lista e na área de mensagens
            criarNovaConversa(nomeParaAbrir);
        }
    }
}

function criarNovaConversa(nome) {
    var nomeFormatado = nome.charAt(0).toUpperCase() + nome.slice(1);
    var idRadio = "conv-" + nome;

    // Cria o radio input novo
    var novoRadio = document.createElement("input");
    novoRadio.type = "radio";
    novoRadio.id = idRadio;
    novoRadio.name = "conversation";
    novoRadio.hidden = true;
    novoRadio.checked = true;

    // Adiciona o radio antes da .chat-list
    var chatLayout = document.querySelector(".chat-layout");
    var chatList = document.querySelector(".chat-list");
    chatLayout.insertBefore(novoRadio, chatList);

    // Cria o item na lista de conversas
    var novoItem = document.createElement("label");
    novoItem.setAttribute("for", idRadio);
    novoItem.className = "chat-item";
    novoItem.innerHTML =
        "<span class='chat-avatar'>" +
            "<img src='imagens/user.png' alt='" + nomeFormatado + "'>" +
        "</span>" +
        "<span class='chat-meta'>" +
            "<span class='chat-name'>" + nomeFormatado + "</span>" +
            "<span class='chat-preview'>Nova conversa</span>" +
        "</span>";

    chatList.appendChild(novoItem);

    // Cria a área de conversa
    var novaConversa = document.createElement("article");
    novaConversa.className = "conversation conversation-" + nome;
    novaConversa.innerHTML =
        "<header class='chat-header'>" +
            "<h2>" + nomeFormatado + "</h2>" +
        "</header>" +
        "<div class='messages'>" +
            "<p class='message left'>Olá! Como posso te ajudar?</p>" +
        "</div>" +
        "<form action='#' method='post' class='message-form'>" +
            "<input type='text' name='msg' placeholder='Digite sua mensagem...' required>" +
            "<button type='submit'>Enviar</button>" +
        "</form>";

    var chatContent = document.querySelector(".chat-content");
    chatContent.appendChild(novaConversa);

    // Adiciona a regra de CSS para mostrar a conversa nova via JS direto
    novaConversa.style.display = "flex";
    novaConversa.style.flexDirection = "column";
    novaConversa.style.height = "100%";

    // Quando o radio for marcado, mostra a conversa
    novoRadio.addEventListener("change", function () {
        if (this.checked) {
            novaConversa.style.display = "flex";
        }
    });

    // Adiciona o evento de envio de mensagem na conversa nova
    var formNovo = novaConversa.querySelector(".message-form");
    formNovo.addEventListener("submit", function (e) {
        e.preventDefault();
        var input = this.querySelector("input[name='msg']");
        var texto = input.value.trim();
        if (texto === "") return;

        var caixaMensagens = novaConversa.querySelector(".messages");
        var novaMensagem = document.createElement("p");
        novaMensagem.className = "message right";
        novaMensagem.textContent = texto;
        caixaMensagens.appendChild(novaMensagem);
        input.value = "";
        caixaMensagens.scrollTop = caixaMensagens.scrollHeight;
    });
}

// -------------------------------------------------------
// Navegação — oculta o menu superior; apenas o rodapé navega
// -------------------------------------------------------

var topNav = document.querySelector(".top-nav");
if (topNav) {
    topNav.style.display = "none";
}

// -------------------------------------------------------
// Toolbar — alinha barra de pesquisa e botão Filtros
// -------------------------------------------------------

var toolbar = document.querySelector(".toolbar");
if (toolbar) {
    toolbar.style.display      = "flex";
    toolbar.style.alignItems   = "center";
    toolbar.style.gap          = "12px";
    toolbar.style.padding      = "12px 20px";
}

var searchInput = document.getElementById("location-search");
if (searchInput) {
    searchInput.style.height       = "52px";
    searchInput.style.fontSize     = "1rem";
    searchInput.style.padding      = "0 20px";
    searchInput.style.borderRadius = "10px";
    searchInput.style.flex         = "1";
    searchInput.style.border       = "2px solid #ccc";
    searchInput.style.outline      = "none";
    searchInput.style.boxSizing    = "border-box";
    searchInput.style.alignSelf    = "center";
}

var filtrosBtn = document.querySelector("a[href='#filters-modal']");
if (filtrosBtn) {
    filtrosBtn.textContent         = "Filtros";
    filtrosBtn.style.display       = "inline-flex";
    filtrosBtn.style.alignItems    = "center";
    filtrosBtn.style.justifyContent = "center";
    filtrosBtn.style.height        = "52px";
    filtrosBtn.style.fontSize      = "1rem";
    filtrosBtn.style.padding       = "0 24px";
    filtrosBtn.style.borderRadius  = "10px";
    filtrosBtn.style.whiteSpace    = "nowrap";
    filtrosBtn.style.flexShrink    = "0";
    filtrosBtn.style.alignSelf     = "center";
}

// -------------------------------------------------------
// Header — melhora estética do nome e botão Entrar
// -------------------------------------------------------

var header = document.querySelector("header");
if (header) {
    header.style.display        = "flex";
    header.style.flexDirection  = "column";
    header.style.alignItems     = "center";
    header.style.justifyContent = "center";
    header.style.padding        = "20px 16px";
    header.style.gap            = "12px";
}

var siteTitle = document.querySelector("header h1");
if (siteTitle) {
    siteTitle.style.fontSize      = "3rem";
    siteTitle.style.fontWeight    = "800";
    siteTitle.style.letterSpacing = "1px";
    siteTitle.style.color         = "#ffffff";
    siteTitle.style.textShadow    = "0 2px 6px rgba(0,0,0,0.25)";
    siteTitle.style.textAlign     = "center";
}

var entrarBtn = document.querySelector("header a.button");
if (entrarBtn) {
    entrarBtn.style.padding       = "14px 48px";
    entrarBtn.style.fontSize      = "1.2rem";
    entrarBtn.style.fontWeight    = "600";
    entrarBtn.style.borderRadius  = "8px";
    entrarBtn.style.letterSpacing = "0.5px";
    entrarBtn.style.boxShadow     = "0 3px 10px rgba(0,0,0,0.2)";
    entrarBtn.style.transition    = "transform 0.15s, box-shadow 0.15s";
    entrarBtn.addEventListener("mouseover", function () {
        this.style.transform = "translateY(-2px)";
        this.style.boxShadow = "0 6px 16px rgba(0,0,0,0.25)";
    });
    entrarBtn.addEventListener("mouseout", function () {
        this.style.transform = "translateY(0)";
        this.style.boxShadow = "0 3px 10px rgba(0,0,0,0.2)";
    });
}

// -------------------------------------------------------
// Bottom nav — aumenta a barra e os ícones
// -------------------------------------------------------

var bottomNav = document.getElementById("bottom-nav");
if (bottomNav) {
    bottomNav.style.height    = "90px";
    bottomNav.style.padding   = "0 16px";

    var navUl = bottomNav.querySelector("ul");
    if (navUl) {
        navUl.style.height     = "100%";
        navUl.style.display    = "flex";
        navUl.style.alignItems = "center";
    }

    var navLinks = bottomNav.querySelectorAll("a");
    for (var n = 0; n < navLinks.length; n++) {
        navLinks[n].style.display     = "flex";
        navLinks[n].style.alignItems  = "center";
        navLinks[n].style.padding     = "8px 16px";
    }

    var navIcons = bottomNav.querySelectorAll("img");
    for (var o = 0; o < navIcons.length; o++) {
        navIcons[o].style.width  = "44px";
        navIcons[o].style.height = "44px";
    }
}

// -------------------------------------------------------
// Perfil — aumenta tamanho das informações exibidas
// -------------------------------------------------------

var profileContent = document.querySelector(".profile-content");
if (profileContent) {

    // Título "Informações do Perfil"
    var tituloSecao = profileContent.querySelector("h2:first-of-type");
    if (tituloSecao) {
        tituloSecao.style.fontSize        = "1.8rem";
        tituloSecao.style.fontWeight      = "800";
        tituloSecao.style.color           = "#ffffff";
        tituloSecao.style.textShadow      = "0 2px 8px rgba(0,0,0,0.6)";
        tituloSecao.style.background      = "rgba(26, 46, 90, 0.55)";
        tituloSecao.style.backdropFilter  = "blur(4px)";
        tituloSecao.style.padding         = "10px 24px";
        tituloSecao.style.borderRadius    = "10px";
        tituloSecao.style.display         = "inline-block";
        tituloSecao.style.marginBottom    = "16px";
        tituloSecao.style.letterSpacing   = "0.5px";
    }

    // Nome do usuário dentro do card
    var nomeCard = profileContent.querySelector(".profile-card > h2");
    if (nomeCard) {
        nomeCard.style.fontSize = "1.5rem";
    }

    // Título "Dados do Usuário"
    var tituloInfo = profileContent.querySelector(".profile-info h3");
    if (tituloInfo) {
        tituloInfo.style.fontSize   = "1.1rem";
        tituloInfo.style.fontWeight = "700";
        tituloInfo.style.marginBottom = "8px";
    }

    // Parágrafos de dados do usuário
    var paragrafos = profileContent.querySelectorAll(".profile-info p");
    for (var pi = 0; pi < paragrafos.length; pi++) {
        paragrafos[pi].style.fontSize   = "1rem";
        paragrafos[pi].style.lineHeight = "1.8";
    }
}

// -------------------------------------------------------
// Perfil — atualiza os dados exibidos ao salvar o form
// -------------------------------------------------------

var formPerfil = document.getElementById("profile-form");

if (formPerfil) {
    formPerfil.addEventListener("submit", function (e) {
        e.preventDefault();

        var novoNome        = document.getElementById("edit-name").value;
        var novoEmail       = document.getElementById("edit-email").value;
        var novaIdade       = document.getElementById("edit-age").value;
        var novoGenero      = document.getElementById("edit-gender").value;
        var novaProfissao   = document.getElementById("edit-profession").value;
        var novaLocalizacao = document.getElementById("edit-location").value;
        var novoTelefone    = document.getElementById("edit-phone").value;
        var novaBio         = document.getElementById("edit-bio").value;
        var novoEstadoCivil = document.getElementById("edit-marital").value;
        var novaExperiencia = document.getElementById("edit-experience").value;
        var novosIdiomas    = document.getElementById("edit-languages").value;
        var novaRenda       = document.getElementById("edit-income").value;
        var novosHobbies    = document.getElementById("edit-hobbies").value;

        // Atualiza cada parágrafo do card comparando o texto do strong
        var paragrafos = document.querySelectorAll(".profile-info p");

        for (var p = 0; p < paragrafos.length; p++) {
            var strong = paragrafos[p].querySelector("strong");
            if (!strong) continue;

            var campo = strong.textContent.trim();

            if (campo === "Email:")        paragrafos[p].innerHTML = "<strong>Email:</strong> " + novoEmail;
            if (campo === "Tipo:")         continue; // não tem campo pra editar
            if (campo === "Idade:")        paragrafos[p].innerHTML = "<strong>Idade:</strong> " + novaIdade;
            if (campo === "Gênero:")       paragrafos[p].innerHTML = "<strong>Gênero:</strong> " + novoGenero;
            if (campo === "Profissão:")    paragrafos[p].innerHTML = "<strong>Profissão:</strong> " + novaProfissao;
            if (campo === "Localização:")  paragrafos[p].innerHTML = "<strong>Localização:</strong> " + novaLocalizacao;
            if (campo === "Telefone:")     paragrafos[p].innerHTML = "<strong>Telefone:</strong> " + novoTelefone;
            if (campo === "Bio:")          paragrafos[p].innerHTML = "<strong>Bio:</strong> " + novaBio;
            if (campo === "Estado Civil:") paragrafos[p].innerHTML = "<strong>Estado Civil:</strong> " + novoEstadoCivil;
            if (campo === "Experiência:")  paragrafos[p].innerHTML = "<strong>Experiência:</strong> " + novaExperiencia;
            if (campo === "Idiomas:")      paragrafos[p].innerHTML = "<strong>Idiomas:</strong> " + novosIdiomas;
            if (campo === "Renda:")        paragrafos[p].innerHTML = "<strong>Renda:</strong> " + novaRenda;
            if (campo === "Hobbies:")      paragrafos[p].innerHTML = "<strong>Hobbies:</strong> " + novosHobbies;
        }

        // Atualiza o nome no título do card
        var nomeCard = document.querySelector(".profile-card > h2");
        if (nomeCard) {
            nomeCard.textContent = novoNome;
        }

        // Atualiza a inicial no avatar
        var avatar = document.querySelector(".profile-avatar");
        if (avatar) {
            avatar.textContent = novoNome.charAt(0).toUpperCase();
        }

        alert("Perfil atualizado com sucesso!");

        // Fecha o formulário desmarcando o checkbox que o controla
        var toggle = document.getElementById("edit-profile-toggle");
        if (toggle) {
            toggle.checked = false;
        }
    });
}