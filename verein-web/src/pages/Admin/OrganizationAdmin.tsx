import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useToast } from '../../contexts/ToastContext';
import Modal from '../../components/Common/Modal';
import { organizationService } from '../../services/organizationService';
import {
  OrganizationDto,
  OrganizationCreateDto,
  OrganizationUpdateDto,
  PathNodeDto
} from '../../types/organization';
import './OrganizationAdmin.css';

type OrganizationNode = OrganizationDto & { children: OrganizationNode[] };

const orgTypeOptions = ['Dachverband', 'Landesverband', 'Region', 'Verein'];
const federationOptions = ['DITIB', 'Independent', 'Other'];

const OrganizationAdmin: React.FC = () => {
  // @ts-ignore - i18next type definitions
  const { t } = useTranslation(['organizationAdmin', 'common']);
  const { showToast } = useToast();

  const [organizations, setOrganizations] = useState<OrganizationDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [includeDeleted, setIncludeDeleted] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [expandedIds, setExpandedIds] = useState<Set<number>>(new Set());
  const [path, setPath] = useState<PathNodeDto[]>([]);

  const [filters, setFilters] = useState({
    orgType: 'all',
    federationCode: 'all',
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formMode, setFormMode] = useState<'create' | 'edit'>('create');
  const [formData, setFormData] = useState<OrganizationCreateDto>({
    name: '',
    orgType: 'Verein',
    parentOrganizationId: null,
    federationCode: null,
    aktiv: true
  });
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const selectedNode = organizations.find((org) => org.id === selectedId) || null;
  const selectedParentName = selectedNode?.parentOrganizationId
    ? organizations.find((org) => org.id === selectedNode.parentOrganizationId)?.name || '-'
    : '-';
  const selectedStatusLabel = selectedNode?.aktiv
    ? t('common:status.active')
    : t('common:status.inactive');

  const getErrorMessage = (error: any, fallback: string) => {
    const responseData = error?.response?.data;
    if (typeof responseData === 'string') {
      return responseData;
    }
    if (responseData?.message) {
      return responseData.message;
    }
    return error?.message || fallback;
  };

  const loadOrganizations = async () => {
    try {
      setLoading(true);
      const data = await organizationService.getAll({ includeDeleted });
      setOrganizations(data);
      if (selectedId && !data.some((org) => org.id === selectedId)) {
        setSelectedId(null);
      }
    } catch (error: any) {
      const message = getErrorMessage(error, t('organizationAdmin:messages.loadError'));
      showToast(message, 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrganizations();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [includeDeleted]);

  useEffect(() => {
    if (!selectedId) {
      setPath([]);
      return;
    }

    organizationService.getPath(selectedId)
      .then((data) => setPath(data))
      .catch(() => setPath([]));
  }, [selectedId]);

  const buildTree = (items: OrganizationDto[]): OrganizationNode[] => {
    const nodeMap = new Map<number, OrganizationNode>();
    items.forEach((item) => {
      nodeMap.set(item.id, { ...item, children: [] });
    });

    const roots: OrganizationNode[] = [];
    nodeMap.forEach((node) => {
      if (node.parentOrganizationId && nodeMap.has(node.parentOrganizationId)) {
        nodeMap.get(node.parentOrganizationId)!.children.push(node);
      } else {
        roots.push(node);
      }
    });

    const sortNodes = (nodes: OrganizationNode[]) => {
      nodes.sort((a, b) => a.name.localeCompare(b.name));
      nodes.forEach((node) => sortNodes(node.children));
    };

    sortNodes(roots);
    return roots;
  };

  const filteredTree = useMemo(() => {
    const roots = buildTree(organizations);
    const matchesFilters = (node: OrganizationNode) => {
      const matchesOrgType = filters.orgType === 'all' || node.orgType === filters.orgType;
      const matchesFederation = filters.federationCode === 'all' || (node.federationCode || '') === filters.federationCode;
      return matchesOrgType && matchesFederation;
    };

    const filterNode = (node: OrganizationNode): OrganizationNode | null => {
      const filteredChildren = node.children
        .map(filterNode)
        .filter((child): child is OrganizationNode => child !== null);

      if (matchesFilters(node) || filteredChildren.length > 0) {
        return { ...node, children: filteredChildren };
      }
      return null;
    };

    return roots
      .map(filterNode)
      .filter((node): node is OrganizationNode => node !== null);
  }, [organizations, filters]);

  const toggleExpand = (id: number) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const openCreateRoot = () => {
    setFormMode('create');
    setFormData({
      name: '',
      orgType: 'Dachverband',
      parentOrganizationId: null,
      federationCode: null,
      aktiv: true
    });
    setIsModalOpen(true);
  };

  const openCreateChild = () => {
    if (!selectedNode) {
      return;
    }
    setFormMode('create');
    setFormData({
      name: '',
      orgType: 'Verein',
      parentOrganizationId: selectedNode.id,
      federationCode: selectedNode.federationCode ?? null,
      aktiv: true
    });
    setIsModalOpen(true);
  };

  const openEdit = () => {
    if (!selectedNode) {
      return;
    }
    setFormMode('edit');
    setFormData({
      name: selectedNode.name,
      orgType: selectedNode.orgType,
      parentOrganizationId: selectedNode.parentOrganizationId ?? null,
      federationCode: selectedNode.federationCode ?? null,
      aktiv: selectedNode.aktiv ?? true
    });
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    try {
      if (!formData.name?.trim()) {
        showToast(t('common:validation.required'), 'error');
        return;
      }

      if (formMode === 'create') {
        await organizationService.create(formData);
      } else if (selectedNode) {
        const updatePayload: OrganizationUpdateDto = {
          name: formData.name,
          orgType: formData.orgType,
          parentOrganizationId: formData.parentOrganizationId ?? undefined,
          federationCode: formData.federationCode ?? undefined,
          aktiv: formData.aktiv
        };
        await organizationService.update(selectedNode.id, updatePayload);
      }

      showToast(t('organizationAdmin:messages.saveSuccess'), 'success');
      setIsModalOpen(false);
      await loadOrganizations();
    } catch (error: any) {
      const message = getErrorMessage(error, t('organizationAdmin:messages.loadError'));
      showToast(message, 'error');
    }
  };

  const handleDelete = async () => {
    if (!selectedNode) {
      return;
    }

    try {
      await organizationService.delete(selectedNode.id);
      setSelectedId(null);
      await loadOrganizations();
    } catch (error: any) {
      const message = getErrorMessage(error, t('organizationAdmin:messages.deleteBlocked'));
      showToast(message, 'error');
    }
  };

  const handleConfirmDelete = async () => {
    setIsDeleteModalOpen(false);
    await handleDelete();
  };

  const handleRestore = async () => {
    if (!selectedNode) {
      return;
    }

    try {
      await organizationService.restore(selectedNode.id);
      await loadOrganizations();
      showToast(t('organizationAdmin:messages.restoreSuccess'), 'success');
    } catch (error: any) {
      const message = getErrorMessage(error, t('organizationAdmin:messages.loadError'));
      showToast(message, 'error');
    }
  };

  const renderNode = (node: OrganizationNode, depth = 0) => {
    const hasChildren = node.children.length > 0;
    const isExpanded = expandedIds.has(node.id);
    const isSelected = selectedId === node.id;
    return (
      <div
        key={node.id}
        className="org-tree-row"
        data-depth={depth}
        style={{ '--depth-level': depth } as React.CSSProperties}
      >
        <div className={`org-tree-node ${isSelected ? 'selected' : ''}`}>
          {hasChildren ? (
            <button
              type="button"
              className="org-tree-toggle"
              onClick={() => toggleExpand(node.id)}
              aria-label={isExpanded ? 'Collapse' : 'Expand'}
            >
              {isExpanded ? '▼' : '▶'}
            </button>
          ) : (
            <span className="org-tree-toggle placeholder" aria-hidden="true" />
          )}
          <button
            type="button"
            className="org-tree-label"
            onClick={() => setSelectedId(node.id)}
          >
            <div className="org-tree-label-main">
              <span className="org-name">{node.name}</span>
              <span className="org-type-chip">{node.orgType}</span>
            </div>
            <div className="org-tree-label-meta">
              {node.deletedFlag ? (
                <span className="org-status-chip deleted">
                  {t('organizationAdmin:labels.deleted')}
                </span>
              ) : node.aktiv === false ? (
                <span className="org-status-chip inactive">
                  {t('common:status.inactive')}
                </span>
              ) : null}
            </div>
          </button>
        </div>
        {hasChildren && isExpanded && (
          <div className="org-tree-children">
            {node.children.map((child) => renderNode(child, depth + 1))}
          </div>
        )}
      </div>
    );
  };
  const parentOptions = organizations.filter((org) => !org.deletedFlag && org.id !== selectedId);

  return (
    <div className="organization-admin">
      <div className="page-header">
        <h1 className="page-title">{t('organizationAdmin:title')}</h1>
      </div>

      <div className="org-toolbar">
        <div className="org-toolbar-card">
          <div className="org-filters">
            <div className="org-filter">
              <label>{t('organizationAdmin:filters.orgType')}</label>
              <select
                value={filters.orgType}
                onChange={(e) => setFilters((prev) => ({ ...prev, orgType: e.target.value }))}
              >
                <option value="all">{t('common:all')}</option>
                {orgTypeOptions.map((type) => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
            <div className="org-filter">
              <label>{t('organizationAdmin:filters.federationCode')}</label>
              <select
                value={filters.federationCode}
                onChange={(e) => setFilters((prev) => ({ ...prev, federationCode: e.target.value }))}
              >
                <option value="all">{t('common:all')}</option>
                {federationOptions.map((code) => (
                  <option key={code} value={code}>{code}</option>
                ))}
              </select>
            </div>
            <label className="org-toggle">
              <input
                type="checkbox"
                checked={includeDeleted}
                onChange={(e) => setIncludeDeleted(e.target.checked)}
              />
              {t('organizationAdmin:filters.includeDeleted')}
            </label>
          </div>
          <div className="org-toolbar-actions">
            <button type="button" className="org-primary-btn" onClick={openCreateRoot}>
              {t('organizationAdmin:actions.createRoot')}
            </button>
          </div>
        </div>
      </div>

      <div className="org-content">
        <div className="org-tree-panel">
          <div className="org-panel-header">
            <h2>Tree</h2>
            {loading && <span className="org-loading">{t('common:status.loading')}</span>}
          </div>
          <div className="org-tree">
            {filteredTree.length === 0 && !loading ? (
              <div className="org-empty">{t('common:noResults')}</div>
            ) : (
              filteredTree.map((node) => renderNode(node))
            )}
          </div>
        </div>

        <div className="org-details-panel">
          <div className="org-panel-header">
            <h2>Details</h2>
          </div>
          {selectedNode ? (
            <div className="org-details">
              <div className="org-details-card">
                <div className="org-details-heading">
                  <h3>{selectedNode.name}</h3>
                  <span className="org-type-chip detail">{selectedNode.orgType}</span>
                </div>
                <div className="org-details-group">
                  <p className="org-details-label">
                    {t('organizationAdmin:labels.parent')}
                  </p>
                  <p className="org-details-value">{selectedParentName}</p>
                  <p className="org-details-label">
                    {t('organizationAdmin:labels.federationCode')}
                  </p>
                  <p className="org-details-value">{selectedNode.federationCode || '-'}</p>
                </div>
                <div className="org-details-group">
                  <p className="org-details-label">
                    {t('organizationAdmin:labels.aktiv')}
                  </p>
                  <p className="org-details-value">{selectedStatusLabel}</p>
                  {selectedNode.deletedFlag && (
                    <span className="org-status-chip deleted">
                      {t('organizationAdmin:labels.deleted')}
                    </span>
                  )}
                </div>
                <div className="org-details-hierarchy">
                  <p className="org-details-label">
                    {t('organizationAdmin:labels.hierarchy')}
                  </p>
                  <div className="org-hierarchy-path">
                    {path.length > 0 ? (
                      path.map((node, index) => (
                        <span key={node.id}>
                          {node.name}
                          {index < path.length - 1 && (
                            <span className="org-path-sep">›</span>
                          )}
                        </span>
                      ))
                    ) : (
                      <span className="org-hierarchy-empty">-</span>
                    )}
                  </div>
                </div>
                <p className="org-details-id">ID: {selectedNode.id}</p>
              </div>
              <div className="org-actions">
                <button type="button" className="primary" onClick={openCreateChild}>
                  {t('organizationAdmin:actions.createChild')}
                </button>
                <button type="button" className="secondary" onClick={openEdit}>
                  {t('organizationAdmin:actions.edit')}
                </button>
                {!selectedNode.deletedFlag ? (
                  <button
                    type="button"
                    className="danger"
                    onClick={() => setIsDeleteModalOpen(true)}
                  >
                    {t('organizationAdmin:actions.delete')}
                  </button>
                ) : (
                  <button type="button" className="secondary" onClick={handleRestore}>
                    {t('organizationAdmin:actions.restore')}
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="org-empty-state">
              <span className="org-empty-icon" aria-hidden="true">🧭</span>
              <p>{t('organizationAdmin:messages.selectOrganization')}</p>
            </div>
          )}
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={
          formMode === 'edit'
            ? t('organizationAdmin:actions.edit')
            : formData.parentOrganizationId
              ? t('organizationAdmin:actions.createChild')
              : t('organizationAdmin:actions.createRoot')
        }
        size="md"
        footer={(
          <div className="org-modal-footer">
            <button type="button" className="secondary" onClick={() => setIsModalOpen(false)}>
              {t('organizationAdmin:actions.cancel')}
            </button>
            <button type="button" className="primary" onClick={handleSave}>
              {t('organizationAdmin:actions.save')}
            </button>
          </div>
        )}
      >
        <div className="org-form">
          <label>
            {t('organizationAdmin:labels.name')}
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
            />
          </label>
          <label>
            {t('organizationAdmin:labels.orgType')}
            <select
              value={formData.orgType}
              onChange={(e) => setFormData((prev) => ({ ...prev, orgType: e.target.value }))}
            >
              {orgTypeOptions.map((type) => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </label>
          <label>
            {t('organizationAdmin:labels.federationCode')}
            <select
              value={formData.federationCode ?? ''}
              onChange={(e) => setFormData((prev) => ({ ...prev, federationCode: e.target.value || null }))}
            >
              <option value="">-</option>
              {federationOptions.map((code) => (
                <option key={code} value={code}>{code}</option>
              ))}
            </select>
          </label>
          <label>
            {t('organizationAdmin:labels.parent')}
            <select
              value={formData.parentOrganizationId ?? ''}
              onChange={(e) => setFormData((prev) => ({
                ...prev,
                parentOrganizationId: e.target.value ? Number(e.target.value) : null
              }))}
            >
              <option value="">{t('common:actions.pleaseSelect')}</option>
              {parentOptions.map((org) => (
                <option key={org.id} value={org.id}>
                  {org.name}
                </option>
              ))}
            </select>
          </label>
          <label className="org-checkbox">
            <input
              type="checkbox"
              checked={formData.aktiv ?? true}
              onChange={(e) => setFormData((prev) => ({ ...prev, aktiv: e.target.checked }))}
            />
            {t('organizationAdmin:labels.aktiv')}
          </label>
        </div>
      </Modal>
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title={t('organizationAdmin:actions.delete')}
        size="sm"
        footer={(
          <div className="org-modal-footer">
            <button type="button" className="secondary" onClick={() => setIsDeleteModalOpen(false)}>
              {t('organizationAdmin:actions.cancel')}
            </button>
            <button type="button" className="danger" onClick={handleConfirmDelete}>
              {t('organizationAdmin:actions.delete')}
            </button>
          </div>
        )}
      >
        <p className="org-modal-delete-text">
          {t('organizationAdmin:messages.deleteWarning')}
        </p>
      </Modal>
    </div>
  );
};

export default OrganizationAdmin;
