import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Search, X, DollarSign, Clock, Tag } from 'lucide-react';
import { LoadingSpinner, ErrorMessage } from '../components';
import { Service } from '../types';
import { getAllServices, createService, updateService, deleteService } from '../services/firestoreService';

interface ServiceFormData {
  name: string;
  description: string;
  category: 'blouse' | 'kurti' | 'bridal' | 'salwar' | 'alterations' | 'other';
  pricing: Array<{ type: string; price: number; description: string }>;
  estimatedDays: number;
  requiresMeasurements: boolean;
}

const ServicesPage: React.FC = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [filteredServices, setFilteredServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [formData, setFormData] = useState<ServiceFormData>({
    name: '',
    description: '',
    category: 'blouse',
    pricing: [{ type: 'Basic', price: 0, description: '' }],
    estimatedDays: 7,
    requiresMeasurements: true
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadServices();
  }, []);

  useEffect(() => {
    filterServices();
  }, [services, searchTerm]);

  const loadServices = async () => {
    try {
      setLoading(true);
      setError(null);
      const fetchedServices = await getAllServices();
      setServices(fetchedServices);
    } catch (err: any) {
      setError(err.message || 'Failed to load services');
      console.error('Error loading services:', err);
    } finally {
      setLoading(false);
    }
  };

  const filterServices = () => {
    if (!searchTerm) {
      setFilteredServices(services);
      return;
    }

    const term = searchTerm.toLowerCase();
    const filtered = services.filter(
      (service) =>
        service.name.toLowerCase().includes(term) ||
        service.description.toLowerCase().includes(term) ||
        service.category.toLowerCase().includes(term)
    );
    setFilteredServices(filtered);
  };

  const handleOpenModal = (service?: Service) => {
    if (service) {
      setEditingService(service);
      setFormData({
        name: service.name,
        description: service.description,
        category: service.category,
        pricing: service.pricing,
        estimatedDays: service.estimatedDays,
        requiresMeasurements: service.requiresMeasurements
      });
    } else {
      setEditingService(null);
      setFormData({
        name: '',
        description: '',
        category: 'blouse',
        pricing: [{ type: 'Basic', price: 0, description: '' }],
        estimatedDays: 7,
        requiresMeasurements: true
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingService(null);
    setFormData({
      name: '',
      description: '',
      category: 'blouse',
      pricing: [{ type: 'Basic', price: 0, description: '' }],
      estimatedDays: 7,
      requiresMeasurements: true
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      if (editingService) {
        await updateService(editingService.id, formData);
      } else {
        await createService(formData);
      }
      await loadServices();
      handleCloseModal();
    } catch (err: any) {
      alert(err.message || 'Failed to save service');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (serviceId: string, serviceName: string) => {
    if (!confirm(`Are you sure you want to delete "${serviceName}"? This action cannot be undone.`)) {
      return;
    }

    try {
      await deleteService(serviceId);
      await loadServices();
    } catch (err: any) {
      alert(err.message || 'Failed to delete service');
    }
  };

  const addPricingTier = () => {
    setFormData({
      ...formData,
      pricing: [...formData.pricing, { type: '', price: 0, description: '' }]
    });
  };

  const removePricingTier = (index: number) => {
    if (formData.pricing.length === 1) return;
    const newPricing = formData.pricing.filter((_, i) => i !== index);
    setFormData({ ...formData, pricing: newPricing });
  };

  const updatePricingTier = (index: number, field: string, value: any) => {
    const newPricing = [...formData.pricing];
    newPricing[index] = { ...newPricing[index], [field]: value };
    setFormData({ ...formData, pricing: newPricing });
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      blouse: 'bg-pink-100 text-pink-700',
      kurti: 'bg-purple-100 text-purple-700',
      bridal: 'bg-rose-100 text-rose-700',
      salwar: 'bg-blue-100 text-blue-700',
      alterations: 'bg-green-100 text-green-700',
      default: 'bg-gray-100 text-gray-700'
    };
    return colors[category] || colors.default;
  };

  if (loading) {
    return (
      <div className="p-4 pb-20">
        <h1 className="text-2xl font-bold text-slate-800 mb-2">Services</h1>
        <p className="text-slate-600 mb-6">Manage available services and pricing</p>
        <LoadingSpinner text="Loading services..." className="py-12" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 pb-20">
        <h1 className="text-2xl font-bold text-slate-800 mb-2">Services</h1>
        <p className="text-slate-600 mb-6">Manage available services and pricing</p>
        <ErrorMessage
          title="Unable to Load Services"
          message={error}
          onRetry={loadServices}
          variant="card"
        />
      </div>
    );
  }

  return (
    <div className="p-4 pb-20">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 mb-2">Services</h1>
          <p className="text-slate-600">Manage available services and pricing</p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 px-4 py-2 bg-rose-600 text-white rounded-xl hover:bg-rose-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          <span>Add Service</span>
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-2xl p-4 border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-600 text-sm">Total Services</p>
              <p className="text-2xl font-bold text-slate-800">{services.length}</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-xl">
              <Tag className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-600 text-sm">Avg. Price</p>
              <p className="text-2xl font-bold text-slate-800">
                ₹{services.length > 0
                  ? Math.round(services.reduce((sum, s) => sum + s.pricing[0].price, 0) / services.length)
                  : 0}
              </p>
            </div>
            <div className="bg-green-100 p-3 rounded-xl">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-600 text-sm">Avg. Duration</p>
              <p className="text-2xl font-bold text-slate-800">
                {services.length > 0
                  ? Math.round(services.reduce((sum, s) => sum + s.estimatedDays, 0) / services.length)
                  : 0} days
              </p>
            </div>
            <div className="bg-purple-100 p-3 rounded-xl">
              <Clock className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search services..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
          />
        </div>
      </div>

      {/* Services Grid */}
      {filteredServices.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-2xl border border-slate-200">
          <div className="bg-slate-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">🎨</span>
          </div>
          <div className="text-slate-600 text-lg mb-2">
            {searchTerm ? 'No services found' : 'No services yet'}
          </div>
          <p className="text-slate-500 mb-4">
            {searchTerm
              ? 'Try adjusting your search terms'
              : 'Add your first service to get started'}
          </p>
          {!searchTerm && (
            <button
              onClick={() => handleOpenModal()}
              className="px-6 py-2 bg-rose-600 text-white rounded-xl hover:bg-rose-700 transition-colors"
            >
              Add Service
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredServices.map((service) => (
            <div
              key={service.id}
              className="bg-white rounded-2xl p-4 border border-slate-200 hover:border-rose-300 transition-colors"
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 className="font-semibold text-slate-800 text-lg mb-1">
                    {service.name}
                  </h3>
                  <span className={`inline-block px-2 py-1 rounded-lg text-xs font-medium ${getCategoryColor(service.category)}`}>
                    {service.category}
                  </span>
                </div>
              </div>

              {/* Description */}
              <p className="text-sm text-slate-600 mb-4 line-clamp-2">
                {service.description}
              </p>

              {/* Pricing */}
              <div className="space-y-2 mb-4">
                {service.pricing.map((price, index) => (
                  <div key={index} className="flex items-center justify-between text-sm">
                    <span className="text-slate-600">{price.type}</span>
                    <span className="font-semibold text-rose-600">₹{price.price}</span>
                  </div>
                ))}
              </div>

              {/* Meta */}
              <div className="flex items-center gap-4 text-sm text-slate-600 mb-4 pb-4 border-b border-slate-100">
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span>{service.estimatedDays} days</span>
                </div>
                {service.requiresMeasurements && (
                  <span className="text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded">
                    Measurements Required
                  </span>
                )}
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <button
                  onClick={() => handleOpenModal(service)}
                  className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-slate-50 text-slate-600 rounded-xl hover:bg-slate-100 transition-colors text-sm font-medium"
                >
                  <Edit2 className="w-4 h-4" />
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(service.id, service.name)}
                  className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-colors text-sm font-medium"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-slate-200">
              <h2 className="text-xl font-bold text-slate-800">
                {editingService ? 'Edit Service' : 'Add New Service'}
              </h2>
              <button
                onClick={handleCloseModal}
                className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Service Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
                  required
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Description *
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
                  required
                />
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Category *
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-4 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
                  required
                >
                  <option value="blouse">Blouse</option>
                  <option value="kurti">Kurti</option>
                  <option value="bridal">Bridal</option>
                  <option value="salwar">Salwar Kameez</option>
                  <option value="alterations">Alterations</option>
                  <option value="other">Other</option>
                </select>
              </div>

              {/* Pricing Tiers */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-slate-700">
                    Pricing Tiers *
                  </label>
                  <button
                    type="button"
                    onClick={addPricingTier}
                    className="text-sm text-rose-600 hover:text-rose-700"
                  >
                    + Add Tier
                  </button>
                </div>
                <div className="space-y-3">
                  {formData.pricing.map((tier, index) => (
                    <div key={index} className="flex gap-2 items-start">
                      <input
                        type="text"
                        placeholder="Type (e.g., Basic)"
                        value={tier.type}
                        onChange={(e) => updatePricingTier(index, 'type', e.target.value)}
                        className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
                        required
                      />
                      <input
                        type="number"
                        placeholder="Price"
                        value={tier.price || ''}
                        onChange={(e) => updatePricingTier(index, 'price', parseFloat(e.target.value) || 0)}
                        className="w-24 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
                        required
                      />
                      <input
                        type="text"
                        placeholder="Description"
                        value={tier.description}
                        onChange={(e) => updatePricingTier(index, 'description', e.target.value)}
                        className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
                      />
                      {formData.pricing.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removePricingTier(index)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Estimated Days */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Estimated Days *
                </label>
                <input
                  type="number"
                  value={formData.estimatedDays}
                  onChange={(e) => setFormData({ ...formData, estimatedDays: parseInt(e.target.value) || 0 })}
                  className="w-full px-4 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
                  required
                  min="1"
                />
              </div>

              {/* Requires Measurements */}
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="requiresMeasurements"
                  checked={formData.requiresMeasurements}
                  onChange={(e) => setFormData({ ...formData, requiresMeasurements: e.target.checked })}
                  className="w-4 h-4 text-rose-600 border-slate-300 rounded focus:ring-rose-500"
                />
                <label htmlFor="requiresMeasurements" className="text-sm text-slate-700">
                  Requires customer measurements
                </label>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="flex-1 px-4 py-2 border border-slate-300 text-slate-700 rounded-xl hover:bg-slate-50 transition-colors"
                  disabled={submitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-rose-600 text-white rounded-xl hover:bg-rose-700 transition-colors disabled:opacity-50"
                  disabled={submitting}
                >
                  {submitting ? 'Saving...' : editingService ? 'Update Service' : 'Add Service'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ServicesPage;
