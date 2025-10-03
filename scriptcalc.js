const questionCard = document.getElementById('question-card');
const backButton = document.getElementById('back-button');
const nextButton = document.getElementById('next-button');
const progressBar = document.getElementById('progress-bar');
const loadingSpinner = document.getElementById('loading-spinner')
 
let currentQuestionIndex = 0;
let userAnswers = {}; // Objeto para armazenar as respostas do usuário

// Variáveis para o cálculo da pegada de carbono, baseadas no arquivo Cal_emisão.js
let q1 = 0;
let q2 = 0;
let q3 = 0;
let q4 = 0;
let q5 = 0;
let q6 = 1; // Valor padrão
let q7 = 0;
let q8 = 0;
let q9 = 0;
let q10= 0;

// Array de objetos com as perguntas do questionário
const questions = [
    {
        question: "Qual o seu principal meio de transporte diário?",
        options: [
            { text: "Carro", value: "carro" },
            { text: "Moto", value: "moto" },
            { text: "Bicicleta", value: "Bicicleta" },
            { text: "Ônibus", value: "Ônibus" },
            { text: "A pé", value: "pé" }
        ],

    },
    {
        question: "Quantos carros você ou sua família possuem? (alugado ou próprio)",
        options: [
            { text: "Nenhum", value: "nenhumc" },
            { text: "1 carro", value: "1c" },
            { text: "2 carros", value: "2c" },
            { text: "3 ou mais", value: "3+c" }
        ],
    },
    {
        question: "Qual o tipo de fonte do seu carro?",
        options: [
            { text: "Combustível fóssil", value: "combustível" },
            { text: "Biocombustível", value: "biocombustível" },
            { text: "Elétrico", value: "elétrico" },
            { text: "Híbrido", value: "híbrido" }
        ],
    },
    {
        question: "Quantas refeições você faz por dia?",
        options: [
            { text: "1-2", value: "1-2" },
            { text: "2-3", value: "2-3" },
            { text: "3-4", value: "3-4" },
            { text: "Mais que 4", value: "4+" }
        ],
    },
    {
        question: "Qual a base da sua dieta?",
        options: [
            { text: "Vegana", value: "Vegana" },
            { text: "Vegetariana", value: "Vegetariana" },
            { text: "Pescetariana", value: "Pescetariana" },
            { text: "Carnívora", value: "Carnívora" }
        ],
    },
    {
        question: "Com que frequência você consome carne vermelha por semana?",
        options: [
            { text: "Todo dia", value: "diariamente" },
            { text: "Alguns dias", value: "al_dias" },
            { text: "Raramente", value: "raramente" }
        ],
    },
    {
        question: "Qual o tipo de fonte elétrica para resfriamento em sua moradia?",
        options: [
            { text: "Resfriamento elétrico", value: "eletrico" },
            { text: "Gás natural", value: "gas" },
            { text: "Biomassa", value: "biomassa" },
            { text: "Sem resfriamento", value: "semaquecimento" }
        ],
    },
    {
        question: "Você possui mais de um imóvel?",
        options: [
            { text: "Sim", value: "sim" },
            { text: "Não", value: "nao" }
        ],
    },
    {
        question: "Você utiliza eletrodomésticos eficientes em termos de energia?",
        options: [
            { text: "Sim", value: "sim" },
            { text: "Não", value: "nao" }
        ],
    },
    {
        question: "Você costuma utilizar sacolas plásticas quando vai fazer alguma compra?",
        options: [
            { text: "Sim", value: "sim" },
            { text: "Não", value: "nao" },
            { text: "Raramente", value: "raramente" }
        ],
    }
];

