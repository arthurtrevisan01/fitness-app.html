// --- LÓGICA DE NAVEGAÇÃO ---
function showTab(tabId) {
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    document.getElementById(tabId).classList.add('active');
}

// --- BASE DE DADOS DE TREINOS (Baseado em Ciência) ---
// Estrutura: Volume adequado, seleção de compostos primeiro.
const workoutsDB = {
    3: [ // Full Body 3x
        { name: "Dia A - Full Body Força", ex: ["Agachamento: 3x5", "Supino Reto: 3x5", "Remada Curvada: 3x6", "Desenvolvimento Militar: 3x8"] },
        { name: "Dia B - Descanso / Cardio", ex: ["Caminhada leve 40min"] },
        { name: "Dia C - Full Body Hipertrofia", ex: ["Leg Press: 3x10", "Supino Inclinado Halter: 3x10", "Puxada Alta: 3x10", "Elevação Lateral: 3x15"] },
        { name: "Dia D - Descanso", ex: ["Alongamento"] },
        { name: "Dia E - Full Body Metabólico", ex: ["Terra: 3x5", "Passada: 3x12", "Flexão de Braço: 3xFalha", "Rosca Direta + Tríceps Corda: 3x12"] }
    ],
    4: [ // Upper Lower
        { name: "Dia A - Upper (Superiores)", ex: ["Supino Reto: 4x6-8", "Remada Curvada: 4x8", "Desenvolvimento Halter: 3x10", "Paralelas: 3xFalha"] },
        { name: "Dia B - Lower (Inferiores)", ex: ["Agachamento Livre: 4x6-8", "RDL (Stiff): 3x10", "Cadeira Extensora: 3x15", "Panturrilhas: 4x15"] },
        { name: "Dia C - Descanso", ex: ["Cardio Moderado"] },
        { name: "Dia D - Upper (Volume)", ex: ["Supino Inclinado: 3x10", "Puxada Alta: 3x12", "Elevação Lateral: 4x12", "Bíceps/Tríceps: 3x12"] },
        { name: "Dia E - Lower (Foco Posterior)", ex: ["Levantamento Terra: 3x5", "Leg Press: 3x10", "Mesa Flexora: 4x12", "Abdômen: 3x20"] }
    ],
    6: [ // ABC x2
        { name: "A - Empurrar (Peito/Ombro/Tríceps)", ex: ["Supino Reto: 4x8", "Crucifixo Inclinado: 3x12", "Desenvolvimento: 3x10", "Tríceps Testa: 3x12"] },
        { name: "B - Puxar (Costas/Bíceps)", ex: ["Barra Fixa ou Puxada: 4x8", "Remada Baixa: 3x12", "Rosca Direta: 3x10", "Rosca Martelo: 3x12"] },
        { name: "C - Pernas", ex: ["Agachamento: 4x8", "Leg Press: 3x12", "Extensora: 3x15", "Panturrilhas: 4x15"] }
    ]
};

// --- FUNÇÃO MESTRE: GERA TUDO ---
function generateAll() {
    // 1. Coletar Dados
    const weight = parseFloat(document.getElementById('weight').value);
    const height = parseFloat(document.getElementById('height').value);
    const age = parseFloat(document.getElementById('age').value);
    const gender = document.getElementById('gender').value;
    const goal = document.getElementById('goal').value;
    const days = document.getElementById('days').value;

    if (!weight || !height || !age) {
        alert("Por favor, preencha todos os dados do perfil!");
        return;
    }

    // 2. IA DE TREINO (Lógica de Seleção)
    let selectedPlan = workoutsDB[days] || workoutsDB[4]; // Fallback para 4 dias
    if (days == 5) selectedPlan = workoutsDB[4]; // Simplificação para o exemplo
    if (days == 6) {
        // Duplicar o ABC para virar ABCABC
        let abc = workoutsDB[6];
        selectedPlan = [...abc, ...abc]; 
    }

    let workoutHtml = "";
    selectedPlan.forEach(day => {
        let exList = day.ex.map(e => `<li>${e}</li>`).join('');
        workoutHtml += `<div class="workout-day"><h3>${day.name}</h3><ul>${exList}</ul></div>`;
    });
    
    // Adiciona nota científica baseada no objetivo
    let tip = "";
    if(goal === 'gain') tip = "💡 <strong>Dica Científica:</strong> Para hipertrofia, foque na sobrecarga progressiva (aumentar peso ou reps toda semana).";
    if(goal === 'lose') tip = "💡 <strong>Dica Científica:</strong> Mantenha a intensidade alta para preservar massa magra enquanto perde gordura.";
    
    document.getElementById('workout-plan').innerHTML = tip + workoutHtml;

    // 3. IA DE DIETA (Cálculo Metabólico)
    // Fórmula de Mifflin-St Jeor (Mais precisa que Harris-Benedict)
    let tdee = 0;
    let bmr = (10 * weight) + (6.25 * height) - (5 * age);
    
    if (gender === 'male') bmr += 5;
    else bmr -= 161;

    // Fator de atividade estimado (moderado pois a pessoa treina)
    tdee = bmr * 1.55; 

    // Ajuste pelo objetivo
    let finalCals = tdee;
    if (goal === 'lose') finalCals -= 500; // Déficit agressivo mas seguro
    if (goal === 'gain') finalCals += 300; // Superávit leve

    // Cálculo de Macros (Ciência: 2g/kg proteina, 1g/kg gordura, resto carbo)
    let protein = weight * 2; 
    let fat = weight * 0.8;
    let carbs = (finalCals - (protein * 4) - (fat * 9)) / 4;

    let dietHtml = `
        <h3>📊 Suas Metas Diárias</h3>
        <p><strong>Calorias Totais:</strong> ${Math.round(finalCals)} kcal</p>
        <p><strong>Proteínas:</strong> ${Math.round(protein)}g (Essencial para músculo)</p>
        <p><strong>Carboidratos:</strong> ${Math.round(carbs)}g (Energia para o treino)</p>
        <p><strong>Gorduras:</strong> ${Math.round(fat)}g (Hormônios)</p>
        <hr>
        <h3>🍽️ Exemplo de Cardápio (Gerado pela IA)</h3>
        <p><strong>Café da Manhã:</strong> Ovos (${Math.round(protein * 0.2/6)} un), Aveia (${Math.round(carbs * 0.2)}g), Fruta.</p>
        <p><strong>Almoço:</strong> Peito de Frango/Carne Magra (${Math.round(protein * 0.35/0.3)}g), Arroz/Batata (${Math.round(carbs * 0.35)}g), Salada à vontade.</p>
        <p><strong>Pré-Treino:</strong> Iogurte ou Whey, Banana.</p>
        <p><strong>Jantar:</strong> Repetir proporções do almoço mas com menos carboidrato se preferir.</p>
    `;

    document.getElementById('diet-plan').innerHTML = dietHtml;

    // Salvar no LocalStorage para persistir
    localStorage.setItem('userProfile', JSON.stringify({weight, height, age, gender, goal, days}));
    
    alert("Plano gerado e sincronizado com sucesso!");
    showTab('workout');
}

// --- TRACKER LOGIC ---
function saveSet() {
    const ex = document.getElementById('track-ex').value;
    const kg = document.getElementById('track-kg').value;
    const reps = document.getElementById('track-reps').value;
    const date = new Date().toLocaleDateString();

    if (!ex || !kg || !reps) return;

    const logEntry = { date, ex, kg, reps };
    
    // Pegar histórico antigo
    let history = JSON.parse(localStorage.getItem('workoutHistory')) || [];
    history.unshift(logEntry); // Adiciona no topo
    localStorage.setItem('workoutHistory', JSON.stringify(history));

    renderHistory();
    
    // Limpar campos numéricos
    document.getElementById('track-kg').value = '';
    document.getElementById('track-reps').value = '';
}

function renderHistory() {
    let history = JSON.parse(localStorage.getItem('workoutHistory')) || [];
    const list = document.getElementById('history-list');
    list.innerHTML = "";

    history.slice(0, 20).forEach(h => { // Mostra os ultimos 20
        let li = document.createElement('li');
        li.innerHTML = `<span>${h.date} - <strong>${h.ex}</strong></span> <span>${h.kg}kg x ${h.reps}</span>`;
        list.appendChild(li);
    });
}

function clearHistory() {
    if(confirm("Tem certeza?")) {
        localStorage.removeItem('workoutHistory');
        renderHistory();
    }
}

// Carregar dados ao abrir
window.onload = function() {
    renderHistory();
    const savedProfile = JSON.parse(localStorage.getItem('userProfile'));
    if (savedProfile) {
        document.getElementById('weight').value = savedProfile.weight;
        document.getElementById('height').value = savedProfile.height;
        document.getElementById('age').value = savedProfile.age;
        // Se quiser, pode chamar generateAll() aqui para já mostrar o plano
    }
};
