import React, { useState, useEffect } from 'react';
import { Info, Settings, RotateCcw, Eye, EyeOff, Box, Sparkles, CheckCircle2, AlertTriangle, BookOpen } from 'lucide-react';

// --- GENERATOR SCRAMBLE WCA --- //
const generateRandomScramble = () => {
  const moves = ["U", "D", "L", "R", "F", "B"];
  const modifiers = ["", "'", "2"];
  let scramble = [];
  let lastMove = "";

  for (let i = 0; i < 20; i++) {
    let move;
    do {
      move = moves[Math.floor(Math.random() * moves.length)];
    } while (move === lastMove);
    lastMove = move;
    const modifier = modifiers[Math.floor(Math.random() * modifiers.length)];
    scramble.push(move + modifier);
  }
  return scramble.join(" ");
};

// --- SKEMA HURUF EDGE (Buffer: DF / Putih-Merah) --- //
const EDGE_LETTER_MAP = [
  "BA", "BI", // 0, 1: UL (Kuning-Biru, Biru-Kuning)
  "DA", "DI", // 2, 3: UB (Kuning-Orange, Orange-Kuning)
  "GA", "GI", // 4, 5: UR (Kuning-Hijau, Hijau-Kuning)
  "JA", "JI", // 6, 7: UF (Kuning-Merah, Merah-Kuning)
  "KA", "KI", // 8, 9: FL (Merah-Biru, Biru-Merah)
  "LA", "LI", // 10, 11: BL (Orange-Biru, Biru-Orange)
  "MA", "MI", // 12, 13: BR (Orange-Hijau, Hijau-Orange)
  "NA", "NI", // 14, 15: FR (Merah-Hijau, Hijau-Merah)
  "PA", "PI", // 16, 17: DL (Putih-Biru, Biru-Putih)
  "SA", "SI", // 18, 19: DB (Putih-Orange, Orange-Putih)
  "TA", "TI", // 20, 21: DR (Putih-Hijau, Hijau-Putih)
  null, null  // 22, 23: DF (BUFFER: Putih-Merah, Merah-Putih)
];

// --- SKEMA HURUF CORNER (Buffer: UBL / Kuning-Oren-Biru) --- //
const CORNER_LETTER_MAP = [
  "GA", "GI", "GU", // 0, 1, 2: UBR (Kuning-Orange-Hijau, Hijau-Kuning-Oren, Oren-Kuning-Hijau)
  "JA", "JI", "JU", // 3, 4, 5: UFR (Kuning-Hijau-Merah, Hijau-Merah-Kuning, Merah-Kuning-Hijau)
  "BA", "BI", "BU", // 6, 7, 8: UFL (Kuning-Merah-Biru, Biru-Kuning-Merah, Merah-Kuning-Biru)
  "KA", "KI", "KU", // 9, 10, 11: DFL (Putih-Merah-Biru, Biru-Merah-Putih, Merah-Biru-Putih)
  "LA", "LI", "LU", // 12, 13, 14: DBL (Putih-Oren-Biru, Biru-Oren-Putih, Oren-Putih-Biru)
  "MA", "MI", "MU", // 15, 16, 17: DBR (Putih-Hijau-Oren, Hijau-Oren-Putih, Oren-Hijau-Putih)
  "NA", "NI", "NU", // 18, 19, 20: DFR (Putih-Merah-Hijau, Hijau-Merah-Putih, Merah-Hijau-Putih)
  null, null, null // 21, 22, 23: UBL (BUFFER: Kuning-Oren-Biru)
];

