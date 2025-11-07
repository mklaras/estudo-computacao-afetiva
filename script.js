// script.js (ATUALIZADO PARA YOUTUBE)
window.onload = () => {
  const sections = document.querySelectorAll('.form-section');
  const form = document.getElementById('surveyForm');
  const videoContainer = document.getElementById('videoContainer');
  const videoCaption = document.getElementById('videoCaption'); 

  let currentSection = 0;
  let currentVideo = 0;
  let scenario = Math.ceil(Math.random() * 3);
  let savedVideoAnswers = {};

  // =================== A GRANDE MUDANÇA ESTÁ AQUI ===================
  // Insira os IDs dos seus vídeos do YouTube abaixo.
  // isTrue: true marca qual é a notícia verdadeira em cada cenário.
  // ==================================================================
  const videos = {
    1: [
      { id: "QO4WC_oM-V4", emitter: "Humano", isTrue: false },
      { id: "TpcdzhN3638",    emitter: "NAO",     isTrue: false },
      { id: "IR5_AxaCNgY", emitter: "Roboldo", isTrue: true }
    ],
    2: [
      { id: "lT5Z3ci34QU", emitter: "Humano", isTrue: true },
      { id: "DSNpFVA-3Wc",    emitter: "NAO",     isTrue: false },
      { id: "L9F-6cud9-U", emitter: "Roboldo", isTrue: false }
    ],
    3: [
      { id: "882d-2ms2e8", emitter: "Humano", isTrue: false },
      { id: "Wa9Y_55RPQA",    emitter: "NAO",     isTrue: true },
      { id: "DkfegF29dGU", emitter: "Roboldo", isTrue: false }
    ]
  };

  // Função Likert (sem alterações)
  function createLikert(containerId, namePrefix, labelMin, labelMax) {
    const container = document.getElementById(containerId);
    if (!container) return;
    let radiosHTML = '';
    for (let i = 1; i <= 5; i++) {
      radiosHTML += `<label><input type="radio" name="${namePrefix}" value="${i}" required> ${i}</label>`;
    }
    container.innerHTML = `
      ${labelMin ? `<span class="likert-legend min">${labelMin}</span>` : ''}
      <div class="likert-radios">${radiosHTML}</div>
      ${labelMax ? `<span class="likert-legend max">${labelMax}</span>` : ''}
    `;
  }

  // Lista de escalas Likert (sem alterações)
  const likertScales = [
    ["tecnologia", "tecnologia", "Muito Baixa", "Muito Alta"],
    ["conf-tec", "conf-tec", "Discordo Totalmente", "Concordo Totalmente"],
    ["robos-info", "robos-info", "Discordo Totalmente", "Concordo Totalmente"],
    ["pref-humanos", "pref-humanos", "Discordo Totalmente", "Concordo Totalmente"],
    ["q_competent", "q_competent", "Incompetente", "Competente"],
    ["q_dependable", "q_dependable", "Não confiável", "Confiável"],
    ["q_capable", "q_capable", "Incapaz", "Capaz"],
    ["q_consistent", "q_consistent", "Inconsistente", "Consistente"],
    ["q_reliable", "q_reliable", "Incerto", "Confiável"],
    ["q_expert", "q_expert", "Amador", "Especialista"],
    ["q_efficient", "q_efficient", "Ineficiente", "Eficiente"],
    ["q_precise", "q_precise", "Vago", "Preciso"],
    ["q_cooperative", "q_cooperative", "Não cooperativo", "Cooperativo"],
    ["q_humanlike", "q_humanlike", "Semelhante à máquina", "Semelhante ao humano"],
    ["q_lifelike", "q_lifelike", "Artificial", "Realista"],
    ["q_warm", "q_warm", "Frio", "Caloroso"],
    ["q_empathetic", "q_empathetic", "Apático", "Empático"],
    ["q_personal", "q_personal", "Genérico", "Pessoal"],
    ["q_social", "q_social", "Transacional", "Social"],
    ["pos1", "pos1", "Discordo Totalmente", "Concordo Totalmente"],
    ["pos2", "pos2", "Discordo Totalmente", "Concordo Totalmente"],
    ["pos3", "pos3", "Discordo Totalmente", "Concordo Totalmente"],
  ];

  likertScales.forEach(scale => {
    if (document.getElementById(scale[0])) {
      createLikert(scale[0], scale[1], scale[2], scale[3]);
    }
  });

  // Função de validação (sem alterações)
  function validateCurrentSection(section) {
    const inputs = section.querySelectorAll('input[type="number"][required], select[required]');
    for (const input of inputs) {
      if (!input.value) return false;
    }
    const likertGroups = section.querySelectorAll('.likert');
    for (const group of likertGroups) {
      const firstRadio = group.querySelector('input[type="radio"]');
      if (firstRadio) {
        const radioName = firstRadio.name;
        if (section.querySelector(`input[name="${radioName}"]:checked`) === null) {
          return false; 
        }
      }
    }
    return true;
  }

  // Função nextSection (sem alterações)
  function nextSection() {
    const currentSectionElement = sections[currentSection];
    if (currentSectionElement.id === 'intro') {
      if (!document.getElementById('consentimento').checked) {
        alert("Você precisa concordar com o termo para iniciar.");
        return;
      }
    } else if (currentSectionElement.id === 'preStudy') {
      if (!validateCurrentSection(currentSectionElement)) {
        alert("Por favor, preencha todos os campos obrigatórios.");
        return;
      }
    }
    window.scrollTo(0, 0);
    if (currentSection < sections.length - 1) {
      sections[currentSection].classList.remove('active');
      currentSection++;
      sections[currentSection].classList.add('active');
      if (sections[currentSection].id === 'study') {
        currentVideo = 0;
        loadVideo();
      }
    }
  }

  // =================== FUNÇÃO ATUALIZADA ===================
  function loadVideo() {
    if (currentVideo < videos[scenario].length) {
      const video = videos[scenario][currentVideo];
      const emitterName = video.emitter;
      const videoID = video.id;

      // Define a legenda
      videoCaption.textContent = `Notícia ${currentVideo + 1} - ${emitterName}`;

      // Gera o URL do YouTube com ?rel=0
      // Isso (tenta) reduzir os vídeos sugeridos ao final.
      const embedUrl = `https://www.youtube.com/embed/${videoID}?rel=0`;

      // Cria o iframe do YouTube
      videoContainer.innerHTML = `
        <div style="position: relative; width: 100%; padding-bottom: 56.25%; height: 0;">
          <iframe 
            style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;"
            src="${embedUrl}" 
            title="Vídeo do estudo" 
            frameborder="0" 
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
s           allowfullscreen>
          </iframe>
        </div>`;
    } else {
      nextSection();
    }
  }

  // =================== FUNÇÃO ATUALIZADA ===================
  function nextVideo() {
    const videoQuestionsDiv = document.getElementById('videoQuestions');
    // Pega o nome do emissor da nova estrutura de objeto
    const emitterName = videos[scenario][currentVideo].emitter; 
    
    const currentAnswers = videoQuestionsDiv.querySelectorAll('input[type="radio"]:checked');
    const totalQuestions = videoQuestionsDiv.querySelectorAll('.likert').length; 

    if (currentAnswers.length < totalQuestions) {
        alert(`Por favor, responda todas as ${totalQuestions} perguntas sobre o emissor.`);
        return; 
    }

    currentAnswers.forEach(radio => {
      const questionName = radio.name; 
      const answerValue = radio.value;
      // Salva como "Humano_q_competent", "NAO_q_competent", etc.
      savedVideoAnswers[`${emitterName}_${questionName}`] = answerValue;
      radio.checked = false; 
    });

    window.scrollTo(0, 0);

    currentVideo++;
    if (currentVideo < videos[scenario].length) {
      loadVideo();
    } else {
      nextSection();
    }
  }

  // =================== SUBMIT ATUALIZADO ===================
  form.addEventListener('submit', e => {
    e.preventDefault();
    
    if (!validateCurrentSection(sections[currentSection])) {
        alert("Por favor, preencha todos os campos obrigatórios.");
        return;
    }

    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());
    
    const histVer = formData.getAll('hist_ver');
    data.hist_ver = histVer.join(', '); 

    // Lógica do cenário agora usa a nova estrutura de objeto
    let scenarioLabel = "Cenário " + scenario;
    const scenarioVideos = videos[scenario];
    // Encontra o vídeo marcado com "isTrue: true"
    const nvVideo = scenarioVideos.find(v => v.isTrue === true); 

    if (nvVideo) {
      scenarioLabel += ` (NV - ${nvVideo.emitter})`;
    }
    
    data["cenario"] = scenarioLabel;
    
    const finalData = { ...data, ...savedVideoAnswers };

    // **LEMBRE-SE DE COLOCAR SUA URL AQUI**
    const WEB_APP_URL = "https://script.google.com/macros/s/AKfycbyxpHEKY0IKJRdAXHWoioWm22vVkg0owqhGiBDT9hU17giHV47bzUr3syBpo331bGadEQ/exec";

    fetch(WEB_APP_URL, {
      method: "POST",
      mode: "no-cors", 
      body: JSON.stringify(finalData), 
      headers: { "Content-Type": "application/json" }
    });

    sections[currentSection].classList.remove('active');
    document.getElementById('endScreen').classList.add('active');
    window.scrollTo(0, 0); 
  });

  // Funções globais (sem alterações)
  window.nextSection = nextSection;
  window.nextVideo = nextVideo;

  sections[0].classList.add('active');
};