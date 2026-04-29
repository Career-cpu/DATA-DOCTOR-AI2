import { useState, useRef } from "react";
import { motion } from "framer-motion";
import * as XLSX from "xlsx";
import { ai, dataDoctorInstruction } from "../lib/gemini";
import ReactMarkdown from "react-markdown";
import { useSoundEffects } from "../hooks/useSoundEffects";
import { useLanguage } from "../contexts/LanguageContext";

export default function AIDataDoctor() {
  const [files, setFiles] = useState<File[]>([]);
  const [previewData, setPreviewData] = useState<{fileName: string, headers: string[], rows: any[]}[]>([]);
  const [sheetLink, setSheetLink] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { playHoverSound, playClickSound, playSuccessSound, playBotMessageSound } = useSoundEffects();
  const { t } = useLanguage();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      setFiles(selectedFiles);
      
      const previews = [];
      for (const file of selectedFiles) {
        try {
          const data = await file.arrayBuffer();
          const workbook = XLSX.read(data, { type: "array" });
          const firstSheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[firstSheetName];
          const json = XLSX.utils.sheet_to_json<any>(worksheet, { defval: null });
          
          if (json.length > 0) {
            const headers = Object.keys(json[0]);
            const rows = json.slice(0, 5);
            previews.push({ fileName: file.name, headers, rows });
          }
        } catch (err) {
          console.error("Error generating preview:", err);
        }
      }
      setPreviewData(previews);
    }
  };

  const analyzeData = async () => {
    if (files.length === 0 && !sheetLink.trim()) return;
    setIsAnalyzing(true);
    setResult(null);
    setError(null);

    try {
      let combinedData = "";
      let fileStats: any[] = [];
      let allColumns: Record<string, string[]> = {};

      if (files.length > 0) {
        for (const file of files) {
          const data = await file.arrayBuffer();
          const workbook = XLSX.read(data, { type: "array" });
          const firstSheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[firstSheetName];
          
          // Get all rows to calculate statistics
          const allRows = XLSX.utils.sheet_to_json<any>(worksheet, { defval: null });
          const totalRows = allRows.length;
          
          let missingStats: Record<string, number> = {};
          let columns = totalRows > 0 ? Object.keys(allRows[0]) : [];
          
          columns.forEach(col => {
            missingStats[col] = 0;
            if (!allColumns[col]) allColumns[col] = [];
            if (!allColumns[col].includes(file.name)) {
              allColumns[col].push(file.name);
            }
          });

          allRows.forEach(row => {
            columns.forEach(col => {
              const val = row[col];
              if (val === null || val === undefined || val === "" || val === "NA" || val === "NaN") {
                missingStats[col]++;
              }
            });
          });

          fileStats.push({
            fileName: file.name,
            totalRows,
            missingStats,
            columns
          });

          // Get first 50 rows for sample
          const json = XLSX.utils.sheet_to_json(worksheet, { header: 1 }).slice(0, 50);
          combinedData += `\n--- File: ${file.name} ---\n`;
          combinedData += JSON.stringify(json, null, 2);
        }
      }

      let commonColumns: string[] = [];
      if (files.length > 1) {
        commonColumns = Object.keys(allColumns).filter(col => allColumns[col].length > 1);
      }

      let prompt = `Bạn là một chuyên gia dữ liệu (Data Doctor). Hãy chẩn đoán tình trạng dữ liệu và giải thích thật ĐƠN GIẢN, DỄ HIỂU cho người không rành về kỹ thuật.

QUAN TRỌNG NHẤT:
- BẮT ĐẦU BẰNG KẾT LUẬN TRẠNG THÁI DỮ LIỆU: Ngay dòng đầu tiên, hãy kết luận rõ ràng tình trạng dataset (Ví dụ: "Trạng thái: Sẵn sàng cho phân tích", "Trạng thái: Cần được clean", "Trạng thái: Cần xử lý dữ liệu rỗng", v.v.) trước khi đi vào chi tiết.
- CHỈ HỖ TRỢ POWER BI VÀ EXCEL DASHBOARD: Tuyệt đối không đề xuất các phần mềm, ngôn ngữ lập trình (Python, R, SQL, Tableau...) hay kỹ thuật phức tạp khác.
- HẠN CHẾ TỐI ĐA TỪ NGỮ CHUYÊN NGÀNH (JARGON): Giải thích mọi thứ bằng ngôn ngữ đời thường, dễ hiểu nhất.
- PHONG CÁCH HƯỚNG DẪN POWER BI: Trình bày các bước xử lý và phân tích giống như một bài hướng dẫn (tutorial) thực hành trong Power BI hoặc Excel.
- KHÔNG dùng từ ngữ chào hỏi, KHÔNG vòng vo. Trình bày cực kỳ rõ ràng, dùng gạch đầu dòng (bullet points) cẩn thận.

Bắt buộc chia thành đúng 4 phần sau (sau dòng kết luận trạng thái):
1. Tóm tắt tình trạng dữ liệu (Dữ liệu bị thiếu, dữ liệu rác...).
2. Mối liên kết dữ liệu (Các cột có thể dùng để nối các bảng với nhau trong Power BI/Excel).
3. Đánh giá mức độ sẵn sàng (Dữ liệu đã đủ tốt để lên biểu đồ chưa?).
4. Đề xuất hướng xử lý và phân tích (Hướng dẫn từng bước làm trong Power BI/Excel).

`;
      
      if (fileStats.length > 0) {
        prompt += `\n[KẾT QUẢ QUÉT DỮ LIỆU TỰ ĐỘNG]\n`;
        fileStats.forEach(stat => {
          prompt += `- File: ${stat.fileName} (Tổng cộng: ${stat.totalRows} dòng)\n`;
          const missingCols = Object.entries(stat.missingStats).filter(([_, count]) => (count as number) > 0);
          if (missingCols.length > 0) {
            prompt += `  + Các cột có dữ liệu trống (Missing/NA): ${missingCols.map(([col, count]) => `${col} (${count} ô trống)`).join(', ')}\n`;
          } else {
            prompt += `  + Không phát hiện dữ liệu trống.\n`;
          }
        });
        
        if (commonColumns.length > 0) {
          prompt += `\n- Cột chung có thể dùng làm Key liên kết giữa các file: ${commonColumns.join(', ')}\n`;
        } else if (files.length > 1) {
          prompt += `\n- Không tìm thấy cột chung nào giữa các file để làm Key liên kết.\n`;
        }
      }

      if (combinedData) {
        prompt += `\n\nDưới đây là mẫu dữ liệu (tối đa 50 dòng) khách hàng tải lên để bạn phân tích sâu hơn:\n${combinedData}`;
      }
      
      if (sheetLink.trim()) {
        prompt += `\n\nPhân tích thêm dữ liệu từ link Google Sheet này: ${sheetLink.trim()}`;
      }

      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
        config: {
          systemInstruction: dataDoctorInstruction,
          tools: [{ urlContext: {} }]
        }
      });

      setResult(response.text || t('doctor.error'));
      playSuccessSound();
    } catch (err) {
      console.error("Error analyzing data:", err);
      setError(t('doctor.error'));
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <section className="py-24 bg-transparent relative z-10">
      
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-slate-900 mb-6 drop-shadow-sm">
              {t('doctor.title')} <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-purple-500">{t('doctor.titleHighlight')}</span>
            </h2>
            <p className="text-lg text-slate-600 mb-8 leading-relaxed">
              {t('doctor.subtitle')}
            </p>

            <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-xl">
              <div 
                className="border-2 border-dashed border-purple-500/30 rounded-2xl p-10 text-center cursor-pointer hover:bg-slate-50 transition-colors mb-6"
                onClick={() => { fileInputRef.current?.click(); playClickSound(); }}
                onMouseEnter={playHoverSound}
              >
                <input 
                  type="file" 
                  multiple 
                  accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                  className="hidden" 
                  ref={fileInputRef}
                  onChange={handleFileChange}
                />
                <div className="w-16 h-16 bg-purple-50 text-yellow-600 rounded-full flex items-center justify-center mx-auto mb-4 border border-purple-100">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12"/>
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-slate-800 mb-2">{t('doctor.uploadBoxTitle')}</h3>
                <p className="text-sm text-slate-500">{t('doctor.uploadBoxDesc')}</p>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-bold text-slate-700 mb-2">{t('doctor.orPasteLink')}</label>
                <input 
                  type="url" 
                  value={sheetLink}
                  onChange={(e) => setSheetLink(e.target.value)}
                  placeholder="https://docs.google.com/spreadsheets/d/..."
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all"
                />
              </div>

              {(files.length > 0 || sheetLink) && (
                <div className="mt-6">
                  {files.length > 0 && (
                    <>
                      <h4 className="text-sm font-bold text-slate-700 mb-3">{t('doctor.selectedFiles')}</h4>
                      <ul className="space-y-2 mb-6">
                        {files.map((f, i) => (
                          <li key={i} className="text-sm text-slate-700 flex items-center gap-2 bg-slate-50 px-3 py-2 rounded-lg border border-slate-200 shadow-sm">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-yellow-600">
                              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                              <polyline points="14 2 14 8 20 8"/>
                              <line x1="16" y1="13" x2="8" y2="13"/>
                              <line x1="16" y1="17" x2="8" y2="17"/>
                              <polyline points="10 9 9 9 8 9"/>
                            </svg>
                            {f.name}
                          </li>
                        ))}
                      </ul>

                      {previewData.length > 0 && (
                        <div className="mb-6">
                          <h4 className="text-sm font-bold text-slate-700 mb-3">{t('doctor.previewData')}</h4>
                          <div className="space-y-4">
                            {previewData.map((preview, idx) => (
                              <div key={idx} className="bg-white border border-slate-200 rounded-lg overflow-hidden shadow-sm">
                                <div className="bg-slate-50 px-3 py-2 border-b border-slate-200 text-xs font-bold text-slate-600">
                                  {preview.fileName}
                                </div>
                                <div className="overflow-x-auto custom-scrollbar">
                                  <table className="w-full text-left text-xs whitespace-nowrap">
                                    <thead>
                                      <tr className="bg-white border-b border-slate-100 font-bold">
                                        {preview.headers.map((h, i) => (
                                          <th key={i} className="px-3 py-2 text-slate-700">{h}</th>
                                        ))}
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {preview.rows.map((row, rIdx) => (
                                        <tr key={rIdx} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                                          {preview.headers.map((h, cIdx) => (
                                            <td key={cIdx} className="px-3 py-2 text-slate-600 truncate max-w-[150px]">
                                              {row[h] !== null ? String(row[h]) : <span className="text-slate-400 italic">null</span>}
                                            </td>
                                          ))}
                                        </tr>
                                      ))}
                                    </tbody>
                                  </table>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </>
                  )}
                  
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => { analyzeData(); playClickSound(); }}
                    onMouseEnter={playHoverSound}
                    disabled={isAnalyzing}
                    className="w-full py-4 bg-gradient-to-r from-yellow-500 to-purple-600 text-white rounded-xl font-bold text-lg hover:from-yellow-400 hover:to-purple-500 transition-colors shadow-lg shadow-purple-900/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isAnalyzing ? (
                      t('doctor.analyzing')
                    ) : (
                      t('doctor.startAnalyze')
                    )}
                  </motion.button>
                </div>
              )}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="h-full"
          >
            <div className="bg-white rounded-3xl p-8 h-full shadow-2xl border border-slate-200 relative overflow-hidden min-h-[500px]">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-yellow-400 to-purple-500"></div>
              
              <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-purple-50 flex items-center justify-center text-yellow-600 border border-purple-100">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
                  </svg>
                </div>
                {t('doctor.resultTitle')}
              </h3>

              <div className="prose prose-slate prose-purple max-w-none overflow-y-auto max-h-[500px] pr-4 custom-scrollbar text-slate-700 prose-headings:text-slate-900 prose-p:text-slate-600 prose-strong:text-slate-900 prose-li:text-slate-600 prose-td:text-slate-600 prose-th:text-slate-900 prose-ul:list-disc prose-ol:list-decimal prose-li:ml-6 prose-p:leading-relaxed prose-ul:my-2 prose-li:my-1">
                {isAnalyzing ? (
                  <div className="flex flex-col items-center justify-center h-64">
                    <div className="relative w-32 h-32 flex items-center justify-center mb-6 text-purple-500">
                      <svg className="w-full h-full" viewBox="0 0 100 100">
                        <polygon points="30,5 70,5 95,30 95,70 70,95 30,95 5,70 5,30" fill="none" stroke="currentColor" strokeWidth="2" />
                        <path d="M 50 5 L 50 15 M 95 50 L 85 50 M 50 95 L 50 85 M 5 50 L 15 50" stroke="currentColor" strokeWidth="2" />
                        <circle cx="50" cy="50" r="8" fill="none" stroke="currentColor" strokeWidth="2" />
                        <circle cx="50" cy="50" r="3" fill="currentColor" />
                      </svg>
                      <motion.div
                        animate={{ top: ["0%", "100%", "0%"] }}
                        transition={{ duration: 2.5, ease: "easeInOut", repeat: Infinity }}
                        className="absolute left-0 right-0 h-0.5 bg-yellow-500 shadow-[0_0_15px_3px_rgba(234,179,8,0.8)] z-10"
                      />
                    </div>
                    <p className="text-yellow-600 font-bold animate-pulse text-lg">{t('doctor.analyzingStructure')}</p>
                  </div>
                ) : error ? (
                  <div className="flex flex-col items-center justify-center h-64 text-slate-900">
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="mb-4 text-red-500">
                      <circle cx="12" cy="12" r="10"></circle>
                      <line x1="12" y1="8" x2="12" y2="12"></line>
                      <line x1="12" y1="16" x2="12.01" y2="16"></line>
                    </svg>
                    <p className="text-lg font-bold text-center">{error}</p>
                  </div>
                ) : result ? (
                  <ReactMarkdown>{result}</ReactMarkdown>
                ) : (
                  <div className="flex flex-col items-center justify-center h-64 text-slate-500">
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="mb-4 opacity-50">
                      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                    </svg>
                    <p className="font-medium">{t('doctor.noResult')}</p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
