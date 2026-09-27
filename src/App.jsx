import React, { useState, useEffect } from 'react';
import { Info, Settings, RefreshCw, Eye, Sparkles, Heart } from 'lucide-react';

// ====================================================================
// KAMUS PASANGAN HURUF (KATA BENDA & SUASANA INDAH, NYATA & SEJUK)
// ====================================================================
const pairDictionary = {
  // Kombinasi BA, BI, DA, DI
  'BA-DA': 'Badan',   'BA-DI': 'Batik',    'BA-PI': 'Bait',    'BA-GA': 'Bintang', 
  'BA-SA': 'Danau',   'BA-MI': 'Bambu',   'BA-TA': 'Batu',    'BA-JA': 'Bunga',   
  'BA-KI': 'Baskom',  'BA-NA': 'Bahtera', 'BA-LA': 'Balok',   'BI-PA': 'Bintang', 
  'BI-SA': 'Bisikan', 'BA-BI': 'Batu',

  // Kombinasi DI, DA, GA, GI, TI, TA, MA, MI
  'DI-GA': 'Dirgantara','DI-PI': 'Dermaga','DA-MI': 'Damai',   'DA-NA': 'Danau',
  'DA-GA': 'Dermaga', 'TI-MA': 'Timah',   'GA-SA': 'Gading',  'GA-MI': 'Gamis',   
  'GA-TA': 'Gardan',  'GA-JA': 'Gajah',   'GA-KI': 'Gamelan', 'GA-NA': 'Gading',  
  'GA-LA': 'Gaza',    'GI-PA': 'Gitar',   'GI-SA': 'Girimukti','GI-BA': 'Gubuk',   
  'GI-KI': 'Gitar',   'JI-GA': 'Jelita',

  // Kombinasi PA, PI, SA, SI, NA, NI
  'PI-GA': 'Pigura',  'PI-SA': 'Pita',    'PI-BA': 'Piala',   'PA-SI': 'Pasir',
  'PA-BA': 'Papan',   'PA-SA': 'Pasar',   'PA-DI': 'Padi',    'PI-NI': 'Pinus',
  'SA-MI': 'Samudra', 'SA-BA': 'Sabana',  'SA-GA': 'Saga',    'SI-BA': 'Sinar',   
  'SI-PA': 'Sirup',   'SI-JI': 'Sinar',   'NA-SI': 'Nasi',    'NA-LA': 'Nala',

  // Kombinasi TA, TI, JA, JI, KA, KI, LA, MA, MI
  'TA-GA': 'Taman',   'TA-MI': 'Taman',   'JA-KI': 'Jaket',   'JA-NA': 'Jalan',
  'LA-JA': 'Lentera', 'KI-LA': 'Kilau',   'MA-NA': 'Mahkota', 'MA-MI': 'Mawar',   
  'MA-LI': 'Melati',  'LA-MA': 'Lampu',   'KA-LA': 'Kalam',   'MI-TA': 'Mutiara'
};

// Helper untuk mengambil nama kata dari pasangan huruf
function getWordFromPair(pairKey) {
  if (pairDictionary[pairKey]) return pairDictionary[pairKey];
  
  let cleanKey = pairKey.replace('-', '');
  const fallbackMap = {
    'BADA': 'Badan',  'TIMA': 'Timah',  'DAGA': 'Dermaga', 'JIGA': 'Jelita',
    'NASI': 'Nasi',   'PINI': 'Pinus',  'PADI': 'Padi',    'SIJI': 'Sinar',
    'MALI': 'Melati', 'BABI': 'Batu',   'SAMI': 'Samudra', 'TAGA': 'Taman'
  };
  
  return fallbackMap[cleanKey] || (cleanKey.charAt(0).toUpperCase() + cleanKey.slice(1).toLowerCase());
}