// Renderiza a pergunta atual na tela
function renderQuestion() {
    // Adiciona classes para a animação de saída do cartão atual
    questionCard.classList.add('card-exit-active');

    // Timeout para esperar a animação de saída terminar antes de renderizar o novo conteúdo
    setTimeout(() => {
        questionCard.innerHTML = '';
        const question = questions[currentQuestionIndex];

        // Título da pergunta
        const questionTitle = document.createElement('h2');
        // ALTERAÇÃO AQUI: text-3xl md:text-4xl mudado para text-2xl md:text-3xl
        questionTitle.className = 'text-2xl md:text-3xl font-bold text-center text-slate-800 mb-8'; 
        questionTitle.textContent = question.question;
        questionCard.appendChild(questionTitle);

        // Contêiner para as opções de resposta
        const optionsContainer = document.createElement('div');
        optionsContainer.className = 'flex flex-col gap-4';

        question.options.forEach((option, index) => {
            const optionButton = document.createElement('button');
            optionButton.className = 'flex items-center gap-4 bg-slate-100 text-slate-700 py-4 px-6 rounded-2xl font-semibold transition-all duration-200 hover:bg-blue-100 hover:text-blue-800 shadow-md';
            optionButton.dataset.value = option.value;
            optionButton.innerHTML = `
                ${question.icons ? question.icons[index] : ''}
                <span>${option.text}</span>
            `;

            // Adiciona a classe 'selected' se a opção já foi escolhida
            if (userAnswers[currentQuestionIndex] && userAnswers[currentQuestionIndex] === option.value) {
                optionButton.classList.remove('bg-slate-100', 'text-slate-700', 'hover:bg-blue-100', 'hover:text-blue-800');
                optionButton.classList.add('bg-blue-600', 'text-white', 'hover:bg-blue-700');
            }

            optionButton.addEventListener('click', () => {
                // Remove a seleção de todas as opções
                optionsContainer.querySelectorAll('button').forEach(btn => {
                    btn.classList.remove('bg-blue-600', 'text-white', 'hover:bg-blue-700');
                    btn.classList.add('bg-slate-100', 'text-slate-700', 'hover:bg-blue-100', 'hover:text-blue-800');
                });
                // Adiciona a seleção à opção clicada
                optionButton.classList.add('bg-blue-600', 'text-white', 'hover:bg-blue-700');
                optionButton.classList.remove('bg-slate-100', 'text-slate-700', 'hover:bg-blue-100', 'hover:text-blue-800');
                userAnswers[currentQuestionIndex] = option.value;
                updateNavigationButtons();
            });

            optionsContainer.appendChild(optionButton);
        });

        questionCard.appendChild(optionsContainer);

        // Remove a classe de saída e adiciona a de entrada para a animação
        questionCard.classList.remove('card-exit-active');
        questionCard.classList.add('card-appear-active');

        // Atualiza a barra de progresso
        updateProgressBar();
        // Atualiza os botões de navegação
        updateNavigationButtons();
    }, 300); // O tempo do timeout deve ser igual à duração da transição CSS
}

// Atualiza o estado dos botões de navegação
function updateNavigationButtons() {
    backButton.disabled = currentQuestionIndex === 0;
    if (currentQuestionIndex === questions.length - 1) {
        nextButton.textContent = 'Calcular';
        nextButton.disabled = !userAnswers[currentQuestionIndex];
    } else {
        nextButton.textContent = 'Próximo';
        nextButton.disabled = !userAnswers[currentQuestionIndex];
    }
}

// Atualiza a barra de progresso
function updateProgressBar() {
    const progress = ((currentQuestionIndex + 1) / questions.length) * 100;
    progressBar.style.width = `${progress}%`;
}

// Evento para o botão "Próximo"
nextButton.addEventListener('click', () => {

    if (currentQuestionIndex === 1 && userAnswers[currentQuestionIndex]=== 'nenhumc'){
        currentQuestionIndex +=1;
    }

    if (currentQuestionIndex === 4 && userAnswers[currentQuestionIndex]==='Vegana' || userAnswers[currentQuestionIndex]==='Pescetariana' || userAnswers[currentQuestionIndex]==='Vegetariana'){
        currentQuestionIndex +=1;
    }

    if (currentQuestionIndex < questions.length - 1) {
        currentQuestionIndex++;
        renderQuestion();
    } else {
        // Lógica para finalizar o questionário e mostrar o resultado
        showResults();
    }
});

// Evento para o botão "Anterior"
backButton.addEventListener('click', () => {
    if (currentQuestionIndex > 0) {
        currentQuestionIndex--;
        renderQuestion();
    }
});

