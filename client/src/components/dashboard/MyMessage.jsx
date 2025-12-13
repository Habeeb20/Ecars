// /* eslint-disable no-unused-vars */
// import React, { useState, useEffect } from 'react';
// import { 
//   Loader2, 
//   MessageCircle, 
//   Search, 
//   X, 
//   Send, 
//   ShieldCheck,
//   Clock
// } from 'lucide-react';
// import { toast } from 'sonner';
// import { useAuth } from '../../contexts/AuthContext';

// const MyMessages = () => {
//   const { user } = useAuth();
//   const [conversations, setConversations] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [selectedConversation, setSelectedConversation] = useState(null);
//   const [messages, setMessages] = useState([]);
//   const [newMessage, setNewMessage] = useState('');
//   const [sending, setSending] = useState(false);

//   useEffect(() => {
//     fetchConversations();
//   }, []);

//   const fetchConversations = async () => {
//     try {
//       setLoading(true);
//       const token = localStorage.getItem('token');
//       const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/messages/my-conversations`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       const data = await res.json();
// console.log(data)
//       if (data.status === 'success') {
//         setConversations(data.data.conversations || []);
//       } else {
//         toast.error('Failed to load conversations');
//       }
//     } catch (err) {
//       toast.error('Network error');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const openConversation = async (partner) => {
//     try {
//       const token = localStorage.getItem('token');
//       const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/messages/conversation/${partner._id}`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       const data = await res.json();
// console.log(data)
//       if (data.status === 'success') {
//         setMessages(data.data.messages || []);
//         setSelectedConversation(partner);
//       }
//     } catch (err) {
//       toast.error('Failed to load messages');
//     }
//   };

//   const sendMessage = async () => {
//     if (!newMessage.trim() || sending) return;

//     setSending(true);
//     try {
//       const token = localStorage.getItem('token');
//       const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/messages`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify({
//           recipient: selectedConversation._id,
//           content: newMessage,
//         }),
//       });

//       const data = await res.json();
//       console.log(data)
//       if (data.status === 'success') {
//         setMessages(prev => [...prev, data.data.message]);
//         setNewMessage('');
//         fetchConversations(); // Refresh conversation list
//       } else {
//         toast.error('Failed to send message');
//       }
//     } catch (err) {
//       toast.error('Network error');
//     } finally {
//       setSending(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-12 px-4">
//       <div className="max-w-7xl mx-auto">
//         <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-8">
//           My Messages
//         </h1>

//         {loading ? (
//           <div className="flex justify-center py-20">
//             <Loader2 className="h-12 w-12 text-indigo-600 animate-spin" />
//           </div>
//         ) : conversations.length === 0 ? (
//           <div className="text-center py-20 bg-white dark:bg-gray-800 rounded-3xl shadow-xl">
//             <MessageCircle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
//             <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
//               No messages yet
//             </h3>
//             <p className="text-gray-600 dark:text-gray-400">
//               Start a conversation by browsing listings!
//             </p>
//           </div>
//         ) : (
//           <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//             {/* Conversation List */}
//             <div className="lg:col-span-1 bg-white dark:bg-gray-800 rounded-3xl shadow-xl h-fit">
//               <div className="p-4 border-b border-gray-200 dark:border-gray-700">
//                 <h2 className="font-bold text-lg">Conversations</h2>
//               </div>
//               <div className="overflow-y-auto max-h-96">
//                 {conversations?.map(conv => (
//                   <button
//                     key={conv.partner?._id}
//                     onClick={() => openConversation(conv.partner)}
//                     className={`w-full p-4 flex items-center gap-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all ${
//                       selectedConversation?._id === conv.partner?._id ? 'bg-indigo-50 dark:bg-indigo-900/30' : ''
//                     }`}
//                   >
//                     <img 
//                       src={conv.partner?.avatar || '/default-avatar.jpg'} 
//                       alt={conv.partner?.name}
//                       className="h-12 w-12 rounded-full object-cover"
//                     />
//                     <div className="text-left flex-1">
//                       <p className="font-semibold flex items-center gap-1">
//                         {conv.partner?.firstName} {conv.partner?.lastName}
//                         {conv.partner?.verified && <ShieldCheck className="h-4 w-4 text-green-500" />}
//                       </p>
//                       <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
//                         {conv?.lastMessage?.content}
//                       </p>
//                       <p className="text-xs text-gray-400 mt-1">
//                         <Clock className="inline h-3 w-3" /> {new Date(conv?.lastMessageTime?.createdAt).toLocaleDateString()}
//                       </p>
//                     </div>
//                   </button>
//                 ))}
//               </div>
//             </div>

