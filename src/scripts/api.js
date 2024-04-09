const routes = {
  champions: "http://localhost:8080/champions",
  ask: "http://localhost:8080/champions/{championId}/ask"
}


const apiService = {

  async getChampions() {
    const route = routes.champions;
    const response = await fetch(route);
    return response.json();
  },

  async postAskChampions(id, message){

    const route = routes.ask.replace("{championId}", id);
    data = {question : message}

    console.log(`${id} e message: ${message}, rota: ${route}`);


    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    }

    const response = await fetch(route, options);

    return response.json();
    
  },
}

const state = {
  values: {
    champions: [],
    selectedId: 0,
  },
  views: {
    response: document.querySelector(".text-reponse"),
    question: document.getElementById("text-request"),
    avatar  : document.getElementById("avatar"),
    carousel: document.getElementById("carousel-cards-content"),
  }
}



async function main() {

  await loadChampions();
  await renderChampions();

  await loadCarrousel()
};

async function loadChampions(){
  const championsData = await apiService.getChampions();
  state.values.champions = championsData;
}

async function renderChampions(){
  const championsData = state.values.champions;
  const elements = championsData.map((champion) =>
      `      
      <div class="timeline-carousel__item" onclick="onChangeChampionSelected(${champion.id}, '${champion.image_url}')">
        <div class="timeline-carousel__image">
          <div class="media-wrapper media-wrapper--overlay"
            style="background: url('${champion.image_url}') center center; background-size:cover;">
          </div>
        </div>
        <div class="timeline-carousel__item-inner">
          <span class="name">${champion.name}</span>
          <span class="role">${champion.role}</span>
          <p>${champion.lore}/p>
        </div>
      </div>`
  );

  state.views.carousel.innerHTML = elements.join(" ");

  if (championsData != []){
    state.views.avatar.style.backgroundImage = `url('${championsData[0].image_url}')`;
    state.views.response.textContent = `Faça uma pergunta para ${championsData[0].name}`;
  }
}

async function onChangeChampionSelected(championId, image_url){
  state.views.avatar.style.backgroundImage = `url('${image_url}')`;
  state.views.avatar.dataset.id = championId;
  state.values.selectedId = championId;
  await resetForm();
}

async function resetForm(){
  state.views.question.value = "";
  state.views.response.textContent = `Faça uma pergunta para ${state.values.champions[state.values.selectedId - 1].name}`;
}

async function fetchAskChampion(){

  if (state.views.question.value != "") {
    const championId = state.values.selectedId;
    const message = state.views.question.value;
  
    console.log(`Pergunta: ${message}`);
  
    const data = await apiService.postAskChampions(championId, message);
    
    state.views.response.textContent = await data.answer;

  } else {
    state.views.response.textContent = "Campo de pergunta está vazio!"
  }

}

async function loadCarrousel() {
  const caroujs = (el) => {
    return $("[data-js=" + el + "]");
  };

  caroujs("timeline-carousel").slick({
    infinite: false,
    arrows: true,
    arrows: true,
    prevArrow:
      '<div class="slick-prev"> <div class="btn mr-3 btn-warning d-flex justify-content-center align-items-center"> <div>Anterior</div><svg class="ml-1" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 24 24" style="enable-background:new 0 0 24 24;" xml:space="preserve"> <path d="M10.1,19.1l1.5-1.5L7,13h14.1v-2H7l4.6-4.6l-1.5-1.5L3,12L10.1,19.1z"/> </svg></div></div>',
    nextArrow:
      '<div class="slick-next"> <div class="btn btn-warning d-flex justify-content-center align-items-center"> <svg class="mr-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"> <path d="M 14 4.9296875 L 12.5 6.4296875 L 17.070312 11 L 3 11 L 3 13 L 17.070312 13 L 12.5 17.570312 L 14 19.070312 L 21.070312 12 L 14 4.9296875 z"/> </svg> <div>Próximo</div></div></div>',
    dots: true,
    autoplay: false,
    speed: 1100,
    slidesToShow: 3,
    slidesToScroll: 3,
    responsive: [
      {
        breakpoint: 800,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  });
}

main();
