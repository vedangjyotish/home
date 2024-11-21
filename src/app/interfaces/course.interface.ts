export interface IModule {
  module: number;
  list: string[];
  m_price: string;
}

export interface ICourse {
  cid: string;
  name: string;
  img: string;
  alt: string;
  rating: number;
  highlights: string[];
  tagline: string[];
  price: string;
  featured?: boolean;
  mods: IModule[];
  duration?: number; // Duration in hours
}