// Exibe a tela de resultados
function showResults() {

    questionCard.classList.add('hidden')
    loadingSpinner.classList.remove('hidden')

    setTimeout(() => {
        // Itera pelas respostas do usuário e atribui os valores para o cálculo
        for (const [index, value] of Object.entries(userAnswers)) {
            switch (Number(index)) {
                case 0: // Transporte
                    if (value === 'carro') q1 = 0.1268;
                    else if (value === 'moto') q1 = 0.0711;
                    else if (value === 'Bicicleta') q1 = 0.0016;
                    else if (value === 'Ônibus') q1 = 0.016;
                    else if (value === 'pé') q1 = 0;
                    break;

                case 1: // Quantos carros
                    if (value === 'nenhumc') q2 = 0;
                    else if (value === '1c') q2 = 1;
                    else if (value === '2c') q2 = 2;
                    else if (value === '3+c') q2 = 3;
                    break;

                case 2: // Tipo de fonte do carro
                    if (value === 'combustível') q3 = 2.28;
                    else if (value === 'biocombustível') q3 = 1.722;
                    else if (value === 'elétrico') q3 = 0.234;
                    else if (value === 'híbrido') q3 = 0.736;
                    break;

                case 3: // Refeições por dia
                    if (value === '1-2') q4 = 1.5;
                    else if (value === '2-3') q4 = 2.5;
                    else if (value === '3-4') q4 = 3.5;
                    else if (value === '4+') q4 = 4;
                    break;

                case 4: // Tipo de dieta
                    if (value === 'Vegana') q5 = 2.9;
                    else if (value === 'Vegetariana') q5 = 4.1;
                    else if (value === 'Pescetariana') q5 = 5.04;
                    else if (value === 'Carnívora') q5 = 7.2;
                    break;

                case 5: // Frequência de carne vermelha
                    if (value === 'diariamente') q6 = 7;
                    else if (value === 'al_dias') q6 = 4;
                    else if (value === 'raramente') q6 = 1.5;
                    break;

                case 6: // Fonte elétrica para resfriamento
                    if (value === 'eletrico') q7 = 0.0817;//media de kWh por dia

                    else if (value === 'gas') q7 = 2.1 //media de 2.1kg por m²;
                    else if (value === 'biomassa') q7 = 0.2 //media da queima da biomassa por kWh de energia térmica;
                    else if (value === 'semaquecimento') q7 = 0;
                    break;

                case 7: // Mais de um imóvel
                    if (value === 'sim') q8 = 2;
                    else if (value === 'nao') q8 = 1;
                    break;

                case 8: // Eletrodomésticos eficientes
                    if (value === 'sim') q9 = 0.0817;
                    else if (value === 'nao') q9 = 1.4 * 0.0817;//aparelhos que não são econômicos aumentam em média 40% do consumo de kWh
                    break;

                case 9: // Sacolas plásticas
                    if (value === 'sim') q10 = 1.015;
                    else if (value === 'nao') q10 = 1;
                    else if (value === 'raramente') q10 = 1.005;
                    break;
            }
        }

        // Cálculo
        const g_carbono_total = (q1 + q2*q3 + q4 + q7*q8 + q9 +q10) *7 +q6*q5
        const g_carbono = g_carbono_total.toFixed(2);
        let nivelMessage = "";

        // Lógica para definir o nível, baseada no arquivo Cal_emisão.js
        if (g_carbono_total <= 50) {
            nivelMessage = "Parabéns! Sua pegada de carbono é baixa. Continue com as suas atitudes sustentáveis! ";
        } else if (g_carbono_total > 50 && g_carbono_total <= 100) {
            nivelMessage = "Sua pegada de carbono está na média. Algumas mudanças simples em sua rotina já ajudariam a baixar a sua pegada!";
        } else {
            nivelMessage = "Sua pegada de carbono está muito alta! Pequenas mudanças em sua rotina podem fazer grande diferença na saúde do planeta.";
        }
        
        // Oculta os botões de navegação
        backButton.style.display = 'none';
        nextButton.style.display = 'none';

        // Exibe o resultado na tela
        questionCard.innerHTML = `
            <div class="flex flex-col items-center justify-center text-center p-8 min-h-[400px]">
                <h2 class="text-3xl md:text-4xl font-bold text-slate-800 mb-4">Seu resultado:</h2>
                <p class="text-3xl font-bold text-blue-600 mb-4">${g_carbono} kg de carbono por semana</p>
                <p class="text-lg text-slate-600 mb-8">${nivelMessage}</p>
                <button class="mt-8 bg-green-500 text-white font-bold py-3 px-8 rounded-full shadow-lg hover:bg-green-600 transition-colors duration-200" onclick="location.reload()">
                    Reiniciar
                </button>
            </div>
        `;

    updateProgressBar();
    loadingSpinner.classList.add('hidden');
    questionCard.classList.remove('hidden');
},5000);

}

renderQuestion();
