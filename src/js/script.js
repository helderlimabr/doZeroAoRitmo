const btnMenu = document.querySelector('.fa-bars')
const container = document.querySelector('.container')
const listaMusicas = document.querySelector('#playerlist')
const infoMusica = document.querySelector('.info')
const tituloAtual = document.querySelector('.titulo-atual')
const capaAlbum = document.querySelector('.capa-album')
const btnPlayPause = document.querySelector('#play')
const btnPassar = document.querySelector('#passar')
const btnVoltar = document.querySelector('#voltar')
const duracaoEl = document.querySelector('.duracao')
const tempoCorrenteEl = document.querySelector('.tempo-corrente')
const pontoBarra = document.querySelector('.ponto')
const barraProgresso = document.querySelector('.barra-progresso')

btnMenu.addEventListener('click', () => {
    container.classList.toggle('active')
})

let tocando = false
let tocandoAgora = 0
let rondon = false
let repeat = false
let favoritas = []
let musica = new Audio()

const musicas = [
    {
        titulo: 'Tenha Fé',
        artista: 'Os Originais do Samba',
        img_capa: 'src/sounds/os_originais_do_samba/os_originais_do_samba_org.jpg',
        arquivo: 'src/sounds/os_originais_do_samba/tenha_fe.mp3',
    },
    {
        titulo: 'Undo',
        artista: 'Dirty Loops',
        img_capa: 'src/sounds/dirty_loops/dirty_loops.jpg',
        arquivo: 'src/sounds/dirty_loops/undo.mp3',
    },
    {
        titulo: 'Um Sonho de Amor',
        artista: 'Limão com Mel',
        img_capa: 'src/sounds/limao_com_mel/limao_com_mel.jpg',
        arquivo: 'src/sounds/limao_com_mel/um_sonho_de_amor.mp3',
    },
]

function init() {
    atualizaListaDeMusicas(musicas)
    carregaMusica(tocandoAgora)
}

init()

function atualizaListaDeMusicas(musicas) {
    listaMusicas.innerHTML = ""

    musicas.forEach((musica, indice) => {
        const titulo = musica.titulo
        const arquivo = musica.arquivo
        const duracao = formataTempo(musica.duration)

        const tr = document.createElement('tr')

        tr.innerHTML = `
            <tr>
                <td class="numero">
                    <h5>${indice + 1}</h5>
                </td>
                <td class="titulo">
                    <h6>${titulo}</h6>
                </td>
                <td class="tempo">
                    <h5></h5>
                </td>
                <td class="tempo">
                    <i class="fas fa-heart"></i>
                </td>
            </tr>        
        `
        listaMusicas.appendChild(tr)

        tr.addEventListener('click', () => {
            carregaMusica(indice)
            musica.play
            container.classList.remove('active')
            btnPlayPause.classList.replace('fa-play', 'fa-pause')
            tocando = true
        })

        const duracaoMusica = new Audio(`${arquivo}`)
        duracaoMusica.addEventListener('loadedmetadata', () => {
            const duracao = duracaoMusica.duration
            tr.querySelector('.tempo h5').innerHTML = formataTempo(duracao)
        })
    })
}

function formataTempo(tempo){
    let minutos = Math.floor(tempo / 60)
    let segundos = Math.floor(tempo % 60)
    segundos = segundos < 10 ? `0${segundos}` : segundos
    return `${minutos}:${segundos}`
}

function carregaMusica(indiceMusica) {
    infoMusica.innerHTML = `
        <h2>${musicas[indiceMusica].titulo}</h2>
        <h3>${musicas[indiceMusica].artista}</h3>
    `
    tituloAtual.innerHTML =`${musicas[indiceMusica].titulo}`
    capaAlbum.style.background = `url(${musicas[indiceMusica].img_capa})`
    capaAlbum.style.backgroundSize = 'cover'
    musica.src = `${musicas[indiceMusica].arquivo}`
}

btnPlayPause.addEventListener('click', () => {
    if(tocando) {
        btnPlayPause.classList.replace('fa-pause', 'fa-play')
        tocando = !tocando
        musica.pause()
    } else {
        btnPlayPause.classList.replace('fa-play', 'fa-pause')
        tocando = !tocando
        musica.play()
    }
})

btnPassar.addEventListener('click', () =>{
    if(tocandoAgora == musicas.length - 1){
        tocandoAgora = 0
    } else {
        tocandoAgora++
    }
    carregaMusica(tocandoAgora)
    if(tocando){
        musica.play()
    }
})

btnVoltar.addEventListener(`click`, () =>{
    if(tocandoAgora == 0) {
        tocandoAgora = musicas.length - 1
    } else {
        tocandoAgora--
    }
    carregaMusica(tocandoAgora)
    if(tocando) {
        musica.play()
    }
})

function atualizaBarraProgresso() {
    let vDuracao = musica.duration
    let vTempoCorrente = musica.currentTime
    isNaN(vDuracao) ? vDuracao = 0 : vDuracao
    isNaN(vTempoCorrente) ? vTempoCorrente = 0 : vTempoCorrente
    duracaoEl.innerHTML = formataTempo(vDuracao)
    tempoCorrenteEl.innerHTML = formataTempo(vTempoCorrente)
    console.log((vTempoCorrente / vDuracao) * 100)
    let percetProgressao = (vTempoCorrente / vDuracao) * 100
    pontoBarra.style.left = `${percetProgressao}%`

}

musica.addEventListener('timeupdate', atualizaBarraProgresso)

function setTempo(e){
    let width = this.clientWidth
    let posicaoClick = e.offsetX
    let duracao = musica.duration
    musica.currentTime = (posicaoClick / width) * duracao
}

barraProgresso.addEventListener('click', setTempo)