// DATA TABEL KETERANGAN HURUF FOR DISPLAY
const EDGE_GUIDE_TABLE = [
  { sticker: "Kuning - Biru", code: "BA" }, { sticker: "Biru - Kuning", code: "BI" },
  { sticker: "Kuning - Orange", code: "DA" }, { sticker: "Orange - Kuning", code: "DI" },
  { sticker: "Kuning - Hijau", code: "GA" }, { sticker: "Hijau - Kuning", code: "GI" },
  { sticker: "Kuning - Merah", code: "JA" }, { sticker: "Merah - Kuning", code: "JI" },
  { sticker: "Merah - Biru", code: "KA" }, { sticker: "Biru - Merah", code: "KI" },
  { sticker: "Orange - Biru", code: "LA" }, { sticker: "Biru - Orange", code: "LI" },
  { sticker: "Orange - Hijau", code: "MA" }, { sticker: "Hijau - Orange", code: "MI" },
  { sticker: "Merah - Hijau", code: "NA" }, { sticker: "Hijau - Merah", code: "NI" },
  { sticker: "Putih - Biru", code: "PA" }, { sticker: "Biru - Putih", code: "PI" },
  { sticker: "Putih - Orange", code: "SA" }, { sticker: "Orange - Putih", code: "SI" },
  { sticker: "Putih - Hijau", code: "TA" }, { sticker: "Hijau - Putih", code: "TI" },
];

const CORNER_GUIDE_TABLE = [
  { sticker: "Kuning - Merah - Biru", code: "BA" }, { sticker: "Biru - Kuning - Merah", code: "BI" }, { sticker: "Merah - Kuning - Biru", code: "BU" },
  { sticker: "Kuning - Orange - Hijau", code: "GA" }, { sticker: "Hijau - Kuning - Oren", code: "GI" }, { sticker: "Oren - Kuning - Hijau", code: "GU" },
  { sticker: "Kuning - Hijau - Merah", code: "JA" }, { sticker: "Hijau - Merah - Kuning", code: "JI" }, { sticker: "Merah - Kuning - Hijau", code: "JU" },
  { sticker: "Putih - Merah - Biru", code: "KA" }, { sticker: "Biru - Merah - Putih", code: "KI" }, { sticker: "Merah - Biru - Putih", code: "KU" },
  { sticker: "Putih - Oren - Biru", code: "LA" }, { sticker: "Biru - Oren - Putih", code: "LI" }, { sticker: "Oren - Putih - Biru", code: "LU" },
  { sticker: "Putih - Hijau - Oren", code: "MA" }, { sticker: "Hijau - Oren - Putih", code: "MI" }, { sticker: "Oren - Hijau - Putih", code: "MU" },
  { sticker: "Putih - Merah - Hijau", code: "NA" }, { sticker: "Hijau - Merah - Putih", code: "NI" }, { sticker: "Merah - Hijau - Putih", code: "NU" },
];

// KAMUS KATA PASANGAN UNTUK MEMO KALIMAT
const WORD_DICT = {
  "BABI": "Babi", "BADA": "Badak", "BADI": "Badi", "BAGA": "Bagas", "BAGI": "Bagi",
  "BAJA": "Baja", "BAJI": "Baji", "BAKA": "Bakar", "BAKI": "Baki", "BALA": "Balap",
  "BALI": "Bali", "BAMA": "Bamas", "BAMI": "Bami", "BANA": "Banan", "BANI": "Bani",
  "BAPA": "Bapak", "BAPI": "Baping", "BASA": "Basah", "BASI": "Basi", "BATA": "Batik",
  "BATI": "Batin", "BIDA": "Bidadari", "BIGA": "Bigas", "BIJA": "Bijak", "BIKA": "Bika",
  "BILI": "Bilik", "BIMA": "Bima", "BINA": "Bina", "BISA": "Bisa", "BITA": "Bintang",
  "DABA": "Dabarku", "DABI": "Dabing", "DAGA": "Dagang", "DAGI": "Daging", "DAJA": "Dajal",
  "DAMA": "Damai", "DANI": "Danil", "DAPA": "Dapat", "DASI": "Dasi", "DATA": "Datang",
  "GABA": "Gabah", "GAGA": "Gagah", "GAJA": "Gajah", "GAJI": "Gaji", "GALI": "Gali",
  "GAMA": "Gamas", "GANI": "Gani", "GAPA": "Gapai", "GASI": "Gasing", "GATA": "Gatal",
  "JAGA": "Jaga", "JAJA": "Jajak", "JAKA": "Jaksa", "JALI": "Jalin", "JAMA": "Jamu",
  "JANI": "Janji", "JASI": "Jasmani", "JATA": "Jatah", "KABA": "Kabar", "KABI": "Kabin",
  "KAGA": "Kagum", "KAJA": "Kajang", "KAKA": "Kakak", "KALI": "Kali", "KAMA": "Kamar",
  "KANI": "Kanil", "KAPA": "Kapal", "KASI": "Kasih", "KATA": "Kata", "LABA": "Laba",
  "LAGA": "Laga", "LALI": "Lali", "LAMA": "Lama", "LANI": "Lani", "LAPA": "Lapar",
  "LATA": "Latar", "MABA": "Mabar", "MADI": "Madih", "MAJA": "Maja", "MAKA": "Makan",
  "MALI": "Malih", "MAMA": "Mama", "MANI": "Manis", "MAPA": "Mapan", "MATA": "Mata",
  "PAPA": "Papa", "PASI": "Pasir", "PATA": "Patah", "SABA": "Sabak", "SADI": "Sadis",
  "SAGA": "Saga", "SAJA": "Sajak", "SALI": "Salin", "SAMA": "Sama", "SANI": "Sanak",
  "SAPA": "Sapa", "SATA": "Satu", "SIDA": "Sidang", "SINA": "Sinar", "SISA": "Sisa",
  "TABA": "Tabah", "TADI": "Tadi", "TAJA": "Tajam", "TAKA": "Takut", "TALI": "Tali",
  "TAMA": "Taman", "TANI": "Tani", "TAPA": "Tapak", "TATA": "Tata", "TIDA": "Tidak",
  "GUJU": "Guju", "BUKA": "Buka", "LAMI": "Lami", "MUNA": "Munajat", "JUMA": "Jumat"
};

