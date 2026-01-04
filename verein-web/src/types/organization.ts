export type OrganizationType = 'Landesverband' | 'Region' | 'Verein';
export type FederationCode = 'DITIB';

export interface OrganizationDto {
  id: number;
  name: string;
  orgType: OrganizationType | string;
  parentOrganizationId?: number | null;
  federationCode?: FederationCode | string | null;
  aktiv?: boolean;
  deletedFlag?: boolean;
}

export interface OrganizationCreateDto {
  name: string;
  orgType: OrganizationType | string;
  parentOrganizationId?: number | null;
  federationCode?: FederationCode | string | null;
  aktiv?: boolean;
}

export interface OrganizationUpdateDto {
  name?: string;
  orgType?: OrganizationType | string;
  parentOrganizationId?: number | null;
  federationCode?: FederationCode | string | null;
  aktiv?: boolean;
}

export interface TreeNodeDto {
  id: number;
  name: string;
  orgType: OrganizationType | string;
  deletedFlag?: boolean;
  children: TreeNodeDto[];
}

export interface PathNodeDto {
  id: number;
  name: string;
  orgType: OrganizationType | string;
}