// ====================================================================
// PEMBUAT CERITA TERPISAH (SEKUENSIAL & ALAMI)
// ====================================================================
function buildSingleStory(cycles, badgeBg, badgeText, borderCol) {
  let flatTargets = cycles.flat();
  if (flatTargets.length === 0) return '<span class="text-gray-400 font-medium">Sudah rapi (Solved) ✨</span>';

  let words = [];
  for (let i = 0; i < flatTargets.length; i += 2) {
    if (i + 1 < flatTargets.length) {
      words.push(getWordFromPair(`${flatTargets[i]}-${flatTargets[i+1]}`));
    } else {
      words.push(flatTargets[i]); // Sisa target tunggal
    }
  }

  // Penghubung lembut, singkat, dan menenangkan
  const connectors = [
    '✨ menyinari ✨',
    '🌸 menghiasi 🌸',
    '🕊️ berada di dekat 🕊️',
    '🌟 memancarkan berkah ke 🌟',
    '🍃 bersanding dengan 🍃'
  ];

  let sentenceElements = [];
  for (let i = 0; i < words.length; i++) {
    sentenceElements.push(
      `<strong class="${badgeBg} ${badgeText} ${borderCol} px-2.5 py-0.5 rounded border font-bold">${words[i]}</strong>`
    );
    if (i < words.length - 1) {
      let conn = connectors[i % connectors.length];
      sentenceElements.push(`<span class="text-gray-600 font-medium text-xs md:text-sm mx-1">${conn}</span>`);
    }
  }

  return sentenceElements.join(' ');
}

// ====================================================================
// SIMULATOR BLD (STANDAR WCA: U=PUTIH, F=HIJAU)
// ====================================================================
function solveBLDMemo(scrambleStr) {
  let ePos = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
  let eOri = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  let cPos = [0, 1, 2, 3, 4, 5, 6, 7];
  let cOri = [0, 0, 0, 0, 0, 0, 0, 0];

  let faces = [];
  for (let f = 0; f < 6; f++) {
    for (let i = 0; i < 9; i++) faces.push(f);
  }

  const rotFace = (base) => {
    let p = faces.slice(base, base + 9);
    faces[base+0]=p[6]; faces[base+1]=p[3]; faces[base+2]=p[0];
    faces[base+3]=p[7]; faces[base+4]=p[4]; faces[base+5]=p[1];
    faces[base+6]=p[8]; faces[base+7]=p[5]; faces[base+8]=p[2];
  };

  const edgeLetters = {
    '0_0': 'BA', '0_1': 'BI', '1_0': 'DA', '1_1': 'DI',
    '2_0': 'GA', '2_1': 'GI', '3_0': 'JA', '3_1': 'JI',
    '4_0': 'KA', '4_1': 'KI', '5_0': 'LA', '5_1': 'LI',
    '6_0': 'MA', '6_1': 'MI', '7_0': 'NA', '7_1': 'NI',
    '9_0': 'PA', '9_1': 'PI', '10_0': 'SA', '10_1': 'SI',
    '11_0': 'TA', '11_1': 'TI'
  };

  const cornerLetters = {
    '1_0': 'BA', '1_1': 'BI', '1_2': 'DA',
    '2_0': 'DI', '2_1': 'GA', '2_2': 'GI',
    '3_0': 'JA', '3_1': 'JI', '3_2': 'KA',
    '4_0': 'KI', '4_1': 'LA', '4_2': 'LI',
    '5_0': 'MA', '5_1': 'MI', '5_2': 'NA',
    '6_0': 'NI', '6_1': 'PA', '6_2': 'PI',
    '7_0': 'SA', '7_1': 'SI', '7_2': 'TA'
  };

  const doMove = (m) => {
    let face = m[0];
    let turns = m.includes("'") ? 3 : m.includes("2") ? 2 : 1;

    for (let t = 0; t < turns; t++) {
      if (face === 'U') {
        let cp = [cPos[0], cPos[1], cPos[2], cPos[3]], co = [cOri[0], cOri[1], cOri[2], cOri[3]];
        cPos[0] = cp[3]; cPos[1] = cp[0]; cPos[2] = cp[1]; cPos[3] = cp[2];
        cOri[0] = co[3]; cOri[1] = co[0]; cOri[2] = co[1]; cOri[3] = co[2];

        let ep = [ePos[0], ePos[1], ePos[2], ePos[3]], eo = [eOri[0], eOri[1], eOri[2], eOri[3]];
        ePos[0] = ep[3]; ePos[1] = ep[0]; ePos[2] = ep[1]; ePos[3] = ep[2];
        eOri[0] = eo[3]; eOri[1] = eo[0]; eOri[2] = eo[1]; eOri[3] = eo[2];

        rotFace(0);
        let tmp = [faces[45], faces[46], faces[47]];
        faces[45]=faces[36]; faces[46]=faces[37]; faces[47]=faces[38];
        faces[36]=faces[18]; faces[37]=faces[19]; faces[38]=faces[20];
        faces[18]=faces[9];  faces[19]=faces[10]; faces[20]=faces[11];
        faces[9]=tmp[0];     faces[10]=tmp[1];    faces[11]=tmp[2];
      } else if (face === 'D') {
        let cp = [cPos[4], cPos[5], cPos[6], cPos[7]], co = [cOri[4], cOri[5], cOri[6], cOri[7]];
        cPos[4] = cp[3]; cPos[5] = cp[0]; cPos[6] = cp[1]; cPos[7] = cp[2];
        cOri[4] = co[3]; cOri[5] = co[0]; cOri[6] = co[1]; cOri[7] = co[2];

        let ep = [ePos[8], ePos[9], ePos[10], ePos[11]], eo = [eOri[8], eOri[9], eOri[10], eOri[11]];
        ePos[8] = ep[3]; ePos[9] = ep[0]; ePos[10] = ep[1]; ePos[11] = ep[2];
        eOri[8] = eo[3]; eOri[9] = eo[0]; eOri[10] = eo[1]; eOri[11] = eo[2];

        rotFace(27);
        let tmp = [faces[24], faces[25], faces[26]];
        faces[24]=faces[42]; faces[25]=faces[43]; faces[26]=faces[44];
        faces[42]=faces[51]; faces[43]=faces[52]; faces[44]=faces[53];
        faces[51]=faces[15]; faces[52]=faces[16]; faces[53]=faces[17];
        faces[15]=tmp[0];     faces[16]=tmp[1];    faces[17]=tmp[2];
      } else if (face === 'L') {
        let cp = [cPos[0], cPos[3], cPos[4], cPos[7]], co = [cOri[0], cOri[3], cOri[4], cOri[7]];
        cPos[0] = cp[3]; cPos[3] = cp[0]; cPos[4] = cp[1]; cPos[7] = cp[2];
        cOri[0] = (co[3] + 1) % 3; cOri[3] = (co[0] + 2) % 3;
        cOri[4] = (co[1] + 1) % 3; cOri[7] = (co[2] + 2) % 3;

        let ep = [ePos[3], ePos[5], ePos[11], ePos[6]], eo = [eOri[3], eOri[5], eOri[11], eOri[6]];
        ePos[3] = ep[3]; ePos[5] = ep[0]; ePos[11] = ep[1]; ePos[6] = ep[2];
        eOri[3] = eo[3]; eOri[5] = eo[0]; eOri[11] = eo[1]; eOri[6] = eo[2];

        rotFace(36);
        let uIdx=[0,3,6], fIdx=[18,21,24], dIdx=[27,30,33], bIdx=[53,50,47];
        let tmp = uIdx.map(i => faces[i]);
        uIdx.forEach((idx, i) => faces[idx] = faces[bIdx[i]]);
        bIdx.forEach((idx, i) => faces[idx] = faces[dIdx[i]]);
        dIdx.forEach((idx, i) => faces[idx] = faces[fIdx[i]]);
        fIdx.forEach((idx, i) => faces[idx] = tmp[i]);
      } else if (face === 'R') {
        let cp = [cPos[1], cPos[2], cPos[5], cPos[6]], co = [cOri[1], cOri[2], cOri[5], cOri[6]];
        cPos[1] = cp[3]; cPos[2] = cp[0]; cPos[5] = cp[1]; cPos[6] = cp[2];
        cOri[1] = (co[3] + 2) % 3; cOri[2] = (co[0] + 1) % 3;
        cOri[5] = (co[1] + 2) % 3; cOri[6] = (co[2] + 1) % 3;

        let ep = [ePos[1], ePos[7], ePos[9], ePos[4]], eo = [eOri[1], eOri[7], eOri[9], eOri[4]];
        ePos[1] = ep[3]; ePos[7] = ep[0]; ePos[9] = ep[1]; ePos[4] = ep[2];
        eOri[1] = eo[3]; eOri[7] = eo[0]; eOri[9] = eo[1]; eOri[4] = eo[2];

        rotFace(9);
        let uIdx=[2,5,8], bIdx=[51,48,45], dIdx=[35,32,29], fIdx=[26,23,20];
        let tmp = uIdx.map(i => faces[i]);
        uIdx.forEach((idx, i) => faces[idx] = faces[fIdx[i]]);
        fIdx.forEach((idx, i) => faces[idx] = faces[dIdx[i]]);
        dIdx.forEach((idx, i) => faces[idx] = faces[bIdx[i]]);
        bIdx.forEach((idx, i) => faces[idx] = tmp[i]);
      } else if (face === 'F') {
        let cp = [cPos[3], cPos[2], cPos[5], cPos[4]], co = [cOri[3], cOri[2], cOri[5], cOri[4]];
        cPos[3] = cp[3]; cPos[2] = cp[0]; cPos[5] = cp[1]; cPos[4] = cp[2];
        cOri[3] = (co[3] + 1) % 3; cOri[2] = (co[0] + 2) % 3;
        cOri[5] = (co[1] + 1) % 3; cOri[4] = (co[2] + 2) % 3;

        let ep = [ePos[2], ePos[4], ePos[8], ePos[5]], eo = [eOri[2], eOri[4], eOri[8], eOri[5]];
        ePos[2] = ep[3]; ePos[4] = ep[0]; ePos[8] = ep[1]; ePos[5] = ep[2];
        eOri[2] = (eo[3] + 1) % 2; eOri[4] = (eo[0] + 1) % 2;
        eOri[8] = (eo[1] + 1) % 2; eOri[5] = (eo[2] + 1) % 2;

        rotFace(18);
        let uIdx=[6,7,8], rIdx=[9,12,15], dIdx=[29,28,27], lIdx=[44,41,38];
        let tmp = uIdx.map(i => faces[i]);
        uIdx.forEach((idx, i) => faces[idx] = faces[lIdx[i]]);
        lIdx.forEach((idx, i) => faces[idx] = faces[dIdx[i]]);
        dIdx.forEach((idx, i) => faces[idx] = faces[rIdx[i]]);
        rIdx.forEach((idx, i) => faces[idx] = tmp[i]);
      } else if (face === 'B') {
        let cp = [cPos[1], cPos[0], cPos[7], cPos[6]], co = [cOri[1], cOri[0], cOri[7], cOri[6]];
        cPos[1] = cp[3]; cPos[0] = cp[0]; cPos[7] = cp[1]; cPos[6] = cp[2];
        cOri[1] = (co[3] + 1) % 3; cOri[0] = (co[0] + 2) % 3;
        cOri[7] = (co[1] + 1) % 3; cOri[6] = (co[2] + 2) % 3;

        let ep = [ePos[0], ePos[6], ePos[10], ePos[7]], eo = [eOri[0], eOri[6], eOri[10], eOri[7]];
        ePos[0] = ep[3]; ePos[6] = ep[0]; ePos[10] = ep[1]; ePos[7] = ep[2];
        eOri[0] = (eo[3] + 1) % 2; eOri[6] = (eo[0] + 1) % 2;
        eOri[10] = (eo[1] + 1) % 2; eOri[7] = (eo[2] + 1) % 2;

        rotFace(45);
        let uIdx=[2,1,0], lIdx=[36,39,42], dIdx=[33,34,35], rIdx=[17,14,11];
        let tmp = uIdx.map(i => faces[i]);
        uIdx.forEach((idx, i) => faces[idx] = faces[rIdx[i]]);
        rIdx.forEach((idx, i) => faces[idx] = faces[dIdx[i]]);
        dIdx.forEach((idx, i) => faces[idx] = faces[lIdx[i]]);
        lIdx.forEach((idx, i) => faces[idx] = tmp[i]);
      }
    }
  };

  scrambleStr.trim().split(/\s+/).forEach(doMove);

  // --- TRACING EDGE (Buffer: DF / Slot 8) ---
  let edgeCycles = [], currEdge = [];
  let ePosCopy = [...ePos], eOriCopy = [...eOri];
  const bufferE = 8;

  for (let step = 0; step < 30; step++) {
    let unsolved = [];
    for (let i = 0; i < 12; i++) {
      if (i !== bufferE && (ePosCopy[i] !== i || eOriCopy[i] !== 0)) unsolved.push(i);
    }
    let p = ePosCopy[bufferE], o = eOriCopy[bufferE];
    if (unsolved.length === 0 && p === bufferE && o === 0) {
      if (currEdge.length > 0) edgeCycles.push(currEdge);
      break;
    }
    if (p === bufferE) {
      if (currEdge.length > 0) { edgeCycles.push(currEdge); currEdge = []; }
      if (unsolved.length === 0) break;
      let breakSlot = unsolved[0];
      currEdge.push(edgeLetters[`${breakSlot}_0`] || '??');
      let pBuf = ePosCopy[bufferE], oBuf = eOriCopy[bufferE];
      let pTgt = ePosCopy[breakSlot], oTgt = eOriCopy[breakSlot];
      ePosCopy[bufferE] = pTgt; eOriCopy[bufferE] = oTgt;
      ePosCopy[breakSlot] = pBuf; eOriCopy[breakSlot] = oBuf;
    } else {
      currEdge.push(edgeLetters[`${p}_${o}`] || '??');
      let targetSlot = p;
      let pBuf = ePosCopy[bufferE], oBuf = eOriCopy[bufferE];
      let pTgt = ePosCopy[targetSlot], oTgt = eOriCopy[targetSlot];
      ePosCopy[targetSlot] = pBuf; eOriCopy[targetSlot] = 0;
      ePosCopy[bufferE] = pTgt; eOriCopy[bufferE] = (oTgt - oBuf + 2) % 2;
    }
  }

  // --- TRACING CORNER (Buffer: UBL / Slot 0) ---
  let cornerCycles = [], currCorner = [];
  let cPosCopy = [...cPos], cOriCopy = [...cOri];
  const bufferC = 0;

  for (let step = 0; step < 30; step++) {
    let unsolved = [];
    for (let i = 1; i < 8; i++) {
      if (cPosCopy[i] !== i || cOriCopy[i] !== 0) unsolved.push(i);
    }
    let p = cPosCopy[bufferC], o = cOriCopy[bufferC];
    if (unsolved.length === 0 && p === bufferC && o === 0) {
      if (currCorner.length > 0) cornerCycles.push(currCorner);
      break;
    }
    if (p === bufferC) {
      if (currCorner.length > 0) { cornerCycles.push(currCorner); currCorner = []; }
      if (unsolved.length === 0) break;
      let breakSlot = unsolved[0];
      currCorner.push(cornerLetters[`${breakSlot}_0`] || '??');
      let pBuf = cPosCopy[bufferC], oBuf = cOriCopy[bufferC];
      let pTgt = cPosCopy[breakSlot], oTgt = cOriCopy[breakSlot];
      cPosCopy[bufferC] = pTgt; cOriCopy[bufferC] = oTgt;
      cPosCopy[breakSlot] = pBuf; cOriCopy[breakSlot] = oBuf;
    } else {
      currCorner.push(cornerLetters[`${p}_${o}`] || '??');
      let targetSlot = p;
      let pBuf = cPosCopy[bufferC], oBuf = cOriCopy[bufferC];
      let pTgt = cPosCopy[targetSlot], oTgt = cOriCopy[targetSlot];
      cPosCopy[targetSlot] = pBuf; cOriCopy[targetSlot] = 0;
      cPosCopy[bufferC] = pTgt; cOriCopy[bufferC] = (oTgt - oBuf + 3) % 3;
    }
  }

  const formatCycles = (cycles) => cycles.length === 0 ? 'Solved' : cycles.map(c => `(${c.join(' ')})`).join(' ');
  const totalEdgeTargets = edgeCycles.reduce((sum, c) => sum + c.length, 0);

  return {
    edgesText: formatCycles(edgeCycles),
    cornersText: formatCycles(cornerCycles),
    edgeStory: buildSingleStory(edgeCycles, 'bg-emerald-100', 'text-emerald-900', 'border-emerald-300'),
    cornerStory: buildSingleStory(cornerCycles, 'bg-indigo-100', 'text-indigo-900', 'border-indigo-300'),
    hasParity: totalEdgeTargets % 2 !== 0,
    faces: faces
  };
}