//             {/* Chat Window */}
//             <div className="lg:col-span-2">
//               {selectedConversation ? (
//                 <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl h-full flex flex-col" style={{ minHeight: '600px' }}>
//                   <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
//                     <div className="flex items-center gap-3">
//                       <img 
//                         src={selectedConversation.avatar || '/default-avatar.jpg'} 
//                         alt={selectedConversation.firstName}
//                         className="h-10 w-10 rounded-full"
//                       />
//                       <div>
//                         <h3 className="font-bold">{selectedConversation.firstName} {selectedConversation.lastName}</h3>
//                         <p className="text-sm text-gray-500">Active now</p>
//                       </div>
//                     </div>
//                     <button onClick={() => setSelectedConversation(null)}>
//                       <X className="h-6 w-6 text-gray-500" />
//                     </button>
//                   </div>

//                   <div className="flex-1 overflow-y-auto p-6 space-y-4">
//                     {messages.map(msg => (
//                       <div key={msg._id} className={`flex ${msg.sender._id === user._id ? 'justify-end' : 'justify-start'}`}>
//                         <div className={`max-w-xs px-5 py-3 rounded-3xl ${
//                           msg.sender._id === user._id 
//                             ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white' 
//                             : 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white'
//                         }`}>
//                           <p>{msg.content}</p>
//                           <p className="text-xs opacity-70 mt-1">
//                             {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
//                           </p>
//                         </div>
//                       </div>
//                     ))}
//                   </div>

//                   <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex gap-3">
//                     <input
//                       type="text"
//                       value={newMessage}
//                       onChange={(e) => setNewMessage(e.target.value)}
//                       onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
//                       placeholder="Type a message..."
//                       className="flex-1 px-5 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none"
//                     />
//                     <button
//                       onClick={sendMessage}
//                       disabled={sending || !newMessage.trim()}
//                       className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl flex items-center gap-2 disabled:opacity-50"
//                     >
//                       {sending ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
//                     </button>
//                   </div>
//                 </div>
//               ) : (
//                 <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-12 text-center">
//                   <MessageCircle className="h-20 w-20 text-gray-300 mx-auto mb-6" />
//                   <p className="text-xl text-gray-600 dark:text-gray-400">Select a conversation to start chatting</p>
//                 </div>
//               )}
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default MyMessages;









/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { 
  Loader2, 
  MessageCircle, 
  Search, 
  X, 
  Send, 
  ShieldCheck,
  Clock,
  User
} from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '../../contexts/AuthContext';

