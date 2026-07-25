export interface MinistryPillar {
  title: string;
  description: string;
}

export interface MinistryInfo {
  name: string;
  radioName: string;
  aboutShort: string;
  aboutLong: string;
  pillars: MinistryPillar[];
  address: string;
}
