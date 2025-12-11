

// /* eslint-disable no-unused-vars */
// import React, { useState, useEffect } from 'react';
// import { 
//   Plus, 
//   Edit, 
//   Trash2, 
//   X, 
//   Loader2, 
//   Save, 
//   Eye,
//   ChevronDown,
//   Search
// } from 'lucide-react';
// import { toast } from 'sonner';
// import { Star, Clock } from 'lucide-react';

// const BlogManagement = () => {
//   const [blogs, setBlogs] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [showCreateModal, setShowCreateModal] = useState(false);
//   const [editingBlog, setEditingBlog] = useState(null);
//   const [formData, setFormData] = useState({
//     title: '',
//     content: '',
//     image: '',                    // Main Cloudinary URL
//     additionalImages: [],         // Array of Cloudinary URLs
//   });
//   const [submitting, setSubmitting] = useState(false);
//   const [searchQuery, setSearchQuery] = useState('');

//   useEffect(() => {
//     fetchBlogs();
//   }, []);

//   const fetchBlogs = async () => {
//     try {
//       setLoading(true);
//       const token = localStorage.getItem('token');
//       const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/blogs`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       const data = await res.json();
//       console.log(data);
//       if (data.status === 'success') {
//         setBlogs(data.data.blogs || []);
//       } else {
//         toast.error('Failed to load blogs');
//       }
//     } catch (err) {
//       toast.error('Network error');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({ ...prev, [name]: value }));
//   };

//   const handleMainImageChange = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       // Simulate Cloudinary upload (in real app, you would upload to Cloudinary first)
//       // For now, we just set a placeholder URL — replace with real Cloudinary upload logic
//       const fakeCloudinaryUrl = URL.createObjectURL(file);
//       setFormData(prev => ({ ...prev, image: fakeCloudinaryUrl }));
//     }
//   };

//   const handleAdditionalImagesChange = (e) => {
//     const files = Array.from(e.target.files);
//     if (files.length > 0) {
//       const newUrls = files.map(file => URL.createObjectURL(file));
//       setFormData(prev => ({
//         ...prev,
//         additionalImages: [...prev.additionalImages, ...newUrls],
//       }));
//     }
//   };

//   const removeAdditionalImage = (index) => {
//     setFormData(prev => ({
//       ...prev,
//       additionalImages: prev.additionalImages.filter((_, i) => i !== index),
//     }));
//   };

//   const handleContentChange = (content) => {
//     setFormData(prev => ({ ...prev, content }));
//   };

