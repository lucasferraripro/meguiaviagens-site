/* ═══════════════════════════════════════════════════════════════
   DATABASE.JS — Me Guia Viagens
   Fonte única de verdade para todos os pacotes.
   Carregue este arquivo ANTES de index.html e pacote.html renderizarem.
═══════════════════════════════════════════════════════════════ */

/* ── DADOS DA AGÊNCIA ── */
const SITE = {
    nome:      'Me Guia Viagens',
    whatsapp:  '5542991311225',
    email:     'contato@meguiaviagens.com.br',
    tel:       'Consulte pelo WhatsApp'
};

/* ── THUMB MAP — imagens dos cards na home ── */
const THUMB = {
    fortaleza:     'https://i0.wp.com/bonitour.com.br/wp-content/uploads/2024/02/Jericoacoara-Pedra-Furada-creditos_-Rudimencial-Getty-Images.webp?fit=960%2C600&ssl=1',
    orlando:       'https://admin.cnnbrasil.com.br/wp-content/uploads/sites/12/2022/09/disney-novidades-2023.webp?w=1200&h=1200&crop=1',
    olimpia:       'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=700&q=80',
    lasvegas:      'https://images.unsplash.com/photo-1605833556294-ea5c7a74f57d?auto=format&fit=crop&w=700&q=80',
    portogalinhas: 'https://www.viajenaviagem.com/wp-content/uploads/2024/02/letreiro-porto-de-galinhas-16x9-1.jpg.webp',
    cancun:        'https://images.unsplash.com/photo-1552074284-5e88ef1aef18?auto=format&fit=crop&w=700&q=80'
};

