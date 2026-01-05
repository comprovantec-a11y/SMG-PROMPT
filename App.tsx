
import React, { useState, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";
import { 
  Disc, 
  Mic2, 
  Layers, 
  Check,
  Copy,
  Zap,
  Loader2,
  History,
  Trash2,
  Lock,
  Volume2,
  Save,
  Feather,
  Search,
  BookOpen,
  Eraser,
  Cpu,
  Trophy,
  ExternalLink,
  X,
  Music2,
  AlertTriangle
} from 'lucide-react';

// --- Types ---
type SunoVersion = 'v5' | 'v4.5+' | 'v4.5' | 'v4' | 'v3.5';
type VocalTone = 'Male Tenor' | 'Male Baritone' | 'Female Soprano' | 'Female Alto' | 'Soulful Raspy' | 'Gospel Power' | 'Smooth R&B' | 'Rock Grit';
type Language = 'pt' | 'en' | 'es';

interface SavedItem {
  id: string;
  name: string;
  content: string;
  type: 'prompt' | 'lyric';
  timestamp: number;
}

interface GroundingSource {
  title: string;
  uri: string;
}

// --- Translations ---
const translations = {
  pt: {
    login_title: "SMG",
    login_subtitle: "ENGINEERING",
    login_protocol: "Protocolo Elite 2026",
    login_placeholder: "Chave de acesso SMG...",
    login_btn: "Entrar no Terminal",
    login_error: "Acesso restrito. Chave inválida.",
    
    header_title: "SMG",
    header_subtitle: "PROMPT GENERATOR",
    header_slogan: "A inteligência por trás do seu próximo hit.",
    header_tag_logic: "Processador Lógico 2026",
    header_tag_ver: "Estúdio v5.5",
    
    nav_terminal: "Terminal",
    nav_vault: "Biblioteca",
    
    term_style_title: "Arquitetura de Áudio",
    term_style_placeholder: "Ideia de Estilo (ex: Pop Soul 2026)...",
    term_bpm: "Cadência (BPM)",
    term_tone: "Tom Vocal",
    term_engine: "Versão do Motor",
    
    term_lyrics_title: "Lírica & Fraseado",
    term_lyrics_placeholder: "Insira a letra aqui para processamento profundo SMG...",
    term_anti_copy_std: "Anti-Copy Padrão",
    term_anti_copy_turbo: "Protocolo Turbo",
    term_deep_search: "Busca Profunda",
    term_process_btn: "PROCESSAR PROJETO 2026",
    
    out_style_title: "Prompt de Estilo Suno",
    out_lyrics_title: "Letra Processada [Tags] & (Backs)",
    out_waiting_eng: "Aguardando Engenharia...",
    out_waiting_lyr: "Aguardando Processador Lírico...",
    out_sources: "Fontes Originais Localizadas",
    
    lib_title: "Biblioteca SMG",
    lib_empty: "Biblioteca Vazia",
    lib_restore: "Restaurar",
    
    modal_save_title: "Arquivar Projeto",
    modal_placeholder: "Nome do arquivo...",
    modal_cancel: "Cancelar",
    modal_confirm: "Confirmar",
    
    hist_title: "Logs de Auditoria",
    hist_active: "Protocolo 2026 Activo",
    hist_desc: "Módulo Studio FX desativado para otimização de recursos. Foco total em Engenharia de Prompt e Lírica.",
    
    err_search_not_found: "Sistema não conseguiu localizar a letra exata. Tente variar o nome ou insira manualmente.",
    err_search_conn: "Erro de conexão na busca.",

    // Tone Translations
    tone_male_tenor: "Tenor Masculino",
    tone_male_baritone: "Barítono Masculino",
    tone_female_soprano: "Soprano Feminino",
    tone_female_alto: "Contralto Feminino",
    tone_soulful_raspy: "Soulful Raspy (Rouco)",
    tone_gospel_power: "Gospel Power",
    tone_smooth_rnb: "Smooth R&B",
    tone_rock_grit: "Rock Grit (Rasgado)"
  },
  en: {
    login_title: "SMG",
    login_subtitle: "ENGINEERING",
    login_protocol: "Elite Protocol 2026",
    login_placeholder: "SMG Access Key...",
    login_btn: "Enter Terminal",
    login_error: "Access restricted. Invalid key.",
    
    header_title: "SMG",
    header_subtitle: "PROMPT GENERATOR",
    header_slogan: "The intelligence behind your next hit.",
    header_tag_logic: "Logic Processor 2026",
    header_tag_ver: "Studio v5.5",
    
    nav_terminal: "Terminal",
    nav_vault: "Library",
    
    term_style_title: "Audio Architecture",
    term_style_placeholder: "Style Idea (e.g., Pop Soul 2026)...",
    term_bpm: "Cadence (BPM)",
    term_tone: "Vocal Tone",
    term_engine: "Engine Version",
    
    term_lyrics_title: "Lyric & Phrasing",
    term_lyrics_placeholder: "Enter lyrics here for deep SMG processing...",
    term_anti_copy_std: "Standard Anti-Copy",
    term_anti_copy_turbo: "Turbo Protocol",
    term_deep_search: "Deep Search",
    term_process_btn: "PROCESS PROJECT 2026",
    
    out_style_title: "Suno Style Prompt",
    out_lyrics_title: "Processed Lyrics [Tags] & (Backs)",
    out_waiting_eng: "Awaiting Engineering...",
    out_waiting_lyr: "Awaiting Lyric Processor...",
    out_sources: "Original Sources Located",
    
    lib_title: "SMG Library",
    lib_empty: "Library Empty",
    lib_restore: "Restore",
    
    modal_save_title: "Archive Project",
    modal_placeholder: "Filename...",
    modal_cancel: "Cancel",
    modal_confirm: "Confirm",
    
    hist_title: "Audit Logs",
    hist_active: "Protocol 2026 Active",
    hist_desc: "Studio FX module disabled for resource optimization. Full focus on Prompt Engineering and Lyrics.",
    
    err_search_not_found: "System could not locate exact lyrics. Try varying the name or enter manually.",
    err_search_conn: "Connection error during search.",

    // Tone Translations
    tone_male_tenor: "Male Tenor",
    tone_male_baritone: "Male Baritone",
    tone_female_soprano: "Female Soprano",
    tone_female_alto: "Female Alto",
    tone_soulful_raspy: "Soulful Raspy",
    tone_gospel_power: "Gospel Power",
    tone_smooth_rnb: "Smooth R&B",
    tone_rock_grit: "Rock Grit"
  },
  es: {
    login_title: "SMG",
    login_subtitle: "INGENIERÍA",
    login_protocol: "Protocolo Élite 2026",
    login_placeholder: "Clave de acceso SMG...",
    login_btn: "Entrar al Terminal",
    login_error: "Acceso restringido. Clave inválida.",
    
    header_title: "SMG",
    header_subtitle: "PROMPT GENERATOR",
    header_slogan: "La inteligencia detrás de tu próximo éxito.",
    header_tag_logic: "Procesador Lógico 2026",
    header_tag_ver: "Estudio v5.5",
    
    nav_terminal: "Terminal",
    nav_vault: "Biblioteca",
    
    term_style_title: "Arquitectura de Audio",
    term_style_placeholder: "Idea de Estilo (ej: Pop Soul 2026)...",
    term_bpm: "Cadencia (BPM)",
    term_tone: "Tono Vocal",
    term_engine: "Versión del Motor",
    
    term_lyrics_title: "Lírica y Fraseo",
    term_lyrics_placeholder: "Inserte letra aquí para procesamiento profundo SMG...",
    term_anti_copy_std: "Anti-Copy Estándar",
    term_anti_copy_turbo: "Protocolo Turbo",
    term_deep_search: "Búsqueda Profunda",
    term_process_btn: "PROCESAR PROYECTO 2026",
    
    out_style_title: "Prompt de Estilo Suno",
    out_lyrics_title: "Letra Procesada [Tags] & (Coros)",
    out_waiting_eng: "Esperando Ingeniería...",
    out_waiting_lyr: "Esperando Procesador Lírico...",
    out_sources: "Fuentes Originales Localizadas",
    
    lib_title: "Biblioteca SMG",
    lib_empty: "Biblioteca Vacía",
    lib_restore: "Restaurar",
    
    modal_save_title: "Archivar Proyecto",
    modal_placeholder: "Nombre del archivo...",
    modal_cancel: "Cancelar",
    modal_confirm: "Confirmar",
    
    hist_title: "Registros de Auditoría",
    hist_active: "Protocolo 2026 Activo",
    hist_desc: "Módulo Studio FX deshabilitado para optimización de recursos. Enfoque total en Ingeniería de Prompt y Lírica.",
    
    err_search_not_found: "El sistema no pudo localizar la letra exacta. Intente variar el nombre o ingrese manualmente.",
    err_search_conn: "Error de conexión en la búsqueda.",

    // Tone Translations
    tone_male_tenor: "Tenor Masculino",
    tone_male_baritone: "Barítono Masculino",
    tone_female_soprano: "Soprano Femenino",
    tone_female_alto: "Contralto Femenino",
    tone_soulful_raspy: "Soulful Raspy (Ronco)",
    tone_gospel_power: "Gospel Power",
    tone_smooth_rnb: "Smooth R&B",
    tone_rock_grit: "Rock Grit (Rasgado)"
  }
};

// --- Prompt Templates ---
const PromptTemplates = {
  deepEngineeredProcess: (style: string, lyrics: string, version: string, bpm: string, tone: string, phonetic: boolean, turbo: boolean, lang: Language) => {
    
    const hasLyrics = lyrics && lyrics.trim().length > 0;
    
    // Language specific instructions
    const instructions = {
      pt: {
        role: "Atue como Engenheiro Chefe de Áudio da SMG Studios 2026.",
        objective: "OBJETIVO: Criar prompts de engenharia sonora de ELITE seguindo estritamente um modelo de referência.",
        style_instruct: `1. STYLE PROMPT (ENGENHARIA SONORA AVANÇADA - MODELO OBRIGATÓRIO):
    - Entrada do Usuário: "${style}"
    - Versão: ${version} | BPM SOLICITADO: ${bpm || 'Auto'} | Tom Vocal: ${tone}
    
    VOCÊ DEVE SEGUIR ESTRITAMENTE ESTA ESTRUTURA DE TEXTO.
    
    REGRAS CRÍTICAS:
    1. Se um BPM foi solicitado (${bpm}), você DEVE ESCRÊVE-LO explicitamente no início do prompt (ex: "${bpm} BPM Funk Soul...").
    2. NÃO use lista de tags. USE TEXTO NARRATIVO TÉCNICO EM INGLÊS.
    
    ESTRUTURA ALVO: "[BPM se fornecido] Genre Name. [Time]s intro: [Instrument details]. Lead [Gender] vocal in [Language], [Tone details], [Performance details]. Drums [Details]. Guitars/Instruments [Details]. Backing vocals: [Details]. Verse 2 [Details]; pre-chorus [Details]; chorus [Details]. Bridge: [Details]. Final hook: [Details]. Ear-candy: [FX Details]. Mix [Details]. [Negative constraints]."
    
    MODELO DE REFERÊNCIA:
    "110 BPM Funk Soul Fusion. 2–3s intro: bass lays syncopated pocket; Rhodes stabs mark pulse; funky rhythm guitar answers. Lead male vocal in BR Portuguese, clear diction, warm, soulful, sings straight melody while band swings. Drums tight kick/snare, ghost-note shuffle, open hi-hat. Guitars improvise with muted strums, bends, syncopated riffs. Backing vocals: 4–6 voices gospel-style harmony, lush layers on choruses and hooks. Verse 2 half-time (4 bars); pre-chorus one-beat dropout; chorus lift with slap bass, brass stabs, gospel pads, harmony choir. Bridge: bass+guitar dialogue, fake drop to vocal+Rhodes for 1 bar, tape-stop tease, explosive return. Final hook: subtle key lift, 2-bar stop-time, 8-bar vamp/tag with call-and-response horns, tasty guitar fills. Ear-candy: reverse swells, filter sweeps, stereo slap delay, quick turnarounds. Mix wide, deep lows, crisp highs, live-jam energy. No claps, no distortion."

    IMPORTANTE: Mantenha o prompt final com no máximo 1000 caracteres. O texto deve ser em INGLÊS TÉCNICO (industry standard).`,
        lyric_instruct: `2. ESTRUTURA DE PRODUTOR MUSICAL (MODELO OBRIGATÓRIO):
    - Entrada de Letra: "${lyrics}"
    
    VOCÊ DEVE AGIR COMO UM PRODUTOR MUSICAL. NÃO APENAS COLOQUE [Intro] ou [Verso].
    VOCÊ DEVE DESCREVER O SOM DENTRO DOS COLCHETES PARA CADA SEÇÃO, COMO UM DIRETOR MUSICAL GUIANDO A BANDA.

    FORMATO OBRIGATÓRIO:
    [nome_da_seção — Detalhes do Groove. Instrumentos específicos. Dinâmica e Emoção.]
    Letra da seção...

    REGRAS:
    1. TODAS as seções (Intro, Verso, Refrão, Ponte, Solo, Outro) devem ter essa descrição técnica detalhada dentro dos colchetes.
    2. (Parênteses) continuam sendo usados para Backing Vocals que são cantados.
    3. Mantenha a estrutura lógica e progressiva da música, descrevendo as mudanças de dinâmica.`,
        anti_copy_header: `REGRAS RÍGIDAS DE ANTI-COPY (FONÉTICA BRASILEIRA):
    O PROCESSO DEVE SER CIRÚRGICO. LEIA A PALAVRA MENTALMENTE ANTES DE ALTERAR.`,
        phonetic_rules: phonetic ? `
    MODO ANTI-COPY MODERADO:
    1. 'O' final átono vira 'u' (ex: posso -> possu, vivo -> vivu).
    2. 'E' com som de 'i' vira 'i' (ex: que -> qui, de -> di).
    3. RACIOCÍNIO DO 'S' para 'Z':
       - REGRA: Troque 's' por 'z' APENAS se o som for foneticamente /z/ (som de zebra).
       - CORRETO: "Casa" -> "Caza", "Preciso" -> "Precizu", "Mesa" -> "Meza".
       - PROIBIDO: JAMAIS troque se o som for de 'S' (início de palavra ou 'ss').
       - ERRADO: "Sapo" -> "Zapo" (NÃO FAÇA ISSO!), "Passado" -> "Pazzado" (NÃO FAÇA ISSO!).
    4. Adicione acento circunflexo visual em 'e' ou 'o' tônicos (ex: ele -> êle).
    ` : '',
        turbo_rules: turbo ? `
    MODO ANTI-COPY TURBO (EXTREMO):
    APLIQUE TODAS AS REGRAS DO MODERADO ACIMA, MAIS:
    5. Troque 'ão' por 'âum' (ex: não -> nâum, coração -> coraçâum).
    6. Troque 'eu' por 'êu' (ex: eu -> êu).
    7. Adicione acentos agudos visuais na última vogal de palavras oxítonas/paroxítonas terminadas em a/e/o (ex: vida -> vidá, nas -> nás).
    ` : '',
        footer: "IMPORTANTE: O objetivo é a perfeição estrutural."
      },
      en: {
        role: "Act as Chief Audio Engineer at SMG Studios 2026.",
        objective: "OBJECTIVE: Create ELITE audio engineering prompts strictly following a reference model.",
        style_instruct: `1. STYLE PROMPT (ADVANCED AUDIO ENGINEERING - MANDATORY MODEL):
    - User Input: "${style}"
    - Version: ${version} | BPM REQUESTED: ${bpm || 'Auto'} | Vocal Tone: ${tone}
    
    YOU MUST STRICTLY FOLLOW THIS TEXT STRUCTURE.

    CRITICAL RULES:
    1. If a BPM was requested (${bpm}), you MUST WRITE IT explicitly at the start of the prompt (e.g., "${bpm} BPM Funk Soul...").
    2. DO NOT use a tag list. USE TECHNICAL NARRATIVE TEXT.
    
    TARGET STRUCTURE: "[BPM if provided] Genre Name. [Time]s intro: [Instrument details]. Lead [Gender] vocal in [Language], [Tone details], [Performance details]. Drums [Details]. Guitars/Instruments [Details]. Backing vocals: [Details]. Verse 2 [Details]; pre-chorus [Details]; chorus [Details]. Bridge: [Details]. Final hook: [Details]. Ear-candy: [FX Details]. Mix [Details]. [Negative constraints]."
    
    REFERENCE MODEL (MATCH THIS LEVEL OF DETAIL):
    "110 BPM Funk Soul Fusion. 2–3s intro: bass lays syncopated pocket; Rhodes stabs mark pulse; funky rhythm guitar answers. Lead male vocal in BR Portuguese, clear diction, warm, soulful, sings straight melody while band swings. Drums tight kick/snare, ghost-note shuffle, open hi-hat. Guitars improvise with muted strums, bends, syncopated riffs. Backing vocals: 4–6 voices gospel-style harmony, lush layers on choruses and hooks. Verse 2 half-time (4 bars); pre-chorus one-beat dropout; chorus lift with slap bass, brass stabs, gospel pads, harmony choir. Bridge: bass+guitar dialogue, fake drop to vocal+Rhodes for 1 bar, tape-stop tease, explosive return. Final hook: subtle key lift, 2-bar stop-time, 8-bar vamp/tag with call-and-response horns, tasty guitar fills. Ear-candy: reverse swells, filter sweeps, stereo slap delay, quick turnarounds. Mix wide, deep lows, crisp highs, live-jam energy. No claps, no distortion."

    IMPORTANT: Keep the final prompt under 1000 characters. Use TECHNICAL ENGLISH (industry standard).`,
        lyric_instruct: `2. MUSIC PRODUCER STRUCTURE (MANDATORY MODEL):
    - Lyric Input: "${lyrics}"
    
    YOU MUST ACT AS A MUSIC PRODUCER. DO NOT JUST PUT [Intro] or [Verse].
    YOU MUST DESCRIBE THE SOUND INSIDE THE BRACKETS FOR EACH SECTION.

    REQUIRED FORMAT:
    [section_name — Groove details. Specific instruments. Dynamics and Emotion.]
    Lyrics...

    RULES:
    1. ALL sections (Intro, Verse, Chorus, Bridge, Solo, Outro) must have this detailed technical description inside the brackets.
    2. (Parentheses) are still used for Backing Vocals that are sung.
    3. Maintain logical and progressive song structure.`,
        anti_copy_header: "",
        phonetic_rules: "",
        turbo_rules: "",
        footer: "IMPORTANT: Aim for structural perfection."
      },
      es: {
        role: "Actúa como Ingeniero Jefe de Audio de SMG Studios 2026.",
        objective: "OBJETIVO: Crear prompts de ingeniería de audio de ÉLITE siguiendo estrictamente un modelo de referencia.",
        style_instruct: `1. STYLE PROMPT (INGENIERÍA DE AUDIO AVANZADA - MODELO OBLIGATORIO):
    - Entrada del Usuario: "${style}"
    - Versión: ${version} | BPM SOLICITADO: ${bpm || 'Auto'} | Tono Vocal: ${tone}
    
    DEBES SEGUIR ESTRICTAMENTE ESTA ESTRUCTURA DE TEXTO.
    
    REGLAS CRÍTICAS:
    1. Si se solicitó un BPM (${bpm}), DEBES ESCRIBIRLO explícitamente al inicio del prompt (ej: "${bpm} BPM Funk Soul...").
    2. NO USES lista de tags. USA TEXTO NARRATIVO TÉCNICO EN INGLÉS.
    
    ESTRUCTURA OBJETIVO: "[BPM si proporcionado] Genre Name. [Time]s intro: [Instrument details]. Lead [Gender] vocal in [Language], [Tone details], [Performance details]. Drums [Details]. Guitars/Instruments [Details]. Backing vocals: [Details]. Verse 2 [Details]; pre-chorus [Details]; chorus [Details]. Bridge: [Details]. Final hook: [Details]. Ear-candy: [FX Details]. Mix [Details]. [Negative constraints]."
    
    MODELO DE REFERENCIA (IGUALA ESTE NIVEL DE DETALLE):
    "110 BPM Funk Soul Fusion. 2–3s intro: bass lays syncopated pocket; Rhodes stabs mark pulse; funky rhythm guitar answers. Lead male vocal in BR Portuguese, clear diction, warm, soulful, sings straight melody while band swings. Drums tight kick/snare, ghost-note shuffle, open hi-hat. Guitars improvise with muted strums, bends, syncopated riffs. Backing vocals: 4–6 voices gospel-style harmony, lush layers on choruses and hooks. Verse 2 half-time (4 bars); pre-chorus one-beat dropout; chorus lift with slap bass, brass stabs, gospel pads, harmony choir. Bridge: bass+guitar dialogue, fake drop to vocal+Rhodes for 1 bar, tape-stop tease, explosive return. Final hook: subtle key lift, 2-bar stop-time, 8-bar vamp/tag with call-and-response horns, tasty guitar fills. Ear-candy: reverse swells, filter sweeps, stereo slap delay, quick turnarounds. Mix wide, deep lows, crisp highs, live-jam energy. No claps, no distortion."

    IMPORTANTE: Mantén el prompt final por debajo de 1000 caracteres. Usa INGLÉS TÉCNICO (estándar de la industria) para la mejor interpretación de la IA.`,
        lyric_instruct: `2. ESTRUCTURA DE PRODUCTOR MUSICAL (MODELO OBLIGATORIO):
    - Entrada de Letra: "${lyrics}"
    
    DEBES ACTUAR COMO UN PRODUCTOR MUSICAL. NO PONGAS SOLO [Intro] o [Verso].
    DEBES DESCRIBIR EL SONIDO DENTRO DE LOS CORCHETES PARA CADA SECCIÓN.

    FORMATO OBLIGATORIO:
    [nombre_sección — Detalles del Groove. Instrumentos específicos. Dinámica y Emoción.]
    Letra de la sección...

    REGRAS:
    1. TODAS las secciones (Intro, Verso, Coro, Puente, Solo, Outro) deben tener esta descripción técnica detallada dentro de los corchetes.
    2. (Paréntesis) se siguen usando para Coros/Backing Vocals que se cantan.
    3. Mantén una estructura de canción lógica y progresiva.`,
        anti_copy_header: "",
        phonetic_rules: "",
        turbo_rules: "",
        footer: "IMPORTANT: Objetivo de perfección estructural."
      }
    };

    const t = instructions[lang];

    return `
    ${t.role}
    
    ${t.objective}

    ${t.style_instruct}

    ${hasLyrics ? t.lyric_instruct : ""}

    ${hasLyrics ? t.anti_copy_header : ""}
    
    ${hasLyrics && lang === 'pt' ? t.phonetic_rules : ''}

    ${hasLyrics && lang === 'pt' ? t.turbo_rules : ''}
    
    ${t.footer}

    RETORNE APENAS UM JSON NO SEGUINTE FORMATO:
    {
      "engineeredStyle": "O prompt de estilo técnico detalhado aqui",
      "processedLyrics": "${hasLyrics ? 'A letra estruturada com tags detalhadas em [Colchetes] e as substituições fonéticas aplicadas aqui' : ''}",
      "bpm": "${bpm || 'Sugestão de BPM'}"
    }
  `;
  },
  fetchLyricsOnly: (input: string, lang: Language) => `
    ${lang === 'pt' ? 'Você é um Agente de Busca Musical Especializado.' : lang === 'es' ? 'Eres un Agente de Búsqueda Musical Especializado.' : 'You are a Specialized Music Search Agent.'}
    Sua missão: Encontrar a letra da música "${input}".

    PROTOCOLO DE BUSCA:
    1. Tente a busca exata do termo fornecido.
    2. Se falhar, tente buscar por variações do título ou trechos da letra se o usuário forneceu.
    3. Se falhar, tente buscar pelo nome do artista + "letra".
    
    SAÍDA OBRIGATÓRIA:
    - Se encontrar: Retorne APENAS a letra completa e original (sem introduções como "Aqui está a letra").
    - Se NÃO encontrar nada confiável após tentar variações: Retorne EXATAMENTE a string "NOT_FOUND".
  `
};

// --- Components ---

const App: React.FC = () => {
  const [isAuthorized, setIsAuthorized] = useState<boolean>(false);
  const [password, setPassword] = useState<string>('');
  const [loginError, setLoginError] = useState<string>('');
  
  // --- States ---
  const [language, setLanguage] = useState<Language>('pt');
  const [activeTab, setActiveTab] = useState<'prompt' | 'library'>('prompt');
  
  // Terminal Inputs
  const [styleInput, setStyleInput] = useState<string>('');
  const [lyricsInput, setLyricsInput] = useState<string>('');
  const [bpmInput, setBpmInput] = useState<string>(''); 
  const [sunoVersion, setSunoVersion] = useState<SunoVersion>('v5');
  const [vocalTone, setVocalTone] = useState<VocalTone>('Male Tenor');
  
  // Terminal Results
  const [generatedStyle, setGeneratedStyle] = useState<string>('');
  const [generatedLyrics, setGeneratedLyrics] = useState<string>('');
  const [groundingSources, setGroundingSources] = useState<GroundingSource[]>([]);
  const [searchError, setSearchError] = useState<string>('');

  // Processing States
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [usePhonetic, setUsePhonetic] = useState<boolean>(false);
  const [useTurbo, setUseTurbo] = useState<boolean>(false);
  
  // UI States
  const [copiedStyle, setCopiedStyle] = useState<boolean>(false);
  const [copiedLyrics, setCopiedLyrics] = useState<boolean>(false);
  const [namingItem, setNamingItem] = useState<SavedItem | null>(null);
  const [newName, setNewName] = useState('');
  const [savedLibrary, setSavedLibrary] = useState<SavedItem[]>([]);
  const [showHistory, setShowHistory] = useState<boolean>(false);

  const LOGIN_PASSWORD = "groovesmg33";
  const t = translations[language];

  useEffect(() => {
    const savedLib = localStorage.getItem('smg_library_v2');
    if (savedLib) setSavedLibrary(JSON.parse(savedLib));
    if (sessionStorage.getItem('smg_auth') === 'true') setIsAuthorized(true);
  }, []);

  useEffect(() => localStorage.setItem('smg_library_v2', JSON.stringify(savedLibrary)), [savedLibrary]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === LOGIN_PASSWORD) {
      setIsAuthorized(true);
      sessionStorage.setItem('smg_auth', 'true');
    } else {
      setLoginError(t.login_error);
      setTimeout(() => setLoginError(""), 3000);
    }
  };

  // --- TERMINAL FUNCTIONS ---
  const generateDeepEngineeredContent = async () => {
    if (!styleInput && !lyricsInput) return;
    setIsProcessing(true);
    setGroundingSources([]);
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    try {
      const prompt = PromptTemplates.deepEngineeredProcess(styleInput, lyricsInput, sunoVersion, bpmInput, vocalTone, usePhonetic, useTurbo, language);
      const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview', 
        contents: prompt,
        config: { 
          responseMimeType: "application/json",
          thinkingConfig: { thinkingBudget: 1024 } 
        }
      });
      
      const text = response.text;
      if (text) {
        const data = JSON.parse(text.trim());
        setGeneratedStyle(data.engineeredStyle);
        setGeneratedLyrics(data.processedLyrics);
        if (!bpmInput && data.bpm) setBpmInput(data.bpm);
      }
    } catch (e) { console.error(e); } finally { setIsProcessing(false); }
  };

  const handleDeepSearchLyrics = async () => {
    if (!lyricsInput || lyricsInput.length < 2) return;
    setIsSearching(true);
    setSearchError('');
    setGroundingSources([]);
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    try {
      const prompt = PromptTemplates.fetchLyricsOnly(lyricsInput, language);
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
        config: { tools: [{ googleSearch: {} }] }
      });
      
      const text = response.text?.trim();
      if (text === "NOT_FOUND") {
        setSearchError(t.err_search_not_found);
      } else if (text) { 
        setLyricsInput(text); 
        const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
        if (chunks) {
          const sources: GroundingSource[] = chunks.filter(c => c.web).map(c => ({ title: c.web!.title || 'Fonte externa', uri: c.web!.uri }));
          setGroundingSources(sources);
        }
      }
    } catch (e) { 
      console.error(e); 
      setSearchError(t.err_search_conn);
    } finally { setIsSearching(false); }
  };

  const clearLyrics = () => {
    setLyricsInput('');
    setGeneratedLyrics('');
    setGroundingSources([]);
    setSearchError('');
  };

  const confirmSaveItem = () => {
    if (!namingItem || !newName.trim()) return;
    const newItem: SavedItem = { 
      id: Math.random().toString(36).substr(2, 9), 
      name: newName.trim(), 
      content: namingItem.content, 
      type: namingItem.type, 
      timestamp: Date.now()
    };
    setSavedLibrary([newItem, ...savedLibrary]);
    setNamingItem(null);
    setNewName('');
  };

  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-[#020617] flex items-center justify-center p-6 relative overflow-hidden font-sans">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-purple-900/20 via-transparent to-transparent opacity-50"></div>
        <form onSubmit={handleLogin} className="relative z-10 w-full max-w-md bg-white/[0.03] border border-white/10 p-10 rounded-[2.5rem] shadow-2xl backdrop-blur-3xl animate-fade-in">
          <div className="flex flex-col items-center mb-10">
            <div className="relative mb-6">
              <div className="absolute inset-0 bg-purple-600 blur-2xl opacity-40 animate-pulse"></div>
              <div className="relative p-5 bg-gradient-to-br from-purple-600 to-indigo-700 rounded-3xl shadow-xl">
                <Lock className="w-10 h-10 text-white" />
              </div>
            </div>
            <h1 className="text-3xl font-black text-white uppercase tracking-tighter text-center">{t.login_title} <span className="text-purple-500">{t.login_subtitle}</span></h1>
            <p className="text-slate-500 text-[10px] uppercase tracking-[0.3em] font-bold mt-2">{t.login_protocol}</p>
          </div>
          <div className="space-y-4">
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder={t.login_placeholder} className="w-full bg-black/40 border border-white/10 rounded-2xl p-5 text-center text-white outline-none focus:border-purple-500/50 transition-all font-mono" />
            {loginError && <p className="text-red-400 text-center text-[10px] font-black uppercase tracking-widest">{loginError}</p>}
            <button type="submit" className="w-full py-5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white rounded-2xl font-black uppercase shadow-lg transition-all active:scale-95">{t.login_btn}</button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 font-sans pb-24 selection:bg-purple-500/40 relative overflow-hidden">
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-purple-900/10 blur-[150px] rounded-full"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-900/10 blur-[150px] rounded-full"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-10">
        <header className="mb-12 flex flex-col lg:flex-row items-center justify-between gap-8 animate-fade-in">
          <div className="flex items-center gap-6">
            <div className="relative group">
              <div className="absolute inset-0 bg-purple-600 blur-xl opacity-30 group-hover:opacity-50 transition-opacity"></div>
              <div className="relative p-4 bg-gradient-to-br from-purple-600 to-indigo-700 rounded-[1.5rem] shadow-2xl">
                <Cpu className="w-10 h-10 text-white" />
              </div>
            </div>
            <div className="flex flex-col">
              <h1 className="text-5xl md:text-6xl font-black tracking-tighter text-white uppercase leading-none mb-1" style={{ textShadow: '0 0 30px rgba(147, 51, 234, 0.5)' }}>
                {t.header_title}
              </h1>
              <div className="flex flex-col">
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400 text-sm md:text-lg font-bold tracking-[0.35em] uppercase mb-2">
                    {t.header_subtitle}
                  </span>
                  <p className="text-slate-400 text-[10px] md:text-xs font-medium tracking-wide border-l-2 border-purple-500 pl-3 italic opacity-80">
                    {t.header_slogan}
                  </p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex bg-white/[0.03] border border-white/10 rounded-full p-1">
              <button onClick={() => setLanguage('pt')} className={`px-3 py-1 rounded-full text-[10px] font-bold transition-all ${language === 'pt' ? 'bg-purple-600 text-white' : 'text-slate-500 hover:text-white'}`}>PT</button>
              <button onClick={() => setLanguage('en')} className={`px-3 py-1 rounded-full text-[10px] font-bold transition-all ${language === 'en' ? 'bg-purple-600 text-white' : 'text-slate-500 hover:text-white'}`}>EN</button>
              <button onClick={() => setLanguage('es')} className={`px-3 py-1 rounded-full text-[10px] font-bold transition-all ${language === 'es' ? 'bg-purple-600 text-white' : 'text-slate-500 hover:text-white'}`}>ES</button>
            </div>

            <nav className="flex items-center gap-3 p-2 bg-white/[0.03] border border-white/10 rounded-[2rem] backdrop-blur-md">
              <button onClick={() => setActiveTab('prompt')} className={`flex items-center gap-2 px-6 py-3 rounded-full text-[10px] font-black transition-all uppercase tracking-widest ${activeTab === 'prompt' ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300 hover:bg-white/5'}`}>
                <Zap size={14} /> {t.nav_terminal}
              </button>
              <button onClick={() => setActiveTab('library')} className={`flex items-center gap-2 px-6 py-3 rounded-full text-[10px] font-black transition-all uppercase tracking-widest ${activeTab === 'library' ? 'bg-gradient-to-r from-indigo-600 to-blue-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300 hover:bg-white/5'}`}>
                <BookOpen size={14} /> {t.nav_vault}
              </button>
              <div className="w-[1px] h-6 bg-white/10 mx-1"></div>
              <button onClick={() => setShowHistory(!showHistory)} className="p-3 text-slate-500 hover:text-white transition-all rounded-full hover:bg-white/5">
                <History size={20} />
              </button>
            </nav>
          </div>
        </header>

        {activeTab === 'prompt' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 animate-fade-in">
            {/* INPUT SIDE */}
            <div className="lg:col-span-5 space-y-8">
              {/* STYLE MODULE */}
              <div className="bg-white/[0.02] border border-white/10 rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden backdrop-blur-xl group hover:border-purple-500/30 transition-all">
                <div className="flex justify-between items-center mb-8 relative z-10">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-purple-500/20 rounded-lg text-purple-400"><Disc size={18} /></div>
                    <label className="text-[11px] font-black uppercase tracking-[0.2em] text-purple-400">{t.term_style_title}</label>
                  </div>
                </div>
                <div className="space-y-6 relative z-10">
                  <input value={styleInput} onChange={e => setStyleInput(e.target.value)} placeholder={t.term_style_placeholder} className="w-full bg-black/40 border border-white/5 rounded-[1.25rem] p-5 text-white text-sm outline-none focus:border-purple-500/50 transition-all placeholder:text-slate-700" />
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-black/40 border border-white/5 rounded-[1.25rem] p-4">
                      <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-2 block">{t.term_bpm}</label>
                      <input type="text" value={bpmInput} onChange={e => setBpmInput(e.target.value)} placeholder="Auto" className="bg-transparent text-white font-mono text-xl outline-none w-full" />
                    </div>
                    <div className="bg-black/40 border border-white/5 rounded-[1.25rem] p-4">
                      <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-2 block">{t.term_tone}</label>
                      <select value={vocalTone} onChange={e => setVocalTone(e.target.value as VocalTone)} className="bg-transparent text-white font-bold text-xs outline-none w-full cursor-pointer appearance-none">
                        <option value="Male Tenor" className="bg-[#020617]">{t.tone_male_tenor}</option>
                        <option value="Male Baritone" className="bg-[#020617]">{t.tone_male_baritone}</option>
                        <option value="Female Soprano" className="bg-[#020617]">{t.tone_female_soprano}</option>
                        <option value="Female Alto" className="bg-[#020617]">{t.tone_female_alto}</option>
                        <option value="Soulful Raspy" className="bg-[#020617]">{t.tone_soulful_raspy}</option>
                        <option value="Gospel Power" className="bg-[#020617]">{t.tone_gospel_power}</option>
                        <option value="Smooth R&B" className="bg-[#020617]">{t.tone_smooth_rnb}</option>
                        <option value="Rock Grit" className="bg-[#020617]">{t.tone_rock_grit}</option>
                      </select>
                    </div>
                  </div>
                  
                  <div className="bg-black/40 border border-white/5 rounded-[1.25rem] p-4">
                    <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-2 block">{t.term_engine}</label>
                    <div className="flex gap-2">
                      {['v5', 'v4.5+', 'v4', 'v3.5'].map((v) => (
                        <button key={v} onClick={() => setSunoVersion(v as SunoVersion)} className={`flex-1 py-2 rounded-lg text-[10px] font-black uppercase transition-all border ${sunoVersion === v ? 'bg-purple-600/20 border-purple-500/50 text-white' : 'bg-white/5 border-white/5 text-slate-500 hover:text-slate-300'}`}>{v}</button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* LYRICS MODULE */}
              <div className="bg-white/[0.02] border border-white/10 rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden backdrop-blur-xl group hover:border-pink-500/30 transition-all">
                <div className="flex justify-between items-center mb-8 relative z-10">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-pink-500/20 rounded-lg text-pink-400"><Mic2 size={18} /></div>
                    <label className="text-[11px] font-black uppercase tracking-[0.2em] text-pink-400">{t.term_lyrics_title}</label>
                  </div>
                  <button onClick={clearLyrics} className="p-2 text-slate-500 hover:text-red-500 transition-all" title="Limpar Tudo"><Eraser size={18} /></button>
                </div>

                {language === 'pt' && (
                  <div className="flex gap-2 mb-6 bg-black/40 p-1.5 rounded-2xl border border-white/5 relative z-10">
                    <button onClick={() => { setUsePhonetic(!usePhonetic); if(!usePhonetic) setUseTurbo(false); }} className={`flex-1 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-tighter transition-all ${usePhonetic ? 'bg-indigo-600 text-white' : 'text-slate-500'}`}>{t.term_anti_copy_std}</button>
                    <button onClick={() => { setUseTurbo(!useTurbo); if(!useTurbo) setUsePhonetic(false); }} className={`flex-1 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-tighter transition-all ${useTurbo ? 'bg-pink-600 text-white shadow-lg shadow-pink-900/40' : 'text-slate-500'}`}>{t.term_anti_copy_turbo}</button>
                  </div>
                )}

                <div className="relative z-10 group/lyrics">
                  <textarea value={lyricsInput} onChange={e => setLyricsInput(e.target.value)} placeholder={t.term_lyrics_placeholder} className="w-full h-56 bg-black/40 border border-white/5 rounded-[1.5rem] p-6 text-xs font-mono text-slate-300 focus:border-pink-500/50 transition-all resize-none custom-scrollbar" />
                  
                  {searchError && (
                    <div className="absolute bottom-16 left-4 right-4 bg-red-500/10 border border-red-500/30 p-2 rounded-lg flex items-center gap-2 animate-fade-in backdrop-blur-md">
                      <AlertTriangle size={12} className="text-red-400 flex-shrink-0" />
                      <p className="text-[9px] text-red-200 font-bold">{searchError}</p>
                    </div>
                  )}

                  <button onClick={handleDeepSearchLyrics} disabled={isSearching || !lyricsInput} className="absolute bottom-5 right-5 p-3 bg-white/5 border border-white/10 text-white rounded-xl text-[10px] font-black flex items-center gap-2 hover:bg-white/10 disabled:opacity-30 transition-all">
                    {isSearching ? <Loader2 size={14} className="animate-spin" /> : <Search size={14} />} 
                    {t.term_deep_search}
                  </button>
                </div>
              </div>

              <button 
                onClick={generateDeepEngineeredContent} 
                disabled={isProcessing || (!styleInput && !lyricsInput)} 
                className="w-full py-7 bg-gradient-to-br from-purple-600 via-indigo-600 to-blue-600 rounded-[2.5rem] font-black text-xl uppercase tracking-tighter shadow-2xl transition-all flex items-center justify-center gap-4 active:scale-[0.97] group relative overflow-hidden"
              >
                {isProcessing ? <Loader2 className="animate-spin" size={28} /> : (
                  <>
                    <Zap size={28} fill="white" className="group-hover:scale-125 transition-transform" /> 
                    <span>{t.term_process_btn}</span>
                  </>
                )}
                <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </button>
            </div>

            {/* OUTPUT SIDE */}
            <div className="lg:col-span-7 space-y-8 flex flex-col">
              {/* STYLE BOX */}
              <div className="bg-white/[0.02] border border-white/10 rounded-[2.5rem] p-8 shadow-2xl flex flex-col h-[300px] relative overflow-hidden backdrop-blur-xl group">
                <div className="flex justify-between items-center mb-6 relative z-10">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-indigo-500/20 rounded-lg text-indigo-400"><Layers size={18} /></div>
                    <h3 className="text-slate-500 font-black text-[11px] uppercase tracking-[0.2em]">{t.out_style_title}</h3>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={() => setNamingItem({ content: generatedStyle, type: 'prompt', timestamp: 0, id: '', name: '' })} disabled={!generatedStyle} className="p-2.5 bg-green-500/10 text-green-400 border border-green-500/20 rounded-xl hover:bg-green-500 hover:text-white transition-all"><Save size={16} /></button>
                    <button onClick={() => { navigator.clipboard.writeText(generatedStyle); setCopiedStyle(true); setTimeout(() => setCopiedStyle(false), 2000); }} className="p-2.5 rounded-xl border border-white/10 text-slate-500 hover:text-white transition-all">
                      {copiedStyle ? <Check size={18} className="text-green-400" /> : <Copy size={18} />}
                    </button>
                  </div>
                </div>
                <div className="bg-black/30 border border-white/5 rounded-[1.5rem] p-6 flex-grow overflow-y-auto custom-scrollbar relative z-10">
                  {generatedStyle ? (
                    <p className="text-indigo-100 text-sm leading-relaxed font-medium">{generatedStyle}</p>
                  ) : (
                    <div className="h-full flex flex-col items-center justify-center opacity-10 gap-4">
                      <Volume2 size={40} className="animate-pulse" />
                      <p className="text-[10px] font-black uppercase tracking-widest">{t.out_waiting_eng}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* LYRIC BOX */}
              <div className="bg-white/[0.02] border border-white/10 rounded-[2.5rem] p-8 shadow-2xl flex flex-col flex-grow relative overflow-hidden backdrop-blur-xl group min-h-[500px]">
                <div className="flex justify-between items-center mb-6 relative z-10">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-pink-500/20 rounded-lg text-pink-400"><Music2 size={18} /></div>
                    <h3 className="text-slate-500 font-black text-[11px] uppercase tracking-[0.2em]">{t.out_lyrics_title}</h3>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={() => setNamingItem({ content: generatedLyrics, type: 'lyric', timestamp: 0, id: '', name: '' })} disabled={!generatedLyrics} className="p-2.5 bg-green-500/10 text-green-400 border border-green-500/20 rounded-xl hover:bg-green-500 hover:text-white transition-all"><Save size={16} /></button>
                    <button onClick={() => { navigator.clipboard.writeText(generatedLyrics); setCopiedLyrics(true); setTimeout(() => setCopiedLyrics(false), 2000); }} className="p-2.5 rounded-xl border border-white/10 text-slate-500 hover:text-white transition-all">
                      {copiedStyle ? <Check size={18} className="text-green-400" /> : <Copy size={18} />}
                    </button>
                  </div>
                </div>
                
                {groundingSources.length > 0 && (
                  <div className="mb-6 bg-blue-500/10 border border-blue-500/20 rounded-2xl p-4 animate-fade-in relative z-10">
                    <div className="flex items-center gap-2 mb-2">
                      <ExternalLink size={14} className="text-blue-400" />
                      <span className="text-[9px] font-black text-blue-400 uppercase tracking-widest">{t.out_sources}</span>
                    </div>
                    <div className="flex flex-wrap gap-3">
                      {groundingSources.map((s, idx) => (
                        <a key={idx} href={s.uri} target="_blank" rel="noopener noreferrer" className="text-[10px] text-blue-300 hover:text-white underline decoration-blue-500/30">
                          {s.title}
                        </a>
                      ))}
                    </div>
                  </div>
                )}

                <div className="bg-black/30 border border-white/5 rounded-[1.5rem] p-8 flex-grow overflow-y-auto custom-scrollbar relative z-10">
                  {generatedLyrics ? (
                    <pre className="text-slate-200 text-sm font-mono whitespace-pre-wrap leading-relaxed">{generatedLyrics}</pre>
                  ) : (
                    <div className="h-full flex flex-col items-center justify-center opacity-10 gap-4">
                      <Feather size={40} className="animate-pulse" />
                      <p className="text-[10px] font-black uppercase tracking-widest">{t.out_waiting_lyr}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* LIBRARY TAB */}
        {activeTab === 'library' && (
          <div className="space-y-10 animate-fade-in relative z-10">
            <h2 className="text-3xl font-black text-white flex items-center gap-4 uppercase tracking-tighter"><Trophy className="text-yellow-500" /> {t.lib_title}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {savedLibrary.map(item => (
                <div key={item.id} className="bg-white/[0.03] border border-white/10 rounded-[2rem] p-8 shadow-xl relative overflow-hidden group hover:border-blue-500 transition-all hover:-translate-y-2">
                  <div className={`absolute top-0 left-0 w-full h-1.5 ${item.type === 'prompt' ? 'bg-purple-600' : 'bg-pink-600'}`}></div>
                  <div className="flex justify-between items-start mb-6">
                    <span className={`text-[9px] font-black uppercase px-3 py-1 rounded-full border ${item.type === 'prompt' ? 'bg-purple-600/10 text-purple-400 border-purple-500/20' : 'bg-pink-600/10 text-pink-400 border-pink-500/20'}`}>{item.type}</span>
                    <button onClick={() => setSavedLibrary(savedLibrary.filter(i => i.id !== item.id))} className="p-2 text-slate-700 hover:text-red-500 transition-all"><Trash2 size={16} /></button>
                  </div>
                  <h4 className="text-white font-black text-lg mb-3 uppercase truncate">{item.name}</h4>
                  <p className="text-slate-500 text-[11px] line-clamp-4 mb-8 font-mono italic leading-relaxed">{item.content}</p>
                  <button onClick={() => { 
                      if (item.type === 'prompt') { setGeneratedStyle(item.content); setStyleInput(item.name); setActiveTab('prompt'); } 
                      else if (item.type === 'lyric') { setGeneratedLyrics(item.content); setLyricsInput(item.content); setActiveTab('prompt'); }
                   }} className="w-full py-4 bg-white/5 hover:bg-blue-600 hover:text-white rounded-2xl text-[10px] font-black transition-all uppercase tracking-widest">{t.lib_restore}</button>
                </div>
              ))}
              {savedLibrary.length === 0 && <div className="col-span-full py-40 text-center opacity-10 uppercase font-black text-sm tracking-[0.5em]">{t.lib_empty}</div>}
            </div>
          </div>
        )}
      </div>

      {/* MODALS */}
      {namingItem && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 backdrop-blur-3xl animate-fade-in">
          <div className="absolute inset-0 bg-[#020617]/90" onClick={() => setNamingItem(null)}></div>
          <div className="relative w-full max-w-sm bg-[#0a0f1e] border border-white/10 rounded-[3rem] p-10 shadow-2xl animate-scale-up text-center">
            <h3 className="text-2xl font-black text-white uppercase mb-6 tracking-tighter">{t.modal_save_title}</h3>
            <input autoFocus value={newName} onChange={e => setNewName(e.target.value)} onKeyDown={e => e.key === 'Enter' && confirmSaveItem()} placeholder={t.modal_placeholder} className="w-full bg-black/40 border border-white/10 rounded-2xl p-5 text-white font-bold text-center outline-none focus:border-green-500 mb-6" />
            <div className="flex gap-4">
              <button onClick={() => setNamingItem(null)} className="flex-1 py-5 bg-white/5 rounded-2xl text-[10px] font-black uppercase text-slate-400 transition-all">{t.modal_cancel}</button>
              <button onClick={confirmSaveItem} className="flex-1 py-5 bg-green-600 hover:bg-green-500 text-white rounded-2xl text-[10px] font-black uppercase transition-all shadow-lg">{t.modal_confirm}</button>
            </div>
          </div>
        </div>
      )}

      {showHistory && (
        <div className="fixed inset-y-0 right-0 w-80 bg-[#0a0f1e] border-l border-white/10 z-[150] shadow-2xl animate-slide-left p-8 overflow-y-auto backdrop-blur-3xl">
          <div className="flex items-center justify-between mb-10">
            <h3 className="text-xl font-black text-white uppercase tracking-tighter">{t.hist_title}</h3>
            <button onClick={() => setShowHistory(false)} className="p-2 text-slate-500 hover:text-white bg-white/5 rounded-full"><X size={20} /></button>
          </div>
          <div className="space-y-6">
            <div className="bg-white/5 p-5 rounded-3xl border border-white/5">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-[10px] text-green-400 font-black uppercase tracking-widest">{t.hist_active}</span>
              </div>
              <p className="text-[11px] text-slate-500 leading-relaxed uppercase tracking-tighter">{t.hist_desc}</p>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; } 
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.05); border-radius: 10px; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes scaleUp { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
        @keyframes slideLeft { from { transform: translateX(100%); } to { transform: translateX(0); } }
        .animate-fade-in { animation: fadeIn 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        .animate-scale-up { animation: scaleUp 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        .animate-slide-left { animation: slideLeft 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
      `}</style>
    </div>
  );
};

export default App;