//   const resetForm = () => {
//     setFormData({ title: '', content: '', image: '', additionalImages: [] });
//     setEditingBlog(null);
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!formData.title.trim() || !formData.content.trim()) {
//       toast.error('Title and content are required');
//       return;
//     }

//     setSubmitting(true);
//     try {
//       const token = localStorage.getItem('token');
//       const url = editingBlog 
//         ? `${import.meta.env.VITE_BACKEND_URL}/blogs/${editingBlog._id}`
//         : `${import.meta.env.VITE_BACKEND_URL}/blogs`;
//       const method = editingBlog ? 'PUT' : 'POST';

//       const res = await fetch(url, {
//         method,
//         headers: {
//           'Content-Type': 'application/json',
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify({
//           title: formData.title,
//           content: formData.content,
//           image: formData.image,
//           additionalImages: formData.additionalImages,
//         }),
//       });

//       const data = await res.json();

//       if (data.status === 'success') {
//         toast.success(editingBlog ? 'Blog updated successfully' : 'Blog created successfully');
//         resetForm();
//         setShowCreateModal(false);
//         fetchBlogs();
//       } else {
//         toast.error('Failed to save blog');
//       }
//     } catch (err) {
//       toast.error('Network error');
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   const handleDelete = async (id) => {
//     if (!window.confirm('Are you sure you want to delete this blog?')) return;

//     try {
//       const token = localStorage.getItem('token');
//       const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/blogs/${id}`, {
//         method: 'DELETE',
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       if (res.ok) {
//         toast.success('Blog deleted successfully');
//         fetchBlogs();
//       } else {
//         toast.error('Failed to delete blog');
//       }
//     } catch (err) {
//       toast.error('Network error');
//     }
//   };

//   const handleEdit = (blog) => {
//     setEditingBlog(blog);
//     setFormData({
//       title: blog.title,
//       content: blog.content,
//       image: blog.image || '',
//       additionalImages: blog.additionalImages || [],
//     });
//     setShowCreateModal(true);
//   };

//   const filteredBlogs = blogs.filter(blog =>
//     blog.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
//     blog.content.toLowerCase().includes(searchQuery.toLowerCase())
//   );

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-12 px-4">
//       <div className="max-w-6xl mx-auto">
//         {/* Header */}
//         <div className="flex flex-col md:flex-row justify-between items-center mb-10">
//           <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
//             Blog Management
//           </h1>
//           <button
//             onClick={() => {
//               resetForm();
//               setShowCreateModal(true);
//             }}
//             className="mt-4 md:mt-0 flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold rounded-xl shadow-lg transform hover:scale-105 transition-all"
//           >
//             <Plus className="h-5 w-5" />
//             Create New Blog
//           </button>
//         </div>

//         {/* Search */}
//         <div className="mb-8 relative max-w-md mx-auto">
//           <input
//             type="text"
//             value={searchQuery}
//             onChange={(e) => setSearchQuery(e.target.value)}
//             placeholder="Search blogs..."
//             className="w-full h-12 pl-10 pr-4 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:border-transparent shadow-md"
//           />
//           <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
//         </div>

//         {/* Blog List */}
//         {loading ? (
//           <div className="flex justify-center py-20">
//             <Loader2 className="h-12 w-12 text-indigo-600 animate-spin" />
//           </div>
//         ) : filteredBlogs.length === 0 ? (
//           <div className="text-center py-20 bg-white dark:bg-gray-800 rounded-3xl shadow-xl">
//             <Search className="h-16 w-16 text-gray-400 mx-auto mb-4" />
//             <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
//               No blogs found
//             </h3>
//             <p className="text-gray-600 dark:text-gray-400">
//               {searchQuery ? 'Try different search terms' : 'Create your first blog'}
//             </p>
//           </div>
//         ) : (
//           <div className="grid gap-6">
//             {filteredBlogs.map(blog => (
//               <div 
//                 key={blog._id}
//                 className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl overflow-hidden border border-gray-200 dark:border-gray-700 hover:shadow-2xl transition-shadow"
//               >
//                 <div className="flex flex-col md:flex-row">
//                   {blog.image && (
//                     <div className="md:w-1/3">
//                       <img 
//                         src={blog.image} 
//                         alt={blog.title}
//                         className="w-full h-48 md:h-full object-cover"
//                       />
//                     </div>
//                   )}
//                   <div className="p-8 flex-1">
//                     <div className="flex justify-between items-start mb-4">
//                       <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
//                         {blog.title}
//                       </h3>
//                       <div className="flex gap-3">
//                         <button
//                           onClick={() => handleEdit(blog)}
//                           className="text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300"
//                         >
//                           <Edit className="h-5 w-5" />
//                         </button>
//                         <button
//                           onClick={() => handleDelete(blog._id)}
//                           className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
//                         >
//                           <Trash2 className="h-5 w-5" />
//                         </button>
//                       </div>
//                     </div>

//                     <div className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-3">
//                       <div dangerouslySetInnerHTML={{ __html: blog.content.substring(0, 200) + '...' }} />
//                     </div>

//                     <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
//                       <div className="flex items-center">
//                         <Star className="h-4 w-4 text-yellow-400 mr-1" />
//                         <span>Published by Admin</span>
//                       </div>
//                       <div className="flex items-center">
//                         <Clock className="h-4 w-4 mr-1" />
//                         <span>{new Date(blog.createdAt).toLocaleDateString()}</span>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}
//       </div>

//       {/* Create/Edit Modal */}
//       {showCreateModal && (
//         <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4 overflow-y-auto">
//           <div className="bg-white dark:bg-gray-800 rounded-3xl max-w-4xl w-full my-8 shadow-2xl max-h-[90vh] flex flex-col">
//             {/* Header */}
//             <div className="p-6 border-b flex justify-between items-center flex-shrink-0">
//               <h2 className="text-2xl font-bold">
//                 {editingBlog ? 'Edit Blog' : 'Create New Blog'}
//               </h2>
//               <button onClick={() => {
//                 resetForm();
//                 setShowCreateModal(false);
//               }}>
//                 <X className="h-6 w-6" />
//               </button>
//             </div>

//             {/* Form */}
//             <div className="flex-1 overflow-y-auto p-8">
//               <form onSubmit={handleSubmit} className="space-y-6">
//                 {/* Title */}
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
//                     Blog Title
//                   </label>
//                   <input
//                     type="text"
//                     name="title"
//                     value={formData.title}
//                     onChange={handleInputChange}
//                     className="w-full px-4 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
//                     placeholder="Enter blog title..."
//                     required
//                   />
//                 </div>

//                 {/* Main Image */}
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
//                     Featured Image (Cloudinary)
//                   </label>
//                   <input
//                     type="file"
//                     accept="image/*"
//                     onChange={handleMainImageChange}
//                     className="w-full px-4 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
//                   />
//                   {formData.image && (
//                     <div className="mt-2">
//                       <img 
//                         src={formData.image} 
//                         alt="Preview" 
//                         className="w-32 h-32 object-cover rounded-lg border"
//                       />
//                     </div>
//                   )}
//                 </div>

//                 {/* Additional Images */}
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
//                     Additional Images (Cloudinary)
//                   </label>
//                   <input
//                     type="file"
//                     accept="image/*"
//                     multiple
//                     onChange={handleAdditionalImagesChange}
//                     className="w-full px-4 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
//                   />
//                   <div className="mt-4 grid grid-cols-4 gap-4">
//                     {formData.additionalImages.map((url, index) => (
//                       <div key={index} className="relative">
//                         <img 
//                           src={url} 
//                           alt={`Additional ${index + 1}`} 
//                           className="w-full h-24 object-cover rounded-lg border"
//                         />
//                         <button
//                           type="button"
//                           onClick={() => removeAdditionalImage(index)}
//                           className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full p-1"
//                         >
//                           <X className="h-4 w-4" />
//                         </button>
//                       </div>
//                     ))}
//                   </div>
//                 </div>

//                 {/* Content */}
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
//                     Content
//                   </label>
//                   <input
//                     type="text"
//                     name="content"
//                     value={formData.content}
//                     onChange={handleInputChange}
//                     className="w-full px-4 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
//                     placeholder="Enter blog title..."
//                     required
//                   />
//                 </div>

//                 {/* Submit */}
//                 <button
//                   type="submit"
//                   disabled={submitting}
//                   className="w-full py-4 px-6 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold rounded-xl shadow-lg transform hover:scale-105 transition-all flex items-center justify-center gap-3"
//                 >
//                   {submitting ? (
//                     <Loader2 className="h-5 w-5 animate-spin" />
//                   ) : editingBlog ? (
//                     <>
//                       <Save className="h-5 w-5" />
//                       Update Blog
//                     </>
//                   ) : (
//                     <>
//                       <Plus className="h-5 w-5" />
//                       Create Blog
//                     </>
//                   )}
//                 </button>
//               </form>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default BlogManagement;



/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Edit, 
  Trash2, 
  X, 
  Loader2, 
  Save, 
  Eye,
  ChevronDown,
  Search
} from 'lucide-react';
import { toast } from 'sonner';
import { Star, Clock } from 'lucide-react';

const BlogManagement = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingBlog, setEditingBlog] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    image: '',                    // Main Cloudinary URL
    additionalImages: [],         // Array of Cloudinary URLs
  });
  const [submitting, setSubmitting] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/blogs`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      console.log(data);
      if (data.status === 'success') {
        setBlogs(data.data.blogs || []);
      } else {
        toast.error('Failed to load blogs');
      }
    } catch (err) {
      toast.error('Network error');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const uploadToCloudinary = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET);
    formData.append('cloud_name', import.meta.env.VITE_CLOUDINARY_CLOUD_NAME);

    try {
      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`,
        {
          method: 'POST',
          body: formData,
        }
      );
      const data = await res.json();
      return data.secure_url;
    } catch (err) {
      toast.error('Cloudinary upload failed');
      return null;
    }
  };

  const handleMainImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setSubmitting(true);
      const url = await uploadToCloudinary(file);
      if (url) {
        setFormData(prev => ({ ...prev, image: url }));
      }
      setSubmitting(false);
    }
  };

  const handleAdditionalImagesChange = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      setSubmitting(true);
      const newUrls = [];
      for (const file of files) {
        const url = await uploadToCloudinary(file);
        if (url) newUrls.push(url);
      }
      setFormData(prev => ({
        ...prev,
        additionalImages: [...prev.additionalImages, ...newUrls],
      }));
      setSubmitting(false);
    }
  };

  const removeAdditionalImage = (index) => {
    setFormData(prev => ({
      ...prev,
      additionalImages: prev.additionalImages.filter((_, i) => i !== index),
    }));
  };

  const resetForm = () => {
    setFormData({ title: '', content: '', image: '', additionalImages: [] });
    setEditingBlog(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.content.trim()) {
      toast.error('Title and content are required');
      return;
    }

    setSubmitting(true);
    try {
      const token = localStorage.getItem('token');
      const url = editingBlog 
        ? `${import.meta.env.VITE_BACKEND_URL}/blogs/${editingBlog._id}`
        : `${import.meta.env.VITE_BACKEND_URL}/blogs`;
      const method = editingBlog ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: formData.title,
          content: formData.content,
          image: formData.image,
          additionalImages: formData.additionalImages,
        }),
      });

      const data = await res.json();

      if (data.status === 'success') {
        toast.success(editingBlog ? 'Blog updated successfully' : 'Blog created successfully');
        resetForm();
        setShowCreateModal(false);
        fetchBlogs();
      } else {
        toast.error('Failed to save blog');
      }
    } catch (err) {
      toast.error('Network error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this blog?')) return;

    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/blogs/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        toast.success('Blog deleted successfully');
        fetchBlogs();
      } else {
        toast.error('Failed to delete blog');
      }
    } catch (err) {
      toast.error('Network error');
    }
  };

  const handleEdit = (blog) => {
    setEditingBlog(blog);
    setFormData({
      title: blog.title,
      content: blog.content,
      image: blog.image || '',
      additionalImages: blog.additionalImages || [],
    });
    setShowCreateModal(true);
  };

  const filteredBlogs = blogs.filter(blog =>
    blog.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    blog.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-10">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Blog Management
          </h1>
          <button
            onClick={() => {
              resetForm();
              setShowCreateModal(true);
            }}
            className="mt-4 md:mt-0 flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold rounded-xl shadow-lg transform hover:scale-105 transition-all"
          >
            <Plus className="h-5 w-5" />
            Create New Blog
          </button>
        </div>

        {/* Search */}
        <div className="mb-8 relative max-w-md mx-auto">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search blogs..."
            className="w-full h-12 pl-10 pr-4 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:border-transparent shadow-md"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
        </div>

        {/* Blog List */}
        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="h-12 w-12 text-indigo-600 animate-spin" />
          </div>
        ) : filteredBlogs.length === 0 ? (
          <div className="text-center py-20 bg-white dark:bg-gray-800 rounded-3xl shadow-xl">
            <Search className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              No blogs found
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              {searchQuery ? 'Try different search terms' : 'Create your first blog'}
            </p>
          </div>
        ) : (
          <div className="grid gap-6">
            {filteredBlogs.map(blog => (
              <div 
                key={blog._id}
                className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl overflow-hidden border border-gray-200 dark:border-gray-700 hover:shadow-2xl transition-shadow"
              >
                <div className="flex flex-col md:flex-row">
                  {blog.image && (
                    <div className="md:w-1/3">
                      <img 
                        src={blog.image} 
                        alt={blog.title}
                        className="w-full h-48 md:h-full object-cover"
                      />
                    </div>
                  )}
                  <div className="p-8 flex-1">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                        {blog.title}
                      </h3>
                      <div className="flex gap-3">
                        <button
                          onClick={() => handleEdit(blog)}
                          className="text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300"
                        >
                          <Edit className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => handleDelete(blog._id)}
                          className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </div>
                    </div>

                    <div className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-3">
                      <div dangerouslySetInnerHTML={{ __html: blog.content.substring(0, 200) + '...' }} />
                    </div>

                    <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                      <div className="flex items-center">
                        <Star className="h-4 w-4 text-yellow-400 mr-1" />
                        <span>Published by Admin</span>
                      </div>
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        <span>{new Date(blog.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Create/Edit Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white dark:bg-gray-800 rounded-3xl max-w-4xl w-full my-8 shadow-2xl max-h-[90vh] flex flex-col">
            {/* Header */}
            <div className="p-6 border-b flex justify-between items-center flex-shrink-0">
              <h2 className="text-2xl font-bold">
                {editingBlog ? 'Edit Blog' : 'Create New Blog'}
              </h2>
              <button onClick={() => {
                resetForm();
                setShowCreateModal(false);
              }}>
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Form */}
            <div className="flex-1 overflow-y-auto p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Title */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Blog Title
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="Enter blog title..."
                    required
                  />
                </div>

                {/* Main Image */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Featured Image (Cloudinary)
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleMainImageChange}
                    className="w-full px-4 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                  {formData.image && (
                    <div className="mt-2">
                      <img 
                        src={formData.image} 
                        alt="Preview" 
                        className="w-32 h-32 object-cover rounded-lg border"
                      />
                    </div>
                  )}
                </div>

                {/* Additional Images */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Additional Images (Cloudinary)
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleAdditionalImagesChange}
                    className="w-full px-4 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                  <div className="mt-4 grid grid-cols-4 gap-4">
                    {formData.additionalImages.map((url, index) => (
                      <div key={index} className="relative">
                        <img 
                          src={url} 
                          alt={`Additional ${index + 1}`} 
                          className="w-full h-24 object-cover rounded-lg border"
                        />
                        <button
                          type="button"
                          onClick={() => removeAdditionalImage(index)}
                          className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full p-1"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Content */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Content
                  </label>
                  <input
                    type="text"
                    name="content"
                    value={formData.content}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="Enter blog title..."
                    required
                  />
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-4 px-6 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold rounded-xl shadow-lg transform hover:scale-105 transition-all flex items-center justify-center gap-3"
                >
                  {submitting ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : editingBlog ? (
                    <>
                      <Save className="h-5 w-5" />
                      Update Blog
                    </>
                  ) : (
                    <>
                      <Plus className="h-5 w-5" />
                      Create Blog
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BlogManagement;