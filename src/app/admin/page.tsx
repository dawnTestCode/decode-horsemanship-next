'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { X, Plus, Edit2, Trash2, Eye, EyeOff, Loader2, Search, ArrowLeft, LogOut, Settings, Key, MessageSquare, Image, Video, Play, GripVertical, Users, MapPin, FileText, Utensils, Calendar, Sparkles, Fence } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import HorseForm, { HorseData } from '@/components/admin/HorseForm';
import GalleryForm, { GalleryItem } from '@/components/admin/GalleryForm';
import AdminLogin from '@/components/admin/AdminLogin';
import PasswordChangeForm from '@/components/admin/PasswordChangeForm';
import InquiriesPanel from '@/components/admin/InquiriesPanel';
import VolunteerContentForm from '@/components/admin/VolunteerContentForm';
import EALImageForm, { EALImage } from '@/components/admin/EALImageForm';
import FieldAssignmentsEditor from '@/components/admin/FieldAssignmentsEditor';
import ProgramDatesEditor from '@/components/admin/ProgramDatesEditor';
import ProgramsEditor from '@/components/admin/ProgramsEditor';
import ProgramEnrollmentsEditor from '@/components/admin/ProgramEnrollmentsEditor';
import SummerCampSessionsEditor from '@/components/admin/SummerCampSessionsEditor';

interface VolunteerContent {
  id: string;
  section_key: string;
  title: string;
  content: string;
  content_type: 'richtext' | 'embed' | 'image' | 'pdf';
  is_visible: boolean;
  sort_order: number;
}


// Sub-component for Programs tab with sub-tabs
const ProgramsAndDatesTab: React.FC = () => {
  const [subTab, setSubTab] = useState<'dates' | 'registrations' | 'programs'>('dates');

  return (
    <div>
      {/* Sub-tabs */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setSubTab('dates')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            subTab === 'dates'
              ? 'bg-blue-700 text-white'
              : 'bg-stone-800 text-stone-400 hover:bg-stone-700'
          }`}
        >
          Scheduled Dates
        </button>
        <button
          onClick={() => setSubTab('registrations')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            subTab === 'registrations'
              ? 'bg-blue-700 text-white'
              : 'bg-stone-800 text-stone-400 hover:bg-stone-700'
          }`}
        >
          Registrations
        </button>
        <button
          onClick={() => setSubTab('programs')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            subTab === 'programs'
              ? 'bg-blue-700 text-white'
              : 'bg-stone-800 text-stone-400 hover:bg-stone-700'
          }`}
        >
          Programs & Pricing
        </button>
      </div>

      {/* Content */}
      {subTab === 'dates' && <ProgramDatesEditor onClose={() => {}} embedded />}
      {subTab === 'registrations' && <ProgramEnrollmentsEditor embedded />}
      {subTab === 'programs' && <ProgramsEditor embedded />}
    </div>
  );
};

export default function AdminPage() {
  const [horses, setHorses] = useState<HorseData[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingHorse, setEditingHorse] = useState<HorseData | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [error, setError] = useState<string | null>(null);
  
  // Authentication state
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);
  const [adminToken, setAdminToken] = useState<string | null>(null);
  
  // Password change modal
  const [showPasswordChange, setShowPasswordChange] = useState(false);
  const [showSettingsMenu, setShowSettingsMenu] = useState(false);
  
  // Inquiries panel
  const [showInquiries, setShowInquiries] = useState(false);
  const [unreadInquiriesCount, setUnreadInquiriesCount] = useState(0);

  // Admin tabs
  const [activeTab, setActiveTab] = useState<'horses' | 'gallery' | 'volunteers' | 'eal' | 'programs' | 'summercamp'>('horses');

  // Gallery state
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [loadingGallery, setLoadingGallery] = useState(true);
  const [showGalleryForm, setShowGalleryForm] = useState(false);
  const [editingGalleryItem, setEditingGalleryItem] = useState<GalleryItem | null>(null);
  const [deleteGalleryConfirm, setDeleteGalleryConfirm] = useState<string | null>(null);
  const [draggedGalleryItem, setDraggedGalleryItem] = useState<string | null>(null);

  // Volunteer content state
  const [volunteerContent, setVolunteerContent] = useState<VolunteerContent[]>([]);
  const [loadingVolunteer, setLoadingVolunteer] = useState(true);
  const [showVolunteerForm, setShowVolunteerForm] = useState(false);
  const [editingVolunteerItem, setEditingVolunteerItem] = useState<VolunteerContent | null>(null);
  const [savingVolunteer, setSavingVolunteer] = useState(false);
  const [showFieldAssignments, setShowFieldAssignments] = useState(false);

  // EAL Images state
  const [ealImages, setEalImages] = useState<EALImage[]>([]);
  const [loadingEal, setLoadingEal] = useState(true);
  const [showEalForm, setShowEalForm] = useState(false);
  const [editingEalImage, setEditingEalImage] = useState<EALImage | null>(null);

  // Check for existing session on mount
  useEffect(() => {
    checkExistingSession();
  }, []);

  const checkExistingSession = async () => {
    const storedToken = localStorage.getItem('admin_token');
    const expiresAt = localStorage.getItem('admin_token_expires');
    
    if (storedToken && expiresAt) {
      // Check if token is expired
      if (new Date(expiresAt) > new Date()) {
        // Verify token with server
        try {
          const { data, error } = await supabase.functions.invoke('admin-auth', {
            body: { action: 'verify', token: storedToken }
          });
          
          if (data?.valid) {
            setAdminToken(storedToken);
            setIsAuthenticated(true);
          } else {
            // Token invalid, clear storage
            localStorage.removeItem('admin_token');
            localStorage.removeItem('admin_token_expires');
          }
        } catch (err) {
          console.error('Token verification error:', err);
          localStorage.removeItem('admin_token');
          localStorage.removeItem('admin_token_expires');
        }
      } else {
        // Token expired, clear storage
        localStorage.removeItem('admin_token');
        localStorage.removeItem('admin_token_expires');
      }
    }
    setAuthLoading(false);
  };

  const handleLoginSuccess = (token: string) => {
    setAdminToken(token);
    setIsAuthenticated(true);
  };

  const handleLogout = async () => {
    try {
      if (adminToken) {
        await supabase.functions.invoke('admin-auth', {
          body: { action: 'logout', token: adminToken }
        });
      }
    } catch (err) {
      console.error('Logout error:', err);
    }
    
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_token_expires');
    setAdminToken(null);
    setIsAuthenticated(false);
  };

  const fetchHorses = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('horses')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setHorses(data || []);
    } catch (err: any) {
      console.error('Error fetching horses:', err);
      setError('Failed to load horses');
    } finally {
      setLoading(false);
    }
  };

  // Fetch inquiries count
  const fetchUnreadCount = async () => {
    try {
      const { data, error } = await supabase
        .from('contact_inquiries')
        .select('id')
        .eq('status', 'unread');

      if (error) throw error;
      setUnreadInquiriesCount(data?.length || 0);
    } catch (err) {
      console.error('Error fetching unread count:', err);
    }
  };

  // Fetch gallery items
  const fetchGallery = async () => {
    setLoadingGallery(true);
    try {
      const { data, error } = await supabase
        .from('gallery')
        .select('*')
        .order('sort_order', { ascending: true });

      if (error) throw error;
      setGalleryItems(data || []);
    } catch (err: any) {
      console.error('Error fetching gallery:', err);
      setError('Failed to load gallery');
    } finally {
      setLoadingGallery(false);
    }
  };

  // Fetch volunteer content
  const fetchVolunteerContent = async () => {
    setLoadingVolunteer(true);
    try {
      const { data, error } = await supabase
        .from('volunteer_content')
        .select('*')
        .order('sort_order', { ascending: true });

      if (error) throw error;
      setVolunteerContent(data || []);
    } catch (err: any) {
      console.error('Error fetching volunteer content:', err);
    } finally {
      setLoadingVolunteer(false);
    }
  };

  // Save volunteer content
  const handleSaveVolunteerContent = async (item: VolunteerContent) => {
    setSavingVolunteer(true);
    try {
      const { error } = await supabase
        .from('volunteer_content')
        .update({
          title: item.title,
          content: item.content,
          is_visible: item.is_visible,
          updated_at: new Date().toISOString()
        })
        .eq('id', item.id);

      if (error) throw error;

      await fetchVolunteerContent();
      setShowVolunteerForm(false);
      setEditingVolunteerItem(null);
    } catch (err: any) {
      console.error('Error saving volunteer content:', err);
      setError('Failed to save volunteer content');
    } finally {
      setSavingVolunteer(false);
    }
  };

  // Fetch EAL images
  const fetchEalImages = async () => {
    setLoadingEal(true);
    try {
      const { data, error } = await supabase
        .from('eal_images')
        .select('*')
        .order('title', { ascending: true });

      if (error) throw error;
      setEalImages(data || []);
    } catch (err: any) {
      console.error('Error fetching EAL images:', err);
    } finally {
      setLoadingEal(false);
    }
  };

  useEffect(() => {
    fetchHorses();
    fetchGallery();
    fetchUnreadCount();
    fetchVolunteerContent();
    fetchEalImages();
  }, []);


  const handleSaveHorse = async (horseData: HorseData) => {
    if (horseData.id) {
      // Update existing horse
      const { error } = await supabase
        .from('horses')
        .update({
          name: horseData.name,
          age: horseData.age,
          breed: horseData.breed,
          gender: horseData.gender,
          height: horseData.height,
          price: horseData.price,
          temperament: horseData.temperament,
          experience_level: horseData.experience_level,
          training_status: horseData.training_status,
          story: horseData.story,
          photos: horseData.photos,
          videos: horseData.videos,
          status: horseData.status,
          show_in_listing: horseData.show_in_listing,
          featured: horseData.featured,
          updated_at: new Date().toISOString()
        })
        .eq('id', horseData.id);

      if (error) throw error;
    } else {
      // Create new horse
      const { error } = await supabase
        .from('horses')
        .insert({
          name: horseData.name,
          age: horseData.age,
          breed: horseData.breed,
          gender: horseData.gender,
          height: horseData.height,
          price: horseData.price,
          temperament: horseData.temperament,
          experience_level: horseData.experience_level,
          training_status: horseData.training_status,
          story: horseData.story,
          photos: horseData.photos,
          videos: horseData.videos,
          status: horseData.status,
          show_in_listing: horseData.show_in_listing,
          featured: horseData.featured
        });

      if (error) throw error;
    }

    setShowForm(false);
    setEditingHorse(null);
    fetchHorses();
  };


  const handleDeleteHorse = async (id: string) => {
    try {
      const { error } = await supabase
        .from('horses')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setDeleteConfirm(null);
      fetchHorses();
    } catch (err: any) {
      console.error('Error deleting horse:', err);
      setError('Failed to delete horse');
    }
  };

  const toggleVisibility = async (horse: HorseData) => {
    try {
      const { error } = await supabase
        .from('horses')
        .update({ show_in_listing: !horse.show_in_listing })
        .eq('id', horse.id);

      if (error) throw error;
      fetchHorses();
    } catch (err: any) {
      console.error('Error updating visibility:', err);
    }
  };

  // Gallery CRUD functions
  const handleSaveGalleryItem = async (itemData: GalleryItem) => {
    if (itemData.id) {
      // Update existing item
      const { error } = await supabase
        .from('gallery')
        .update({
          title: itemData.title,
          description: itemData.description,
          media_type: itemData.media_type,
          media_url: itemData.media_url,
          sort_order: itemData.sort_order,
          show_in_gallery: itemData.show_in_gallery,
          updated_at: new Date().toISOString()
        })
        .eq('id', itemData.id);

      if (error) throw error;
    } else {
      // Create new item
      const { error } = await supabase
        .from('gallery')
        .insert({
          title: itemData.title,
          description: itemData.description,
          media_type: itemData.media_type,
          media_url: itemData.media_url,
          sort_order: itemData.sort_order,
          show_in_gallery: itemData.show_in_gallery
        });

      if (error) throw error;
    }

    setShowGalleryForm(false);
    setEditingGalleryItem(null);
    fetchGallery();
  };

  const handleDeleteGalleryItem = async (id: string) => {
    try {
      const { error } = await supabase
        .from('gallery')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setDeleteGalleryConfirm(null);
      fetchGallery();
    } catch (err: any) {
      console.error('Error deleting gallery item:', err);
      setError('Failed to delete gallery item');
    }
  };

  const toggleGalleryVisibility = async (item: GalleryItem) => {
    try {
      const { error } = await supabase
        .from('gallery')
        .update({ show_in_gallery: !item.show_in_gallery })
        .eq('id', item.id);

      if (error) throw error;
      fetchGallery();
    } catch (err: any) {
      console.error('Error updating visibility:', err);
    }
  };

  // Gallery drag and drop handlers
  const handleGalleryDragStart = (e: React.DragEvent, itemId: string) => {
    setDraggedGalleryItem(itemId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleGalleryDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleGalleryDrop = async (e: React.DragEvent, targetId: string) => {
    e.preventDefault();

    if (!draggedGalleryItem || draggedGalleryItem === targetId) {
      setDraggedGalleryItem(null);
      return;
    }

    // Find indices
    const draggedIndex = galleryItems.findIndex(item => item.id === draggedGalleryItem);
    const targetIndex = galleryItems.findIndex(item => item.id === targetId);

    if (draggedIndex === -1 || targetIndex === -1) {
      setDraggedGalleryItem(null);
      return;
    }

    // Reorder items locally
    const newItems = [...galleryItems];
    const [draggedItem] = newItems.splice(draggedIndex, 1);
    newItems.splice(targetIndex, 0, draggedItem);

    // Update local state immediately for responsiveness
    setGalleryItems(newItems);
    setDraggedGalleryItem(null);

    // Update sort_order in database for all items
    try {
      const updates = newItems.map((item, index) =>
        supabase
          .from('gallery')
          .update({ sort_order: index })
          .eq('id', item.id)
      );
      await Promise.all(updates);
    } catch (err) {
      console.error('Error updating sort order:', err);
      // Refetch to restore correct order if update failed
      fetchGallery();
    }
  };

  const handleGalleryDragEnd = () => {
    setDraggedGalleryItem(null);
  };

  const updateStatus = async (horse: HorseData, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('horses')
        .update({ status: newStatus })
        .eq('id', horse.id);

      if (error) throw error;
      fetchHorses();
    } catch (err: any) {
      console.error('Error updating status:', err);
    }
  };

  const filteredHorses = horses.filter(horse => {
    const matchesSearch = horse.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      horse.breed.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || horse.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'available':
        return 'bg-green-700 text-green-100';
      case 'pending':
        return 'bg-yellow-700 text-yellow-100';
      case 'sold':
        return 'bg-stone-700 text-stone-300';
      default:
        return 'bg-stone-700 text-stone-300';
    }
  };

  // Show loading state while checking authentication
  if (authLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="animate-spin text-red-500 mx-auto mb-4" size={40} />
          <p className="text-stone-400">Checking authentication...</p>
        </div>
      </div>
    );
  }

  // Show login form if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-black overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-stone-900 border-b border-stone-700 z-20">
          <div className="max-w-7xl mx-auto px-4 py-4 flex items-center">
            <Link
              href="/"
              className="p-2 hover:bg-stone-800 rounded-lg transition-colors flex items-center gap-2 text-stone-400 hover:text-stone-200"
            >
              <ArrowLeft size={20} />
              <span className="hidden sm:inline">Back to Site</span>
            </Link>
          </div>
        </div>
        <AdminLogin onLoginSuccess={handleLoginSuccess} />
      </div>
    );
  }

  // Show inquiries panel if open
  if (showInquiries) {
    return (
      <InquiriesPanel onClose={() => { setShowInquiries(false); fetchUnreadCount(); }} />
    );
  }

  return (
    <div className="min-h-screen bg-black overflow-y-auto">
      {/* Header */}
      <div className="sticky top-0 bg-stone-900 border-b border-stone-700 z-20">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="p-2 hover:bg-stone-800 rounded-lg transition-colors flex items-center gap-2 text-stone-400 hover:text-stone-200"
            >
              <ArrowLeft size={20} />
              <span className="hidden sm:inline">Back to Site</span>
            </Link>
            <h1 className="text-xl font-bold text-stone-100">Admin Panel</h1>
          </div>
          <div className="flex items-center gap-2">
            {/* Inquiries Button */}
            <button
              onClick={() => setShowInquiries(true)}
              className="relative p-2 hover:bg-stone-800 text-stone-400 hover:text-stone-200 rounded-lg transition-colors"
              title="View Inquiries"
            >
              <MessageSquare size={20} />
              {unreadInquiriesCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-600 text-white text-xs font-bold rounded-full flex items-center justify-center">
                  {unreadInquiriesCount > 9 ? '9+' : unreadInquiriesCount}
                </span>
              )}
            </button>
            
            {/* Settings Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowSettingsMenu(!showSettingsMenu)}
                className="p-2 hover:bg-stone-800 text-stone-400 hover:text-stone-200 rounded-lg transition-colors"
                title="Settings"
              >
                <Settings size={20} />
              </button>
              
              {showSettingsMenu && (
                <>
                  {/* Backdrop to close menu */}
                  <div 
                    className="fixed inset-0 z-10" 
                    onClick={() => setShowSettingsMenu(false)}
                  />
                  
                  {/* Dropdown Menu */}
                  <div className="absolute right-0 mt-2 w-56 bg-stone-800 border border-stone-700 rounded-lg shadow-xl z-20 overflow-hidden">
                    <button
                      onClick={() => {
                        setShowPasswordChange(true);
                        setShowSettingsMenu(false);
                      }}
                      className="w-full px-4 py-3 text-left text-stone-200 hover:bg-stone-700 transition-colors flex items-center gap-3"
                    >
                      <Key size={18} className="text-stone-400" />
                      Change Password
                    </button>
                    <div className="border-t border-stone-700" />
                    <button
                      onClick={() => {
                        handleLogout();
                        setShowSettingsMenu(false);
                      }}
                      className="w-full px-4 py-3 text-left text-red-400 hover:bg-stone-700 transition-colors flex items-center gap-3"
                    >
                      <LogOut size={18} />
                      Logout
                    </button>
                  </div>
                </>
              )}
            </div>
            
            {activeTab === 'horses' && (
              <button
                onClick={() => { setEditingHorse(null); setShowForm(true); }}
                className="px-4 py-2 bg-red-700 hover:bg-red-600 text-white font-semibold rounded-lg transition-colors flex items-center gap-2"
              >
                <Plus size={20} />
                <span className="hidden sm:inline">Add Horse</span>
              </button>
            )}
            {activeTab === 'gallery' && (
              <button
                onClick={() => { setEditingGalleryItem(null); setShowGalleryForm(true); }}
                className="px-4 py-2 bg-red-700 hover:bg-red-600 text-white font-semibold rounded-lg transition-colors flex items-center gap-2"
              >
                <Plus size={20} />
                <span className="hidden sm:inline">Add to Gallery</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setActiveTab('horses')}
            className={`px-6 py-3 rounded-lg font-medium transition-colors flex items-center gap-2 ${
              activeTab === 'horses'
                ? 'bg-red-700 text-white'
                : 'bg-stone-800 text-stone-400 hover:bg-stone-700 hover:text-stone-200'
            }`}
          >
            <span>Horses</span>
            <span className="px-2 py-0.5 bg-black/20 rounded text-sm">{horses.length}</span>
          </button>
          <button
            onClick={() => setActiveTab('gallery')}
            className={`px-6 py-3 rounded-lg font-medium transition-colors flex items-center gap-2 ${
              activeTab === 'gallery'
                ? 'bg-red-700 text-white'
                : 'bg-stone-800 text-stone-400 hover:bg-stone-700 hover:text-stone-200'
            }`}
          >
            <Image size={18} />
            <span>Gallery</span>
            <span className="px-2 py-0.5 bg-black/20 rounded text-sm">{galleryItems.length}</span>
          </button>
          <button
            onClick={() => setActiveTab('volunteers')}
            className={`px-6 py-3 rounded-lg font-medium transition-colors flex items-center gap-2 ${
              activeTab === 'volunteers'
                ? 'bg-green-700 text-white'
                : 'bg-stone-800 text-stone-400 hover:bg-stone-700 hover:text-stone-200'
            }`}
          >
            <Users size={18} />
            <span>Volunteers</span>
          </button>
          <button
            onClick={() => setActiveTab('eal')}
            className={`px-6 py-3 rounded-lg font-medium transition-colors flex items-center gap-2 ${
              activeTab === 'eal'
                ? 'bg-purple-700 text-white'
                : 'bg-stone-800 text-stone-400 hover:bg-stone-700 hover:text-stone-200'
            }`}
          >
            <Sparkles size={18} />
            <span>EAL Images</span>
            <span className="px-2 py-0.5 bg-black/20 rounded text-sm">{ealImages.filter(i => i.image_url).length}/{ealImages.length}</span>
          </button>
          <button
            onClick={() => setActiveTab('programs')}
            className={`px-6 py-3 rounded-lg font-medium transition-colors flex items-center gap-2 ${
              activeTab === 'programs'
                ? 'bg-blue-700 text-white'
                : 'bg-stone-800 text-stone-400 hover:bg-stone-700 hover:text-stone-200'
            }`}
          >
            <Calendar size={18} />
            <span>EAL Programs</span>
          </button>
          <button
            onClick={() => setActiveTab('summercamp')}
            className={`px-6 py-3 rounded-lg font-medium transition-colors flex items-center gap-2 ${
              activeTab === 'summercamp'
                ? 'bg-amber-700 text-white'
                : 'bg-stone-800 text-stone-400 hover:bg-stone-700 hover:text-stone-200'
            }`}
          >
            <Calendar size={18} />
            <span>Summer Camp</span>
          </button>
        </div>

        {/* Horses Tab Content */}
        {activeTab === 'horses' && (
          <>
            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-stone-900/50 border border-stone-800 rounded-lg p-4">
            <div className="text-2xl font-bold text-stone-100">{horses.length}</div>
            <div className="text-stone-500 text-sm">Total Horses</div>
          </div>
          <div className="bg-stone-900/50 border border-stone-800 rounded-lg p-4">
            <div className="text-2xl font-bold text-green-500">
              {horses.filter(h => h.status === 'available').length}
            </div>
            <div className="text-stone-500 text-sm">Available</div>
          </div>
          <div className="bg-stone-900/50 border border-stone-800 rounded-lg p-4">
            <div className="text-2xl font-bold text-yellow-500">
              {horses.filter(h => h.status === 'pending').length}
            </div>
            <div className="text-stone-500 text-sm">Pending</div>
          </div>
          <div className="bg-stone-900/50 border border-stone-800 rounded-lg p-4">
            <div className="text-2xl font-bold text-stone-400">
              {horses.filter(h => h.status === 'sold').length}
            </div>
            <div className="text-stone-500 text-sm">Sold</div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-stone-500" size={20} />
            <input
              type="text"
              placeholder="Search horses..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-stone-900 border border-stone-700 rounded-lg pl-10 pr-4 py-2 text-stone-200 focus:border-red-500 focus:outline-none"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-stone-900 border border-stone-700 rounded-lg px-4 py-2 text-stone-200 focus:border-red-500 focus:outline-none"
          >
            <option value="all">All Status</option>
            <option value="available">Available</option>
            <option value="pending">Pending</option>
            <option value="sold">Sold</option>
          </select>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-900/30 border border-red-700 rounded-lg text-red-400 flex items-center justify-between">
            {error}
            <button onClick={() => setError(null)} className="p-1 hover:bg-red-800 rounded">
              <X size={18} />
            </button>
          </div>
        )}

        {/* Horse List */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="animate-spin text-red-500" size={40} />
          </div>
        ) : filteredHorses.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-stone-500 mb-4">
              {horses.length === 0 ? 'No horses added yet' : 'No horses match your filters'}
            </div>
            {horses.length === 0 && (
              <button
                onClick={() => setShowForm(true)}
                className="px-6 py-3 bg-red-700 hover:bg-red-600 text-white font-semibold rounded-lg transition-colors"
              >
                Add Your First Horse
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredHorses.map((horse) => (
              <div
                key={horse.id}
                className="bg-stone-900/50 border border-stone-800 rounded-lg p-4 hover:border-stone-700 transition-colors"
              >
                <div className="flex flex-col md:flex-row gap-4">
                  {/* Photo */}
                  <div className="w-full md:w-32 h-32 bg-stone-800 rounded-lg overflow-hidden flex-shrink-0">
                    {horse.photos && horse.photos.length > 0 ? (
                      <img
                        src={horse.photos[0]}
                        alt={horse.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-stone-600">
                        No Photo
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-start gap-2 mb-2">
                      <h3 className="text-lg font-bold text-stone-100">{horse.name}</h3>
                      <span className={`text-xs px-2 py-1 rounded capitalize ${getStatusBadge(horse.status)}`}>
                        {horse.status}
                      </span>
                      {!horse.show_in_listing && (
                        <span className="text-xs px-2 py-1 rounded bg-stone-800 text-stone-400">
                          Hidden
                        </span>
                      )}
                      {horse.featured && (
                        <span className="text-xs px-2 py-1 rounded bg-red-900 text-red-300">
                          Featured
                        </span>
                      )}
                    </div>
                    <p className="text-stone-400 text-sm mb-2">
                      {horse.age} yr old {horse.gender} • {horse.breed} • {horse.height}
                    </p>
                    <div className="flex flex-wrap gap-2 mb-2">
                      <span className="text-xs bg-stone-800 px-2 py-1 rounded text-stone-300">
                        {horse.temperament}
                      </span>
                      <span className="text-xs bg-stone-800 px-2 py-1 rounded text-stone-300">
                        {horse.experience_level}
                      </span>
                      <span className="text-xs bg-stone-800 px-2 py-1 rounded text-stone-300">
                        {horse.training_status}
                      </span>
                    </div>
                    <p className="text-red-500 font-bold">{horse.price}</p>
                  </div>

                  {/* Actions */}
                  <div className="flex md:flex-col gap-2 flex-shrink-0">
                    <button
                      onClick={() => toggleVisibility(horse)}
                      className={`p-2 rounded-lg transition-colors ${
                        horse.show_in_listing
                          ? 'bg-green-900/30 text-green-500 hover:bg-green-900/50'
                          : 'bg-stone-800 text-stone-500 hover:bg-stone-700'
                      }`}
                      title={horse.show_in_listing ? 'Hide from listing' : 'Show in listing'}
                    >
                      {horse.show_in_listing ? <Eye size={18} /> : <EyeOff size={18} />}
                    </button>
                    <button
                      onClick={() => { setEditingHorse(horse); setShowForm(true); }}
                      className="p-2 bg-stone-800 hover:bg-stone-700 text-stone-300 rounded-lg transition-colors"
                      title="Edit"
                    >
                      <Edit2 size={18} />
                    </button>
                    <button
                      onClick={() => setDeleteConfirm(horse.id!)}
                      className="p-2 bg-red-900/30 hover:bg-red-900/50 text-red-500 rounded-lg transition-colors"
                      title="Delete"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>

                {/* Quick Status Change */}
                <div className="mt-4 pt-4 border-t border-stone-800 flex flex-wrap gap-2">
                  <span className="text-stone-500 text-sm mr-2">Quick status:</span>
                  {['available', 'pending', 'sold'].map((status) => (
                    <button
                      key={status}
                      onClick={() => updateStatus(horse, status)}
                      className={`text-xs px-3 py-1 rounded capitalize transition-colors ${
                        horse.status === status
                          ? getStatusBadge(status)
                          : 'bg-stone-800 text-stone-400 hover:bg-stone-700'
                      }`}
                    >
                      {status}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
          </>
        )}

        {/* Gallery Tab Content */}
        {activeTab === 'gallery' && (
          <>
            {/* Gallery Stats */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-stone-900/50 border border-stone-800 rounded-lg p-4">
                <div className="text-2xl font-bold text-stone-100">{galleryItems.length}</div>
                <div className="text-stone-500 text-sm">Total Items</div>
              </div>
              <div className="bg-stone-900/50 border border-stone-800 rounded-lg p-4">
                <div className="text-2xl font-bold text-blue-500">
                  {galleryItems.filter(i => i.media_type === 'photo').length}
                </div>
                <div className="text-stone-500 text-sm">Photos</div>
              </div>
              <div className="bg-stone-900/50 border border-stone-800 rounded-lg p-4">
                <div className="text-2xl font-bold text-purple-500">
                  {galleryItems.filter(i => i.media_type === 'video').length}
                </div>
                <div className="text-stone-500 text-sm">Videos</div>
              </div>
            </div>

            {/* Gallery Grid */}
            {loadingGallery ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="animate-spin text-red-500" size={40} />
              </div>
            ) : galleryItems.length === 0 ? (
              <div className="text-center py-20">
                <Image size={48} className="mx-auto mb-4 text-stone-600" />
                <div className="text-stone-500 mb-4">No gallery items yet</div>
                <button
                  onClick={() => setShowGalleryForm(true)}
                  className="px-6 py-3 bg-red-700 hover:bg-red-600 text-white font-semibold rounded-lg transition-colors"
                >
                  Add Your First Item
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {galleryItems.map((item) => (
                  <div
                    key={item.id}
                    draggable
                    onDragStart={(e) => handleGalleryDragStart(e, item.id!)}
                    onDragOver={handleGalleryDragOver}
                    onDrop={(e) => handleGalleryDrop(e, item.id!)}
                    onDragEnd={handleGalleryDragEnd}
                    className={`bg-stone-900/50 border rounded-lg overflow-hidden transition-all group cursor-move ${
                      draggedGalleryItem === item.id
                        ? 'border-red-500 opacity-50'
                        : 'border-stone-800 hover:border-stone-700'
                    }`}
                  >
                    {/* Media Preview */}
                    <div className="aspect-video relative bg-stone-800">
                      {item.media_type === 'photo' ? (
                        <img
                          src={item.media_url}
                          alt={item.title || 'Gallery item'}
                          className="w-full h-full object-cover pointer-events-none"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-stone-800">
                          <Play size={32} className="text-stone-500" />
                        </div>
                      )}

                      {/* Drag handle */}
                      <div className="absolute top-2 right-2 p-1.5 bg-black/60 rounded text-stone-400 hover:text-white transition-colors">
                        <GripVertical size={16} />
                      </div>

                      {/* Media type badge */}
                      <div className="absolute top-2 left-2 px-2 py-1 bg-black/60 rounded text-xs flex items-center gap-1">
                        {item.media_type === 'video' ? (
                          <>
                            <Video size={12} />
                            Video
                          </>
                        ) : (
                          <>
                            <Image size={12} />
                            Photo
                          </>
                        )}
                      </div>

                      {/* Visibility badge */}
                      {!item.show_in_gallery && (
                        <div className="absolute bottom-2 right-2 px-2 py-1 bg-yellow-900/80 text-yellow-400 rounded text-xs">
                          Hidden
                        </div>
                      )}
                    </div>

                    {/* Info */}
                    <div className="p-3">
                      <p className="text-stone-200 font-medium truncate">
                        {item.title || 'Untitled'}
                      </p>
                      {item.description && (
                        <p className="text-stone-500 text-sm truncate">{item.description}</p>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="px-3 pb-3 flex gap-2">
                      <button
                        onClick={() => toggleGalleryVisibility(item)}
                        className={`flex-1 p-2 rounded-lg transition-colors flex items-center justify-center gap-1 text-sm ${
                          item.show_in_gallery
                            ? 'bg-green-900/30 text-green-500 hover:bg-green-900/50'
                            : 'bg-stone-800 text-stone-500 hover:bg-stone-700'
                        }`}
                        title={item.show_in_gallery ? 'Hide' : 'Show'}
                      >
                        {item.show_in_gallery ? <Eye size={16} /> : <EyeOff size={16} />}
                      </button>
                      <button
                        onClick={() => { setEditingGalleryItem(item); setShowGalleryForm(true); }}
                        className="flex-1 p-2 bg-stone-800 hover:bg-stone-700 text-stone-300 rounded-lg transition-colors flex items-center justify-center"
                        title="Edit"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        onClick={() => setDeleteGalleryConfirm(item.id!)}
                        className="flex-1 p-2 bg-red-900/30 hover:bg-red-900/50 text-red-500 rounded-lg transition-colors flex items-center justify-center"
                        title="Delete"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* Volunteers Tab Content */}
        {activeTab === 'volunteers' && (
          <>
            {/* Volunteer Stats */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-stone-900/50 border border-stone-800 rounded-lg p-4">
                <div className="text-2xl font-bold text-stone-100">{volunteerContent.length}</div>
                <div className="text-stone-500 text-sm">Total Sections</div>
              </div>
              <div className="bg-stone-900/50 border border-stone-800 rounded-lg p-4">
                <div className="text-2xl font-bold text-green-500">
                  {volunteerContent.filter(i => i.is_visible).length}
                </div>
                <div className="text-stone-500 text-sm">Visible</div>
              </div>
              <div className="bg-stone-900/50 border border-stone-800 rounded-lg p-4">
                <div className="text-2xl font-bold text-yellow-500">
                  {volunteerContent.filter(i => !i.is_visible).length}
                </div>
                <div className="text-stone-500 text-sm">Hidden</div>
              </div>
            </div>

            {/* Info Box */}
            <div className="bg-green-900/20 border border-green-800/50 rounded-lg p-4 mb-6">
              <p className="text-green-400 text-sm">
                <strong>Volunteer Portal:</strong> Volunteers can access these resources by clicking "Volunteer Portal" in the footer and entering the volunteer password.
              </p>
            </div>

            {/* Field Assignments Button */}
            <button
              onClick={() => setShowFieldAssignments(true)}
              className="w-full mb-6 p-4 bg-stone-900/50 border border-stone-800 hover:border-green-700 rounded-lg transition-colors flex items-center justify-between group"
            >
              <div className="flex items-center gap-4">
                <div className="p-3 bg-green-900/30 rounded-lg">
                  <Fence size={20} className="text-green-500" />
                </div>
                <div className="text-left">
                  <h3 className="font-semibold text-stone-100">Field Assignments</h3>
                  <p className="text-sm text-stone-500">Manage which horses are in which fields</p>
                </div>
              </div>
              <Edit2 size={18} className="text-stone-500 group-hover:text-green-500 transition-colors" />
            </button>

            {/* Volunteer Content List */}
            {loadingVolunteer ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="animate-spin text-green-500" size={40} />
              </div>
            ) : (
              <div className="space-y-4">
                {volunteerContent.map((item) => {
                  const icons: Record<string, React.ReactNode> = {
                    property_map: <MapPin size={20} className="text-green-500" />,
                    procedures: <FileText size={20} className="text-blue-500" />,
                    feed_charts: <Utensils size={20} className="text-orange-500" />,
                    calendar: <Calendar size={20} className="text-purple-500" />,
                  };

                  return (
                    <div
                      key={item.id}
                      className="bg-stone-900/50 border border-stone-800 rounded-lg p-4 flex items-center justify-between"
                    >
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-stone-800 rounded-lg">
                          {icons[item.section_key] || <FileText size={20} />}
                        </div>
                        <div>
                          <h3 className="font-semibold text-stone-100">{item.title}</h3>
                          <p className="text-sm text-stone-500">
                            {item.content_type === 'embed' ? 'Embed URL' : 'Rich Text'} •
                            {item.is_visible ? (
                              <span className="text-green-500 ml-1">Visible</span>
                            ) : (
                              <span className="text-yellow-500 ml-1">Hidden</span>
                            )}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={async () => {
                            const { error } = await supabase
                              .from('volunteer_content')
                              .update({ is_visible: !item.is_visible })
                              .eq('id', item.id);
                            if (!error) fetchVolunteerContent();
                          }}
                          className={`p-2 rounded-lg transition-colors ${
                            item.is_visible
                              ? 'bg-green-900/30 hover:bg-green-900/50 text-green-500'
                              : 'bg-yellow-900/30 hover:bg-yellow-900/50 text-yellow-500'
                          }`}
                          title={item.is_visible ? 'Hide section' : 'Show section'}
                        >
                          {item.is_visible ? <Eye size={18} /> : <EyeOff size={18} />}
                        </button>
                        <button
                          onClick={() => {
                            setEditingVolunteerItem(item);
                            setShowVolunteerForm(true);
                          }}
                          className="p-2 bg-stone-800 hover:bg-stone-700 text-stone-300 rounded-lg transition-colors"
                          title="Edit content"
                        >
                          <Edit2 size={18} />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}

        {/* EAL Images Tab Content */}
        {activeTab === 'eal' && (
          <>
            {/* EAL Stats */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-stone-900/50 border border-stone-800 rounded-lg p-4">
                <div className="text-2xl font-bold text-stone-100">{ealImages.length}</div>
                <div className="text-stone-500 text-sm">Total Slots</div>
              </div>
              <div className="bg-stone-900/50 border border-stone-800 rounded-lg p-4">
                <div className="text-2xl font-bold text-green-500">
                  {ealImages.filter(i => i.image_url).length}
                </div>
                <div className="text-stone-500 text-sm">Uploaded</div>
              </div>
              <div className="bg-stone-900/50 border border-stone-800 rounded-lg p-4">
                <div className="text-2xl font-bold text-yellow-500">
                  {ealImages.filter(i => !i.image_url).length}
                </div>
                <div className="text-stone-500 text-sm">Missing</div>
              </div>
            </div>

            {/* Info Box and Add Button */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="flex-1 bg-purple-900/20 border border-purple-800/50 rounded-lg p-4">
                <p className="text-purple-400 text-sm">
                  <strong>EAL Images:</strong> These images are used throughout the EAL section pages (About, Mustangs, Programs, etc.). Upload images to replace the placeholder content.
                </p>
              </div>
              <button
                onClick={() => {
                  setEditingEalImage({
                    id: '',
                    image_key: '',
                    title: '',
                    description: null,
                    image_url: null,
                    focal_x: 50,
                    focal_y: 50,
                    is_visible: true,
                    created_at: '',
                    updated_at: '',
                  });
                  setShowEalForm(true);
                }}
                className="px-4 py-3 bg-purple-700 hover:bg-purple-600 text-white rounded-lg font-medium flex items-center gap-2 whitespace-nowrap"
              >
                <Plus size={18} />
                Add New Image
              </button>
            </div>

            {/* EAL Images Grid */}
            {loadingEal ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="animate-spin text-purple-500" size={40} />
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {ealImages.map((item) => (
                  <div
                    key={item.id}
                    className="bg-stone-900/50 border border-stone-800 rounded-lg overflow-hidden"
                  >
                    <div className="aspect-[4/3] bg-stone-800 relative">
                      {item.image_url ? (
                        <img
                          src={item.image_url}
                          alt={item.title}
                          className="w-full h-full object-cover"
                          style={{ objectPosition: `${item.focal_x ?? 50}% ${item.focal_y ?? 50}%` }}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-stone-600">
                          <div className="text-center">
                            <Image size={32} className="mx-auto mb-2 opacity-50" />
                            <span className="text-sm">No image</span>
                          </div>
                        </div>
                      )}
                      {!item.is_visible && (
                        <div className="absolute top-2 left-2 px-2 py-1 bg-yellow-600 text-yellow-100 text-xs rounded">
                          Hidden
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-stone-100 mb-1">{item.title}</h3>
                      <p className="text-xs text-stone-500 mb-3">{item.image_key}</p>
                      {item.description && (
                        <p className="text-sm text-stone-400 mb-3">{item.description}</p>
                      )}
                      <button
                        onClick={() => {
                          setEditingEalImage(item);
                          setShowEalForm(true);
                        }}
                        className="w-full px-4 py-2 bg-stone-800 hover:bg-stone-700 text-stone-300 rounded-lg transition-colors flex items-center justify-center gap-2"
                      >
                        <Edit2 size={16} />
                        {item.image_url ? 'Edit' : 'Upload Image'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* Programs Tab Content */}
        {activeTab === 'programs' && (
          <ProgramsAndDatesTab />
        )}

        {/* Summer Camp Tab Content */}
        {activeTab === 'summercamp' && (
          <SummerCampSessionsEditor embedded />
        )}
      </div>

      {/* Horse Form Modal */}
      {showForm && (
        <HorseForm
          horse={editingHorse}
          onSave={handleSaveHorse}
          onCancel={() => { setShowForm(false); setEditingHorse(null); }}
        />
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-stone-900 rounded-xl p-6 max-w-md w-full border border-stone-700">
            <h3 className="text-xl font-bold text-stone-100 mb-4">Delete Horse?</h3>
            <p className="text-stone-400 mb-6">
              Are you sure you want to delete this horse? This action cannot be undone.
            </p>
            <div className="flex gap-4">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 px-4 py-2 border border-stone-600 hover:border-stone-500 text-stone-300 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteHorse(deleteConfirm)}
                className="flex-1 px-4 py-2 bg-red-700 hover:bg-red-600 text-white rounded-lg transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}


      {/* Gallery Form Modal */}
      {showGalleryForm && (
        <GalleryForm
          item={editingGalleryItem}
          onSave={handleSaveGalleryItem}
          onCancel={() => { setShowGalleryForm(false); setEditingGalleryItem(null); }}
        />
      )}

      {/* Gallery Delete Confirmation Modal */}
      {deleteGalleryConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-stone-900 rounded-xl p-6 max-w-md w-full border border-stone-700">
            <h3 className="text-xl font-bold text-stone-100 mb-4">Delete Gallery Item?</h3>
            <p className="text-stone-400 mb-6">
              Are you sure you want to delete this gallery item? This action cannot be undone.
            </p>
            <div className="flex gap-4">
              <button
                onClick={() => setDeleteGalleryConfirm(null)}
                className="flex-1 px-4 py-2 border border-stone-600 hover:border-stone-500 text-stone-300 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteGalleryItem(deleteGalleryConfirm)}
                className="flex-1 px-4 py-2 bg-red-700 hover:bg-red-600 text-white rounded-lg transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Password Change Modal */}
      {showPasswordChange && adminToken && (
        <PasswordChangeForm
          token={adminToken}
          onClose={() => setShowPasswordChange(false)}
          onSuccess={() => setShowPasswordChange(false)}
        />
      )}

      {/* Volunteer Content Form Modal */}
      {showVolunteerForm && editingVolunteerItem && (
        <VolunteerContentForm
          item={editingVolunteerItem}
          onSave={handleSaveVolunteerContent}
          onCancel={() => { setShowVolunteerForm(false); setEditingVolunteerItem(null); }}
          isSaving={savingVolunteer}
        />
      )}

      {/* Field Assignments Editor Modal */}
      {showFieldAssignments && (
        <FieldAssignmentsEditor onClose={() => setShowFieldAssignments(false)} />
      )}

      {/* EAL Image Form Modal */}
      {showEalForm && editingEalImage && (
        <EALImageForm
          image={editingEalImage}
          onClose={() => { setShowEalForm(false); setEditingEalImage(null); }}
          onSave={fetchEalImages}
        />
      )}
    </div>
  );
}