const CONNECTORS = [
  "menyinari",
  "menghiasi",
  "berada di dekat",
  "memancarkan berkah ke",
  "bersanding dengan"
];

// --- SIMULATOR PEMUTARAN KUBUS BLD REAL-TIME --- //
const applyCycle = (arr, cycle) => {
  const temp = arr[cycle[cycle.length - 1]];
  for (let i = cycle.length - 1; i > 0; i--) {
    arr[cycle[i]] = arr[cycle[i - 1]];
  }
  arr[cycle[0]] = temp;
};

const solveRealBLDMemo = (scrambleStr) => {
  let edges = Array.from({ length: 24 }, (_, i) => i);
  let corners = Array.from({ length: 24 }, (_, i) => i);

  const edgeMoves = {
    "U": [[0, 2, 4, 6], [1, 3, 5, 7]],
    "D": [[22, 20, 18, 16], [23, 21, 19, 17]],
    "R": [[5, 13, 21, 15], [4, 12, 20, 14]],
    "L": [[1, 9, 17, 11], [0, 8, 16, 10]],
    "F": [[7, 14, 23, 8], [6, 15, 22, 9]],
    "B": [[3, 10, 19, 12], [2, 11, 18, 13]]
  };

  const cornerMoves = {
    "U": [[21, 0, 3, 6], [22, 1, 4, 7], [23, 2, 5, 8]],
    "D": [[9, 18, 15, 12], [11, 19, 17, 14], [10, 20, 16, 13]],
    "R": [[1, 16, 20, 4], [0, 17, 18, 5], [2, 15, 19, 3]],
    "L": [[7, 23, 13, 10], [6, 22, 12, 11], [8, 21, 14, 9]],
    "F": [[5, 19, 11, 8], [3, 20, 9, 7], [4, 18, 10, 6]],
    "B": [[22, 2, 17, 14], [21, 1, 15, 13], [23, 0, 16, 12]]
  };

  if (scrambleStr) {
    const movesList = scrambleStr.trim().split(/\s+/);
    movesList.forEach(m => {
      if (!m) return;
      const base = m[0];
      const times = m.includes("2") ? 2 : m.includes("'") ? 3 : 1;

      for (let t = 0; t < times; t++) {
        if (edgeMoves[base]) edgeMoves[base].forEach(cycle => applyCycle(edges, cycle));
        if (cornerMoves[base]) cornerMoves[base].forEach(cycle => applyCycle(corners, cycle));
      }
    });
  }

  // TARGET EDGE
  let edgeTargets = [];
  let visitedEdgePieces = new Array(12).fill(false);
  visitedEdgePieces[11] = true;

  let curBufEdge = 22;
  let safetyEdge = 0;
  while (safetyEdge++ < 50) {
    let stickerInBuf = edges[curBufEdge];
    let pieceInBuf = Math.floor(stickerInBuf / 2);

    if (pieceInBuf === 11) {
      let breakPiece = -1;
      for (let p = 0; p < 11; p++) {
        let isSolved = (edges[2 * p] === 2 * p && edges[2 * p + 1] === 2 * p + 1);
        if (!visitedEdgePieces[p] && !isSolved) {
          breakPiece = p;
          break;
        }
      }
      if (breakPiece === -1) break;

      let targetSlot = 2 * breakPiece;
      if (EDGE_LETTER_MAP[targetSlot]) edgeTargets.push(EDGE_LETTER_MAP[targetSlot]);
      visitedEdgePieces[breakPiece] = true;

      let temp = edges[curBufEdge];
      edges[curBufEdge] = edges[targetSlot];
      edges[targetSlot] = temp;
    } else {
      if (EDGE_LETTER_MAP[stickerInBuf]) edgeTargets.push(EDGE_LETTER_MAP[stickerInBuf]);
      visitedEdgePieces[pieceInBuf] = true;

      let targetSlot = stickerInBuf;
      let temp = edges[curBufEdge];
      edges[curBufEdge] = edges[targetSlot];
      edges[targetSlot] = temp;
    }
  }

  // TARGET CORNER
  let cornerTargets = [];
  let visitedCornerPieces = new Array(8).fill(false);
  visitedCornerPieces[7] = true;

  let curBufCorner = 21;
  let safetyCorner = 0;
  while (safetyCorner++ < 50) {
    let stickerInBuf = corners[curBufCorner];
    let pieceInBuf = Math.floor(stickerInBuf / 3);

    if (pieceInBuf === 7) {
      let breakPiece = -1;
      for (let p = 0; p < 7; p++) {
        let isSolved = (corners[3 * p] === 3 * p && corners[3 * p + 1] === 3 * p + 1 && corners[3 * p + 2] === 3 * p + 2);
        if (!visitedCornerPieces[p] && !isSolved) {
          breakPiece = p;
          break;
        }
      }
      if (breakPiece === -1) break;

      let targetSlot = 3 * breakPiece;
      if (CORNER_LETTER_MAP[targetSlot]) cornerTargets.push(CORNER_LETTER_MAP[targetSlot]);
      visitedCornerPieces[breakPiece] = true;

      let temp = corners[curBufCorner];
      corners[curBufCorner] = corners[targetSlot];
      corners[targetSlot] = temp;
    } else {
      if (CORNER_LETTER_MAP[stickerInBuf]) cornerTargets.push(CORNER_LETTER_MAP[stickerInBuf]);
      visitedCornerPieces[pieceInBuf] = true;

      let targetSlot = stickerInBuf;
      let temp = corners[curBufCorner];
      corners[curBufCorner] = corners[targetSlot];
      corners[targetSlot] = temp;
    }
  }

  const edgePairs = [];
  for (let i = 0; i < edgeTargets.length; i += 2) {
    if (i + 1 < edgeTargets.length) edgePairs.push(`(${edgeTargets[i]} ${edgeTargets[i+1]})`);
    else edgePairs.push(`(${edgeTargets[i]})`);
  }

  const cornerPairs = [];
  for (let i = 0; i < cornerTargets.length; i += 2) {
    if (i + 1 < cornerTargets.length) cornerPairs.push(`(${cornerTargets[i]} ${cornerTargets[i+1]})`);
    else cornerPairs.push(`(${cornerTargets[i]})`);
  }

  const edgeStory = [];
  for (let i = 0; i < edgeTargets.length; i += 2) {
    const rawPair = edgeTargets[i] + (edgeTargets[i+1] || "");
    const word = WORD_DICT[rawPair] || rawPair;
    const conn = CONNECTORS[Math.floor(i / 2) % CONNECTORS.length];
    edgeStory.push({ word, conn });
  }

  const cornerStory = [];
  for (let i = 0; i < cornerTargets.length; i += 2) {
    const rawPair = cornerTargets[i] + (cornerTargets[i+1] || "");
    const word = WORD_DICT[rawPair] || rawPair;
    const conn = CONNECTORS[Math.floor(i / 2) % CONNECTORS.length];
    cornerStory.push({ word, conn });
  }

  return {
    edgeTargetsStr: edgePairs.length > 0 ? edgePairs.join(" ") : "(Selesai / Solved)",
    cornerTargetsStr: cornerPairs.length > 0 ? cornerPairs.join(" ") : "(Selesai / Solved)",
    edgeStory,
    cornerStory,
    hasParity: (edgeTargets.length % 2 !== 0)
  };
};

