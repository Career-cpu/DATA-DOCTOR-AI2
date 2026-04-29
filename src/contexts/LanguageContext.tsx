import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'en' | 'vi';

interface LanguageContextType {
  language: Language;
  toggleLanguage: () => void;
  t: (key: string) => string;
}

const translations: Record<Language, Record<string, string>> = {
  en: {
    'nav.showcase': 'Showcase',
    'nav.aiConsultant': 'AI Consultant',
    'nav.playground': 'Playground',
    'nav.blog': 'Blog',
    'nav.datasets': 'Free Datasets',
    'nav.getDiagnosis': 'Get Free Data Diagnosis',
    'hero.title': 'Unlock Your Data Potential with',
    'hero.titleHighlight': 'Premium Dashboard',
    'hero.subtitle': 'Explore our curated collection of high quality, customizeable, dashboard templates design for modern business. Get started now.',
    'hero.getStarted': 'Get Started',
    'hero.exploreAgent': 'Explore Data Doctor Agent',
    'gallery.title': 'Featured Templates',
    'gallery.subtitle': 'Explore our most popular and high-quality dashboard designs, handcrafted for your success.',
    'gallery.categories': 'Categories',
    'gallery.all': 'All',
    'gallery.bestSeller': 'Best Seller',
    'doctor.title': 'AI Data',
    'doctor.titleHighlight': 'Doctor',
    'doctor.subtitle': 'Diagnose your data health in seconds. Upload Excel/CSV files or paste a Google Sheet link for AI to analyze maturity readiness, detect technical issues, and suggest the optimal "Approach Model".',
    'doctor.uploadBoxTitle': 'Upload your data',
    'doctor.uploadBoxDesc': 'Supports .xlsx, .csv (Max 50 first rows will be analyzed)',
    'doctor.orPasteLink': 'Or paste Google Sheet link (shared):',
    'doctor.selectedFiles': 'Selected files:',
    'doctor.previewData': 'Data Preview (first 5 rows):',
    'doctor.analyzing': 'Diagnosing...',
    'doctor.startAnalyze': 'Start Diagnosis',
    'doctor.resultTitle': 'Diagnosis Results',
    'doctor.analyzingStructure': 'Analyzing data structure...',
    'doctor.error': 'An error occurred during analysis. Please try again later.',
    'doctor.noResult': 'Diagnosis results will appear here.',
    'testimonials.title': 'What our clients say',
    'testimonials.subtitle': 'Success stories from partners who have trusted and accompanied us on the digital transformation journey.',
    'testimonials.quote1': 'Their data solutions have saved us hundreds of hours of reporting each month. The dashboard is intuitive and very easy to use.',
    'testimonials.quote2': 'The professionalism and deep understanding of Data Modeling of the team have helped us build a solid data system.',
    'testimonials.quote3': 'Since adopting the new approach model, our revenue has increased by 30% thanks to data-driven decision making.',
    'testimonials.role1': 'Operations Director',
    'testimonials.role2': 'Head of Analytics',
    'testimonials.role3': 'CEO',
    'footer.desc': 'Professional data solutions consultant and Power BI designer. Turning data into optimal "Approach Models" for businesses.',
    'footer.services': 'Services',
    'footer.service1': 'Dashboard Design',
    'footer.service2': 'AI Strategy Consulting',
    'footer.service3': 'Data Standardization',
    'footer.contact': 'Contact',
    'footer.getConsultation': 'Get free consultation &rarr;',
    'footer.privacy': 'Absolute commitment to customer information security.',
    'contact.success': 'Thank you for submitting your information. We will contact you shortly!',
    'contact.title': 'Get Free Data',
    'contact.titleHighlight': 'Diagnosis',
    'contact.subtitle': 'Leave your information so I can contact you and advise on the most suitable data "Approach Model" for your business.',
    'contact.name': 'Full Name *',
    'contact.namePlaceholder': 'John Doe',
    'contact.company': 'Company/Organization',
    'contact.companyPlaceholder': 'Your company name',
    'contact.email': 'Work Email *',
    'contact.emailPlaceholder': 'email@company.com',
    'contact.phone': 'Phone Number *',
    'contact.phonePlaceholder': '090 123 4567',
    'contact.service': 'Service of Interest',
    'contact.service1': 'Power BI Dashboard Design',
    'contact.service2': 'Data Standardization (ETL)',
    'contact.service3': 'Data Strategy Consulting',
    'contact.service4': 'Other',
    'contact.message': 'Describe current data issues',
    'contact.messagePlaceholder': 'Example: Manual reporting takes a lot of time, data is fragmented in many Excel files...',
    'contact.submit': 'Send consultation request',
    'contact.privacyNote': 'By submitting your information, you agree to our privacy policy. Absolute commitment to customer information security.',
    'datasets.title': 'Free',
    'datasets.titleHighlight': 'Datasets',
    'datasets.subtitle': 'Real-world sample datasets to help you practice and improve your data analysis and Dashboard building skills.',
    'datasets.download': 'Download CSV',
    'datasets.ds1.title': 'E-commerce Sales Data',
    'datasets.ds1.desc': 'E-commerce sales data with over 100k transactions, including customer, product, and revenue information.',
    'datasets.ds2.title': 'Marketing Campaign Performance',
    'datasets.ds2.desc': 'Results of advertising campaigns on Facebook, Google Ads, including costs, clicks, and conversions.',
    'datasets.ds3.title': 'HR Employee Attrition',
    'datasets.ds3.desc': 'HR data with metrics on satisfaction, compensation, and turnover rates.',
    'datasets.ds4.title': 'Supply Chain & Logistics',
    'datasets.ds4.desc': 'Shipping, inventory, and delivery time information from various suppliers.',
    'datasets.ds5.title': 'Financial P&L Statements',
    'datasets.ds5.desc': 'Sample Profit and Loss (P&L) statements of a tech company over 5 years.',
    'datasets.ds6.title': 'Customer Support Tickets',
    'datasets.ds6.desc': 'Data on customer support requests, response times, and customer satisfaction (CSAT).',
    'blog.title': 'Data',
    'blog.titleHighlight': 'Blog',
    'blog.subtitle': 'Sharing knowledge, experience, and the latest "Approach Models" in the field of data analysis.',
    'blog.category': 'Power BI & Data',
    'blog.postTitle': 'Optimizing ROAS with Multi-channel Data Approach Model',
    'blog.postDesc': 'Discover how to build an automated reporting system that helps track and optimize advertising costs across multiple platforms most effectively.',
    'blog.date': 'March 18, 2026',
    'blog.readTime': '5 min read',
  },
  vi: {
    'nav.showcase': 'Sản phẩm',
    'nav.aiConsultant': 'Tư vấn AI',
    'nav.playground': 'Sân chơi',
    'nav.blog': 'Blog',
    'nav.datasets': 'Dữ liệu miễn phí',
    'nav.getDiagnosis': 'Nhận chẩn đoán Data miễn phí',
    'hero.title': 'Khai phá tiềm năng dữ liệu với',
    'hero.titleHighlight': 'Dashboard Cao cấp',
    'hero.subtitle': 'Khám phá bộ sưu tập các mẫu dashboard chất lượng cao, dễ dàng tùy chỉnh, thiết kế riêng cho doanh nghiệp hiện đại. Bắt đầu ngay.',
    'hero.getStarted': 'Bắt đầu ngay',
    'hero.exploreAgent': 'Khám phá Data Doctor Agent',
    'gallery.title': 'Mẫu Nổi Bật',
    'gallery.subtitle': 'Khám phá các thiết kế dashboard phổ biến và chất lượng nhất của chúng tôi, được tạo ra cho sự thành công của bạn.',
    'gallery.categories': 'Danh mục',
    'gallery.all': 'Tất cả',
    'gallery.bestSeller': 'Bán Chạy',
    'doctor.title': 'AI Data',
    'doctor.titleHighlight': 'Doctor',
    'doctor.subtitle': 'Chẩn đoán tình trạng dữ liệu của bạn chỉ trong vài giây. Tải lên file Excel/CSV hoặc dán link Google Sheet để AI phân tích maturity readiness, phát hiện lỗi kỹ thuật và đề xuất "Mô hình tiếp cận" tối ưu nhất.',
    'doctor.uploadBoxTitle': 'Tải lên dữ liệu của bạn',
    'doctor.uploadBoxDesc': 'Hỗ trợ .xlsx, .csv (Tối đa 50 dòng đầu tiên sẽ được phân tích)',
    'doctor.orPasteLink': 'Hoặc dán link Google Sheet (đã share):',
    'doctor.selectedFiles': 'File đã chọn:',
    'doctor.previewData': 'Preview Dữ liệu (5 dòng đầu):',
    'doctor.analyzing': 'Đang chẩn đoán...',
    'doctor.startAnalyze': 'Bắt đầu chẩn đoán',
    'doctor.resultTitle': 'Kết quả chẩn đoán',
    'doctor.analyzingStructure': 'Đang phân tích cấu trúc dữ liệu...',
    'doctor.error': 'Đã xảy ra lỗi trong quá trình phân tích. Vui lòng thử lại sau.',
    'doctor.noResult': 'Kết quả chẩn đoán sẽ hiển thị tại đây.',
    'testimonials.title': 'Khách hàng nói gì về chúng tôi',
    'testimonials.subtitle': 'Những câu chuyện thành công từ các đối tác đã tin tưởng và đồng hành cùng chúng tôi trên hành trình chuyển đổi số.',
    'testimonials.quote1': 'Giải pháp dữ liệu của họ đã giúp chúng tôi tiết kiệm hàng trăm giờ làm báo cáo mỗi tháng. Dashboard trực quan và rất dễ sử dụng.',
    'testimonials.quote2': 'Sự chuyên nghiệp và am hiểu sâu sắc về Data Modeling của đội ngũ đã giúp chúng tôi xây dựng được một hệ thống dữ liệu vững chắc.',
    'testimonials.quote3': 'Từ khi áp dụng mô hình tiếp cận mới, doanh thu của chúng tôi đã tăng 30% nhờ vào việc ra quyết định dựa trên dữ liệu thực tế.',
    'testimonials.role1': 'Giám đốc Vận hành',
    'testimonials.role2': 'Trưởng phòng Phân tích',
    'testimonials.role3': 'CEO',
    'footer.desc': 'Chuyên gia tư vấn giải pháp dữ liệu và thiết kế Power BI chuyên nghiệp. Biến dữ liệu thành "Mô hình tiếp cận" tối ưu cho doanh nghiệp.',
    'footer.services': 'Dịch vụ',
    'footer.service1': 'Thiết kế Dashboard',
    'footer.service2': 'Tư vấn chiến lược AI',
    'footer.service3': 'Chuẩn hóa dữ liệu',
    'footer.contact': 'Liên hệ',
    'footer.getConsultation': 'Nhận tư vấn miễn phí &rarr;',
    'footer.privacy': 'Cam kết bảo mật thông tin khách hàng tuyệt đối.',
    'contact.success': 'Cảm ơn bạn đã gửi thông tin. Chúng tôi sẽ liên hệ sớm nhất!',
    'contact.title': 'Nhận Chẩn Đoán',
    'contact.titleHighlight': 'Data Miễn Phí',
    'contact.subtitle': 'Để lại thông tin để tôi liên hệ và tư vấn "Mô hình tiếp cận" dữ liệu phù hợp nhất cho doanh nghiệp của bạn.',
    'contact.name': 'Họ và tên *',
    'contact.namePlaceholder': 'Nguyễn Văn A',
    'contact.company': 'Công ty/Tổ chức',
    'contact.companyPlaceholder': 'Tên công ty của bạn',
    'contact.email': 'Email công việc *',
    'contact.emailPlaceholder': 'email@company.com',
    'contact.phone': 'Số điện thoại *',
    'contact.phonePlaceholder': '090 123 4567',
    'contact.service': 'Dịch vụ quan tâm',
    'contact.service1': 'Thiết kế Dashboard Power BI',
    'contact.service2': 'Chuẩn hóa dữ liệu (ETL)',
    'contact.service3': 'Tư vấn chiến lược Data',
    'contact.service4': 'Khác',
    'contact.message': 'Mô tả vấn đề dữ liệu hiện tại',
    'contact.messagePlaceholder': 'Ví dụ: Báo cáo thủ công mất nhiều thời gian, dữ liệu phân mảnh ở nhiều file Excel...',
    'contact.submit': 'Gửi yêu cầu tư vấn',
    'contact.privacyNote': 'Bằng việc gửi thông tin, bạn đồng ý với chính sách bảo mật của chúng tôi. Cam kết bảo mật thông tin khách hàng tuyệt đối.',
    'datasets.title': 'Free',
    'datasets.titleHighlight': 'Datasets',
    'datasets.subtitle': 'Bộ dữ liệu mẫu thực tế giúp bạn thực hành và nâng cao kỹ năng phân tích dữ liệu, xây dựng Dashboard.',
    'datasets.download': 'Tải xuống CSV',
    'datasets.ds1.title': 'E-commerce Sales Data',
    'datasets.ds1.desc': 'Dữ liệu bán hàng thương mại điện tử với hơn 100k giao dịch, bao gồm thông tin khách hàng, sản phẩm, và doanh thu.',
    'datasets.ds2.title': 'Marketing Campaign Performance',
    'datasets.ds2.desc': 'Kết quả của các chiến dịch quảng cáo trên Facebook, Google Ads, bao gồm chi phí, lượt click, và chuyển đổi.',
    'datasets.ds3.title': 'HR Employee Attrition',
    'datasets.ds3.desc': 'Dữ liệu nhân sự với các chỉ số về mức độ hài lòng, lương thưởng, và tỷ lệ nghỉ việc.',
    'datasets.ds4.title': 'Supply Chain & Logistics',
    'datasets.ds4.desc': 'Thông tin vận chuyển, tồn kho, và thời gian giao hàng từ nhiều nhà cung cấp khác nhau.',
    'datasets.ds5.title': 'Financial P&L Statements',
    'datasets.ds5.desc': 'Báo cáo kết quả hoạt động kinh doanh (P&L) mẫu của một công ty công nghệ trong 5 năm.',
    'datasets.ds6.title': 'Customer Support Tickets',
    'datasets.ds6.desc': 'Dữ liệu về các yêu cầu hỗ trợ khách hàng, thời gian phản hồi, và mức độ hài lòng (CSAT).',
    'blog.title': 'Data',
    'blog.titleHighlight': 'Blog',
    'blog.subtitle': 'Chia sẻ kiến thức, kinh nghiệm và các "Mô hình tiếp cận" mới nhất trong lĩnh vực phân tích dữ liệu.',
    'blog.category': 'Power BI & Data',
    'blog.postTitle': 'Tối ưu hóa ROAS với Mô hình tiếp cận dữ liệu đa kênh',
    'blog.postDesc': 'Khám phá cách xây dựng hệ thống báo cáo tự động giúp theo dõi và tối ưu hóa chi phí quảng cáo trên nhiều nền tảng khác nhau một cách hiệu quả nhất.',
    'blog.date': '18 Tháng 3, 2026',
    'blog.readTime': '5 phút đọc',
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>('en');

  useEffect(() => {
    const savedLang = localStorage.getItem('language') as Language | null;
    if (savedLang) {
      setLanguage(savedLang);
    }
  }, []);

  const toggleLanguage = () => {
    setLanguage(prev => {
      const newLang = prev === 'en' ? 'vi' : 'en';
      localStorage.setItem('language', newLang);
      return newLang;
    });
  };

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
