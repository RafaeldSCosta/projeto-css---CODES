var cardLists = document.querySelectorAll(".property-card aside ul");
for (var cl = 0; cl < cardLists.length; cl++) {
    cardLists[cl].style.listStyle = "none";
    cardLists[cl].style.padding   = "0";
    cardLists[cl].style.margin    = "0";
}

function normalizarTexto(texto) {
    return texto
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");
}

var slider = document.getElementById("maxPrice");
var labelPreco = document.querySelector("label[for='maxPrice']");

if (slider && labelPreco) {
    slider.addEventListener("input", function () {
        labelPreco.textContent = "Preço máximo: R$ " + slider.value;
    });
}

var formFiltros = document.querySelector(".filters-content");

if (formFiltros) {
    formFiltros.addEventListener("submit", function (e) {
        e.preventDefault();

        var locationInput = document.getElementById("location-search");
        var termoBusca = normalizarTexto(locationInput ? locationInput.value.trim() : "");
        
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

        if (apelidos[termoBusca]) {
            termoBusca = apelidos[termoBusca];
        }

        var precoMax = slider ? parseInt(slider.value) : 9999;
        
        var checkboxesQuartos = document.querySelectorAll("input[name='bedrooms']:checked");
        var arrayQuartos = [];
        for (var c = 0; c < checkboxesQuartos.length; c++) {
            arrayQuartos.push(checkboxesQuartos[c].value);
        }

        var petsFilter = document.querySelector("input[name='pets-filter']:checked").value;
        var gymFilter = document.querySelector("input[name='gym-filter']:checked").value;
        var subwayFilter = document.querySelector("input[name='subway-filter']:checked").value;
        var roommatesFilter = document.querySelector("input[name='roommates-filter']:checked").value;
        var poolFilter = document.querySelector("input[name='pool-filter']:checked").value;

        var cards = document.querySelectorAll(".property-card");

        for (var f = 0; f < cards.length; f++) {
            var card = cards[f];
            var li = card.closest("li");
            if (!li) continue;

            var cPrice = parseInt(card.dataset.price) || 0;
            var cLoc = normalizarTexto(card.dataset.location || "");
            var cText = normalizarTexto(card.textContent || "");
            var cBed = card.dataset.bedrooms || "";
            var cPets = card.dataset.pets || "any";
            var cGym = card.dataset.gym || "any";
            var cSubway = card.dataset.subway || "any";
            var cRoommates = card.dataset.roommates || "any";
            var cPool = card.dataset.pool || "any";

            var matchBusca = (termoBusca === "" || cLoc.includes(termoBusca) || cText.includes(termoBusca));
            var matchPrice = (cPrice <= precoMax);
            
            var matchBed = true;
            if (arrayQuartos.length > 0) {
                var is4Plus = arrayQuartos.includes("4+") && parseInt(cBed) >= 4;
                matchBed = arrayQuartos.includes(cBed) || is4Plus;
            }

            var matchPets = (petsFilter === "any" || cPets === petsFilter);
            var matchGym = (gymFilter === "any" || cGym === gymFilter);
            var matchSubway = (subwayFilter === "any" || cSubway === subwayFilter);
            var matchRoommates = (roommatesFilter === "any" || cRoommates === roommatesFilter);
            var matchPool = (poolFilter === "any" || cPool === poolFilter);

            if (matchBusca && matchPrice && matchBed && matchPets && matchGym && matchSubway && matchRoommates && matchPool) {
                li.style.display = "";
            } else {
                li.style.display = "none";
            }
        }

        window.location.hash = "";
    });

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
atualizarBotaoLogin();

var checkboxesFavorito = document.querySelectorAll(".favorite-checkbox");

for (var j = 0; j < checkboxesFavorito.length; j++) {
    var checkbox = checkboxesFavorito[j];
    var id = checkbox.id;
    var label = document.querySelector("label[for='" + id + "'].star");

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
            localStorage.setItem("fav_" + thisId, "true");
            if (thisLabel) {
                thisLabel.style.backgroundImage = "url('imagens/coracaoverm.png')";
                thisLabel.style.backgroundSize = "cover";
                thisLabel.style.backgroundPosition = "center";
            }
        } else {
            localStorage.setItem("fav_" + thisId, "false");
            if (thisLabel) {
                thisLabel.style.backgroundImage = "url('imagens/like.png')";
                thisLabel.style.backgroundSize = "20px";
                thisLabel.style.backgroundPosition = "center";
            }
        }

        if (document.querySelector(".tab-moradias")) {
            renderizarFavoritos();
        }
    });
}

var dadosImoveis = {
    "fav-1": {
        titulo: "Apartamento Aconchegante",
        vagas: "1 vaga disponível",
        preco: "R$ 1.200/mês",
        bairro: "Diadema",
        tamanho: "50m²",
        descricao: "Localizado em Diadema, este imóvel oferece um quarto bem iluminado. Excelente custo-benefício para quem tem pets e busca um bairro estritamente residencial e tranquilo.",
        imagem: "imagens/apartamento.jpg",
        link: "teste1.html#property-1"
    },
    "fav-2": {
        titulo: "Studio Moderno",
        vagas: "2 vagas disponíveis",
        preco: "R$ 1.500/mês",
        bairro: "Vila Olímpia",
        tamanho: "65m²",
        descricao: "Lindo studio na Vila Olímpia com 65m². Condomínio completo com academia e piscina, além de fácil acesso ao metrô. Ambiente focado e morador atual introvertido.",
        imagem: "imagens/quarto2.jpg",
        link: "teste1.html#property-2"
    },
    "fav-3": {
        titulo: "Kitnet Integrada",
        vagas: "Sem vagas",
        preco: "R$ 1.800/mês",
        bairro: "Vila Mariana",
        tamanho: "40m²",
        descricao: "Na Vila Mariana, 40m² ideais para estudantes. Aceita pets, fica ao lado do metrô e conta com morador extrovertido. Excelente isolamento acústico para os estudos.",
        imagem: "imagens/apartamento.jpg",
        link: "teste1.html#property-3"
    },
    "fav-4": {
        titulo: "Apartamento Duplex",
        vagas: "1 vaga disponível",
        preco: "R$ 2.200/mês",
        bairro: "Pinheiros",
        tamanho: "75m²",
        descricao: "Em Pinheiros (75m²), com 2 quartos e varanda gourmet. Tem academia e proximidade ao metrô. Perfeito para quem gosta de receber visitas.",
        imagem: "imagens/quarto2.jpg",
        link: "teste1.html#property-4"
    },
    "fav-5": {
        titulo: "Quarto Individual",
        vagas: "1 vaga disponível",
        preco: "R$ 1.400/mês",
        bairro: "Bela Vista",
        tamanho: "45m²",
        descricao: "Bela Vista, 45m². Limpo, silencioso e muito perto do metrô. Excelente opção perto do metrô para quem valoriza a própria privacidade e o sossego.",
        imagem: "imagens/quarto1.jpg",
        link: "teste1.html#property-5"
    },
    "fav-6": {
        titulo: "Studio Mobiliado",
        vagas: "2 vagas disponíveis",
        preco: "R$ 1.650/mês",
        bairro: "Santana",
        tamanho: "55m²",
        descricao: "Santana, 55m². Condomínio moderno e cheio de vida na Zona Norte. Infraestrutura conta com academia bem equipada e piscina. O morador atual é animado, gosta de socializar e o espaço aceita pets.",
        imagem: "imagens/quarto2.jpg",
        link: "teste1.html#property-6"
    },
    "fav-7": {
        titulo: "Cobertura Espaçosa",
        vagas: "1 vaga disponível",
        preco: "R$ 2.800/mês",
        bairro: "Moema",
        tamanho: "110m²",
        descricao: "Imóvel de alto padrão com 3 quartos amplos em um dos melhores bairros. Infraestrutura espetacular com piscina, academia de luxo e metrô a 5 minutos. Ideal para quem procura conforto total.",
        imagem: "imagens/apartamento.jpg",
        link: "teste1.html#property-7"
    },
    "fav-8": {
        titulo: "Apartamento Familiar",
        vagas: "2 vagas disponíveis",
        preco: "R$ 1.900/mês",
        bairro: "Tatuapé",
        tamanho: "80m²",
        descricao: "Condomínio clube no Tatuapé com lazer de sobra: piscina ensolarada e academia completa. Os colegas de apartamento são super simpáticos e receptivos. Localização privilegiada ao lado do transporte público.",
        imagem: "imagens/quarto1.jpg",
        link: "teste1.html#property-8"
    },
    "fav-9": {
        titulo: "Apê Prático USP",
        vagas: "1 vaga disponível",
        preco: "R$ 1.100/mês",
        bairro: "Butantã",
        tamanho: "45m²",
        descricao: "Oportunidade econômica focada em universitários e estudantes. Aceita pets, fica extremamente próximo à estação Butantã e possui um ambiente respeitoso com moradores focados nos estudos e mais reservados.",
        imagem: "imagens/quarto2.jpg",
        link: "teste1.html#property-9"
    },
    "fav-10": {
        titulo: "Residencial Arborizado",
        vagas: "1 vaga disponível",
        preco: "R$ 1.700/mês",
        bairro: "Santo Amaro",
        tamanho: "70m²",
        descricao: "Apartamento charmoso em rua arborizada. Tem uma área fitness excelente no prédio e é muito receptivo a animais de estimação. Embora não tenha metrô na porta, o acesso por ônibus é rápido.",
        imagem: "imagens/apartamento.jpg",
        link: "teste1.html#property-10"
    },
    "fav-11": {
        titulo: "Kitnet Clássica",
        vagas: "1 vaga disponível",
        preco: "R$ 1.300/mês",
        bairro: "Ipiranga",
        tamanho: "35m²",
        descricao: "Construção antiga, porém muito bem conservada e charmosa. Região histórica com caminhada rápida até a estação. Perfil do morador atual é bem quieto, respeitando horários de silêncio e leitura.",
        imagem: "imagens/quarto1.jpg",
        link: "teste1.html#property-11"
    },
    "fav-12": {
        titulo: "Amplo Apartamento",
        vagas: "2 vagas disponíveis",
        preco: "R$ 2.500/mês",
        bairro: "Lapa",
        tamanho: "95m²",
        descricao: "Espaço generoso na Lapa, ideal para repúblicas jovens e divertidas. Bairro cheio de vida, próximo aos trilhos de transporte e muito amigável para pets. Sem área de lazer, mas com muito espaço interno.",
        imagem: "imagens/apartamento.jpg",
        link: "teste1.html#property-12"
    },
    "fav-13": {
        titulo: "Studio Central",
        vagas: "1 vaga disponível",
        preco: "R$ 1.550/mês",
        bairro: "Centro",
        tamanho: "40m²",
        descricao: "Viva no coração pulsante de São Paulo! Prédio reformado de ponta a ponta com academia no rooftop e a passos da estação República. Ambiente com pegada totalmente urbana e descolada.",
        imagem: "imagens/quarto2.jpg",
        link: "teste1.html#property-13"
    },
    "fav-14": {
        titulo: "Condomínio Clube",
        vagas: "2 vagas disponíveis",
        preco: "R$ 1.450/mês",
        bairro: "Osasco",
        tamanho: "65m²",
        descricao: "Complexo incrível que oferece tudo sem sair de casa: piscinas imensas, quadras e academia. A vizinhança e os moradores são bastante sociáveis e organizam eventos. Seu pet será muito bem-vindo.",
        imagem: "imagens/apartamento.jpg",
        link: "teste1.html#property-14"
    },
    "fav-15": {
        titulo: "Apartamento Completo",
        vagas: "1 vaga disponível",
        preco: "R$ 2.100/mês",
        bairro: "S. Bernardo do Campo",
        tamanho: "85m²",
        descricao: "Qualidade de vida excelente para o seu dia a dia e home office. Edifício familiar com lazer de clube (piscinas e academia top). Varanda envidraçada maravilhosa e muito espaço para seu cachorro de porte médio.",
        imagem: "imagens/quarto1.jpg",
        link: "teste1.html#property-15"
    },
    "fav-16": {
        titulo: "Quarto Compacto",
        vagas: "1 vaga disponível",
        preco: "R$ 1.250/mês",
        bairro: "Liberdade",
        tamanho: "30m²",
        descricao: "Localização privilegiada a passos do metrô São Joaquim e praças de alimentação orientais. Muito prático para o dia a dia acelerado. Ideal para pessoas mais introspectivas que buscam descanso ao voltar do trabalho.",
        imagem: "imagens/apartamento.jpg",
        link: "teste1.html#property-16"
    }
};

function renderizarFavoritos() {
    var secao = document.querySelector(".tab-moradias");
    if (!secao) return;

    var artigosHTML = secao.querySelectorAll("article:not(.js-fav-card)");
    for (var k = 0; k < artigosHTML.length; k++) {
        artigosHTML[k].style.display = "none";
    }

    var cardsGerados = secao.querySelectorAll(".js-fav-card");
    for (var l = 0; l < cardsGerados.length; l++) {
        cardsGerados[l].remove();
    }

    for (var favId in dadosImoveis) {
        if (localStorage.getItem("fav_" + favId) === "true") {
            var imovel = dadosImoveis[favId];

            var artigo = document.createElement("article");
            artigo.className = "js-fav-card property-card";

            artigo.innerHTML =
                "<fieldset class='favorite-form'>" +
                    "<legend class='visually-hidden'>Favoritar</legend>" +
                    "<input type='checkbox' id='" + favId + "-fav' class='favorite-checkbox' checked>" +
                    "<label for='" + favId + "-fav' class='star' style=\"background-image:url('imagens/coracaoverm.png');background-size:cover;background-position:center\">" +
                        "<span class='sr-only'>Favoritar</span>" +
                    "</label>" +
                "</fieldset>" +
                "<figure>" +
                    "<img src='" + imovel.imagem + "' alt='" + imovel.titulo + "'>" +
                "</figure>" +
                "<h2>" + imovel.titulo + "</h2>" +
                "<p class='vacancies'><small>" + imovel.vagas + "</small></p>" +
                "<h3>" + imovel.preco + "</h3>" +
                "<aside><ul style='list-style:none;padding:0;margin:0;'><li><small>" + imovel.bairro + "</small></li><li><small>" + imovel.tamanho + "</small></li><li><small>São Paulo</small></li></ul></aside>" +
                "<p>" + imovel.descricao + "</p>" +
                "<a href='" + imovel.link + "' class='button'>Ver Detalhes</a>";

            secao.appendChild(artigo);

            var novoCheckbox = artigo.querySelector(".favorite-checkbox");
            novoCheckbox.addEventListener("change", function () {
                var thisId = this.id.replace("-fav", "");
                localStorage.setItem("fav_" + thisId, this.checked ? "true" : "false");
                renderizarFavoritos();

                var checkboxHome = document.getElementById(thisId);
                if (checkboxHome) checkboxHome.checked = this.checked;
            });
        }
    }
}