// --- KOMPONEN VISUAL GRID SISI RUBIK 3x3 --- //
const CubeFace3x3 = ({ label, colorClass, textColor = "text-white" }) => (
  <div className="flex flex-col items-center gap-1">
    <div className="grid grid-cols-3 gap-0.5 p-1 bg-slate-800 rounded-lg shadow-sm w-16 h-16 sm:w-20 sm:h-20">
      {Array.from({ length: 9 }).map((_, i) => (
        <div
          key={i}
          className={`${colorClass} rounded-[2px] flex items-center justify-center text-[10px] sm:text-xs font-black ${textColor}`}
        >
          {i === 4 ? label : ""}
        </div>
      ))}
    </div>
  </div>
);

export default function App() {
  const [scramble, setScramble] = useState(() => generateRandomScramble());
  const [memoData, setMemoData] = useState(() => solveRealBLDMemo(scramble));
  const [showMemo, setShowMemo] = useState(true);
  const [show2D, setShow2D] = useState(true);
  const [showGuide, setShowGuide] = useState(false);

  const generateNewScramble = () => {
    const newScramble = generateRandomScramble();
    setScramble(newScramble);
    setMemoData(solveRealBLDMemo(newScramble));
  };

  useEffect(() => {
    if (scramble) {
      setMemoData(solveRealBLDMemo(scramble));
    }
  }, [scramble]);

  return (
    <div className="min-h-screen bg-slate-50 text-gray-900 font-sans flex flex-col items-center">
      
      {/* HEADER NAVY */}
      <header className="w-full bg-[#2b4cb8] text-white py-3.5 px-6 flex justify-between items-center shadow-md">
        <h1 className="text-xl font-bold tracking-tight flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-yellow-300" /> Memo Rubik BLD Shihwa
        </h1>
        <div className="flex items-center gap-4">
          <button className="hover:opacity-80 transition-opacity"><Info className="w-6 h-6" /></button>
          <button className="hover:opacity-80 transition-opacity"><Settings className="w-6 h-6" /></button>
        </div>
      </header>

      {/* KONTEN UTAMA */}
      <main className="w-full max-w-2xl p-4 flex flex-col items-center gap-5 mt-2">

        {/* PETUNJUK ORIENTASI */}
        <div className="w-full bg-yellow-50 border border-yellow-300 rounded-xl p-3 text-center text-xs text-yellow-950 shadow-xs">
          <span className="font-bold text-yellow-900">Orientasi Pegangan:</span> Kuning (Atas / U), Merah (Depan / F), Putih (Bawah / D), Orange (Belakang / B), Hijau (Kanan / R), Biru (Kiri / L).
        </div>

        {/* TEKS SCRAMBLE */}
        <div className="w-full bg-white border border-gray-200 rounded-2xl p-5 shadow-sm text-center">
          <p className="font-mono text-lg font-medium tracking-wide text-gray-800 leading-relaxed">
            {scramble}
          </p>
        </div>

        {/* TOMBOL KONTROL */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 w-full">
          <button 
            onClick={() => setShowMemo(!showMemo)}
            className="flex items-center justify-center gap-1.5 py-2.5 px-2 bg-gray-100 hover:bg-gray-200 rounded-xl text-xs font-semibold text-gray-700 transition-colors cursor-pointer"
          >
            {showMemo ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            {showMemo ? "HIDE MEMO" : "SHOW MEMO"}
          </button>

          <button 
            onClick={() => setShow2D(!show2D)}
            className="flex items-center justify-center gap-1.5 py-2.5 px-2 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
          >
            <Box className="w-4 h-4" />
            {show2D ? "HIDE 2D CUBE" : "SHOW 2D CUBE"}
          </button>

          <button 
            onClick={() => setShowGuide(!showGuide)}
            className="flex items-center justify-center gap-1.5 py-2.5 px-2 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-300 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
          >
            <BookOpen className="w-4 h-4 text-amber-600" />
            PANDUAN HURUF
          </button>

          <button 
            onClick={generateNewScramble}
            className="flex items-center justify-center gap-1.5 py-2.5 px-2 bg-gray-900 hover:bg-gray-800 text-white rounded-xl text-xs font-semibold transition-colors shadow-sm cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" /> SCRAMBLE
          </button>
        </div>

        {/* MODAL / PANEL PANDUAN PENAMAAN HURUF */}
        {showGuide && (
          <div className="w-full bg-white border border-amber-200 rounded-2xl p-4 shadow-sm flex flex-col gap-4 animate-in fade-in duration-200">
            <div className="flex justify-between items-center border-b pb-2">
              <h3 className="text-sm font-bold text-gray-800 flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-amber-600" /> Keterangan Penamaan Huruf & Buffer Custom
              </h3>
              <button 
                onClick={() => setShowGuide(false)}
                className="text-xs text-gray-500 hover:text-gray-800 font-bold px-2 py-0.5 bg-gray-100 rounded-lg cursor-pointer"
              >
                Tutup ✖
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              {/* TABEL EDGE */}
              <div className="bg-emerald-50/70 p-3 rounded-xl border border-emerald-200">
                <h4 className="font-bold text-emerald-800 mb-2 border-b border-emerald-300 pb-1">
                  A. EDGE TARGETS <span className="text-[11px] font-normal block text-emerald-700">Buffer: Putih - Merah (DF)</span>
                </h4>
                <div className="max-h-60 overflow-y-auto pr-1">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="border-b border-emerald-200 text-emerald-900 font-bold">
                        <th className="pb-1">Sisi Stiker (Warna)</th>
                        <th className="pb-1 text-center">Kode</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-emerald-100 text-gray-700">
                      {EDGE_GUIDE_TABLE.map((row, idx) => (
                        <tr key={idx} className="hover:bg-emerald-100/50">
                          <td className="py-1">{row.sticker}</td>
                          <td className="py-1 text-center font-bold text-emerald-800">{row.code}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* TABEL CORNER */}
              <div className="bg-indigo-50/70 p-3 rounded-xl border border-indigo-200">
                <h4 className="font-bold text-indigo-800 mb-2 border-b border-indigo-300 pb-1">
                  B. CORNER TARGETS <span className="text-[11px] font-normal block text-indigo-700">Buffer: Kuning - Oren - Biru (UBL)</span>
                </h4>
                <div className="max-h-60 overflow-y-auto pr-1">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="border-b border-indigo-200 text-indigo-900 font-bold">
                        <th className="pb-1">Sisi Stiker (Warna)</th>
                        <th className="pb-1 text-center">Kode</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-indigo-100 text-gray-700">
                      {CORNER_GUIDE_TABLE.map((row, idx) => (
                        <tr key={idx} className="hover:bg-indigo-100/50">
                          <td className="py-1">{row.sticker}</td>
                          <td className="py-1 text-center font-bold text-indigo-800">{row.code}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* PRATINJAU JARING-JARING RUBIK 3x3 REALISTIS */}
        {show2D && (
          <div className="w-full bg-white border border-gray-200 rounded-2xl p-4 shadow-sm flex flex-col items-center gap-3">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-1">
              <Box className="w-3.5 h-3.5" /> Pratinjau Posisi Muka (Jaring-Jaring 3x3)
            </span>
            
            {/* JARING-JARING KUBUS REALISTIS */}
            <div className="flex flex-col items-center gap-1 my-1">
              {/* SISI ATAS (U: Kuning) */}
              <div className="flex justify-center w-full">
                <div className="w-16 sm:w-20"></div> {/* spacer */}
                <CubeFace3x3 label="U" colorClass="bg-yellow-400" textColor="text-gray-900" />
              </div>

              {/* BARIS TENGAH: L (Biru), F (Merah), R (Hijau), B (Orange) */}
              <div className="flex justify-center gap-1 w-full">
                <CubeFace3x3 label="L" colorClass="bg-blue-600" />
                <CubeFace3x3 label="F" colorClass="bg-red-600" />
                <CubeFace3x3 label="R" colorClass="bg-green-600" />
                <CubeFace3x3 label="B" colorClass="bg-orange-500" />
              </div>

              {/* SISI BAWAH (D: Putih) */}
              <div className="flex justify-center w-full">
                <div className="w-16 sm:w-20"></div> {/* spacer */}
                <CubeFace3x3 label="D" colorClass="bg-white border border-gray-300" textColor="text-gray-900" />
              </div>
            </div>
          </div>
        )}

        {/* HASIL MEMO & NARASI */}
        {showMemo && memoData && (
          <div className="w-full flex flex-col gap-4">
            
            {/* 1. EDGE TARGETS & KALIMAT */}
            <div className="bg-emerald-50/60 border border-emerald-200/80 rounded-2xl p-4 shadow-sm flex flex-col gap-3">
              <div className="flex justify-between items-center border-b border-emerald-200/60 pb-2">
                <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-emerald-600" /> 1. EDGE TARGETS & KALIMAT
                </span>
                <span className="text-xs font-mono font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-lg">
                  {memoData.edgeTargetsStr}
                </span>
              </div>
              
              <div className="flex flex-wrap items-center gap-2 text-sm leading-relaxed text-gray-800 pt-1">
                {memoData.edgeStory.map((item, idx) => (
                  <React.Fragment key={idx}>
                    <span className="bg-emerald-200/80 text-emerald-900 font-semibold px-2.5 py-1 rounded-lg border border-emerald-300/50 shadow-2xs">
                      {item.word}
                    </span>
                    <span className="text-emerald-700 text-xs italic font-medium">
                      🌸 {item.conn} 🌸
                    </span>
                  </React.Fragment>
                ))}
              </div>
            </div>

            {/* 2. CORNER TARGETS & KALIMAT */}
            <div className="bg-indigo-50/60 border border-indigo-200/80 rounded-2xl p-4 shadow-sm flex flex-col gap-3">
              <div className="flex justify-between items-center border-b border-indigo-200/60 pb-2">
                <span className="text-xs font-bold text-indigo-800 uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-indigo-600" /> 2. CORNER TARGETS & KALIMAT
                </span>
                <span className="text-xs font-mono font-bold text-indigo-700 bg-indigo-100 px-2 py-0.5 rounded-lg">
                  {memoData.cornerTargetsStr}
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-2 text-sm leading-relaxed text-gray-800 pt-1">
                {memoData.cornerStory.map((item, idx) => (
                  <React.Fragment key={idx}>
                    <span className="bg-indigo-200/80 text-indigo-900 font-semibold px-2.5 py-1 rounded-lg border border-indigo-300/50 shadow-2xs">
                      {item.word}
                    </span>
                    <span className="text-indigo-700 text-xs italic font-medium">
                      ✨ {item.conn} ✨
                    </span>
                  </React.Fragment>
                ))}
              </div>
            </div>

            {/* STATUS PARITY */}
            <div className="flex justify-center mt-1">
              {memoData.hasParity ? (
                <div className="flex items-center gap-1.5 text-xs font-bold text-amber-700 bg-amber-50 border border-amber-200 px-3 py-1.5 rounded-full">
                  <AlertTriangle className="w-4 h-4 text-amber-600" /> PARITY DETECTED
                </div>
              ) : (
                <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-full">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" /> TIDAK ADA PARITY
                </div>
              )}
            </div>

          </div>
        )}

      </main>
    </div>
  );
}
