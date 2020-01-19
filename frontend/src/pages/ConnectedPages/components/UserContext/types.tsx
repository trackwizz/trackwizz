interface IImages {
  width: null | number;
  height: null | number;
  url: string;
}

export interface IUser {
  country: string;
  display_name: string;
  email: string;
  explicit_content: {
    filter_enabled: boolean;
    filter_locked: boolean;
  };
  external_urls: {
    spotify: string;
  };
  followers: {
    href: null | string;
    total: number;
  };
  href: string;
  id: string;
  images: IImages[];
  product: string;
  type: string;
  uri: string;
}
