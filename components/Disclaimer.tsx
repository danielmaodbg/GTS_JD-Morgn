import React, { useEffect } from 'react';

interface DisclaimerProps {
  onBack: () => void;
}

const Disclaimer: React.FC<DisclaimerProps> = ({ onBack }) => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen pt-32 pb-24 px-6 md:px-12 bg-jd-dark selection:bg-jd-gold/10 selection:text-white font-sans">
      <div className="max-w-5xl mx-auto">
        {/* Title Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
          <div className="space-y-4">
            <h2 className="text-jd-gold text-sm font-black uppercase tracking-[0.5em] flex items-center">
              <span className="w-12 h-px bg-jd-gold/30 mr-4"></span> LEGAL AGREEMENTS AND POLICIES
            </h2>
            <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter uppercase leading-none">
              隱私權政策與 <span className="text-jd-gold font-light not-italic">免責聲明</span>
            </h1>
            <p className="text-xs text-gray-500 font-bold uppercase tracking-widest">
              JD MORGAN GLOBAL TRADING LTD. Registered in British Columbia, Canada
            </p>
          </div>
          <button 
            onClick={onBack}
            className="px-10 py-4 bg-white/5 hover:bg-jd-gold text-white hover:text-jd-dark border border-white/10 hover:border-jd-gold rounded-2xl text-xs font-black uppercase tracking-widest transition-all flex items-center gap-3 shadow-md"
          >
            <i className="fa-solid fa-arrow-left"></i> 返回系統
          </button>
        </div>

        {/* Content Container - 全部區塊改為深藍底色 */}
        <div className="space-y-12">
          
          {/* Section 1: TERMS OF SERVICE */}
          <section id="tos" className="bg-jd-light/95 backdrop-blur-xl border border-white/5 rounded-[3rem] p-10 md:p-16 shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-12 opacity-[0.03] pointer-events-none group-hover:opacity-[0.07] transition-opacity">
              <i className="fa-solid fa-file-contract text-[15rem] text-white"></i>
            </div>
            
            <div className="relative z-10 space-y-10">
              <div className="border-b border-white/5 pb-6">
                <h2 className="text-3xl font-black text-white mb-2 uppercase tracking-tighter">1. TERMS OF SERVICE | 服務條款</h2>
                <p className="text-jd-gold text-[10px] font-black uppercase tracking-widest">Effective Date: January 18, 2026</p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                <div className="space-y-6 text-gray-400">
                  <h4 className="text-gray-600 text-[10px] font-black uppercase tracking-[0.3em]">[EN] English Version</h4>
                  <div className="space-y-6 text-sm leading-relaxed">
                    <p><strong>1.1 ACCEPTANCE OF TERMS</strong> These Terms of Service constitute a legally binding agreement between JD MORGAN GLOBAL TRADING LTD. ("the Company") and the user ("the Client"). By accessing our trade intelligence and coordination services, you acknowledge that you have read, understood, and agreed to be bound by these terms.</p>
                    <p><strong>1.2 SCOPE OF SERVICES</strong> The Company provides a platform for trade intelligence exchange and facilitates coordination between global suppliers and logistics providers. The Company acts as an information intermediary and is not a party to any underlying purchase, sale, or shipping contracts between the Client and third parties.</p>
                    <p><strong>1.3 CONFIDENTIALITY & NON-CIRCUMVENTION</strong> The Client shall maintain strict confidentiality regarding any trade secrets or supplier data obtained through the Company. The Client agrees not to bypass the Company to engage directly with any suppliers or partners introduced by the Company for a period of 24 months from the initial introduction.</p>
                  </div>
                </div>

                <div className="space-y-6 text-gray-300">
                  <h4 className="text-jd-gold text-[10px] font-black uppercase tracking-[0.3em]">[中] 中文譯本</h4>
                  <div className="space-y-6 text-sm leading-relaxed">
                    <p><strong>1.1 條款確認</strong> 本服務條款構成 JD MORGAN GLOBAL TRADING LTD.（以下簡稱「本公司」）與用戶（以下簡稱「客戶」）之間具法律約束力的協議。訪問我們的貿易情報與協調服務，即表示您確認已閱讀、理解並同意受本條款之約束。</p>
                    <p><strong>1.2 服務範圍</strong> 本公司提供貿易情報交流平台，並促進全球供應商與物流商之間的協調。本公司僅作為資訊中介機構，並非客戶與第三方之間任何基礎採購、銷售或運輸合同的當事方。</p>
                    <p><strong>1.3 保密與禁止繞道條款</strong> 客戶應對通過本公司獲取的任何商業秘密或供應商數據承擔嚴格保密義務。客戶同意自本公司初次介紹後 24 個月內，不得繞過本公司直接與本公司介紹的任何供應商或合作夥伴進行交易。</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Section 2: LEGAL DISCLAIMER */}
          <section id="disclaimer" className="bg-jd-light/95 backdrop-blur-xl border border-white/5 rounded-[3rem] p-10 md:p-16 shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-12 opacity-[0.03] pointer-events-none group-hover:opacity-[0.07] transition-opacity">
              <i className="fa-solid fa-shield-halved text-[15rem] text-white"></i>
            </div>
            
            <div className="relative z-10 space-y-10">
              <div className="border-b border-white/5 pb-6">
                <h2 className="text-3xl font-black text-white mb-2 uppercase tracking-tighter">2. LEGAL DISCLAIMER | 法律免責聲明</h2>
                <p className="text-jd-gold text-[10px] font-black uppercase tracking-widest">Protocol Version: L-2026-A</p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                <div className="space-y-6 text-gray-400">
                  <h4 className="text-gray-600 text-[10px] font-black uppercase tracking-[0.3em]">[EN] English Version</h4>
                  <div className="space-y-6 text-sm leading-relaxed">
                    <p><strong>2.1 NO WARRANTY ON INFORMATION</strong> All trade intelligence, market analysis, and data provided by the Company are for informational purposes only. The Company makes no representations or warranties, express or implied, regarding the completeness, accuracy, or reliability of any information.</p>
                    <p><strong>2.2 THIRD-PARTY PERFORMANCE</strong> The Company shall not be liable for any acts, errors, omissions, or negligence of any third-party suppliers or logistics providers.</p>
                  </div>
                </div>

                <div className="space-y-6 text-gray-300">
                  <h4 className="text-jd-gold text-[10px] font-black uppercase tracking-[0.3em]">[中] 中文譯本</h4>
                  <div className="space-y-6 text-sm leading-relaxed">
                    <p><strong>2.1 資訊不保證</strong> 本公司提供的所有貿易情報、市場分析及數據僅供參考。本公司不對任何資訊的完整性、準確性或可靠性作出明示或暗示的聲明或保證。</p>
                    <p><strong>2.2 第三方履約免責</strong> 本公司對任何第三方供應商或物流機構的行為、錯誤、遺漏或疏忽不承擔法律責任。</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Section 3: PRIVACY POLICY */}
          <section id="privacy" className="bg-jd-light/95 backdrop-blur-xl border border-white/5 rounded-[3rem] p-10 md:p-16 shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-12 opacity-[0.03] pointer-events-none group-hover:opacity-[0.07] transition-opacity">
              <i className="fa-solid fa-fingerprint text-[15rem] text-white"></i>
            </div>
            
            <div className="relative z-10 space-y-10">
              <div className="border-b border-white/5 pb-6">
                <h2 className="text-3xl font-black text-white mb-2 uppercase tracking-tighter">3. PRIVACY POLICY | 隱私權政策</h2>
                <p className="text-jd-gold text-[10px] font-black uppercase tracking-widest">Compliance Status: PIPA 2026 CERTIFIED</p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                <div className="space-y-6 text-gray-400">
                  <h4 className="text-gray-600 text-[10px] font-black uppercase tracking-[0.3em]">[EN] English Version</h4>
                  <div className="space-y-6 text-sm leading-relaxed">
                    <p><strong>3.1 DATA COLLECTION (BC PIPA COMPLIANCE)</strong> In accordance with the British Columbia Personal Information Protection Act (PIPA), we collect business-related personal information necessary to facilitate trade coordination.</p>
                    <p><strong>3.2 DISCLOSURE & DATA STORAGE</strong> You consent to the disclosure of your business information to vetted partners solely for the purpose of executing trade coordination.</p>
                    <p><strong>3.3 PRIVACY OFFICER</strong> For any inquiries regarding your data, please contact our Privacy Officer:</p>
                    <ul className="space-y-2 text-jd-gold font-bold">
                      <li>• Email: info@jdmorgan.ca</li>
                      <li>• Attn: Privacy Compliance Department</li>
                    </ul>
                  </div>
                </div>

                <div className="space-y-6 text-gray-300">
                  <h4 className="text-jd-gold text-[10px] font-black uppercase tracking-[0.3em]">[中] 中文譯本</h4>
                  <div className="space-y-6 text-sm leading-relaxed">
                    <p><strong>3.1 資訊收集（符合 BC PIPA 標準）</strong> 根據卑詩省《個人資訊保護法》(PIPA)，我們收集為促進貿易協調所必需的商業相關個人資訊，包括姓名、公司聯繫方式及交易記錄。</p>
                    <p><strong>3.2 披露與數據存儲</strong> 您同意我們僅為執行貿易協調之目的，向經過審查的合作夥伴披露您的商業資訊。</p>
                    <p><strong>3.3 隱私專員</strong> 如對您的數據有任何疑問，請聯繫我們的隱私專員：</p>
                    <ul className="space-y-2 text-jd-gold font-bold">
                      <li>• 電子郵件：info@jdmorgan.ca</li>
                      <li>• 收件人：隱私合規部門</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <div className="text-center pt-10 pb-20 border-t border-white/5 space-y-4">
            <p className="text-[10px] text-gray-600 font-black uppercase tracking-[0.5em]">
              Copyright © 2026 JD MORGAN GLOBAL TRADING LTD. All Rights Reserved.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Disclaimer;