if (document.querySelector(".tab-moradias")) {
    renderizarFavoritos();
}

function updateChatTabs() {
    var conversations = document.querySelectorAll(".conversation");
    for (var c = 0; c < conversations.length; c++) {
        conversations[c].style.display = "none";
    }
    var checked = document.querySelector("input[name='conversation']:checked");
    if (checked) {
        var nome = checked.id.replace("conv-", "");
        var activeConv = document.querySelector(".conversation-" + nome);
        if (activeConv) {
            activeConv.style.display = "flex";
            activeConv.style.flexDirection = "column";
            activeConv.style.height = "100%";
        }
    }
}

document.addEventListener("change", function (e) {
    if (e.target && e.target.name === "conversation") {
        updateChatTabs();
    }
});

var formsMensagem = document.querySelectorAll(".message-form");

for (var i = 0; i < formsMensagem.length; i++) {
    var conversaArea = formsMensagem[i].closest(".conversation");
    if(conversaArea) {
        var convClass = Array.from(conversaArea.classList).find(c => c.startsWith('conversation-'));
        if(convClass) {
            var saved = localStorage.getItem("chat_history_" + convClass);
            if(saved) {
                conversaArea.querySelector(".messages").innerHTML = saved;
            }
        }
    }

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

        var classC = Array.from(conversa.classList).find(c => c.startsWith('conversation-'));
        if(classC) {
            localStorage.setItem("chat_history_" + classC, caixaMensagens.innerHTML);
        }
    });
}

var botoesEnviarMensagem = document.querySelectorAll(".btn-enviar-mensagem");

for (var b = 0; b < botoesEnviarMensagem.length; b++) {
    botoesEnviarMensagem[b].addEventListener("click", function (e) {
        e.preventDefault();
        var modal = this.closest(".modal-content");
        var nomeEl = modal ? modal.querySelector(".resident-name") : null;
        var nome = nomeEl ? nomeEl.textContent.trim() : "Morador";
        
        if (nome === "Morador") {
            var modalId = modal.parentElement.id;
            if (modalId === "resident-ana") nome = "Ana";
            else if (modalId === "resident-bruno") nome = "Bruno";
            else if (modalId === "resident-carla") nome = "Carla";
            else if (modalId === "resident-diego") nome = "Diego";
            else if (modalId === "resident-elena") nome = "Elena";
        }
        
        localStorage.setItem("abrirConversa", nome.toLowerCase());
        window.location.href = "chat.html";
    });
}

if (window.location.pathname.includes("chat")) {
    for (var i = 0; i < localStorage.length; i++) {
        var key = localStorage.key(i);
        if (key && key.startsWith("chat_history_conversation-")) {
            var nomeSalvo = key.replace("chat_history_conversation-", "");
            var radioExistente = document.getElementById("conv-" + nomeSalvo);
            if (!radioExistente) {
                criarNovaConversa(nomeSalvo);
            }
        }
    }

    var nomeParaAbrir = localStorage.getItem("abrirConversa");
    if (nomeParaAbrir) {
        localStorage.removeItem("abrirConversa");
        var radioE = document.getElementById("conv-" + nomeParaAbrir);
        if (radioE) {
            radioE.checked = true;
        } else {
            criarNovaConversa(nomeParaAbrir);
            var novoRadio = document.getElementById("conv-" + nomeParaAbrir);
            if(novoRadio) novoRadio.checked = true;
        }
    }
    updateChatTabs();
}

function criarNovaConversa(nome) {
    var nomeFormatado = nome.charAt(0).toUpperCase() + nome.slice(1);
    var idRadio = "conv-" + nome;

    var novoRadio = document.createElement("input");
    novoRadio.type = "radio";
    novoRadio.id = idRadio;
    novoRadio.name = "conversation";
    novoRadio.hidden = true;

    var chatLayout = document.querySelector(".chat-layout");
    var chatList = document.querySelector(".chat-list");
    if(!chatLayout || !chatList) return;
    
    chatLayout.insertBefore(novoRadio, chatList);

    var novoItem = document.createElement("label");
    novoItem.setAttribute("for", idRadio);
    novoItem.className = "chat-item";
    novoItem.innerHTML =
        "<span class='chat-avatar' style='background:#003366;color:white;font-size:24px;'>" + nomeFormatado.charAt(0) + "</span>" +
        "<span class='chat-meta'>" +
            "<span class='chat-name'>" + nomeFormatado + "</span>" +
            "<span class='chat-preview'>Conversa salva</span>" +
        "</span>";
    chatList.appendChild(novoItem);

    var novaConversa = document.createElement("article");
    novaConversa.className = "conversation conversation-" + nome;
    novaConversa.innerHTML =
        "<header class='chat-header'><h2>" + nomeFormatado + "</h2></header>" +
        "<div class='messages'><p class='message left'>Olá! Como posso te ajudar?</p></div>" +
        "<form action='#' method='post' class='message-form'>" +
            "<input type='text' name='msg' placeholder='Digite sua mensagem...' required>" +
            "<button type='submit'>Enviar</button>" +
        "</form>";

    var chatContent = document.querySelector(".chat-content");
    chatContent.appendChild(novaConversa);

    var saved = localStorage.getItem("chat_history_conversation-" + nome);
    if(saved) {
        novaConversa.querySelector(".messages").innerHTML = saved;
    }

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

        localStorage.setItem("chat_history_conversation-" + nome, caixaMensagens.innerHTML);
    });
}

var topNav = document.querySelector(".top-nav");
if (topNav) topNav.style.display = "none";

var toolbar = document.querySelector(".toolbar");
if (toolbar) {
    toolbar.style.display      = "flex";
    toolbar.style.alignItems   = "center";
    toolbar.style.gap          = "12px";
    toolbar.style.padding      = "12px 20px";
}

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

var profileContent = document.querySelector(".profile-content");
if (profileContent) {
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
    }
    var nomeCard = profileContent.querySelector(".profile-card > h2");
    if (nomeCard) nomeCard.style.fontSize = "1.5rem";

    var paragrafos = profileContent.querySelectorAll(".profile-info p");
    for (var pi = 0; pi < paragrafos.length; pi++) {
        paragrafos[pi].style.fontSize   = "1rem";
        paragrafos[pi].style.lineHeight = "1.8";
    }
}

var formPerfil = document.getElementById("profile-form");
if (formPerfil) {
    formPerfil.addEventListener("submit", function (e) {
        e.preventDefault();

        var inputNome = document.getElementById("edit-name");
        var novoNome        = inputNome ? inputNome.value : "Rafael"; 
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

        var paragrafos = document.querySelectorAll(".profile-info p");

        for (var p = 0; p < paragrafos.length; p++) {
            var strong = paragrafos[p].querySelector("strong");
            if (!strong) continue;

            var campo = strong.textContent.trim();
            if (campo === "Email:")        paragrafos[p].innerHTML = "<strong>Email:</strong> " + novoEmail;
            if (campo === "Tipo:")         continue;
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

        var nomeCard = document.querySelector(".profile-card > h2");
        if (nomeCard) nomeCard.textContent = novoNome;

        var avatar = document.querySelector(".profile-avatar");
        if (avatar) avatar.textContent = novoNome.charAt(0).toUpperCase();

        alert("Perfil atualizado com sucesso!");
        var toggle = document.getElementById("edit-profile-toggle");
        if (toggle) toggle.checked = false;
    });
}