// ====================================================================
// VISUALISATOR WARNA STANDAR WCA
// ====================================================================
const colorBgMap = {
  0: 'bg-white border-gray-400',        // U (Putih)
  1: 'bg-red-500 border-red-700',       // R (Merah)
  2: 'bg-green-500 border-green-700',   // F (Hijau)
  3: 'bg-yellow-400 border-yellow-600', // D (Kuning)
  4: 'bg-orange-500 border-orange-700', // L (Oranye)
  5: 'bg-blue-500 border-blue-700'      // B (Biru)
};

function CubeFaceGrid({ faceArray, startIdx, label }) {
  const stickers = faceArray.slice(startIdx, startIdx + 9);
  return (
    <div className="flex flex-col items-center">
      <span className="text-[10px] font-bold text-gray-500 mb-0.5">{label}</span>
      <div className="grid grid-cols-3 gap-0.5 p-1 bg-gray-800 rounded border border-gray-700 shadow-inner">
        {stickers.map((colorIdx, idx) => (
          <div key={idx} className={`w-4 h-4 rounded-xs border ${colorBgMap[colorIdx]}`}></div>
        ))}
      </div>
    </div>
  );
}

function CubeVisualizer({ faces }) {
  if (!faces || faces.length !== 54) return null;
  return (
    <div className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 my-2 flex flex-col items-center shadow-xs">
      <div className="flex items-center gap-1 text-xs font-bold text-gray-700 mb-2">
        <Eye className="w-4 h-4 text-blue-600" />
        <span>Pratinjau Hasil Acakan (Standar WCA):</span>
      </div>

      <div className="flex flex-col items-center gap-1">
        <CubeFaceGrid faceArray={faces} startIdx={0} label="U (Putih)" />
        <div className="flex gap-1">
          <CubeFaceGrid faceArray={faces} startIdx={36} label="L (Oranye)" />
          <CubeFaceGrid faceArray={faces} startIdx={18} label="F (Hijau)" />
          <CubeFaceGrid faceArray={faces} startIdx={9} label="R (Merah)" />
          <CubeFaceGrid faceArray={faces} startIdx={45} label="B (Biru)" />
        </div>
        <CubeFaceGrid faceArray={faces} startIdx={27} label="D (Kuning)" />
      </div>
    </div>
  );
}

// ====================================================================
// APLIKASI UTAMA
// ====================================================================
export default function App() {
  const [scramble, setScramble] = useState('');
  const [showMemo, setShowMemo] = useState(true);
  const [showPreview, setShowPreview] = useState(true);
  const [memoData, setMemoData] = useState({
    edgesText: '', cornersText: '', edgeStory: '', cornerStory: '', hasParity: false, faces: []
  });

  const generateNewScramble = () => {
    const moves = ["U", "D", "L", "R", "F", "B"];
    const modifiers = ["", "'", "2"];
    let newScramble = [], lastMove = "";

    for (let i = 0; i < 18; i++) {
      let move = moves[Math.floor(Math.random() * moves.length)];
      while (move === lastMove) move = moves[Math.floor(Math.random() * moves.length)];
      lastMove = move;
      newScramble.push(move + modifiers[Math.floor(Math.random() * modifiers.length)]);
    }

    const scrText = newScramble.join(" ");
    setScramble(scrText);
    setMemoData(solveBLDMemo(scrText));
  };

  useEffect(() => {
    generateNewScramble();
  }, []);

  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans flex flex-col items-center">
      {/* HEADER NAVY */}
<header className="w-full bg-[#2b4cb8] text-white py-3 px-6 flex justify-between items-center shadow-sm">
  <h1 className="text-xl font-bold tracking-tight">Memo Rubik BLD Shihwa</h1>
  <div className="flex items-center gap-4">
    <button className="hover:opacity-80 transition-opacity"><Info className="w-6 h-6" /></button>
    <button className="hover:opacity-80 transition-opacity"><Settings className="w-6 h-6" /></button>
  </div>
</header>

      {/* KONTEN UTAMA */}
      <main className="w-full max-w-xl p-4 flex flex-col items-center gap-4 mt-1">
        
        {/* PETUNJUK ORIENTASI */}
        <div className="w-full bg-blue-50 border border-blue-200 text-blue-900 text-xs p-2.5 rounded text-center font-medium">
          <strong>Orientasi Pegangan (WCA):</strong> Putih (Atas), Hijau (Depan), Kuning (Bawah), Biru (Belakang), Merah (Kanan), Oranye (Kiri).
        </div>

        {/* KOTAK SCRAMBLE */}
        <div className="w-full text-center border-b border-gray-200 pb-3">
          <p className="text-lg md:text-xl font-mono text-gray-800 font-medium leading-snug tracking-wide select-all">
            {scramble}
          </p>
          <div className="w-full h-0.5 bg-red-500 mt-2"></div>
        </div>

        {/* TOMBOL ACTION */}
        <div className="flex w-full gap-2">
          <button 
            onClick={() => setShowMemo(!showMemo)}
            className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-3 rounded shadow-sm text-xs tracking-wider uppercase transition-colors"
          >
            {showMemo ? "HIDE MEMO" : "SOLVE"}
          </button>
          <button 
            onClick={() => setShowPreview(!showPreview)}
            className="flex-1 bg-blue-100 hover:bg-blue-200 text-blue-800 font-bold py-2 px-3 rounded shadow-sm text-xs tracking-wider uppercase transition-colors"
          >
            {showPreview ? "HIDE 2D CUBE" : "SHOW 2D CUBE"}
          </button>
          <button 
            onClick={generateNewScramble}
            className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-3 rounded shadow-sm text-xs tracking-wider uppercase transition-colors flex items-center justify-center gap-1"
          >
            <RefreshCw className="w-3.5 h-3.5" /> SCRAMBLE
          </button>
        </div>

        {/* PRATINJAU JARING-JARING RUBIK 2D */}
        {showPreview && <CubeVisualizer faces={memoData.faces} />}

        {/* TAMPILAN MEMO + CERITA TERPISAH */}
        {showMemo && (
          <div className="w-full space-y-4 text-center mt-1">
            
            {/* --- SEKSI EDGE --- */}
            <div className="bg-emerald-50/60 border border-emerald-200 rounded-lg p-3 text-left space-y-2">
              <div className="flex justify-between items-center border-b border-emerald-200 pb-1.5">
                <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                  1. Edge Targets & Kalimat
                </span>
                <span className="font-mono text-sm font-bold text-emerald-700">
                  {memoData.edgesText}
                </span>
              </div>
              <div 
                className="text-xs md:text-sm text-gray-800 leading-relaxed pt-1"
                dangerouslySetInnerHTML={{ __html: memoData.edgeStory }}
              />
            </div>

            {/* --- SEKSI CORNER --- */}
            <div className="bg-indigo-50/60 border border-indigo-200 rounded-lg p-3 text-left space-y-2">
              <div className="flex justify-between items-center border-b border-indigo-200 pb-1.5">
                <span className="text-xs font-bold text-indigo-800 uppercase tracking-wider flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                  2. Corner Targets & Kalimat
                </span>
                <span className="font-mono text-sm font-bold text-indigo-700">
                  {memoData.cornersText}
                </span>
              </div>
              <div 
                className="text-xs md:text-sm text-gray-800 leading-relaxed pt-1"
                dangerouslySetInnerHTML={{ __html: memoData.cornerStory }}
              />
            </div>

            {/* PARITY STATUS */}
            <div className="pt-1 text-center">
              <h3 className="text-sm font-bold text-red-600 uppercase tracking-wide">
                {memoData.hasParity ? '⚠️ ADA PARITY' : '✅ TIDAK ADA PARITY'}
              </h3>
            </div>

          </div>
        )}

      </main>
    </div>
  );
}