/* ── BANCO DE DADOS DOS PACOTES ── */
const DB = {

    fortaleza: {
        category:    'nacional',
        title:       'Fortaleza & Jericoacoara',
        subtitle:    'Sol, praias e dunas douradas do Nordeste',
        location:    'Ceará, Brasil',
        duration:    '7 dias / 6 noites',
        price:       '2.190,00',
        priceCartao: '2.190,00',
        parcelas:    '10x de R$ 219,00 sem juros',
        flag:        'Brasil 🇧🇷',
        badge:       '🔥 Oferta',
        dates:       '📅 Consulte disponibilidade · 1 pessoa',
        images: [
            'https://i0.wp.com/bonitour.com.br/wp-content/uploads/2024/02/Jericoacoara-Pedra-Furada-creditos_-Rudimencial-Getty-Images.webp?fit=960%2C600&ssl=1',
            'https://images.unsplash.com/photo-1505118380757-91f5f5632de0?auto=format&fit=crop&w=1200&q=80',
            'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=1200&q=80'
        ],
        desc: 'Fortaleza é o portão de entrada para um dos Nordestes mais vibrantes e coloridos do Brasil. Praias de águas mornas, dunas que se confundem com o horizonte e uma gastronomia que encanta todo paladar. E logo ali, Jericoacoara — eleita uma das mais belas praias do mundo — com seu pôr do sol sobre a duna e a lagoa do paraíso que parece um espelho refletindo o céu. Uma experiência que transforma.',
        incluso: [
            'Passagem aérea ida e volta',
            'Transfer aeroporto–hotel em Fortaleza',
            'Transfer Fortaleza–Jericoacoara (van ou buggy)',
            'Hospedagem 6 noites com café da manhã',
            'Passeio à Lagoa do Paraíso',
            'Passeio de buggy pelas dunas',
            'City tour por Fortaleza',
            'Guia local especializado'
        ],
        nao_incluso: ['Seguro viagem', 'Almoços e jantares', 'Passeios opcionais', 'Gorjetas'],
        roteiro: [
            { dia: '1º Dia', title: 'Chegada a Fortaleza', desc: 'Desembarque no aeroporto e transfer para o hotel na Praia do Futuro ou Meireles. Check-in e primeiro contato com o Nordeste.' },
            { dia: '2º Dia', title: 'City Tour Fortaleza', desc: 'Visita ao Mercado Central, Catedral, Dragão do Mar e Praia de Iracema. À tarde, Praia do Futuro com barracas e a famosa tapioca.' },
            { dia: '3º Dia', title: 'Praias do Litoral Leste', desc: 'Excursão para Aquiraz, Prainha, Iguape e Porto das Dunas. Piscinas naturais e águas cristalinas.' },
            { dia: '4º Dia', title: 'Transfer para Jericoacoara', desc: 'Viagem até Jeri (aprox. 4h). Check-in na pousada. Tarde livre para explorar o vilarejo e assistir ao pôr do sol na duna.' },
            { dia: '5º Dia', title: 'Lagoa do Paraíso', desc: 'Passeio imperdível à Lagoa do Paraíso — águas transparentes entre dunas douradas. Um dos cenários mais lindos do Brasil.' },
            { dia: '6º Dia', title: 'Dunas e Lagoa Azul', desc: 'Passeio de buggy pelas dunas de Jericoacoara até a Lagoa Azul e Lagoa da Torta. Tarde livre na praia.' },
            { dia: '7º Dia', title: 'Retorno', desc: 'Café da manhã, transfer de volta a Fortaleza e embarque para casa cheio de areia, sorrisos e memórias do Nordeste.' }
        ]
    },

    orlando: {
        category:    'internacional',
        title:       'Orlando & Disney',
        subtitle:    'A magia que toda família merece viver',
        location:    'Orlando, Florida, EUA',
        duration:    '9 dias / 8 noites',
        price:       '8.900,00',
        priceCartao: '8.900,00',
        parcelas:    '10x de R$ 890,00 sem juros',
        flag:        'EUA 🇺🇸',
        badge:       '⭐ Popular',
        dates:       '📅 Consulte disponibilidade · 1 pessoa',
        images: [
            'https://admin.cnnbrasil.com.br/wp-content/uploads/sites/12/2022/09/disney-novidades-2023.webp?w=1200&h=1200&crop=1',
            'https://images.unsplash.com/photo-1576502200916-3808e07386a5?auto=format&fit=crop&w=1200&q=80',
            'https://images.unsplash.com/photo-1622468696594-fc5d43b9b2c5?auto=format&fit=crop&w=1200&q=80'
        ],
        desc: 'Realize o sonho da família inteira no maior complexo de parques temáticos do mundo! Magic Kingdom, EPCOT, Hollywood Studios e Animal Kingdom — quatro mundos de magia e diversão que encantam crianças e adultos. A Me Guia cuida de cada detalhe: desde os melhores assentos no avião e os horários ideais das conexões até a escolha do hotel ideal para a sua família.',
        incluso: [
            'Passagem aérea internacional ida e volta',
            'Transfer aeroporto–hotel',
            'Hospedagem 8 noites (hotel indicado pela Aline)',
            'Ingressos 4 parques Disney (Park Hopper)',
            'Orientação pré-viagem completa',
            'Estratégia com milhas para upgrade de assento',
            'Suporte da Me Guia durante toda a viagem'
        ],
        nao_incluso: ['Seguro viagem (fortemente recomendado)', 'Refeições nos parques', 'Universal Studios e Sea World (opcionais)', 'Visto americano (auxílio disponível)', 'Gorjetas'],
        roteiro: [
            { dia: '1º Dia', title: 'Chegada em Orlando', desc: 'Desembarque no aeroporto internacional de Orlando, transfer para o hotel. Check-in e tarde livre para descanso e adaptação.' },
            { dia: '2º Dia', title: 'Magic Kingdom', desc: 'O parque mais famoso do mundo! Cinderella Castle, Space Mountain, Haunted Mansion e o espetáculo de fogos da noite.' },
            { dia: '3º Dia', title: 'EPCOT', desc: 'Future World com atrações tecnológicas incríveis e World Showcase com gastronomia e cultura de 11 países em um só lugar.' },
            { dia: '4º Dia', title: 'Hollywood Studios', desc: "Galaxy's Edge (Star Wars), Toy Story Land, Tower of Terror e os shows incríveis." },
            { dia: '5º Dia', title: 'Animal Kingdom', desc: 'O parque da natureza e dos animais. Pandora — The World of Avatar, safari ao vivo com animais reais e shows imperdíveis.' },
            { dia: '6º Dia', title: 'Universal Studios', desc: 'Harry Potter, Transformers, Jurassic World, Minions — um dia de diversão pura no parque que rivaliza com a Disney.' },
            { dia: '7º Dia', title: 'Sea World + Dia Livre', desc: 'Manhã no Sea World com shows de orcas, golfinhos e montanhas-russas aquáticas. Tarde livre para descanso.' },
            { dia: '8º Dia', title: 'Disney Springs & Compras', desc: 'Manhã no Disney Springs para últimas compras, souvenirs e restaurantes temáticos.' },
            { dia: '9º Dia', title: 'Retorno ao Brasil', desc: 'Transfer ao aeroporto e voo de retorno com a família cheia de memórias, histórias e fotos que vão durar a vida toda.' }
        ]
    },

    olimpia: {
        category:    'nacional',
        title:       'Olímpia — Hot Park Resort',
        subtitle:    'O resort aquático mais completo do Brasil',
        location:    'Olímpia, São Paulo',
        duration:    '4 dias / 3 noites',
        price:       '1.890,00',
        priceCartao: '1.890,00',
        parcelas:    '10x de R$ 189,00 sem juros',
        flag:        'Brasil 🇧🇷',
        badge:       '🔥 Oferta',
        dates:       '📅 Consulte disponibilidade · 1 pessoa',
        images: [
            'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=1200&q=80',
            'https://images.unsplash.com/photo-1564501049412-61c2a3083791?auto=format&fit=crop&w=1200&q=80',
            'https://images.unsplash.com/photo-1540541338537-57e79de23a13?auto=format&fit=crop&w=1200&q=80'
        ],
        desc: 'Olímpia é a capital do turismo de lazer do interior de São Paulo, e o Hot Park é o coração dela. Mais de 60 atrações aquáticas, piscinas de ondas, toboáguas radicais e piscinas termais com águas que brotam naturalmente quentes da terra. Perfeito para famílias com crianças que vão ficar encantadas com as dependências do resort.',
        incluso: [
            'Hospedagem 3 noites em resort de categoria',
            'Pensão completa (café, almoço e jantar)',
            'Ingresso ao Hot Park (incluso nos resorts parceiros)',
            'Acesso às atrações aquáticas e piscinas termais',
            'Entretenimento noturno do resort',
            'Transfer receptivo local'
        ],
        nao_incluso: ['Passagem (opcional: organizamos o traslado)', 'Seguro viagem', 'Consumações extras', 'Gorjetas'],
        roteiro: [
            { dia: '1º Dia', title: 'Chegada a Olímpia', desc: 'Check-in no resort, conhecer as instalações e primeiras horas de diversão nas piscinas termais. Jantar incluído.' },
            { dia: '2º Dia', title: 'Hot Park — Dia Completo', desc: 'Dia inteiro no Hot Park com mais de 60 atrações. Toboáguas radicais, piscina de ondas, piscinas termais e rio lento.' },
            { dia: '3º Dia', title: 'Parque e Lazer Livre', desc: 'Manhã livre no resort desfrutando das piscinas. Tarde de lazer e relaxamento. Jantar especial com animação.' },
            { dia: '4º Dia', title: 'Check-out e Retorno', desc: 'Café da manhã reforçado, check-out com calma e retorno para casa com a família descansada e feliz.' }
        ]
    },

    lasvegas: {
        category:    'internacional',
        title:       'Las Vegas + Los Angeles',
        subtitle:    'A costa oeste americana em uma viagem única',
        location:    'Nevada & Califórnia, EUA',
        duration:    '10 dias / 9 noites',
        price:       '9.490,00',
        priceCartao: '9.490,00',
        parcelas:    '10x de R$ 949,00 sem juros',
        flag:        'EUA 🇺🇸',
        badge:       '💎 Premium',
        dates:       '📅 Consulte disponibilidade · 1 pessoa',
        images: [
            'https://images.unsplash.com/photo-1605833556294-ea5c7a74f57d?auto=format&fit=crop&w=1200&q=80',
            'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=1200&q=80',
            'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?auto=format&fit=crop&w=1200&q=80'
        ],
        desc: 'Uma das combinações mais épicas para quem quer ver os EUA de verdade: a adrenalina e o glamour de Las Vegas com a elegância californiana de Los Angeles. Shows mundiais na Strip, o Grand Canyon logo ali, a Santa Mônica Pier, Hollywood Boulevard, Beverly Hills e o pôr do sol na Pacific Coast Highway.',
        incluso: [
            'Passagem aérea internacional ida e volta',
            'Transfer aeroporto–hotel em Las Vegas',
            'Transfer Las Vegas–Los Angeles (voo ou ônibus panorâmico)',
            'Hospedagem 9 noites (4 em Las Vegas + 5 em LA)',
            'City tour Las Vegas Strip',
            'Excursão ao Grand Canyon (opcional)',
            'City tour Los Angeles: Hollywood, Beverly Hills, Santa Mônica',
            'Estratégia com milhas para upgrade de assento'
        ],
        nao_incluso: ['Seguro viagem', 'Almoços e jantares', 'Shows em Las Vegas', 'Visto americano (auxílio disponível)', 'Gorjetas'],
        roteiro: [
            { dia: '1º Dia', title: 'Chegada em Las Vegas', desc: 'Desembarque e transfer para hotel na Strip. Primeiro passeio pela famosa Las Vegas Boulevard à noite.' },
            { dia: '2º Dia', title: 'Las Vegas Strip', desc: 'Dia explorando os cassinos temáticos mais famosos do mundo: Bellagio, Venetian, Caesars Palace e mais.' },
            { dia: '3º Dia', title: 'Grand Canyon', desc: 'Excursão imperdível ao Grand Canyon — uma das 7 maravilhas naturais do mundo.' },
            { dia: '4º Dia', title: 'Fremont Street & Dia Livre', desc: 'Manhã na histórica Fremont Street com o show de luzes. Tarde livre para compras ou cassinos.' },
            { dia: '5º Dia', title: 'Chegada em Los Angeles', desc: 'Transfer para Los Angeles. Check-in no hotel. Primeira tarde em Santa Mônica.' },
            { dia: '6º Dia', title: 'Hollywood & Beverly Hills', desc: 'Hollywood Boulevard (Calçada da Fama), Letreiro Hollywood, Beverly Hills e Rodeo Drive.' },
            { dia: '7º Dia', title: 'Universal Studios LA', desc: 'Dia no Universal Studios Hollywood com Harry Potter World, Jurassic Park, Fast & Furious e muito mais.' },
            { dia: '8º Dia', title: 'Venice Beach & Marina del Rey', desc: 'Manhã na artística Venice Beach, famosa pelos grafites, malabaristas e o calçadão à beira-mar.' },
            { dia: '9º Dia', title: 'Griffith Park & Compras', desc: 'Vista panorâmica de LA do Observatório Griffith Park. Tarde no The Grove ou Melrose Avenue.' },
            { dia: '10º Dia', title: 'Retorno ao Brasil', desc: 'Transfer ao aeroporto de Los Angeles e embarque de volta para o Brasil com histórias incríveis para contar.' }
        ]
    },

    portogalinhas: {
        category:    'nacional',
        title:       'Porto de Galinhas',
        subtitle:    'A melhor praia do Brasil eleita por viajantes',
        location:    'Pernambuco, Brasil',
        duration:    '6 dias / 5 noites',
        price:       '2.890,00',
        priceCartao: '2.890,00',
        parcelas:    '10x de R$ 289,00 sem juros',
        flag:        'Brasil 🇧🇷',
        badge:       '⭐ Popular',
        dates:       '📅 Consulte disponibilidade · 1 pessoa',
        images: [
            'https://www.viajenaviagem.com/wp-content/uploads/2024/02/letreiro-porto-de-galinhas-16x9-1.jpg.webp',
            'https://images.unsplash.com/photo-1437482078695-73f5ca6c96e2?auto=format&fit=crop&w=1200&q=80',
            'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80'
        ],
        desc: 'Eleita diversas vezes a melhor praia do Brasil, Porto de Galinhas encanta com suas famosas piscinas naturais formadas nos recifes de coral — onde é possível nadar entre peixinhos coloridos em águas rasas, mornas e cristalinas. Romântica para casais, maravilhosa para famílias, simplesmente inesquecível para todos.',
        incluso: [
            'Passagem aérea ida e volta',
            'Transfer Recife–Porto de Galinhas (privativo)',
            'Hospedagem 5 noites com café da manhã',
            'Passeio de jangada nas piscinas naturais',
            'Snorkel incluso no passeio',
            'Passeio a Muro Alto e Lagoa de Muro Alto',
            'Passeio a Praia dos Carneiros'
        ],
        nao_incluso: ['Seguro viagem', 'Almoços e jantares', 'Mergulho com cilindro (opcional)', 'Gorjetas'],
        roteiro: [
            { dia: '1º Dia', title: 'Chegada ao Recife', desc: 'Desembarque no Recife e transfer privativo para Porto de Galinhas (70km). Check-in e primeira caminhada pela orla ao pôr do sol.' },
            { dia: '2º Dia', title: 'Piscinas Naturais de Jangada', desc: 'Passeio de jangada até as famosas piscinas naturais nos recifes. Nadar com peixinhos coloridos em águas rasas e cristalinas.' },
            { dia: '3º Dia', title: 'Muro Alto e Maracaípe', desc: 'Passeio à deslumbrante Lagoa de Muro Alto e Maracaípe, famosa pelo surf e caranguejos.' },
            { dia: '4º Dia', title: 'Praia dos Carneiros', desc: 'Excursão para a romântica Praia dos Carneiros com passeio de barco e visita à charmosa igrejinha à beira-mar.' },
            { dia: '5º Dia', title: 'Dia Livre', desc: 'Dia livre para revisitar as piscinas favoritas, alugar buggys, fazer compras nas lojas da vila ou só descansar.' },
            { dia: '6º Dia', title: 'Retorno ao Recife', desc: 'Transfer para o Recife e embarque de volta com muitas memórias e saudades das mais belas piscinas do Brasil.' }
        ]
    },

    cancun: {
        category:    'internacional',
        title:       'Cancún All Inclusive',
        subtitle:    'Paraíso caribenho com tudo pago',
        location:    'Cancún, México',
        duration:    '7 dias / 6 noites',
        price:       '5.990,00',
        priceCartao: '5.990,00',
        parcelas:    '10x de R$ 599,00 sem juros',
        flag:        'México 🇲🇽',
        badge:       '🔥 Oferta',
        dates:       '📅 Consulte disponibilidade · 1 pessoa',
        images: [
            'https://images.unsplash.com/photo-1552074284-5e88ef1aef18?auto=format&fit=crop&w=1200&q=80',
            'https://images.unsplash.com/photo-1510097467424-192d713fd8b2?auto=format&fit=crop&w=1200&q=80',
            'https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format&fit=crop&w=1200&q=80'
        ],
        desc: 'Cancún é o destino perfeito para quem quer relaxar com tudo incluído no Caribe Mexicano. Praias de areia branca como talco, águas turquesa de tirar o fôlego, resorts 5 estrelas com comida e bebida ilimitadas, shows, entretenimento e excursões incríveis às ruínas maias de Chichén Itzá e Tulum.',
        incluso: [
            'Passagem aérea internacional ida e volta',
            'Transfer aeroporto–resort',
            'Hospedagem 6 noites no regime All Inclusive',
            'Alimentação e bebidas ilimitadas no resort',
            'Entretenimento diurno e noturno no resort',
            'Excursão a Isla Mujeres (barco)',
            'Estratégia com milhas para voo com desconto'
        ],
        nao_incluso: ['Seguro viagem', 'Excursão Chichén Itzá (opcional)', 'Excursão Tulum (opcional)', 'Passeios fora do resort', 'Gorjetas (recomendado)'],
        roteiro: [
            { dia: '1º Dia', title: 'Chegada em Cancún', desc: 'Desembarque no aeroporto internacional e transfer para o resort. Check-in e primeiras horas em um dos mais belos litorais do mundo.' },
            { dia: '2º Dia', title: 'Praia e Resort', desc: 'Dia inteiro usufruindo do resort all inclusive: praia de areia branca, piscinas, esportes aquáticos e drinks ilimitados.' },
            { dia: '3º Dia', title: 'Isla Mujeres', desc: 'Excursão de barco para a encantadora Ilha das Mulheres. Snorkel em recifes de coral, praias paradisíacas e village charmoso.' },
            { dia: '4º Dia', title: 'Chichén Itzá (opcional)', desc: 'Excursão para uma das 7 maravilhas do mundo moderno. A pirâmide maia de Kukulcán e a história da civilização.' },
            { dia: '5º Dia', title: 'Tulum (opcional)', desc: 'Ruínas maias com vista para o mar caribenho — único sítio arqueológico com vista para o Caribe.' },
            { dia: '6º Dia', title: 'Dia Livre no Resort', desc: 'Último dia de relaxamento total. Praia, piscina, spa e os sabores da culinária mexicana e internacional do resort.' },
            { dia: '7º Dia', title: 'Retorno ao Brasil', desc: 'Transfer ao aeroporto e voo de retorno do Caribe com a pele bronzeada, o coração cheio e muita vontade de voltar.' }
        ]
    }

};

/* ═══════════════════════════════════════════════════════════════
   mergeCMS — aplica overrides do admin ao DB
   Garante que edições do admin sincronizem entre home e pacote.html
═══════════════════════════════════════════════════════════════ */
(function mergeCMS() {
    const CMS_KEY = 'meguia_cms_v1';

    try {
        const draft = JSON.parse(localStorage.getItem(CMS_KEY) || '{}');

        // 1. Aplica overrides de preço/título editados pelo admin
        if (draft.__db_overrides) {
            Object.entries(draft.__db_overrides).forEach(([pkgId, ov]) => {
                if (DB[pkgId]) Object.assign(DB[pkgId], ov);
            });
        }

        // 2. Adiciona pacotes novos criados pelo admin
        if (draft.__new_packages) {
            Object.entries(draft.__new_packages).forEach(([id, pkg]) => {
                if (!pkg.category) pkg.category = 'nacional';
                DB[id] = pkg;
            });
        }

        // 3. Aplica overrides publicados no servidor
        const srv = window.__SRV_CMS;
        if (srv) {
            if (srv.__db_overrides) {
                Object.entries(srv.__db_overrides).forEach(([pkgId, ov]) => {
                    if (DB[pkgId]) Object.assign(DB[pkgId], ov);
                });
            }
            if (srv.__new_packages) {
                Object.entries(srv.__new_packages).forEach(([id, pkg]) => {
                    if (!pkg.category) pkg.category = 'nacional';
                    DB[id] = pkg;
                });
            }
        }
    } catch (_) {}
})();