const MyMessages = () => {
  const { user } = useAuth();
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [sending, setSending] = useState(false);

  useEffect(() => {
    fetchConversations();
  }, []);

  const fetchConversations = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/messages/my-conversations`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();

      if (data.status === 'success') {
        setConversations(data.data.conversations || []);
      } else {
        toast.error('Failed to load conversations');
      }
    } catch (err) {
      toast.error('Network error');
    } finally {
      setLoading(false);
    }
  };

  const openConversation = async (conv) => {
    // conv has: userId, name, lastMessage, lastMessageTime, unreadCount
    const partner = {
      _id: conv.userId,
      firstName: conv.name.split(' ')[0],
      lastName: conv.name.split(' ').slice(1).join(' '),
      // You can add avatar later if backend sends it
    };

    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/messages/conversation/${conv.userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();

      if (data.status === 'success') {
        setMessages(data.data.messages || []);
        setSelectedConversation({
          ...partner,
          unreadCount: conv.unreadCount,
        });
      }
    } catch (err) {
      toast.error('Failed to load messages');
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || sending) return;

    setSending(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          recipient: selectedConversation._id,
          content: newMessage,
        }),
      });

      const data = await res.json();
      if (data.status === 'success') {
        setMessages(prev => [...prev, data.data.message]);
        setNewMessage('');
        fetchConversations(); // Refresh conversation list with updated last message
      } else {
        toast.error('Failed to send message');
      }
    } catch (err) {
      toast.error('Network error');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-8">
          My Messages
        </h1>

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="h-12 w-12 text-indigo-600 animate-spin" />
          </div>
        ) : conversations.length === 0 ? (
          <div className="text-center py-20 bg-white dark:bg-gray-800 rounded-3xl shadow-xl">
            <MessageCircle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              No messages yet
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Start a conversation by browsing listings!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Conversation List */}
            <div className="lg:col-span-1 bg-white dark:bg-gray-800 rounded-3xl shadow-xl">
              <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                <h2 className="font-bold text-lg">Conversations</h2>
              </div>
              <div className="overflow-y-auto max-h-[70vh]">
                {conversations.map((conv) => (
                  <button
                    key={conv.userId}
                    onClick={() => openConversation(conv)}
                    className={`w-full p-4 flex items-center gap-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all text-left ${
                      selectedConversation?._id === conv.userId ? 'bg-indigo-50 dark:bg-indigo-900/30' : ''
                    }`}
                  >
                    <div className="h-12 w-12 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center">
                      <User className="h-6 w-6 text-gray-500" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <p className="font-semibold text-gray-900 dark:text-white">
                          {conv.name}
                        </p>
                        {conv.unreadCount > 0 && (
                          <span className="px-2 py-1 text-xs bg-red-500 text-white rounded-full">
                            {conv.unreadCount}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                        {conv.lastMessage}
                      </p>
                      <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {new Date(conv.lastMessageTime).toLocaleDateString()}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Chat Window */}
            <div className="lg:col-span-2">
              {selectedConversation ? (
                <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl flex flex-col" style={{ minHeight: '600px' }}>
                  <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center">
                        <User className="h-6 w-6 text-gray-500" />
                      </div>
                      <div>
                        <h3 className="font-bold">
                          {selectedConversation.firstName} {selectedConversation.lastName}
                        </h3>
                        <p className="text-sm text-gray-500">Active now</p>
                      </div>
                    </div>
                    <button onClick={() => setSelectedConversation(null)}>
                      <X className="h-6 w-6 text-gray-500" />
                    </button>
                  </div>

                  <div className="flex-1 overflow-y-auto p-6 space-y-4">
                    {messages.length === 0 ? (
                      <p className="text-center text-gray-500 dark:text-gray-400 mt-20">
                        Start the conversation!
                      </p>
                    ) : (
                      messages.map((msg) => (
                        <div
                          key={msg._id}
                          className={`flex ${msg.sender._id === user._id ? 'justify-end' : 'justify-start'}`}
                        >
                          <div
                            className={`max-w-xs px-5 py-3 rounded-3xl ${
                              msg.sender._id === user._id
                                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white'
                                : 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white'
                            }`}
                          >
                            <p>{msg.content}</p>
                            <p className="text-xs opacity-70 mt-1">
                              {new Date(msg.createdAt).toLocaleTimeString([], {
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </p>
                          </div>
                        </div>
                      ))
                    )}
                  </div>

                  <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex gap-3">
                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && !sending && sendMessage()}
                      placeholder="Type a message..."
                      className="flex-1 px-5 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                    />
                    <button
                      onClick={sendMessage}
                      disabled={sending || !newMessage.trim()}
                      className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl flex items-center gap-2 disabled:opacity-50"
                    >
                      {sending ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-12 text-center h-full flex flex-col items-center justify-center">
                  <MessageCircle className="h-20 w-20 text-gray-300 mb-6" />
                  <p className="text-xl text-gray-600 dark:text-gray-400">
                    Select a conversation to start chatting
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyMessages;