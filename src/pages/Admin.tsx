import { useState, useEffect } from 'react';
import { useAuth } from '../AuthContext';
import { db } from '../firebase';
import { collection, getDocs, addDoc, deleteDoc, doc, updateDoc, serverTimestamp, query, orderBy } from 'firebase/firestore';
import { Plus, Trash2, Edit2, LogOut, LogIn, LayoutDashboard, Store, FileText, Database } from 'lucide-react';

interface Dashboard {
  id: string;
  title: string;
  subtitle: string;
  desc: string;
  url: string;
  image: string;
  thumb: string;
  order: number;
}

interface StoreDashboard {
  id: string;
  title: string;
  category: string;
  desc: string;
  url: string;
  image: string;
  price: string;
  paymentLink: string;
  order: number;
  isBestSeller?: boolean;
}

export default function Admin() {
  const { user, isAdmin, loading, login, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<'carousel' | 'store' | 'blog' | 'dataset'>('carousel');
  
  // Carousel State
  const [dashboards, setDashboards] = useState<Dashboard[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState<string | null>(null);
  const [fileInputKey, setFileInputKey] = useState(Date.now());
  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    desc: '',
    url: '',
    image: '',
    thumb: '',
    order: 0
  });

  // Store State
  const [storeDashboards, setStoreDashboards] = useState<StoreDashboard[]>([]);
  const [isEditingStore, setIsEditingStore] = useState(false);
  const [currentStoreId, setCurrentStoreId] = useState<string | null>(null);
  const [storeFileInputKey, setStoreFileInputKey] = useState(Date.now());
  const [storeFormData, setStoreFormData] = useState({
    title: '',
    category: '',
    desc: '',
    url: '',
    image: '',
    price: '',
    paymentLink: '',
    order: 0,
    isBestSeller: false
  });

  useEffect(() => {
    if (isAdmin) {
      fetchDashboards();
      fetchStoreDashboards();
    }
  }, [isAdmin]);

  const fetchDashboards = async () => {
    try {
      const q = query(collection(db, 'dashboards'), orderBy('order', 'asc'));
      const querySnapshot = await getDocs(q);
      const data = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Dashboard[];
      setDashboards(data);
    } catch (error) {
      console.error("Error fetching dashboards:", error);
    }
  };

  const fetchStoreDashboards = async () => {
    try {
      const q = query(collection(db, 'store_dashboards'), orderBy('order', 'asc'));
      const querySnapshot = await getDocs(q);
      const data = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as StoreDashboard[];
      setStoreDashboards(data);
    } catch (error) {
      console.error("Error fetching store dashboards:", error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'order' ? Number(value) : value
    }));
  };

  const handleStoreInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const target = e.target as HTMLInputElement;
    const name = target.name;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    
    setStoreFormData(prev => ({
      ...prev,
      [name]: name === 'order' ? Number(value) : value
    }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, field: 'image' | 'thumb', isStore = false) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = field === 'thumb' ? 600 : 1200;
        const MAX_HEIGHT = field === 'thumb' ? 600 : 1200;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, width, height);

        const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
        if (isStore) {
          setStoreFormData(prev => ({ ...prev, [field]: dataUrl }));
        } else {
          setFormData(prev => ({ ...prev, [field]: dataUrl }));
        }
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    if (!formData.image || !formData.thumb) {
      alert("Vui lòng tải lên cả Ảnh lớn và Ảnh nhỏ.");
      return;
    }

    try {
      if (isEditing && currentId) {
        await updateDoc(doc(db, 'dashboards', currentId), {
          ...formData
        });
      } else {
        await addDoc(collection(db, 'dashboards'), {
          ...formData,
          createdAt: serverTimestamp(),
          authorUid: user.uid
        });
      }
      
      setFormData({ title: '', subtitle: '', desc: '', url: '', image: '', thumb: '', order: 0 });
      setIsEditing(false);
      setCurrentId(null);
      setFileInputKey(Date.now());
      fetchDashboards();
    } catch (error) {
      console.error("Error saving dashboard:", error);
      alert("Lỗi khi lưu Dashboard. Vui lòng kiểm tra lại quyền hoặc dữ liệu.");
    }
  };

  const handleStoreSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    if (!storeFormData.image) {
      alert("Vui lòng tải lên Ảnh.");
      return;
    }

    try {
      if (isEditingStore && currentStoreId) {
        await updateDoc(doc(db, 'store_dashboards', currentStoreId), {
          ...storeFormData
        });
      } else {
        await addDoc(collection(db, 'store_dashboards'), {
          ...storeFormData,
          createdAt: serverTimestamp(),
          authorUid: user.uid
        });
      }
      
      setStoreFormData({ title: '', category: '', desc: '', url: '', image: '', price: '', paymentLink: '', order: 0, isBestSeller: false });
      setIsEditingStore(false);
      setCurrentStoreId(null);
      setStoreFileInputKey(Date.now());
      fetchStoreDashboards();
    } catch (error) {
      console.error("Error saving store dashboard:", error);
      alert("Lỗi khi lưu Store Dashboard. Vui lòng kiểm tra lại quyền hoặc dữ liệu.");
    }
  };

  const handleEdit = (dashboard: Dashboard) => {
    setFormData({
      title: dashboard.title,
      subtitle: dashboard.subtitle,
      desc: dashboard.desc,
      url: dashboard.url,
      image: dashboard.image,
      thumb: dashboard.thumb,
      order: dashboard.order
    });
    setCurrentId(dashboard.id);
    setIsEditing(true);
    setFileInputKey(Date.now());
  };

  const handleStoreEdit = (dashboard: StoreDashboard) => {
    setStoreFormData({
      title: dashboard.title,
      category: dashboard.category,
      desc: dashboard.desc,
      url: dashboard.url || '',
      image: dashboard.image,
      price: dashboard.price,
      paymentLink: dashboard.paymentLink,
      order: dashboard.order,
      isBestSeller: dashboard.isBestSeller || false
    });
    setCurrentStoreId(dashboard.id);
    setIsEditingStore(true);
    setStoreFileInputKey(Date.now());
  };

  const handleDelete = async (id: string, isStore = false) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa Dashboard này?")) {
      try {
        if (isStore) {
          await deleteDoc(doc(db, 'store_dashboards', id));
          fetchStoreDashboards();
        } else {
          await deleteDoc(doc(db, 'dashboards', id));
          fetchDashboards();
        }
      } catch (error) {
        console.error("Error deleting dashboard:", error);
      }
    }
  };

  if (loading) {
    return <div className="min-h-screen pt-24 flex items-center justify-center">Đang tải...</div>;
  }

  if (!user) {
    return (
      <div className="min-h-screen pt-24 flex flex-col items-center justify-center relative z-10">
        <h1 className="text-3xl font-bold mb-6 text-slate-900 dark:text-white">Quản trị viên</h1>
        <button 
          onClick={login}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-yellow-400 to-purple-600 text-white dark:text-black font-semibold rounded-lg hover:opacity-90 transition-opacity"
        >
          <LogIn size={20} />
          Đăng nhập bằng Google
        </button>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen pt-24 flex flex-col items-center justify-center relative z-10">
        <h1 className="text-3xl font-bold text-red-500 dark:text-red-400 mb-4">Truy cập bị từ chối</h1>
        <p className="mb-6 text-slate-600 dark:text-gray-300">Tài khoản của bạn không có quyền truy cập trang quản trị.</p>
        <button 
          onClick={logout}
          className="px-6 py-2 bg-slate-200 dark:bg-white/10 text-slate-900 dark:text-white rounded-lg hover:bg-slate-300 dark:hover:bg-white/20 transition-colors backdrop-blur-md border border-slate-300 dark:border-white/10"
        >
          Đăng xuất
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-12 relative z-10">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 to-purple-600 dark:from-yellow-400 dark:to-purple-400">Quản lý Dashboards</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-slate-600 dark:text-gray-300">{user.email}</span>
            <button 
              onClick={logout}
              className="flex items-center gap-2 px-4 py-2 bg-slate-200 dark:bg-white/10 text-slate-900 dark:text-white rounded-lg hover:bg-slate-300 dark:hover:bg-white/20 transition-colors text-sm backdrop-blur-md border border-slate-300 dark:border-white/10"
            >
              <LogOut size={16} />
              Đăng xuất
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-8 border-b border-slate-200 dark:border-white/10 pb-4">
          <button
            onClick={() => setActiveTab('carousel')}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
              activeTab === 'carousel' 
                ? 'bg-gradient-to-r from-yellow-400 to-purple-600 text-white dark:text-black shadow-[0_0_15px_rgba(168,85,247,0.4)]' 
                : 'bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-gray-300 hover:bg-slate-200 dark:hover:bg-white/10 border border-slate-200 dark:border-white/10 backdrop-blur-md'
            }`}
          >
            <LayoutDashboard size={20} />
            Carousel (Trang chủ)
          </button>
          <button
            onClick={() => setActiveTab('store')}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
              activeTab === 'store' 
                ? 'bg-gradient-to-r from-yellow-400 to-purple-600 text-white dark:text-black shadow-[0_0_15px_rgba(168,85,247,0.4)]' 
                : 'bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-gray-300 hover:bg-slate-200 dark:hover:bg-white/10 border border-slate-200 dark:border-white/10 backdrop-blur-md'
            }`}
          >
            <Store size={20} />
            Store (Thư viện)
          </button>
          <button
            onClick={() => setActiveTab('blog')}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
              activeTab === 'blog' 
                ? 'bg-gradient-to-r from-yellow-400 to-purple-600 text-white dark:text-black shadow-[0_0_15px_rgba(168,85,247,0.4)]' 
                : 'bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-gray-300 hover:bg-slate-200 dark:hover:bg-white/10 border border-slate-200 dark:border-white/10 backdrop-blur-md'
            }`}
          >
            <FileText size={20} />
            Blog
          </button>
          <button
            onClick={() => setActiveTab('dataset')}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
              activeTab === 'dataset' 
                ? 'bg-gradient-to-r from-yellow-400 to-purple-600 text-white dark:text-black shadow-[0_0_15px_rgba(168,85,247,0.4)]' 
                : 'bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-gray-300 hover:bg-slate-200 dark:hover:bg-white/10 border border-slate-200 dark:border-white/10 backdrop-blur-md'
            }`}
          >
            <Database size={20} />
            Upload Dataset
          </button>
        </div>

        {activeTab === 'carousel' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Form Carousel */}
            <div className="lg:col-span-1 bg-white dark:bg-white/5 backdrop-blur-xl p-6 rounded-2xl shadow-xl border border-slate-200 dark:border-white/10 h-fit">
              <h2 className="text-xl font-bold mb-6 text-slate-900 dark:text-white">{isEditing ? 'Sửa Dashboard' : 'Thêm Dashboard mới'}</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-1">Tiêu đề (Title)</label>
                  <input required type="text" name="title" value={formData.title} onChange={handleInputChange} className="w-full px-3 py-2 bg-slate-50 dark:bg-black/50 border border-slate-200 dark:border-white/10 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-gray-500" placeholder="VD: RECRUITMENT ANALYTICS" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-1">Phân loại (Subtitle)</label>
                  <input required type="text" name="subtitle" value={formData.subtitle} onChange={handleInputChange} className="w-full px-3 py-2 bg-slate-50 dark:bg-black/50 border border-slate-200 dark:border-white/10 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-gray-500" placeholder="VD: Human Resources" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-1">Mô tả ngắn (Description)</label>
                  <textarea required name="desc" value={formData.desc} onChange={handleInputChange} rows={3} className="w-full px-3 py-2 bg-slate-50 dark:bg-black/50 border border-slate-200 dark:border-white/10 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-gray-500" placeholder="Mô tả chi tiết về dashboard..."></textarea>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-1">Link PowerBI (URL)</label>
                  <input required type="url" name="url" value={formData.url} onChange={handleInputChange} className="w-full px-3 py-2 bg-slate-50 dark:bg-black/50 border border-slate-200 dark:border-white/10 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-gray-500" placeholder="https://app.powerbi.com/view?r=..." />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-1">Ảnh lớn (Image)</label>
                  <input key={`image-${fileInputKey}`} type="file" accept="image/*" onChange={(e) => handleImageUpload(e, 'image')} className="w-full px-3 py-2 bg-slate-50 dark:bg-black/50 border border-slate-200 dark:border-white/10 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none text-slate-900 dark:text-white file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-purple-100 dark:file:bg-purple-500/20 file:text-purple-700 dark:file:text-purple-300 hover:file:bg-purple-200 dark:hover:file:bg-purple-500/30" />
                  {formData.image && <img src={formData.image} alt="Preview" className="mt-2 h-20 object-cover rounded border border-slate-200 dark:border-white/10" />}
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-1">Ảnh nhỏ (Thumbnail)</label>
                  <input key={`thumb-${fileInputKey}`} type="file" accept="image/*" onChange={(e) => handleImageUpload(e, 'thumb')} className="w-full px-3 py-2 bg-slate-50 dark:bg-black/50 border border-slate-200 dark:border-white/10 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none text-slate-900 dark:text-white file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-purple-100 dark:file:bg-purple-500/20 file:text-purple-700 dark:file:text-purple-300 hover:file:bg-purple-200 dark:hover:file:bg-purple-500/30" />
                  {formData.thumb && <img src={formData.thumb} alt="Preview" className="mt-2 h-20 object-cover rounded border border-slate-200 dark:border-white/10" />}
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-1">Thứ tự hiển thị (Order)</label>
                  <input required type="number" name="order" value={formData.order} onChange={handleInputChange} className="w-full px-3 py-2 bg-slate-50 dark:bg-black/50 border border-slate-200 dark:border-white/10 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none text-slate-900 dark:text-white" />
                </div>
                
                <div className="pt-4 flex gap-2">
                  <button type="submit" className="flex-1 bg-gradient-to-r from-yellow-400 to-purple-600 text-white dark:text-black py-2 rounded-lg font-semibold hover:opacity-90 transition-opacity flex items-center justify-center gap-2">
                    <Plus size={18} />
                    {isEditing ? 'Cập nhật' : 'Thêm mới'}
                  </button>
                  {isEditing && (
                    <button type="button" onClick={() => { setIsEditing(false); setFormData({ title: '', subtitle: '', desc: '', url: '', image: '', thumb: '', order: 0 }); setCurrentId(null); setFileInputKey(Date.now()); }} className="px-4 py-2 bg-slate-200 dark:bg-white/10 text-slate-900 dark:text-white rounded-lg font-medium hover:bg-slate-300 dark:hover:bg-white/20 transition-colors border border-slate-300 dark:border-white/10">
                      Hủy
                    </button>
                  )}
                </div>
              </form>
            </div>

            {/* List Carousel */}
            <div className="lg:col-span-2">
              <div className="bg-white dark:bg-white/5 backdrop-blur-xl rounded-2xl shadow-xl border border-slate-200 dark:border-white/10 overflow-hidden">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 dark:bg-white/5 border-b border-slate-200 dark:border-white/10">
                      <th className="p-4 font-medium text-slate-700 dark:text-gray-300">Thứ tự</th>
                      <th className="p-4 font-medium text-slate-700 dark:text-gray-300">Dashboard</th>
                      <th className="p-4 font-medium text-slate-700 dark:text-gray-300">Phân loại</th>
                      <th className="p-4 font-medium text-slate-700 dark:text-gray-300 text-right">Thao tác</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dashboards.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="p-8 text-center text-slate-500 dark:text-gray-400">Chưa có dashboard nào. Hãy thêm mới!</td>
                      </tr>
                    ) : (
                      dashboards.map((db) => (
                        <tr key={db.id} className="border-b border-slate-100 dark:border-white/5 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
                          <td className="p-4 text-slate-700 dark:text-gray-300">{db.order}</td>
                          <td className="p-4">
                            <div className="font-medium text-slate-900 dark:text-white">{db.title}</div>
                            <div className="text-sm text-slate-500 dark:text-gray-400 truncate max-w-xs">{db.url}</div>
                          </td>
                          <td className="p-4 text-slate-700 dark:text-gray-300">{db.subtitle}</td>
                          <td className="p-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button onClick={() => handleEdit(db)} className="p-2 text-yellow-600 dark:text-yellow-400 hover:bg-yellow-100 dark:hover:bg-yellow-400/10 rounded-lg transition-colors">
                                <Edit2 size={16} />
                              </button>
                              <button onClick={() => handleDelete(db.id)} className="p-2 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-400/10 rounded-lg transition-colors">
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'store' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Form Store */}
            <div className="lg:col-span-1 bg-white dark:bg-white/5 backdrop-blur-xl p-6 rounded-2xl shadow-xl border border-slate-200 dark:border-white/10 h-fit">
              <h2 className="text-xl font-bold mb-6 text-slate-900 dark:text-white">{isEditingStore ? 'Sửa Store Dashboard' : 'Thêm Store Dashboard'}</h2>
              <form onSubmit={handleStoreSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-1">Tiêu đề (Title)</label>
                  <input required type="text" name="title" value={storeFormData.title} onChange={handleStoreInputChange} className="w-full px-3 py-2 bg-slate-50 dark:bg-black/50 border border-slate-200 dark:border-white/10 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-gray-500" placeholder="VD: Fashion Store Analytics" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-1">Danh mục (Category)</label>
                  <input 
                    type="text" 
                    required 
                    name="category" 
                    value={storeFormData.category} 
                    onChange={handleStoreInputChange} 
                    list="store-categories"
                    placeholder="Nhập hoặc chọn danh mục"
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-black/50 border border-slate-200 dark:border-white/10 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-gray-500"
                  />
                  <datalist id="store-categories">
                    {Array.from(new Set(storeDashboards.map(d => d.category).filter(Boolean))).map(cat => (
                      <option key={cat} value={cat} />
                    ))}
                  </datalist>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-1">Mô tả ngắn (Description)</label>
                  <textarea required name="desc" value={storeFormData.desc} onChange={handleStoreInputChange} rows={3} className="w-full px-3 py-2 bg-slate-50 dark:bg-black/50 border border-slate-200 dark:border-white/10 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-gray-500" placeholder="Mô tả chi tiết..."></textarea>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-1">Link Xem trước (URL)</label>
                  <input type="url" name="url" value={storeFormData.url} onChange={handleStoreInputChange} className="w-full px-3 py-2 bg-slate-50 dark:bg-black/50 border border-slate-200 dark:border-white/10 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-gray-500" placeholder="https://app.powerbi.com/view?r=..." />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-1">Giá (Price)</label>
                  <input required type="text" name="price" value={storeFormData.price} onChange={handleStoreInputChange} className="w-full px-3 py-2 bg-slate-50 dark:bg-black/50 border border-slate-200 dark:border-white/10 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-gray-500" placeholder="VD: $49" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-1">Link Thanh toán (Stripe/Payment Link)</label>
                  <input required type="url" name="paymentLink" value={storeFormData.paymentLink} onChange={handleStoreInputChange} className="w-full px-3 py-2 bg-slate-50 dark:bg-black/50 border border-slate-200 dark:border-white/10 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-gray-500" placeholder="https://buy.stripe.com/..." />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-1">Ảnh (Image)</label>
                  <input key={`store-image-${storeFileInputKey}`} type="file" accept="image/*" onChange={(e) => handleImageUpload(e, 'image', true)} className="w-full px-3 py-2 bg-slate-50 dark:bg-black/50 border border-slate-200 dark:border-white/10 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none text-slate-900 dark:text-white file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-purple-100 dark:file:bg-purple-500/20 file:text-purple-700 dark:file:text-purple-300 hover:file:bg-purple-200 dark:hover:file:bg-purple-500/30" />
                  {storeFormData.image && <img src={storeFormData.image} alt="Preview" className="mt-2 h-20 object-cover rounded border border-slate-200 dark:border-white/10" />}
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-1">Thứ tự hiển thị (Order)</label>
                  <input required type="number" name="order" value={storeFormData.order} onChange={handleStoreInputChange} className="w-full px-3 py-2 bg-slate-50 dark:bg-black/50 border border-slate-200 dark:border-white/10 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none text-slate-900 dark:text-white" />
                </div>
                
                <div className="flex items-center gap-2 mt-2">
                  <input 
                    type="checkbox" 
                    id="isBestSeller" 
                    name="isBestSeller" 
                    checked={storeFormData.isBestSeller} 
                    onChange={handleStoreInputChange} 
                    className="w-4 h-4 text-purple-600 bg-slate-50 dark:bg-black/50 border-slate-200 dark:border-white/10 rounded focus:ring-purple-500 focus:ring-2" 
                  />
                  <label htmlFor="isBestSeller" className="text-sm font-medium text-slate-700 dark:text-gray-300">
                    Đánh dấu Best Seller
                  </label>
                </div>
                
                <div className="pt-4 flex gap-2">
                  <button type="submit" className="flex-1 bg-gradient-to-r from-yellow-400 to-purple-600 text-white dark:text-black py-2 rounded-lg font-semibold hover:opacity-90 transition-opacity flex items-center justify-center gap-2">
                    <Plus size={18} />
                    {isEditingStore ? 'Cập nhật' : 'Thêm mới'}
                  </button>
                  {isEditingStore && (
                    <button type="button" onClick={() => { setIsEditingStore(false); setStoreFormData({ title: '', category: '', desc: '', url: '', image: '', price: '', paymentLink: '', order: 0, isBestSeller: false }); setCurrentStoreId(null); setStoreFileInputKey(Date.now()); }} className="px-4 py-2 bg-slate-200 dark:bg-white/10 text-slate-900 dark:text-white rounded-lg font-medium hover:bg-slate-300 dark:hover:bg-white/20 transition-colors border border-slate-300 dark:border-white/10">
                      Hủy
                    </button>
                  )}
                </div>
              </form>
            </div>

            {/* List Store */}
            <div className="lg:col-span-2">
              <div className="bg-white dark:bg-white/5 backdrop-blur-xl rounded-2xl shadow-xl border border-slate-200 dark:border-white/10 overflow-hidden">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 dark:bg-white/5 border-b border-slate-200 dark:border-white/10">
                      <th className="p-4 font-medium text-slate-700 dark:text-gray-300">Thứ tự</th>
                      <th className="p-4 font-medium text-slate-700 dark:text-gray-300">Dashboard</th>
                      <th className="p-4 font-medium text-slate-700 dark:text-gray-300">Danh mục</th>
                      <th className="p-4 font-medium text-slate-700 dark:text-gray-300">Giá</th>
                      <th className="p-4 font-medium text-slate-700 dark:text-gray-300 text-right">Thao tác</th>
                    </tr>
                  </thead>
                  <tbody>
                    {storeDashboards.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="p-8 text-center text-slate-500 dark:text-gray-400">Chưa có dashboard nào trong Store. Hãy thêm mới!</td>
                      </tr>
                    ) : (
                      [...storeDashboards].sort((a, b) => (b.isBestSeller === true ? 1 : 0) - (a.isBestSeller === true ? 1 : 0) || a.order - b.order).map((db) => (
                        <tr key={db.id} className="border-b border-slate-100 dark:border-white/5 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
                          <td className="p-4 text-slate-700 dark:text-gray-300">{db.order}</td>
                          <td className="p-4">
                            <div className="font-medium text-slate-900 dark:text-white flex items-center gap-2">
                              {db.title}
                              {db.isBestSeller && (
                                <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-gradient-to-r from-yellow-400 to-yellow-600 text-white dark:text-black rounded-full">
                                  Best Seller
                                </span>
                              )}
                            </div>
                            <div className="text-sm text-slate-500 dark:text-gray-400 truncate max-w-xs">{db.paymentLink}</div>
                          </td>
                          <td className="p-4 text-slate-700 dark:text-gray-300">{db.category}</td>
                          <td className="p-4 text-yellow-600 dark:text-yellow-400 font-medium">{db.price}</td>
                          <td className="p-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button onClick={() => handleStoreEdit(db)} className="p-2 text-yellow-600 dark:text-yellow-400 hover:bg-yellow-100 dark:hover:bg-yellow-400/10 rounded-lg transition-colors">
                                <Edit2 size={16} />
                              </button>
                              <button onClick={() => handleDelete(db.id, true)} className="p-2 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-400/10 rounded-lg transition-colors">
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'blog' && (
          <div className="bg-white dark:bg-white/5 backdrop-blur-xl p-8 rounded-2xl shadow-xl border border-slate-200 dark:border-white/10 text-center">
            <FileText size={48} className="mx-auto text-slate-400 mb-4" />
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Blog Management</h2>
            <p className="text-slate-600 dark:text-slate-400">This section is under construction. You will be able to manage blog posts here.</p>
          </div>
        )}

        {activeTab === 'dataset' && (
          <div className="bg-white dark:bg-white/5 backdrop-blur-xl p-8 rounded-2xl shadow-xl border border-slate-200 dark:border-white/10 text-center">
            <Database size={48} className="mx-auto text-slate-400 mb-4" />
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Dataset Upload</h2>
            <p className="text-slate-600 dark:text-slate-400">This section is under construction. You will be able to upload and manage datasets here.</p>
          </div>
        )}
      </div>
    </div>
  );
}
